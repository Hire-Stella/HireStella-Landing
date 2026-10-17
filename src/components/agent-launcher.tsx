'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquare, Mic, X } from 'lucide-react';
import { Logo } from './ui';
import { ChatAgent, chatConfigured } from './chat-agent';
import { VoiceAgent, voiceConfigured } from './voice-agent';
import { track } from '@/lib/telemetry';

/**
 * The single floating symbol that opens either Stella, or WhatsApp.
 *
 * Hovering or focusing the symbol fans out the choices; clicking it does the
 * same for touch and keyboard. Only one panel is ever open, so the two Stellas
 * never talk over each other — which also matters below the UI: voice and
 * chat share one Dograh embed token slot in the browser, and can only ever
 * have one of them actually loaded at a time (see chat-agent.tsx).
 */

type Mode = 'voice' | 'chat' | null;

/* Each option is withheld when its embed token is not configured, so a
   misconfigured build degrades to whichever one is available rather than
   offering a mode that cannot work. */
const OPTIONS = [
  ...(voiceConfigured ? [{ mode: 'voice' as const, icon: Mic, label: 'Call Stella' }] : []),
  ...(chatConfigured ? [{ mode: 'chat' as const, icon: MessageSquare, label: 'Chat with Stella' }] : []),
];

/* WhatsApp is a plain link out, not a panel, so it needs no token and is
   always offered. */
const WHATSAPP_URL = 'https://wa.me/971544300517';

function WhatsAppIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.04c0-5.22 4.25-9.46 9.48-9.46 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 0 1 2.77 6.69c0 5.22-4.25 9.47-9.46 9.47zm8.05-17.52A11.32 11.32 0 0 0 12.04.65C5.77.65.66 5.75.66 12.03c0 2 .52 3.96 1.52 5.69L.57 23.6l6.03-1.58a11.35 11.35 0 0 0 5.44 1.39h.01c6.27 0 11.38-5.11 11.38-11.38 0-3.04-1.18-5.9-3.34-8.05z" />
    </svg>
  );
}

export function AgentLauncher() {
  const [fan, setFan] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const symbol = useRef<HTMLButtonElement>(null);
  const leaving = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCapable = useRef(true);
  const restoringFocus = useRef(false);

  useEffect(() => {
    hoverCapable.current = matchMedia('(hover: hover)').matches;
  }, []);

  /* Returning focus to the symbol must not look like the visitor tabbing to
     it: after a keyboard interaction the programmatic focus still matches
     :focus-visible, which would fan the options straight back open. .focus()
     dispatches synchronously, so the flag is clear again by the next line. */
  const focusSymbol = useCallback(() => {
    restoringFocus.current = true;
    symbol.current?.focus();
    restoringFocus.current = false;
  }, []);

  const closeFan = useCallback(() => {
    if (leaving.current) clearTimeout(leaving.current);
    setFan(false);
  }, []);

  const openFan = useCallback(() => {
    if (leaving.current) clearTimeout(leaving.current);
    setFan(true);
  }, []);

  /* Touch devices fire compatibility mouseenter/mouseleave around a tap, which
     would open the fan and let the click toggle it straight back shut. Hover
     drives the fan only where hover genuinely exists. */
  const enter = useCallback(() => {
    if (hoverCapable.current) openFan();
  }, [openFan]);

  /* A short grace period so the cursor can travel from the symbol to an option. */
  const leave = useCallback(() => {
    if (!hoverCapable.current) return;
    if (leaving.current) clearTimeout(leaving.current);
    leaving.current = setTimeout(() => setFan(false), 180);
  }, []);

  useEffect(() => () => void (leaving.current && clearTimeout(leaving.current)), []);

  /* "Talk to Stella now" buttons elsewhere on the page carry data-talk. They
     open this launcher's real call and chat options, never the preset hero
     scenarios. With only one mode configured there is nothing to choose. */
  useEffect(() => {
    function talk(e: MouseEvent) {
      if (!(e.target as Element).closest?.('[data-talk]')) return;
      e.preventDefault();
      track('agent_launcher_opened', { from: 'page-cta' });
      if (OPTIONS.length === 1) {
        setMode(OPTIONS[0].mode);
        return;
      }
      openFan();
      setTimeout(() => wrap.current?.querySelector<HTMLElement>('.al-opt')?.focus({ preventScroll: true }), 60);
    }
    document.addEventListener('click', talk);
    return () => document.removeEventListener('click', talk);
  }, [openFan]);

  useEffect(() => {
    if (!fan) return;
    function esc(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      closeFan();
      focusSymbol();
    }
    function away(e: PointerEvent) {
      if (!wrap.current?.contains(e.target as Node)) closeFan();
    }
    document.addEventListener('keydown', esc);
    document.addEventListener('pointerdown', away);
    return () => {
      document.removeEventListener('keydown', esc);
      document.removeEventListener('pointerdown', away);
    };
  }, [fan, closeFan, focusSymbol]);

  function choose(next: Exclude<Mode, null>) {
    closeFan();
    setMode(next);
    track('agent_launcher_choice', { mode: next });
  }

  const closePanel = useCallback(() => {
    setMode(null);
    focusSymbol();
  }, [focusSymbol]);

  const panelOpen = mode !== null;

  return (
    <>
      <VoiceAgent open={mode === 'voice'} onClose={closePanel} />
      <ChatAgent open={mode === 'chat'} onClose={closePanel} />

      <div
        className="al"
        ref={wrap}
        onMouseEnter={enter}
        onMouseLeave={leave}
        /* Keyboard focus opens the fan. A tap also focuses the symbol, so
           without :focus-visible the click below would toggle it straight
           back shut. */
        onFocus={(e) => {
          if (restoringFocus.current) return;
          if (e.target.matches(':focus-visible')) openFan();
        }}
        onBlur={(e) => {
          if (!wrap.current?.contains(e.relatedTarget as Node)) closeFan();
        }}
      >
        <button
          className={`al-sym ${panelOpen ? 'is-open' : ''} ${fan && !panelOpen ? 'is-fanned' : ''}`}
          ref={symbol}
          type="button"
          aria-expanded={fan && !panelOpen}
          aria-haspopup="true"
          aria-label={panelOpen ? 'Close Stella' : 'Talk to Stella'}
          onClick={() => {
            if (panelOpen) {
              setMode(null);
              return;
            }
            /* With a real pointer the fan is already open from hover, so a
               click must not immediately undo it. Touch has no hover, and
               toggles. */
            setFan((f) => (hoverCapable.current ? true : !f));
          }}
        >
          <span className="al-sym-face">
            {panelOpen ? (
              <X size={19} />
            ) : (
              <>
                <Logo symbol />
                <i className="dot" aria-hidden="true" />
              </>
            )}
          </span>
          <span className="al-pulse" aria-hidden="true" />
        </button>

        {/* After the symbol in the DOM so Tab reaches the options from it;
            .al reverses the column so they still sit above. */}
        <div
          className={`al-opts ${fan && !panelOpen ? 'is-open' : ''}`}
          role="group"
          aria-label="Ways to reach Stella"
          aria-hidden={!fan || panelOpen}
        >
          {OPTIONS.map(({ mode: m, icon: Icon, label }) => (
            <button
              className={`al-opt al-opt--${m}`}
              key={m}
              type="button"
              tabIndex={fan && !panelOpen ? 0 : -1}
              onClick={() => choose(m)}
            >
              <span className="al-opt-ico">
                <Icon size={17} />
              </span>
              <span className="al-opt-txt">{label}</span>
            </button>
          ))}
          <a
            className="al-opt al-opt--whatsapp"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={fan && !panelOpen ? 0 : -1}
            onClick={() => {
              closeFan();
              track('agent_launcher_choice', { mode: 'whatsapp' });
            }}
          >
            <span className="al-opt-ico">
              <WhatsAppIcon />
            </span>
            <span className="al-opt-txt">WhatsApp us</span>
          </a>
        </div>
      </div>
    </>
  );
}
