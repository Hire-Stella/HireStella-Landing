'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquare, Mic, X } from 'lucide-react';
import { Logo } from './ui';
import { StellaWidget } from './stella-widget';
import { VoiceAgent, voiceConfigured } from './voice-agent';
import { track } from '@/lib/telemetry';

/**
 * The single floating symbol that opens either Stella.
 *
 * Hovering or focusing the symbol fans out two choices; clicking it does the
 * same for touch and keyboard. Only one panel is ever open, so the two Stellas
 * never talk over each other.
 */

type Mode = 'voice' | 'chat' | null;

/* Voice is withheld when no embed token is configured, so a misconfigured
   build degrades to chat rather than calling the wrong workflow. */
const OPTIONS = [
  ...(voiceConfigured ? [{ mode: 'voice' as const, icon: Mic, label: 'Call Stella' }] : []),
  { mode: 'chat' as const, icon: MessageSquare, label: 'Chat with Stella' },
];

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
      <StellaWidget
        open={mode === 'chat'}
        engaged={fan || panelOpen}
        onOpen={() => choose('chat')}
        onClose={closePanel}
      />

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
        </div>
      </div>
    </>
  );
}
