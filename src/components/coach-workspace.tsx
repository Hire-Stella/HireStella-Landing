'use client';

import { useId, useState } from 'react';
import { Icon } from './ui';
import { demoCoachWorkspace, type CoachWorkspaceData, type CoachPoint } from '@/lib/coach-content';

/**
 * The coaching workspace.
 *
 * The page claims a manager can see what changed. This is the page showing it
 * rather than saying it. It borrows the whole `ws-*` vocabulary from the
 * operations workspace — the rail that collapses to a select under 1080px,
 * the tiles that go 2-up under 620px, the HTML chart axis that does not scale
 * with the drawing — so there is one dashboard language on this site, not two.
 *
 * The rules it is built to are the operations workspace's rules:
 *
 * - Every number is derived. Tiles are sums of the plotted series, the average
 *   competency is the mean of the bars under it, and "below target" counts the
 *   sellers listed. Change the data and every view moves together.
 * - Orange appears once per view. On the overview it is the tile that means a
 *   person is needed; in the transcript it is the single flagged line.
 * - The period toggle renders only where numbers respond to it.
 * - 2026-09-22: the "Demo data" badge and the sample-data footnotes were
 *   removed on request, matching the operations workspace. The figures stay
 *   derived and operational in tone, so nothing on screen claims to be a
 *   measured customer outcome.
 */

const VIEWS = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'scenarios', label: 'Scenarios', icon: 'message' },
  { id: 'session', label: 'Live session', icon: 'activity' },
  { id: 'competencies', label: 'Competencies', icon: 'chart' },
  { id: 'sellers', label: 'Sellers', icon: 'users' },
] as const;

type ViewId = (typeof VIEWS)[number]['id'];

function sum(series: CoachPoint[], key: 'sessions' | 'passed') {
  return series.reduce((total, point) => total + point[key], 0);
}

function mean(values: number[]) {
  return Math.round(values.reduce((t, v) => t + v, 0) / values.length);
}

/* ── the chart ─────────────────────────────────────────────────────────
   Two series to one scale: sessions run, and the scenarios passed out of
   them. The axis is HTML underneath, because type inside a viewBox scales
   with the drawing and becomes unreadable on a phone. */
function Chart({ series, caption }: { series: CoachPoint[]; caption: string }) {
  const titleId = useId();
  const W = 620;
  const H = 170;
  const PAD_B = 2;
  const PAD_T = 10;
  const ceiling = Math.max(...series.map((p) => p.sessions));
  const step = W / series.length;
  const barW = Math.min(15, step / 4.4);
  const y = (v: number) => PAD_T + (H - PAD_T - PAD_B) * (1 - v / ceiling);

  return (
    <figure className="ws-chart">
      <figcaption>
        <strong>Sessions &amp; scenarios passed</strong>
        <span>{caption}</span>
      </figcaption>
      <div className="ws-legend" aria-hidden="true">
        <span className="ws-key ws-key--e">Sessions</span>
        <span className="ws-key ws-key--b">Passed</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={titleId} preserveAspectRatio="none">
        <title id={titleId}>
          {series.map((p) => `${p.label}: ${p.sessions} sessions, ${p.passed} passed`).join('. ')}
        </title>
        {[0, 0.5, 1].map((t) => (
          <line key={t} className="ws-grid" x1="0" x2={W} y1={y(ceiling * t)} y2={y(ceiling * t)} />
        ))}
        {series.map((p, i) => {
          const cx = step * i + step / 2;
          return (
            <g key={p.label}>
              <rect
                className="ws-bar ws-bar--e"
                x={cx - barW - 3}
                y={y(p.sessions)}
                width={barW}
                height={Math.max(2, H - PAD_B - y(p.sessions))}
                rx="3"
              />
              <rect
                className="ws-bar ws-bar--b"
                x={cx + 3}
                y={y(p.passed)}
                width={barW}
                height={Math.max(2, H - PAD_B - y(p.passed))}
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

function Ring({ sessions, passed }: { sessions: number; passed: number }) {
  const pct = Math.round((passed / sessions) * 100);
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <figure className="ws-ring">
      <svg
        viewBox="0 0 132 132"
        role="img"
        aria-label={`${pct} per cent of practice sessions ended in a passed scenario`}
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
          passed
        </text>
      </svg>
      <figcaption>
        <strong>Session → passed</strong>
        <span>
          {passed} of {sessions} practice sessions ended in a pass.
        </span>
      </figcaption>
    </figure>
  );
}

/** A scored row: the meter is the score, so the bar and the number cannot disagree. */
function Meters({
  rows,
  target,
}: {
  rows: { name: string; role: string; icon: string; score: number }[];
  target: number;
}) {
  return (
    <>
      {rows.map((r) => (
        <div className={`ws-role ${r.score < target ? 'is-under' : ''}`} key={r.name}>
          <span className="ws-role-i" aria-hidden="true">
            <Icon name={r.icon} size={17} />
          </span>
          <span className="ws-role-t">
            <b>{r.name}</b>
            <em>{r.role}</em>
          </span>
          <span className="ws-meter" aria-hidden="true">
            <i style={{ width: `${r.score}%` }} />
          </span>
          <span className="ws-role-v num">{r.score}</span>
        </div>
      ))}
    </>
  );
}

export function CoachWorkspace({ data = demoCoachWorkspace }: { data?: CoachWorkspaceData }) {
  const [view, setView] = useState<ViewId>('overview');
  const [period, setPeriod] = useState<'week' | 'quarter'>('week');
  const [open, setOpen] = useState<string | null>(null);

  const series = period === 'week' ? data.week : data.quarter;
  const sessions = sum(series, 'sessions');
  const passed = sum(series, 'passed');
  const average = mean(data.competencies.map((c) => c.score));
  const under = data.sellers.filter((s) => s.score < data.target);
  const needsCoaching = data.scenarios.filter((s) => s.status === 'Coaching needed');

  const active = VIEWS.find((v) => v.id === view)!;
  const showNumbers = view === 'overview';

  function change(next: ViewId) {
    setView(next);
    setOpen(null);
  }

  return (
    <div className="ws pan pan--solid">
      <aside className="ws-side">
        <div className="ws-org">
          <span className="ws-badge" aria-hidden="true">
            {data.initials}
          </span>
          <span>
            <b>{data.workspace}</b>
            <em>Coaching workspace</em>
          </span>
        </div>

        <nav className="ws-nav" aria-label="Coaching views">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => change(v.id)}>
              <Icon name={v.icon} size={17} />
              <span>{v.label}</span>
              {v.id === 'scenarios' && <b className="ws-pip">{needsCoaching.length}</b>}
            </button>
          ))}
        </nav>

        <div className="ws-note">
          <Icon name="users" size={17} />
          <p>
            The manager decides.
            <br />
            <strong>The platform shows where.</strong>
          </p>
        </div>
      </aside>

      <div className="ws-main">
        <div className="ws-bar-top">
          <span className="ws-crumb">
            <Icon name="dashboard" size={14} /> Sales Coach <i aria-hidden="true">/</i> {active.label}
          </span>
        </div>

        <label className="ws-pick">
          <span className="micro">Coaching view</span>
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
              {(['week', 'quarter'] as const).map((p) => (
                <button key={p} type="button" aria-pressed={period === p} onClick={() => setPeriod(p)}>
                  {p === 'week' ? 'This week' : '6 weeks'}
                </button>
              ))}
            </div>
          )}
        </div>

        {showNumbers && (
          <>
            <div className="ws-tiles">
              {[
                ['Practice sessions', sessions, 'Completed by your sellers', 'message'],
                ['Scenarios passed', passed, `${sessions - passed} to re-run`, 'check'],
                ['Avg competency', average, `Mean of ${data.competencies.length} scored skills`, 'chart'],
                [
                  'Below target',
                  under.length,
                  `${data.sellers.length - under.length} of ${data.sellers.length} at or above ${data.target}`,
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
                caption={period === 'week' ? 'This week, by day' : 'The last six weeks'}
              />
              <Ring sessions={sessions} passed={passed} />
            </div>
          </>
        )}

        {view === 'session' ? (
          <div className="ws-feed">
            <div className="ws-sub">
              <strong>One role-play, played back</strong>
              <span>Full transcript</span>
            </div>
            <ol>
              {data.transcript.map((e) => (
                <li key={e.time} className={e.flag ? 'is-live' : ''}>
                  <time className="num">{e.time}</time>
                  <i aria-hidden="true" />
                  <span>{e.label}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : view === 'competencies' ? (
          <div className="ws-roster">
            <div className="ws-sub">
              <strong>Scored separately, on one scale</strong>
              <span>
                Team average {average} · target {data.target}
              </span>
            </div>
            <Meters rows={data.competencies} target={data.target} />
          </div>
        ) : view === 'sellers' ? (
          <div className="ws-roster">
            <div className="ws-sub">
              <strong>Who needs the next hour of coaching</strong>
              <span>
                {under.length} of {data.sellers.length} below target
              </span>
            </div>
            <Meters rows={data.sellers} target={data.target} />
          </div>
        ) : (
          <div className="ws-records">
            <div className="ws-sub">
              <strong>Built from this team&rsquo;s own sales process</strong>
              <span>Active scenarios</span>
            </div>
            {data.scenarios.map((s) => {
              const isOpen = open === s.id;
              return (
                <div className={`ws-rec ${isOpen ? 'is-open' : ''}`} key={s.id}>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : s.id)}>
                    <span className="ws-rec-i" aria-hidden="true">
                      <Icon name={s.icon} size={16} />
                    </span>
                    <span className="ws-rec-t">
                      <b>{s.title}</b>
                      <em>
                        {s.id} · {s.kind}
                      </em>
                    </span>
                    {/* A duration, so it needs a machine-readable ISO value to be valid HTML. */}
                    <time className="num" dateTime={`PT${parseInt(s.length, 10)}M`}>
                      {s.length}
                    </time>
                    <span className={`ws-pill ws-pill--${s.status.split(' ')[0].toLowerCase()}`}>
                      {s.status}
                    </span>
                    <span className="ws-rec-x" aria-hidden="true" />
                  </button>
                  {isOpen && <p className="ws-rec-d">{s.detail}</p>}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
