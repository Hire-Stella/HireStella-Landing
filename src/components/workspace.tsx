'use client';

import { useId, useState } from 'react';
import { Icon } from './ui';
import { clinicWorkspace, type Workspace, type Point } from '@/lib/workspace-content';

/**
 * The operations workspace.
 *
 * This is the page's evidence: the product claim is "you see the whole
 * picture", so the page shows the picture rather than describing it. Every
 * number is derived from the series it sits above, never hard-coded, so the
 * views cannot drift apart as the content changes.
 *
 * 2026-09-22: the "Demo data" badge and the sample-data footnotes were removed
 * on request. The figures stay reconciled and stay operational in tone, so no
 * number on screen claims to be a measured customer outcome and none needs a
 * disclaimer under it. §8.3 surfaces, §12.2 motion.
 */

/* The second view is named by the sector: a dealership takes bookings, an
   agency takes viewings, a clinic takes appointments. */
function views(bookingsLabel: string) {
  return [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'appointments', label: bookingsLabel, icon: 'calendar' },
    { id: 'activity', label: 'Live activity', icon: 'activity' },
    { id: 'specialists', label: 'Specialists', icon: 'users' },
    { id: 'handoffs', label: 'Human handoffs', icon: 'shield' },
  ] as const;
}

type ViewId = 'overview' | 'appointments' | 'activity' | 'specialists' | 'handoffs';

function sum(series: Point[], key: 'enquiries' | 'bookings') {
  return series.reduce((total, point) => total + point[key], 0);
}

/* ── the chart ─────────────────────────────────────────────────────────
   Drawn to one scale: the tallest bar sets the ceiling, gridlines and the
   axis labels read off the same numbers the tiles above show. */
function Chart({
  series,
  caption,
  bookingsLabel,
}: {
  series: Point[];
  caption: string;
  bookingsLabel: string;
}) {
  const titleId = useId();
  const W = 620;
  const H = 170;
  const PAD_B = 2;
  const PAD_T = 10;
  const ceiling = Math.max(...series.map((p) => p.enquiries));
  const step = W / series.length;
  const barW = Math.min(15, step / 4.4);
  const y = (v: number) => PAD_T + (H - PAD_T - PAD_B) * (1 - v / ceiling);

  return (
    <figure className="ws-chart">
      <figcaption>
        <strong>Enquiries &amp; {bookingsLabel.toLowerCase()}</strong>
        <span>{caption}</span>
      </figcaption>
      <div className="ws-legend" aria-hidden="true">
        <span className="ws-key ws-key--e">Enquiries</span>
        <span className="ws-key ws-key--b">{bookingsLabel}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={titleId} preserveAspectRatio="none">
        <title id={titleId}>
          {series
            .map((p) => `${p.label}: ${p.enquiries} enquiries, ${p.bookings} ${bookingsLabel.toLowerCase()}`)
            .join('. ')}
        </title>
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            className="ws-grid"
            x1="0"
            x2={W}
            y1={y(ceiling * t)}
            y2={y(ceiling * t)}
          />
        ))}
        {series.map((p, i) => {
          const cx = step * i + step / 2;
          return (
            <g key={p.label}>
              <rect
                className="ws-bar ws-bar--e"
                x={cx - barW - 3}
                y={y(p.enquiries)}
                width={barW}
                height={Math.max(2, H - PAD_B - y(p.enquiries))}
                rx="3"
              />
              <rect
                className="ws-bar ws-bar--b"
                x={cx + 3}
                y={y(p.bookings)}
                width={barW}
                height={Math.max(2, H - PAD_B - y(p.bookings))}
                rx="3"
              />
            </g>
          );
        })}
      </svg>
      <div className="ws-axis" aria-hidden="true">
        {series.map((p) => (
          <span key={p.label}>{p.label}</span>
        ))}
      </div>
    </figure>
  );
}

function Ring({
  enquiries,
  bookings,
  word,
}: {
  enquiries: number;
  bookings: number;
  word: string;
}) {
  const pct = Math.round((bookings / enquiries) * 100);
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <figure className="ws-ring">
      <svg
        viewBox="0 0 132 132"
        role="img"
        aria-label={`${pct} per cent of enquiries reached a ${word}`}
      >
        <circle className="ws-ring-track" cx="66" cy="66" r={R} fill="none" strokeWidth="11" />
        <circle
          className="ws-ring-fill"
          cx="66"
          cy="66"
          r={R}
          fill="none"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${(C * pct) / 100} ${C}`}
          transform="rotate(-90 66 66)"
        />
        <text className="ws-ring-v" x="66" y="64" textAnchor="middle">
          {pct}%
        </text>
        <text className="ws-ring-k" x="66" y="84" textAnchor="middle">
          to {word}
        </text>
      </svg>
      <figcaption>
        <strong>Enquiry → {word}</strong>
        <span>
          {bookings} of {enquiries} enquiries reached a {word}.
        </span>
      </figcaption>
    </figure>
  );
}

export function OperationsWorkspace({ data = clinicWorkspace }: { data?: Workspace }) {
  const [view, setView] = useState<ViewId>('overview');
  const [period, setPeriod] = useState<'today' | 'week'>('today');
  const [open, setOpen] = useState<string | null>(null);

  const series = period === 'today' ? data.today : data.week;
  const enquiries = sum(series, 'enquiries');
  const bookings = sum(series, 'bookings');
  const followUps = period === 'today' ? data.followUps.today : data.followUps.week;
  const handoffTotal =
    period === 'today' ? data.handoffs.todayTotal : data.handoffs.weekTotal;

  const records =
    view === 'handoffs'
      ? data.records.filter((r) => r.status === 'Staff review')
      : view === 'appointments'
        ? data.records.filter((r) => r.status === 'Confirmed')
        : data.records;

  const VIEWS = views(data.bookingsLabel);
  const active = VIEWS.find((v) => v.id === view)!;
  const showNumbers = view === 'overview';

  function change(next: ViewId) {
    setView(next);
    setOpen(null);
  }

  return (
    <div className="ws pan pan--solid">
      {/* ── the rail of views ── */}
      <aside className="ws-side">
        <div className="ws-org">
          <span className="ws-badge" aria-hidden="true">
            {data.initials}
          </span>
          <span>
            <b>{data.workspace}</b>
            <em>Operations workspace</em>
          </span>
        </div>

        <nav className="ws-nav" aria-label="Workspace views">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={view === v.id}
              onClick={() => change(v.id)}
            >
              <Icon name={v.icon} size={17} />
              <span>{v.label}</span>
              {v.id === 'handoffs' && <b className="ws-pip">{data.handoffs.open}</b>}
            </button>
          ))}
        </nav>

        <div className="ws-note">
          <Icon name="users" size={17} />
          <p>
            Your people.
            <br />
            <strong>Always in control.</strong>
          </p>
        </div>
      </aside>

      {/* ── the working area ── */}
      <div className="ws-main">
        <div className="ws-bar-top">
          <span className="ws-crumb">
            <Icon name="dashboard" size={14} /> Workspace <i aria-hidden="true">/</i>{' '}
            {active.label}
          </span>
        </div>

        <label className="ws-pick">
          <span className="micro">Workspace view</span>
          <select value={view} onChange={(e) => change(e.target.value as ViewId)}>
            {VIEWS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </label>

        <div className="ws-head">
          <div>
            <p className="micro">{data.day}</p>
            <h3>{view === 'overview' ? data.headline : active.label}</h3>
          </div>
          {showNumbers && (
            <div className="ws-period" role="group" aria-label="Period">
              {(['today', 'week'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={period === p}
                  onClick={() => setPeriod(p)}
                >
                  {p === 'today' ? 'Today' : '7 days'}
                </button>
              ))}
            </div>
          )}
        </div>

        {showNumbers && (
          <>
            <div className="ws-tiles">
              {[
                ['Enquiries', enquiries, 'Across configured channels', 'message'],
                [data.bookingsLabel, bookings, 'Confirmed and in the calendar', 'calendar'],
                ['Follow-ups', followUps, 'Scheduled and waiting to send', 'send'],
                [
                  'Open handoffs',
                  data.handoffs.open,
                  `${handoffTotal - data.handoffs.open} resolved · ${handoffTotal} total`,
                  'users',
                ],
              ].map(([label, value, note, icon], i) => (
                <div className={`ws-tile ${i === 3 ? 'is-sig' : ''}`} key={String(label)}>
                  <span className="ws-tile-k">
                    <Icon name={String(icon)} size={15} />
                    {String(label)}
                  </span>
                  <strong className="num">{value}</strong>
                  <small>{note}</small>
                </div>
              ))}
            </div>

            <div className="ws-charts">
              <Chart
                series={series}
                caption={period === 'today' ? 'Today, by hour' : 'This week'}
                bookingsLabel={data.bookingsLabel}
              />
              <Ring enquiries={enquiries} bookings={bookings} word={data.bookingWord} />
            </div>
          </>
        )}

        {view === 'activity' ? (
          <div className="ws-feed">
            <div className="ws-sub">
              <strong>One enquiry, end to end</strong>
              <span>Every step, in order</span>
            </div>
            <ol>
              {data.feed.map((e) => (
                <li key={e.label} className={e.live ? 'is-live' : ''}>
                  <time className="num">{e.time}</time>
                  <i aria-hidden="true" />
                  <span>{e.label}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : view === 'specialists' ? (
          <div className="ws-roster">
            <div className="ws-sub">
              <strong>Activated for this workspace</strong>
              <span>Four of eight · the rest stay available</span>
            </div>
            {data.roster.map((r) => (
              <div className="ws-role" key={r.name}>
                <span className="ws-role-i" aria-hidden="true">
                  <Icon name={r.icon} size={17} />
                </span>
                <span className="ws-role-t">
                  <b>{r.name}</b>
                  <em>{r.role}</em>
                </span>
                <span className="ws-meter" aria-hidden="true">
                  <i style={{ width: `${r.load}%` }} />
                </span>
                <span className="ws-role-v num">{r.load}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="ws-records">
            <div className="ws-sub">
              <strong>
                {view === 'handoffs'
                  ? 'Waiting for a person'
                  : view === 'appointments'
                    ? 'Confirmed in the calendar'
                    : 'A few journeys in motion'}
              </strong>
              <span>Most recent first</span>
            </div>
            {records.map((r) => {
              const isOpen = open === r.id;
              return (
                <div className={`ws-rec ${isOpen ? 'is-open' : ''}`} key={r.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : r.id)}
                  >
                    <span className="ws-rec-i" aria-hidden="true">
                      <Icon name={r.icon} size={16} />
                    </span>
                    <span className="ws-rec-t">
                      <b>{r.title}</b>
                      <em>
                        {r.id} · {r.channel}
                      </em>
                    </span>
                    <time className="num">{r.time}</time>
                    <span
                      className={`ws-pill ws-pill--${r.status.split(' ')[0].toLowerCase()}`}
                    >
                      {r.status}
                    </span>
                    <span className="ws-rec-x" aria-hidden="true" />
                  </button>
                  {isOpen && <p className="ws-rec-d">{r.detail}</p>}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
