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
        <Link className="btn-3" href={`/workforce/${current.id}`}>
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
export function DashboardPlanes() {
  const [settled, setSettled] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setSettled(true);
    const el = host.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
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

  const rear = settled
    ? { transform: 'translateZ(-60px) rotateX(1deg)', opacity: 0.88 }
    : undefined;
  const mid = settled ? { transform: 'translateZ(-20px) rotateY(1deg)' } : undefined;

  return (
    <div className="planes" ref={host}>
      <div className="plane p-rear pan pan--solid" style={rear}>
        <div className="pcap">Specialist metrics</div>
        <div className="bars" aria-hidden="true">
          {[38, 62, 45, 78, 94, 56, 70, 41].map((h, i) => (
            <i key={i} className={h === 94 ? 'on' : ''} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      <div className="plane p-mid pan pan--solid" style={mid}>
        <div className="pcap">Live activity</div>
        <div className="feed">
          {[
            ['22:14', 'Enquiry received · Website', false],
            ['22:14', 'Front Desk responded', false],
            ['22:15', 'Stella routed to Booking', true],
            ['22:16', 'Booking created', false],
            ['22:16', 'Human handoff opened', false],
            ['08:02', 'Follow-up scheduled', false],
          ].map(([time, label, on]) => (
            <div className="ev" key={label as string}>
              <time>{time as string}</time>
              <i className={on ? 'on' : ''} aria-hidden="true" />
              {label as string}
            </div>
          ))}
        </div>
      </div>

      <div className="plane p-front pan pan--solid">
        <div className="pcap">
          Command centre · sample day <span style={{ marginLeft: 'auto' }}>Demo data</span>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="k">Enquiries</div>
            <div className="v">34</div>
          </div>
          <div className="stat">
            <div className="k">Bookings</div>
            <div className="v">21</div>
          </div>
          <div className="stat">
            <div className="k">Follow-ups</div>
            <div className="v">9</div>
          </div>
          <div className="stat hl">
            <div className="k">Open handoffs</div>
            <div className="v">2</div>
          </div>
        </div>
        <p style={{ fontSize: 15, marginTop: 'var(--s5)', lineHeight: 1.65 }}>
          <b style={{ color: 'var(--t1)', fontWeight: 600 }}>
            21 of 34 enquiries reached a booking.
          </b>{' '}
          After-hours enquiries convert at a lower rate than daytime ones. Review the Voice to
          Booking handoff.
        </p>
      </div>
    </div>
  );
}
