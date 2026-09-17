'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, PhoneOff, RotateCcw, X } from 'lucide-react';
import { Logo } from './ui';
import { track } from '@/lib/telemetry';

/**
 * The live voice panel, driven by the Dograh embed.
 *
 * The embed token is provisioned `embedMode: "headless"`, so the script ships
 * no UI of its own — it injects a hidden <audio> element and exposes
 * window.DograhWidget. Every pixel below is ours, and the call is driven
 * through that API.
 */

type Status = 'idle' | 'connecting' | 'connected' | 'failed';

type Dograh = {
  start: () => Promise<unknown> | void;
  stop: () => Promise<unknown> | void;
  setContext: (variables: Record<string, string>) => void;
  onCallEnd: (cb: () => void) => void;
  onError: (cb: (error: Error) => void) => void;
  onStatusChange: (cb: (status: string, text?: string, subtext?: string) => void) => void;
};

declare global {
  interface Window {
    DograhWidget?: Dograh;
  }
}

/* No fallback token. A build without one must not quietly dial somebody
   else's workflow, so the voice option is withheld instead — see
   `voiceConfigured`. `||` rather than `??` because .env.example ships the key
   blank, so a copied-but-unset var arrives as '' rather than undefined. */
const TOKEN = process.env.NEXT_PUBLIC_DOGRAH_TOKEN || '';
const API = process.env.NEXT_PUBLIC_DOGRAH_ENDPOINT || 'https://voice.hirestella.ai';

/** False when no embed token is configured; the launcher then offers chat only. */
export const voiceConfigured = TOKEN.length > 0;
const SCRIPT_ID = 'dograh-widget';

/* One load per document, shared by every mount. */
let loading: Promise<Dograh> | null = null;

function loadDograh(context: Record<string, string>): Promise<Dograh> {
  if (window.DograhWidget) return Promise.resolve(window.DograhWidget);
  if (loading) return loading;

  loading = new Promise<Dograh>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `${API}/embed/dograh-widget.js?token=${encodeURIComponent(TOKEN)}&environment=production&apiEndpoint=${encodeURIComponent(API)}`;
    script.setAttribute('data-dograh-context', JSON.stringify(context));

    /* Drop both the cached promise and the dead <script> so that "Try again"
       re-attempts the load. Leaving `loading` set would replay this rejection
       for the rest of the page's life. */
    const fail = (message: string) => {
      loading = null;
      script.remove();
      reject(new Error(message));
    };

    script.onload = () =>
      window.DograhWidget
        ? resolve(window.DograhWidget)
        : fail('Voice agent loaded without an API');
    script.onerror = () => fail('Voice agent failed to load');
    document.head.appendChild(script);
  });

  return loading;
}

const COPY: Record<Status, { text: string; sub: string; action: string }> = {
  idle: {
    text: 'Ready when you are',
    sub: 'Stella answers live. Your browser will ask for the microphone first.',
    action: 'Start the call',
  },
  connecting: {
    text: 'Connecting you now',
    sub: 'Opening the line to Stella.',
    action: 'Connecting…',
  },
  connected: {
    text: 'Stella is on the line',
    sub: 'Speak normally — she will hear you and answer.',
    action: 'End call',
  },
  failed: {
    text: 'The line did not connect',
    sub: 'Check that the microphone is allowed for this site, then try again.',
    action: 'Try again',
  },
};

export function VoiceAgent({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>('idle');
  const [detail, setDetail] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const live = useRef(false);
  /* Bumped whenever the call is torn down. Anything that resumes after an
     await compares against it and stands down if it belongs to a call the
     visitor has already closed. */
  const session = useRef(0);

  /* Keep a ref of the call state so unmount can hang up without re-binding. */
  live.current = status === 'connecting' || status === 'connected';

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

  const hangUp = useCallback(() => {
    /* Invalidate first, so a start still waiting on the network stands down
       even though there is nothing to stop yet. */
    session.current += 1;
    if (live.current) window.DograhWidget?.stop();
    /* Reset unconditionally: `failed` is not a live state, so guarding this
       behind live.current would leave the error on screen for the next open. */
    setStatus('idle');
    setDetail(null);
  }, []);

  /* A call must never outlive the panel that started it. */
  useEffect(() => () => hangUp(), [hangUp]);
  useEffect(() => {
    if (!open) hangUp();
  }, [open, hangUp]);

  async function startCall() {
    const mine = session.current;
    const current = () => mine === session.current;

    setStatus('connecting');
    setDetail(null);
    track('voice_call_started', { page: pathname });

    try {
      const widget = await loadDograh({
        page_url: window.location.href,
        today: new Date().toISOString().slice(0, 10),
      });

      /* Closed while the script was still downloading. */
      if (!current()) return;

      widget.onStatusChange((next, _text, subtext) => {
        if (!current()) return;
        if (next === 'connected') setStatus('connected');
        else if (next === 'connecting') setStatus('connecting');
        else if (next === 'failed') {
          setStatus('failed');
          if (subtext) setDetail(subtext);
        } else setStatus('idle');
      });
      widget.onCallEnd(() => {
        if (!current()) return;
        setStatus('idle');
        track('voice_call_ended', { page: pathname });
      });
      widget.onError((error) => {
        if (!current()) return;
        setStatus('failed');
        setDetail(error?.message ?? null);
      });

      widget.setContext({
        page_url: window.location.href,
        today: new Date().toISOString().slice(0, 10),
      });

      await widget.start();

      /* Closed while the line was being opened: hang up the call we just
         placed, since hangUp() ran before there was anything to stop. */
      if (!current()) widget.stop();
    } catch (error) {
      if (!current()) return;
      setStatus('failed');
      setDetail(error instanceof Error ? error.message : null);
    }
  }

  if (!open) return null;

  const copy = COPY[status];
  const busy = status === 'connecting';

  return (
    <div
      className="va pan pan--solid blur"
      role="dialog"
      aria-label="Talk to Stella by voice"
      tabIndex={-1}
      ref={panel}
    >
      <div className="va-top">
        <span className="va-mark">
          <Logo symbol />
        </span>
        <span className="va-id">
          <b>Stella</b>
          <em>AI Voice Employee</em>
        </span>
        <button className="ico" aria-label="Close" onClick={onClose} type="button">
          <X size={17} />
        </button>
      </div>

      <div className="va-stage">
        <div className={`va-orb va-orb--${status}`} aria-hidden="true">
          <span className="va-ring" />
          <span className="va-wave">
            {Array.from({ length: 5 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
        </div>

        <div className="va-state" aria-live="polite">
          <b>{copy.text}</b>
          <p className="sm">{detail ?? copy.sub}</p>
        </div>
      </div>

      <div className="va-foot">
        <button
          className={`btn ${status === 'connected' ? 'va-end' : 'btn-1'}`}
          type="button"
          onClick={status === 'connected' ? hangUp : startCall}
          disabled={busy}
        >
          {status === 'connected' ? (
            <PhoneOff size={16} />
          ) : status === 'failed' ? (
            <RotateCcw size={16} />
          ) : (
            <Mic size={16} />
          )}
          {copy.action}
        </button>
        <p className="note">
          A live demonstration. The conversation is processed by HireStella&rsquo;s voice
          platform — please do not share confidential customer data.
        </p>
      </div>
    </div>
  );
}
