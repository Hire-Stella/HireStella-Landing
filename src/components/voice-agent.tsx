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

const TOKEN =
  process.env.NEXT_PUBLIC_DOGRAH_TOKEN ?? 'emb_nwbFG_AlqMRl8-LmulT9LnhBCR_q-hdfKXzFyh04rag';
const API = process.env.NEXT_PUBLIC_DOGRAH_ENDPOINT ?? 'https://voice.hirestella.ai';
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
    script.onload = () =>
      window.DograhWidget
        ? resolve(window.DograhWidget)
        : reject(new Error('Voice agent loaded without an API'));
    script.onerror = () => {
      loading = null;
      reject(new Error('Voice agent failed to load'));
    };
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
    if (!live.current) return;
    window.DograhWidget?.stop();
    setStatus('idle');
    setDetail(null);
  }, []);

  /* A call must never outlive the panel that started it. */
  useEffect(() => () => hangUp(), [hangUp]);
  useEffect(() => {
    if (!open) hangUp();
  }, [open, hangUp]);

  async function startCall() {
    setStatus('connecting');
    setDetail(null);
    track('voice_call_started', { page: pathname });

    try {
      const widget = await loadDograh({
        page_url: window.location.href,
        today: new Date().toISOString().slice(0, 10),
      });

      widget.onStatusChange((next, _text, subtext) => {
        if (next === 'connected') setStatus('connected');
        else if (next === 'connecting') setStatus('connecting');
        else if (next === 'failed') {
          setStatus('failed');
          if (subtext) setDetail(subtext);
        } else setStatus('idle');
      });
      widget.onCallEnd(() => {
        setStatus('idle');
        track('voice_call_ended', { page: pathname });
      });
      widget.onError((error) => {
        setStatus('failed');
        setDetail(error?.message ?? null);
      });

      widget.setContext({
        page_url: window.location.href,
        today: new Date().toISOString().slice(0, 10),
      });

      await widget.start();
    } catch (error) {
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
