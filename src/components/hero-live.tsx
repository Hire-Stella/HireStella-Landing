'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, UserRound } from 'lucide-react';

/**
 * The hero-side panel, animated: Stella's desk at work.
 *
 * Client review, 2026-10-09: the static "what is on this page" panels read as
 * template. This shows the product doing its job instead. A customer writes,
 * Stella hands the work to a specialist, the specialist answers, the result
 * pops up, and the next scene begins. The specialists row lights the one that
 * is working, so the "eight specialists" claim is something you watch rather
 * than read.
 *
 * It runs only while on screen, and holds still for reduced motion.
 */

export type LiveItem =
  | { k: 'in'; text: string; time: string }
  | { k: 'route'; to: string; text: string }
  | { k: 'out'; who: string; text: string; time: string }
  | { k: 'done'; text: string }
  | { k: 'hand'; text: string };

export type LiveScene = {
  channel: string;
  /** Header line after the name. Defaults to "is handling {channel}". */
  status?: string;
  clock: string;
  /** The pop-up that lands on the panel corner when the scene resolves. */
  toast: [string, string];
  items: LiveItem[];
};

export const SPECIALISTS = ['Front Desk', 'Voice', 'Website', 'Booking', 'Admin', 'Marketing', 'Social', 'Follow-up'];

export const STELLA_SCENES: LiveScene[] = [
  {
    channel: 'WhatsApp',
    clock: '11:04 pm',
    toast: ['New booking', 'Saturday, 11:00 am'],
    items: [
      { k: 'in', text: 'Hi, do you have any slots this Saturday?', time: '11:04 pm' },
      { k: 'route', to: 'Booking', text: 'Checking Saturday availability' },
      { k: 'out', who: 'Booking', text: 'Yes, 11am or 2pm. Which suits you?', time: '11:04 pm' },
      { k: 'in', text: '11am please', time: '11:05 pm' },
      { k: 'done', text: 'Booked for Saturday, 11:00 am' },
      { k: 'route', to: 'Follow-up', text: 'Reminder set for Friday evening' },
    ],
  },
  {
    channel: 'Phone',
    clock: '7:42 pm',
    toast: ['Lead qualified', 'In tomorrow’s morning report'],
    items: [
      { k: 'in', text: 'Missed call, after hours', time: '7:42 pm' },
      { k: 'route', to: 'Voice', text: 'Returning the call' },
      { k: 'out', who: 'Voice', text: 'Thanks for calling. How can we help this evening?', time: '7:43 pm' },
      { k: 'in', text: 'I need a quote for three rooms.', time: '7:43 pm' },
      { k: 'hand', text: 'Quote request handed to your team' },
      { k: 'route', to: 'Admin', text: 'Details added to the record' },
    ],
  },
  {
    channel: 'Instagram',
    clock: '9:15 am',
    toast: ['Enquiry answered', 'Follow-up booked for Monday'],
    items: [
      { k: 'in', text: 'Do you deliver to Dubai Marina?', time: '9:15 am' },
      { k: 'route', to: 'Social', text: 'Answering from your delivery notes' },
      { k: 'out', who: 'Social', text: 'We do, next working day. Shall I reserve one for you?', time: '9:15 am' },
      { k: 'in', text: 'Yes please, for Monday.', time: '9:16 am' },
      { k: 'done', text: 'Reserved for Monday delivery' },
      { k: 'route', to: 'Follow-up', text: 'Confirmation goes out Sunday' },
    ],
  },
];

const STEP = 1250;
const TYPING = 900;
const HOLD = 3400;
const LEAVE = 450;

export function HeroLive({
  scenes = STELLA_SCENES,
  label = 'Stella',
  team = SPECIALISTS,
}: {
  scenes?: LiveScene[];
  label?: string;
  /** The row that lights up as work moves: the specialists, or a coach's call stages. */
  team?: string[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const feed = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(0);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [still, setStill] = useState(false);

  /* Reduced motion: show the first scene complete and stop there. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true);
      setStep(scenes[0].items.length);
    }
  }, [scenes]);

  /* Only run while the panel is on screen. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = scenes[scene].items;

  useEffect(() => {
    if (still || !running) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
    if (step < items.length) {
      const next = items[step];
      const wait = step === 0 ? 700 : STEP;
      if (next.k === 'out') {
        later(() => setTyping(true), wait - 300);
        later(() => {
          setTyping(false);
          setStep((s) => s + 1);
        }, wait - 300 + TYPING);
      } else {
        later(() => setStep((s) => s + 1), wait);
      }
    } else {
      later(() => setLeaving(true), HOLD);
      later(() => {
        setScene((s) => (s + 1) % scenes.length);
        setStep(0);
        setLeaving(false);
      }, HOLD + LEAVE);
    }
    return () => timers.forEach(clearTimeout);
  }, [step, scene, running, still, items, scenes.length]);

  /* Messages fill from the top like a real chat; once the thread outgrows the
     window it glides up so the newest message is always in view. */
  useEffect(() => {
    const f = feed.current;
    if (f) f.scrollTo({ top: f.scrollHeight, behavior: still ? 'auto' : 'smooth' });
  }, [step, typing, scene, still]);

  const shown = items.slice(0, step);
  /* The lit cell is whoever last took the work: a routed role, or a team
     member who answered. Nothing is lit before the first hand-off. */
  const active = [...shown]
    .reverse()
    .map((i) => (i.k === 'route' ? i.to : i.k === 'out' ? i.who : undefined))
    .find((n) => n && team.includes(n));
  const working = active;
  const resolved = shown.some((i) => i.k === 'done' || i.k === 'hand');
  const s = scenes[scene];

  return (
    <div
      ref={root}
      className={`hl pan pan--solid ${leaving ? 'hl--leaving' : ''}`}
      role="img"
      aria-label={`${label} handling customer enquiries: answering, booking and following up, with anything sensitive handed to your team.`}
    >
      <div className="hl-top" aria-hidden="true">
        <span className="hl-who">
          <i />
          <b>{label}</b>
          <em>{s.status ?? `is handling ${s.channel}`}</em>
        </span>
        <span className="hl-clock">{s.clock}</span>
      </div>

      <div className="hl-feed" aria-hidden="true" key={scene} ref={feed}>
        {shown.map((it, i) => (
          <Row key={i} it={it} />
        ))}
        {typing ? (
          <p className="hl-typing">
            <i />
            <i />
            <i />
          </p>
        ) : null}
      </div>

      <div className="hl-team" aria-hidden="true" style={{ ['--cols' as string]: Math.min(team.length, 4) }}>
        {team.map((n) => (
          <span key={n} className={n === working ? 'on' : undefined}>
            {n}
          </span>
        ))}
      </div>

      {resolved && !leaving ? (
        <div className="hl-toast" aria-hidden="true" key={`t${scene}`}>
          <span className="hl-toast-ic">
            <Check size={15} strokeWidth={2.6} />
          </span>
          <span>
            <b>{s.toast[0]}</b>
            <em>{s.toast[1]}</em>
          </span>
        </div>
      ) : null}
    </div>
  );
}

function Row({ it }: { it: LiveItem }) {
  switch (it.k) {
    case 'in':
      return (
        <p className="hl-bub hl-bub--in">
          {it.text}
          <time>{it.time}</time>
        </p>
      );
    case 'out':
      return (
        <p className="hl-bub hl-bub--out">
          {it.text}
          <time>
            {it.who}, {it.time}
          </time>
        </p>
      );
    case 'route':
      return (
        <p className="hl-route">
          <b>Stella</b>
          <span className="hl-arrow" />
          <b className="hl-to">{it.to}</b>
          <em>{it.text}</em>
        </p>
      );
    case 'done':
      return (
        <p className="hl-done">
          <Check size={14} strokeWidth={2.4} />
          {it.text}
        </p>
      );
    case 'hand':
      return (
        <p className="hl-hand">
          <UserRound size={14} strokeWidth={2} />
          {it.text}
        </p>
      );
  }
}
