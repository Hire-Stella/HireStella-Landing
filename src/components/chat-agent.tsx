'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { Logo } from './ui';
import { track } from '@/lib/telemetry';
import type { ChatTurn, Dograh } from '@/lib/dograh';

/**
 * The live chat panel, driven by the Dograh embed's REST chat mode.
 *
 * A separate embed token from voice-agent.tsx, provisioned on Dograh's
 * dashboard with widgetType "chat" rather than "voice". The embed is
 * headless here too: no UI of its own, just REST calls (one POST per turn,
 * no WebRTC, no microphone) driven through the same window.DograhWidget API
 * (typed in lib/dograh.ts, shared with voice-agent.tsx). Every pixel below
 * is ours.
 */

type Status = 'idle' | 'starting' | 'ready' | 'waiting' | 'ended' | 'expired' | 'error';

/* No fallback token — see voiceConfigured in voice-agent.tsx for why. */
const TOKEN = process.env.NEXT_PUBLIC_DOGRAH_CHAT_TOKEN || '';
const API = process.env.NEXT_PUBLIC_DOGRAH_ENDPOINT || 'https://voice.hirestella.ai';

/** False when no chat embed token is configured; the launcher then offers voice only. */
export const chatConfigured = TOKEN.length > 0;
const SCRIPT_ID = 'dograh-widget-chat';

let loading: Promise<Dograh> | null = null;

/* Mirrors voice-agent.tsx's loader exactly, token-swapped: the voice and chat
   tokens load the same script under one shared global (window.DograhWidget),
   so the two cannot both be live. The global is reused only when it is
   already configured for this token; otherwise both Dograh script tags are
   cleared and this one loads fresh, which is also how a visitor switching
   from voice back to chat gets a correctly-configured widget rather than a
   leftover voice one. */
function loadDograh(context: Record<string, string>): Promise<Dograh> {
  if (window.DograhWidget?.getState?.().config?.token === TOKEN) {
    return Promise.resolve(window.DograhWidget);
  }
  if (loading) return loading;

  loading = new Promise<Dograh>((resolve, reject) => {
    document.getElementById('dograh-widget-voice')?.remove();
    document.getElementById('dograh-widget-chat')?.remove();
    delete window.DograhWidget;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `${API}/embed/dograh-widget.js?token=${encodeURIComponent(TOKEN)}&environment=production&apiEndpoint=${encodeURIComponent(API)}`;
    script.setAttribute('data-dograh-context', JSON.stringify(context));

    /* Drop both the cached promise and the dead <script> so a retry re-attempts
       the load, the same as voice-agent.tsx. */
    const fail = (message: string) => {
      loading = null;
      script.remove();
      reject(new Error(message));
    };

    script.onload = () => {
      loading = null;
      if (window.DograhWidget) resolve(window.DograhWidget);
      else fail('Chat agent loaded without an API');
    };
    script.onerror = () => fail('Chat agent failed to load');
    document.head.appendChild(script);
  });

  return loading;
}

const STATUS_COPY: Partial<Record<Status, string>> = {
  starting: 'Connecting you to Stella…',
  error: 'Stella could not be reached.',
  ended: 'This conversation has ended.',
  expired: 'This conversation has expired.',
};

function context() {
  return { page_url: window.location.href, today: new Date().toISOString().slice(0, 10) };
}

export function ChatAgent({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>('idle');
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const inputEl = useRef<HTMLInputElement>(null);
  const widget = useRef<Dograh | null>(null);
  /* Bumped on every close and every restart. Anything that resolves after an
     await compares against it and stands down if it belongs to a session the
     visitor has already left or replaced. */
  const session = useRef(0);

  useEffect(() => {
    if (!open) return;
    function esc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);

  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open]);

  /* Disabling the input while a reply is in flight drops focus from it (the
     browser does this automatically), and it does not come back on its own
     once the input re-enables. Without this, every reply forces a click back
     into the box before the next message can be typed. */
  useEffect(() => {
    const busy = status === 'starting' || status === 'waiting';
    const ended = status === 'ended' || status === 'expired' || status === 'error';
    if (open && !busy && !ended) inputEl.current?.focus();
  }, [open, status]);

  useEffect(() => {
    if (open) log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' });
  }, [turns, pending, open]);

  const sync = useCallback(() => {
    const w = widget.current;
    if (!w) return;
    const s = w.getState();
    setTurns(w.getMessages());
    setPending(s.chat?.pendingUserText ?? null);
    if (s.chat?.status) setStatus(s.chat.status);
  }, []);

  const beginSession = useCallback(
    (mine: number) => {
      const current = () => mine === session.current;
      setError(null);
      loadDograh(context())
        .then((w) => {
          if (!current()) return;
          widget.current = w;
          w.onMessage(() => current() && sync());
          w.onChatStateChange(() => current() && sync());
          w.onError((err) => {
            if (!current()) return;
            setError(err?.message ?? null);
          });
          w.setContext(context());
          track('chat_agent_opened', { page: pathname });
          return w.start();
        })
        .then(() => current() && sync())
        .catch((err) => {
          if (!current()) return;
          setStatus('error');
          setError(err instanceof Error ? err.message : null);
        });
    },
    [pathname, sync],
  );

  /* The panel hides without ending the session — Dograh's own stop/end split —
     so reopening within the same mode resumes the conversation. Switching to
     voice and back does not: the loader forces a fresh script, and a fresh
     script has no memory of the old session. */
  useEffect(() => {
    if (!open) {
      widget.current?.stop();
      return;
    }
    beginSession(++session.current);
    // beginSession is stable across a pathname change mid-conversation, which
    // must not restart the session it is already driving.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* A turn is capped at 60s server-side, but nothing here enforced that: if a
     reply genuinely hangs (or the request itself never resolves), the UI has
     no other way out of 'waiting' — closing and reopening the panel resumes
     the same stuck session rather than resetting it, since reopening the
     same mode reuses the existing widget instead of reloading it. So this
     gives up a little past the server's own cap and offers the restart
     button; if the real reply still lands after that, sync() below simply
     overwrites this with the answer, since nothing was actually lost. */
  useEffect(() => {
    if (status !== 'starting' && status !== 'waiting') return;
    const timeout = setTimeout(() => {
      setStatus('error');
      setError('This is taking longer than expected.');
    }, 70000);
    return () => clearTimeout(timeout);
  }, [status]);

  /* Ended, expired or failed conversations have no server-side path back to
     'idle' through the public API, so a restart forces the same clean reload
     the voice/chat mode switch already relies on. */
  function restart() {
    document.getElementById('dograh-widget-voice')?.remove();
    document.getElementById('dograh-widget-chat')?.remove();
    delete window.DograhWidget;
    widget.current = null;
    setTurns([]);
    setPending(null);
    setStatus('idle');
    beginSession(++session.current);
  }

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !widget.current) return;
    setDraft('');
    track('chat_agent_message_sent', { page: pathname });
    await widget.current.sendMessage(text);
    sync();
  }

  if (!open) return null;

  const busy = status === 'starting' || status === 'waiting';
  const ended = status === 'ended' || status === 'expired' || status === 'error';
  const banner = error ?? STATUS_COPY[status] ?? null;

  return (
    <div
      className="sw pan pan--solid blur"
      role="dialog"
      aria-label="Chat to Stella"
      tabIndex={-1}
      ref={panel}
    >
      <div className="sw-top">
        <span className="sw-mark">
          <Logo symbol />
        </span>
        <span className="sw-id">
          <b>Stella</b>
          <em>AI Chat Employee</em>
        </span>
        <button className="ico" aria-label="Close" onClick={onClose} type="button">
          <X size={17} />
        </button>
      </div>

      <div className="sw-log" ref={log} aria-live="polite">
        {turns.map((turn) => (
          <span key={turn.id}>
            {turn.user_message?.text && <p className="sw-line sw-you">{turn.user_message.text}</p>}
            {turn.assistant_message?.text && (
              <p className="sw-line sw-stella">{turn.assistant_message.text}</p>
            )}
          </span>
        ))}
        {pending && <p className="sw-line sw-you">{pending}</p>}
        {busy && (
          <p className="sw-line sw-stella sw-typing" aria-label="Stella is replying">
            <i /> <i /> <i />
          </p>
        )}
        {banner && !busy && (
          <>
            <p className="sw-line sw-stella">{banner}</p>
            {ended && (
              <button className="btn-3 sw-cta" type="button" onClick={restart}>
                Start a new conversation
              </button>
            )}
          </>
        )}
      </div>

      <div className="sw-foot">
        <form className="sw-form" onSubmit={send}>
          <input
            ref={inputEl}
            type="text"
            className="sw-input"
            placeholder="Type a message…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={busy || ended}
            aria-label="Message Stella"
          />
          <button
            className="sw-send"
            type="submit"
            disabled={busy || ended || !draft.trim()}
            aria-label="Send"
          >
            <ArrowUp size={17} strokeWidth={2} />
          </button>
        </form>
        <p className="note">
          Stella&rsquo;s replies here are generated live by AI and may be inaccurate. Please do
          not enter confidential customer data.
        </p>
      </div>
    </div>
  );
}
