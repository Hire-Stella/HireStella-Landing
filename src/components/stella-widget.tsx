'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Logo } from './ui';
import { track } from '@/lib/telemetry';

/**
 * The floating Stella panel and the delayed invitation.
 *
 * Stella here runs labelled local scripts, not a live model, and the panel says
 * so. §34 of the brand book requires demo surfaces to be identifiable as demos.
 *
 * Opening is owned by AgentLauncher, which offers this chat alongside the live
 * voice Stella — one symbol, one panel at a time.
 */

type Line = { from: 'stella' | 'you'; text: string };

const OPENING: Line[] = [
  { from: 'stella', text: 'Hello. I am Stella, the AI General Manager.' },
  { from: 'stella', text: 'Tell me what is slowing your business down and I will show you which specialists the work would actually need.' },
];

const REPLIES: { label: string; you: string; stella: string[]; cta?: { href: string; label: string } }[] = [
  {
    label: 'We miss calls',
    you: 'We keep missing calls when the team is busy.',
    stella: [
      'That is the most common one. Missed calls rarely call back.',
      'A voice workflow answers every call, captures what the caller needs, and books or escalates it. Front Desk and Booking pick up from there.',
    ],
    cta: { href: '/stella#workforce', label: 'See the Voice specialist' },
  },
  {
    label: 'Follow-ups slip',
    you: 'Follow-ups keep slipping through.',
    stella: [
      'Usually because nobody owns the second contact.',
      'Follow-up schedules and runs them on your rules, and re-engages enquiries that went quiet, so it stops depending on who remembers.',
    ],
    cta: { href: '/stella#workforce', label: 'See Outbound & Follow-up' },
  },
  {
    label: 'What does it cost?',
    you: 'How is this priced?',
    stella: [
      'All eight specialists are included in every plan, and there is no per-message price.',
      'The operating level is set by volume, voice, languages, integrations and reporting. We confirm it during scoping rather than quoting blind.',
    ],
    cta: { href: '/book-demo', label: 'Book a demo' },
  },
  {
    label: 'Where do people stay in control?',
    you: 'Where do my people stay in control?',
    stella: [
      'At the boundary you configure.',
      'Clinical, legal and financial decisions, complaints, negotiation and anything contractual go to a person with the full conversation attached.',
    ],
    cta: { href: '/human-boundary', label: 'The human boundary' },
  },
];

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(matchMedia('(prefers-reduced-motion: reduce)').matches), []);
  return reduce;
}

export function StellaWidget({
  open,
  engaged,
  onOpen,
  onClose,
}: {
  open: boolean;
  /* True once the launcher is in use. The invitation and the launcher's
     options share the same corner, so only one of them may be on screen. */
  engaged: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [lines, setLines] = useState<Line[]>(OPENING);
  const [used, setUsed] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [cta, setCta] = useState<{ href: string; label: string } | null>(null);
  const [invite, setInvite] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /* The delayed invitation: once per session, never on a conversion page, and
     never on the confirmation that follows one. Inviting someone to book a demo
     thirty seconds after they booked one reads as a broken site, and the
     invitation's own button would reopen the form on the page whose only job is
     to record the conversion. */
  useEffect(() => {
    if (pathname === '/book-demo' || pathname === '/contact' || pathname === '/thank-you') return;
    let seen = false;
    try {
      seen = sessionStorage.getItem('hirestella-invite') === 'seen';
    } catch {
      /* Storage is optional; without it the invite simply shows. */
    }
    if (seen) return;
    const t = setTimeout(() => {
      setInvite(true);
      track('invite_shown');
    }, 5000);
    return () => clearTimeout(t);
  }, [pathname]);

  const dismissInvite = useCallback((reason: string) => {
    setInvite(false);
    try {
      sessionStorage.setItem('hirestella-invite', 'seen');
    } catch {
      /* Nothing to persist; the invite just returns next navigation. */
    }
    track('invite_dismissed', { reason });
  }, []);

  useEffect(() => {
    if (!open && !invite) return;
    function esc(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      if (invite) dismissInvite('escape');
      if (open) onClose();
    }
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, invite, dismissInvite, onClose]);

  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open]);

  useEffect(() => {
    if (engaged && invite) dismissInvite('engaged');
  }, [engaged, invite, dismissInvite]);

  useEffect(() => {
    if (open) log.current?.scrollTo({ top: log.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [lines, typing, open, reduce]);

  function ask(reply: (typeof REPLIES)[number]) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setUsed((u) => [...u, reply.label]);
    setCta(null);
    setLines((l) => [...l, { from: 'you', text: reply.you }]);
    setTyping(true);
    track('stella_widget_reply', { topic: reply.label });
    reply.stella.forEach((text, i) => {
      timers.current.push(
        setTimeout(
          () => {
            setLines((l) => [...l, { from: 'stella', text }]);
            if (i === reply.stella.length - 1) {
              setTyping(false);
              if (reply.cta) setCta(reply.cta);
            }
          },
          reduce ? 0 : 500 + i * 900,
        ),
      );
    });
  }

  function openPanel() {
    dismissInvite('opened');
    track('stella_widget_opened');
    onOpen();
  }

  const remaining = REPLIES.filter((r) => !used.includes(r.label));

  return (
    <>
      {invite && !open && (
        <div className="invite pan pan--solid blur" role="dialog" aria-label="A quicker way in">
          <button
            className="invite-x"
            aria-label="Dismiss"
            onClick={() => dismissInvite('close')}
            type="button"
          >
            <X size={15} />
          </button>
          <span className="invite-mark">
            <Logo symbol />
          </span>
          <div className="invite-body">
            <p className="micro">Before you go further</p>
            <b>Bring one workflow. We will map it with you.</b>
            <p className="sm">
              A short scoping conversation, no obligation, and a clearer next step either way.
            </p>
            <div className="invite-act">
              <button className="btn btn-1" type="button" data-demo onClick={() => dismissInvite('cta')}>
                Book a demo <span className="tri" aria-hidden="true" />
              </button>
              <button className="btn-3 invite-alt" type="button" onClick={openPanel}>
                Ask Stella first
              </button>
            </div>
          </div>
        </div>
      )}

      {open && (
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
              <em>Your AI General Manager</em>
            </span>
            <button className="ico" aria-label="Close" onClick={onClose} type="button">
              <X size={17} />
            </button>
          </div>

          <div className="sw-log" ref={log} aria-live="polite">
            {lines.map((l, i) => (
              <p className={`sw-line sw-${l.from}`} key={i}>
                {l.text}
              </p>
            ))}
            {typing && (
              <p className="sw-line sw-stella sw-typing" aria-label="Stella is replying">
                <i /> <i /> <i />
              </p>
            )}
            {cta && !typing && (
              <Link className="btn-3 sw-cta" href={cta.href} onClick={onClose}>
                {cta.label} <span className="tri" aria-hidden="true" />
              </Link>
            )}
          </div>

          <div className="sw-foot">
            {remaining.length ? (
              <div className="sw-chips">
                {remaining.map((r) => (
                  <button className="chip" key={r.label} type="button" onClick={() => ask(r)}>
                    {r.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="sw-chips">
                <button className="btn btn-1" type="button" data-demo onClick={onClose}>
                  Book a demo <span className="tri" aria-hidden="true" />
                </button>
                <Link className="chip" href="/#ask-stella" onClick={onClose}>
                  Brief Stella properly
                </Link>
              </div>
            )}
            <p className="note">
              Stella replies from labelled example scripts here, not a live model. Please do not
              enter confidential customer data.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
