'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { specialists } from '@/lib/data';
import { Icon, Logo } from './ui';

const LEFT = specialists.slice(0, 4);
const RIGHT = specialists.slice(4, 8);

/**
 * §12.3 — specialist nodes stay static, only the active route animates.
 * Routes are anchored to real node and core edges and recomputed whenever
 * layout changes, so the lines cannot drift away from the cards.
 */
export function WorkforceMap() {
  const [active, setActive] = useState(0);
  const [paths, setPaths] = useState<{ d: string; len: number }[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const map = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);

  const draw = useCallback(() => {
    const host = map.current;
    const hub = core.current;
    if (!host || !hub || window.innerWidth < 1101) {
      setPaths([]);
      return;
    }
    const m = host.getBoundingClientRect();
    const c = hub.getBoundingClientRect();
    if (!m.width) return;
    setBox({ w: m.width, h: m.height });
    const cy = c.top - m.top + c.height / 2;
    const cl = c.left - m.left;
    const cr = c.right - m.left;
    const next = nodes.current.map((node, i) => {
      if (!node) return { d: '', len: 0 };
      const b = node.getBoundingClientRect();
      const isLeft = i < 4;
      const y = b.top - m.top + b.height / 2;
      const x = isLeft ? b.right - m.left : b.left - m.left;
      const ex = isLeft ? cl : cr;
      const c1 = x + (ex - x) * 0.45;
      const c2 = x + (ex - x) * 0.55;
      return {
        d: `M ${x.toFixed(1)} ${y.toFixed(1)} C ${c1.toFixed(1)} ${y.toFixed(1)}, ${c2.toFixed(1)} ${cy.toFixed(1)}, ${ex.toFixed(1)} ${cy.toFixed(1)}`,
        len: Math.round(Math.abs(ex - x) + Math.abs(cy - y) + 90),
      };
    });
    setPaths(next);
  }, []);

  useEffect(() => {
    draw();
    const host = map.current;
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => draw()) : null;
    if (host && observer) observer.observe(host);
    window.addEventListener('resize', draw);
    document.fonts?.ready.then(draw).catch(() => {});
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', draw);
    };
  }, [draw]);

  const current = specialists[active];

  return (
    <>
      <div className="map" ref={map}>
        <svg className="wires" viewBox={`0 0 ${box.w || 1000} ${box.h || 420}`} aria-hidden="true">
          {paths.map((p, i) =>
            p.d ? (
              <path
                key={i}
                d={p.d}
                className={i === active ? 'on' : ''}
                style={{ ['--len' as string]: p.len }}
              />
            ) : null,
          )}
        </svg>

        <div className="map-col">
          {LEFT.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="node"
              aria-pressed={active === i}
              ref={(el) => {
                nodes.current[i] = el;
              }}
              onClick={() => setActive(i)}
            >
              <Icon name={s.icon} size={20} />
              <span>
                <b>{s.short}</b>
                <em>{s.actions.split(' · ').slice(0, 2).join(' & ').toLowerCase()}</em>
              </span>
            </button>
          ))}
        </div>

        <div className="core" ref={core}>
          <div className="sym">
            <Logo symbol />
          </div>
          <p className="core-name">Stella</p>
          <p className="sm" style={{ color: 'var(--t2)' }}>
            Your AI General Manager
          </p>
          <p className="micro" style={{ marginTop: 8, letterSpacing: '.08em' }}>
            Understands · Coordinates · Connects
          </p>
        </div>

        <div className="map-col">
          {RIGHT.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="node"
              aria-pressed={active === i + 4}
              ref={(el) => {
                nodes.current[i + 4] = el;
              }}
              onClick={() => setActive(i + 4)}
            >
              <Icon name={s.icon} size={20} />
              <span>
                <b>{s.short}</b>
                <em>{s.actions.split(' · ').slice(0, 2).join(' & ').toLowerCase()}</em>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="read">
        <span className="micro num">
          {String(active + 1).padStart(2, '0')} / {String(specialists.length).padStart(2, '0')}
        </span>
        <b>{current.name}</b>
        <p>{current.detail}</p>
        <Link className="btn-3" href="/stella#workforce">
          See the role <span className="tri" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}

/** Exposes its assumptions, per the brand's ROI rule. Never a promised outcome. */
export function CapacityPanel() {
  const [hours, setHours] = useState(20);
  const monthly = Math.round(hours * 4.33 * 0.4);
  const value = Math.round(monthly * 60);
  return (
    <div className="cap pan pan--solid">
      <div className="cap-l">
        <p className="eyebrow eyebrow--sig">01 · Your team&rsquo;s capacity</p>
        <h3 style={{ maxWidth: '18ch' }}>What could your team do with more time?</h3>
        <div className="slider">
          <div className="row">
            <label className="sm" htmlFor="capacity-hours">
              Hours spent on repetitive work each week
            </label>
            <b
              className="num"
              style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 600, color: 'var(--t1)' }}
            >
              {hours} hrs
            </b>
          </div>
          <input
            id="capacity-hours"
            type="range"
            min={0}
            max={100}
            step={1}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />
          <div className="row">
            <span className="micro">0 hours</span>
            <span className="micro">100 hours</span>
          </div>
        </div>
        <p className="note" style={{ marginTop: 'var(--s6)' }}>
          The automatable share is an adjustable assumption, not a promised outcome.
        </p>
      </div>
      <div className="cap-r">
        <p className="micro">Potential monthly capacity</p>
        <div className="cap-big">
          <b className="num">{monthly}</b>
          <span style={{ fontSize: 18, color: 'var(--t2)' }}>hours</span>
        </div>
        <p style={{ fontSize: 15, maxWidth: '32ch' }}>
          That is time your people could spend on the work only they can do.
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 'var(--s4)',
            paddingTop: 'var(--s4)',
            borderTop: '1px solid var(--line)',
          }}
        >
          <span className="sm">Indicative capacity value</span>
          <b
            className="num"
            style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 600, color: 'var(--t1)' }}
          >
            AED {value.toLocaleString('en-US')}
          </b>
        </div>
        <p className="note">
          Illustrative estimate. Capacity value is not cash savings or guaranteed revenue.
        </p>
      </div>
    </div>
  );
}

/** §30A.2 — three planes converge into one readable operating picture. */
/* ── the command centre §30A.2 ──────────────────────────────────────────
   Three planes: the day's shape behind, what is happening beside it, and the
   figure that carries the argument in front.

   2026-09-22 rebuild. The four tiles used to read 34 / 21 / 9 / 2 in identical
   weight, which told the eye nothing, and the one number that makes the case,
   62% of enquiries reaching a booking, was a clause in a sentence underneath.
   Now the rate leads, the supporting figures carry a direction rather than a
   quantity, and open handoffs reads as a state because it is an exception count
   and not a statistic.

   Everything is derived from HOURS. The bars, the totals, the rate and the
   sparkline endpoint cannot drift apart, because there is only one series. */

/** Enquiries by hour across the working day. The single source for the rest. */
const HOURS = [
  { at: '08:00', enquiries: 2, bookings: 1 },
  { at: '10:00', enquiries: 4, bookings: 3 },
  { at: '12:00', enquiries: 3, bookings: 2 },
  { at: '14:00', enquiries: 6, bookings: 4 },
  { at: '16:00', enquiries: 7, bookings: 5 },
  { at: '18:00', enquiries: 5, bookings: 3 },
  { at: '20:00', enquiries: 4, bookings: 2 },
  { at: '22:00', enquiries: 3, bookings: 1 },
];

const TOTAL = HOURS.reduce((n, h) => n + h.enquiries, 0);
const BOOKED = HOURS.reduce((n, h) => n + h.bookings, 0);
const RATE = Math.round((BOOKED / TOTAL) * 100);
const PEAK = HOURS.reduce((a, b) => (b.enquiries > a.enquiries ? b : a));

/** Yesterday, for the deltas. A number with nothing to compare to says little. */
const YESTERDAY = { enquiries: 31, bookings: 18, followUps: 8 };
const FOLLOW_UPS = 9;
const OPEN_HANDOFFS = 2;
const RATE_BEFORE = Math.round((YESTERDAY.bookings / YESTERDAY.enquiries) * 100);

type Kind = 'enquiry' | 'booking' | 'followup' | 'handoff';

const TILES: { key: Kind; label: string; value: number; before: number; spark: number[] }[] = [
  { key: 'enquiry', label: 'Enquiries', value: TOTAL, before: YESTERDAY.enquiries, spark: [26, 29, 24, 31, 28, 31, TOTAL] },
  { key: 'booking', label: 'Bookings', value: BOOKED, before: YESTERDAY.bookings, spark: [14, 17, 13, 19, 16, 18, BOOKED] },
  { key: 'followup', label: 'Follow-ups', value: FOLLOW_UPS, before: YESTERDAY.followUps, spark: [6, 8, 5, 9, 7, 8, FOLLOW_UPS] },
];

const FEED: { time: string; label: string; kind: Kind }[] = [
  { time: '22:14', label: 'Enquiry received · Website', kind: 'enquiry' },
  { time: '22:14', label: 'Front Desk responded', kind: 'enquiry' },
  { time: '22:15', label: 'Stella routed to Booking', kind: 'booking' },
  { time: '22:16', label: 'Booking created', kind: 'booking' },
  { time: '22:16', label: 'Human handoff opened', kind: 'handoff' },
  { time: '08:02', label: 'Follow-up scheduled', kind: 'followup' },
];

/** A sparkline. Small enough that only the shape and the last point read. */
function Spark({ points, active }: { points: number[]; active: boolean }) {
  const w = 62;
  const h = 18;
  const lo = Math.min(...points);
  const hi = Math.max(...points);
  const span = hi - lo || 1;
  const x = (i: number) => (i / (points.length - 1)) * w;
  const y = (v: number) => h - ((v - lo) / span) * (h - 3) - 1.5;
  const line = points.map((v, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg className={`cc-spark ${active ? 'is-on' : ''}`} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path className="cc-spark-fill" d={area} />
      <path className="cc-spark-line" d={line} />
      <circle className="cc-spark-dot" cx={w} cy={y(points[points.length - 1])} r="2.6" />
    </svg>
  );
}

function Delta({ now, before }: { now: number; before: number }) {
  const diff = now - before;
  if (!diff) return <span className="cc-delta is-flat">no change</span>;
  return (
    <span className={`cc-delta ${diff > 0 ? 'is-up' : 'is-down'}`}>
      <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden="true">
        <path d={diff > 0 ? 'M5 1 L9 7 L1 7 Z' : 'M5 9 L1 3 L9 3 Z'} fill="currentColor" />
      </svg>
      {Math.abs(diff)} <span className="cc-delta-k">vs yesterday</span>
    </span>
  );
}

export function DashboardPlanes() {
  const [settled, setSettled] = useState(false);
  const [focus, setFocus] = useState<Kind | null>(null);
  const [shown, setShown] = useState(0);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettled(true);
      setShown(FEED.length);
      return;
    }
    const el = host.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSettled(true);
      setShown(FEED.length);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSettled(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* The feed is the most convincing thing here and it used to sit still. It
     fills in once, at a readable pace, then stops: a permanent loop would be
     decoration rather than a workspace. */
  useEffect(() => {
    if (!settled || shown >= FEED.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 260 : 420);
    return () => clearTimeout(t);
  }, [settled, shown]);

  const rear = settled ? { transform: 'translateZ(-60px) rotateX(1deg)', opacity: 0.88 } : undefined;
  const mid = settled ? { transform: 'translateZ(-20px) rotateY(1deg)' } : undefined;
  const dim = (k: Kind) => (focus && focus !== k ? ' is-dim' : '');

  return (
    <div className="planes" ref={host}>
      {/* ── the day's shape ── */}
      <div className="plane p-rear pan pan--solid" style={rear}>
        <div className="pcap">
          Enquiries by hour
          <span className="pcap-note">Peak {PEAK.at}</span>
        </div>
        <div className="cc-chart">
          <div className="bars" role="img" aria-label={`Enquiries by hour. ${HOURS.map((h) => `${h.at}: ${h.enquiries}`).join(', ')}.`}>
            {HOURS.map((h) => (
              <span className="cc-bar" key={h.at}>
                <i
                  className={h.at === PEAK.at ? 'on' : ''}
                  style={{ height: `${(h.enquiries / PEAK.enquiries) * 100}%` }}
                />
              </span>
            ))}
          </div>
          <div className="cc-axis" aria-hidden="true">
            {HOURS.map((h) => (
              <span key={h.at} className={h.at === PEAK.at ? 'is-peak' : ''}>
                {h.at.slice(0, 2)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── what is happening ── */}
      <div className="plane p-mid pan pan--solid" style={mid}>
        <div className="pcap">
          Live activity
          <span className="cc-pulse" aria-hidden="true" />
        </div>
        <div className="feed">
          {FEED.map((e, i) => (
            <div
              className={`ev${i < shown ? ' is-in' : ''}${dim(e.kind)}`}
              key={e.label}
              aria-hidden={i >= shown}
            >
              <time>{e.time}</time>
              <i className={e.kind === 'booking' ? 'on' : ''} aria-hidden="true" />
              {e.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── the figure that carries the argument ── */}
      <div className="plane p-front pan pan--solid">
        <div className="pcap">
          Command centre · today
          <span className="pcap-note">{TOTAL} enquiries</span>
        </div>

        <div className="cc-lead">
          <div>
            <span className="cc-rate">{RATE}%</span>
            <span className="cc-rate-k">of enquiries reached a booking</span>
          </div>
          <span className="cc-rate-delta">
            {RATE - RATE_BEFORE > 0 ? '+' : ''}
            {RATE - RATE_BEFORE} points vs yesterday
          </span>
        </div>

        <div className="cc-tiles">
          {TILES.map((t) => (
            <button
              type="button"
              className={`cc-tile${focus === t.key ? ' is-on' : ''}`}
              key={t.key}
              onMouseEnter={() => setFocus(t.key)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(t.key)}
              onBlur={() => setFocus(null)}
              aria-pressed={focus === t.key}
            >
              <span className="cc-tile-k">{t.label}</span>
              <span className="cc-tile-row">
                <b>{t.value}</b>
                <Spark points={t.spark} active={focus === t.key} />
              </span>
              <Delta now={t.value} before={t.before} />
            </button>
          ))}
        </div>

        {/* An exception count is a state, not a statistic, so it does not get a
            tile with a big number beside three others. */}
        <div className={`cc-flag${focus === 'handoff' ? ' is-on' : ''}`}>
          <span className="cc-flag-dot" aria-hidden="true" />
          <b>{OPEN_HANDOFFS} open handoffs</b>
          <span>waiting for a person</span>
        </div>

        <p className="cc-read">
          After-hours enquiries convert at a lower rate than daytime ones. Review the Voice to
          Booking handoff.
        </p>
      </div>
    </div>
  );
}
