'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Phone, Star } from 'lucide-react';
import { Icon, Logo } from './ui';
import { specialists } from '@/lib/data';

/*
 * Content 2.0 review (2026-10-17): two homepage stories.
 *
 *  - JourneyFlow: one customer's journey as a route that lights up with the
 *    scroll. Each step shows the small thing that actually happens (the
 *    message, the slot, the reminder) beside what it means.
 *  - LanguageShowcase: each language written in its own script, with Stella's
 *    greeting turning through them.
 *
 * Reduced motion: everything renders lit and still.
 */

const ROLE_ICON: Record<string, string> = Object.fromEntries(specialists.map((x) => [x.short, x.icon]));

type Step = { when: string; role: string; title: string; body: string };

const JOURNEY: Step[] = [
  { when: '11:04 pm', role: 'Front Desk', title: 'Customer gets in touch', body: 'A customer messages after hours about a service and availability. Front Desk replies from your approved business information.' },
  { when: '11:06 pm', role: 'Booking', title: 'A useful next step appears', body: 'The enquiry is qualified and passed to Booking, which offers a suitable slot from the connected calendar and prepares the confirmation.' },
  { when: 'Next day', role: 'Follow-up', title: 'No lead gets forgotten', body: 'Follow-up sends a permitted reminder, or asks for missing details, within your contact rules.' },
  { when: 'Before the visit', role: 'Voice', title: 'A smoother arrival', body: 'A call or message reminds the customer of the visit, with an easy way to reschedule.' },
  { when: 'After the visit', role: 'Admin', title: 'Information stays connected', body: 'Admin updates the records or prepares a summary, flagging anything sensitive for your staff.' },
  { when: 'Later', role: 'Marketing', title: 'A reason to come back', body: 'An approved message asks how it went or invites a relevant next booking, subject to consent.' },
  { when: 'Next morning', role: 'Stella', title: 'The owner sees the picture', body: 'Stella summarises activity, progress and handoffs, so you can focus on the decisions that need you.' },
];

/* The small artefact beside each step. Plain markup, so it reads without motion. */
function Artefact({ i }: { i: number }) {
  switch (i) {
    case 0:
      return (
        <div className="ja ja-chat">
          <p className="ja-in">Hi, do you have anything tomorrow evening?</p>
          <p className="ja-out">Yes, 6:30 pm is free. Shall I hold it for you?</p>
        </div>
      );
    case 1:
      return (
        <div className="ja ja-slots">
          <span>5:00</span>
          <span className="on">
            <Check size={12} strokeWidth={2.4} aria-hidden="true" /> 6:30
          </span>
          <span>7:15</span>
          <em>Confirmation ready</em>
        </div>
      );
    case 2:
      return (
        <div className="ja ja-list">
          <p>
            <Check size={13} strokeWidth={2.2} aria-hidden="true" /> Reminder sent on WhatsApp
          </p>
          <p className="dim">Asked for: preferred branch</p>
        </div>
      );
    case 3:
      return (
        <div className="ja ja-call">
          <span className="ja-ico">
            <Phone size={14} aria-hidden="true" />
          </span>
          <p>
            Reminder call <b>0:42</b>
            <em>Visit confirmed</em>
          </p>
        </div>
      );
    case 4:
      return (
        <div className="ja ja-list">
          <p>
            <Check size={13} strokeWidth={2.2} aria-hidden="true" /> Visit recorded
          </p>
          <p className="flag">One note flagged for staff</p>
        </div>
      );
    case 5:
      return (
        <div className="ja ja-stars">
          <p>How was your visit?</p>
          <span aria-label="Five stars">
            {[0, 1, 2, 3, 4].map((s) => (
              <Star key={s} size={14} aria-hidden="true" />
            ))}
          </span>
        </div>
      );
    default:
      return (
        <div className="ja ja-report">
          <p>Morning report</p>
          <span>
            <b>12</b> booked
          </span>
          <span>
            <b>9</b> followed up
          </span>
          <span className="sig">
            <b>2</b> for you
          </span>
        </div>
      );
  }
}

export function JourneyFlow() {
  const ref = useRef<HTMLOListElement>(null);
  const [p, setP] = useState(1);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setArmed(true);
    let frame = 0;
    const measure = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      /* The route reaches each step as it crosses the middle of the screen. */
      const next = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - r.top) / r.height));
      setP((prev) => (next > prev ? next : prev));
    };
    setP(0);
    const on = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      cancelAnimationFrame(frame);
    };
  }, []);

  const lit = (i: number) => !armed || p >= (i + 0.35) / JOURNEY.length;

  return (
    <ol className={`jr${armed ? ' is-armed' : ''}`} ref={ref} style={{ '--p': p } as React.CSSProperties}>
      <span className="jr-fill" aria-hidden="true" />
      {JOURNEY.map((s, i) => (
        <li className={lit(i) ? 'on' : ''} key={s.title}>
          <time>{s.when}</time>
          <span className="jr-dot" aria-hidden="true" />
          <div className="jr-body">
            <span className="jr-role">
              {s.role === 'Stella' ? <Logo symbol /> : <Icon name={ROLE_ICON[s.role]} size={14} />}
              {s.role}
            </span>
            <h3 className="h4">{s.title}</h3>
            <p>{s.body}</p>
          </div>
          <div className="jr-art pan pan--solid" aria-hidden="true">
            <Artefact i={i} />
          </div>
        </li>
      ))}
    </ol>
  );
}

/* Each language in its own script, with the greeting Stella would open with. */
const LANGS = [
  { code: 'en', native: 'English', name: 'International', hello: 'How can I help you today?' },
  { code: 'ar', native: 'العربية', name: 'Arabic', hello: 'كيف يمكنني مساعدتك اليوم؟', rtl: true },
  { code: 'hi', native: 'हिन्दी', name: 'Hindi', hello: 'आज मैं आपकी कैसे मदद कर सकती हूँ?' },
  { code: 'ur', native: 'اردو', name: 'Urdu', hello: 'آج میں آپ کی کیا مدد کر سکتی ہوں؟', rtl: true },
  { code: 'tl', native: 'Tagalog', name: 'Filipino', hello: 'Paano kita matutulungan ngayon?' },
  { code: 'fr', native: 'Français', name: 'French', hello: 'Comment puis-je vous aider aujourd’hui ?' },
  { code: 'ru', native: 'Русский', name: 'Russian', hello: 'Чем я могу вам помочь сегодня?' },
  { code: 'es', native: 'Español', name: 'Spanish', hello: '¿En qué puedo ayudarle hoy?' },
  { code: 'tr', native: 'Türkçe', name: 'Turkish', hello: 'Bugün size nasıl yardımcı olabilirim?' },
];

export function LanguageShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || held || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setAt((a) => (a + 1) % LANGS.length), 2600);
    return () => clearInterval(t);
  }, [inView, held]);

  const now = LANGS[at];
  return (
    <div className="lgx" ref={ref} onMouseLeave={() => setHeld(false)}>
      <div className="lgx-say">
        <span className="lgx-mark">
          <Logo symbol />
        </span>
        <p key={now.code} lang={now.code} dir={now.rtl ? 'rtl' : 'ltr'}>
          {now.hello}
        </p>
      </div>
      <div className="lgx-grid">
        {LANGS.map((l, i) => (
          <button
            type="button"
            key={l.code}
            className={i === at ? 'on' : ''}
            aria-pressed={i === at}
            onClick={() => {
              setAt(i);
              setHeld(true);
            }}
            onMouseEnter={() => {
              setAt(i);
              setHeld(true);
            }}
          >
            <b lang={l.code} dir={l.rtl ? 'rtl' : 'ltr'}>
              {l.native}
            </b>
            <span>{l.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
