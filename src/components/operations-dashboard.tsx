'use client';
import { useId, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon, Logo } from './ui';
import { specialists } from '@/lib/data';

const week = [
  { day: 'Fri', enquiries: 24, bookings: 14 },
  { day: 'Sat', enquiries: 30, bookings: 18 },
  { day: 'Sun', enquiries: 28, bookings: 16 },
  { day: 'Mon', enquiries: 36, bookings: 23 },
  { day: 'Tue', enquiries: 32, bookings: 20 },
  { day: 'Wed', enquiries: 40, bookings: 25 },
  { day: 'Thu', enquiries: 34, bookings: 21 },
];
const records = [
  {
    id: 'D-024',
    time: '10:30',
    channel: 'Voice',
    title: 'Dental consultation',
    status: 'Confirmed',
    detail:
      'Preferred slot checked in the demo calendar. Appointment confirmed; reminder scheduled.',
    icon: 'phone',
  },
  {
    id: 'D-025',
    time: '11:00',
    channel: 'Website',
    title: 'New patient enquiry',
    status: 'Staff review',
    detail:
      'A treatment question needs a clinician. The booking remains pending and the conversation is attached.',
    icon: 'browser',
  },
  {
    id: 'D-026',
    time: '11:30',
    channel: 'Chat',
    title: 'Appointment change',
    status: 'Confirmed',
    detail:
      'The sample appointment moved to the requested available slot. The reminder was updated.',
    icon: 'message',
  },
  {
    id: 'D-027',
    time: '12:00',
    channel: 'Social',
    title: 'Consultation follow-up',
    status: 'Awaiting reply',
    detail:
      'Approved follow-up sent in this example. The next contact pauses when the patient replies.',
    icon: 'network',
  },
  {
    id: 'D-028',
    time: '12:30',
    channel: 'Voice',
    title: 'Clinic callback',
    status: 'Staff review',
    detail:
      'A request outside the configured workflow is queued for reception with the call summary.',
    icon: 'phone',
  },
];
const views = [
  'Overview',
  'Appointments',
  'Live Activity',
  'Specialists',
  'Human Handoffs',
  'Performance',
];

export function OperationsDashboard({
  full = false,
  dental = false,
}: {
  full?: boolean;
  dental?: boolean;
}) {
  const [view, setView] = useState('Overview');
  const [period, setPeriod] = useState('Today');
  const [selected, setSelected] = useState<string | null>(null);
  const chartId = useId();
  const series =
    period === 'Today'
      ? [
          { day: '08:00', enquiries: 4, bookings: 2 },
          { day: '10:00', enquiries: 8, bookings: 5 },
          { day: '12:00', enquiries: 7, bookings: 4 },
          { day: '14:00', enquiries: 6, bookings: 4 },
          { day: '16:00', enquiries: 9, bookings: 6 },
        ]
      : week;
  const enquiries = series.reduce((sum, item) => sum + item.enquiries, 0);
  const bookings = series.reduce((sum, item) => sum + item.bookings, 0);
  const visibleRecords =
    view === 'Human Handoffs'
      ? records.filter((item) => item.status === 'Staff review')
      : view === 'Appointments'
        ? records.filter((item) => item.status === 'Confirmed')
        : records;
  const changeView = (value: string) => {
    setView(value);
    setSelected(null);
  };
  return (
    <div className={`operations-dashboard ${full ? 'operations-full' : ''}`}>
      <aside className="ops-sidebar">
        <Logo />
        <div className="ops-workspace">
          <span>DC</span>
          <div>
            Demo clinic<small>ILLUSTRATIVE WORKSPACE</small>
          </div>
        </div>
        <nav aria-label="Dashboard views">
          {views.map((name, i) => (
            <button key={name} aria-pressed={view === name} onClick={() => changeView(name)}>
              <Icon
                name={['dashboard', 'calendar', 'activity', 'users', 'shield', 'chart'][i]}
                size={18}
              />
              {name}
              {name === 'Human Handoffs' && <b>2</b>}
            </button>
          ))}
        </nav>
        <div className="ops-team">
          <Icon name="users" size={18} />
          <p>
            Your people.
            <br />
            <strong>Always in control.</strong>
          </p>
        </div>
      </aside>
      <div className="ops-main">
        <div className="ops-topbar">
          <span>
            <Icon name="dashboard" size={16} /> Workspace / {view}
          </span>
          <span className="demo-label">DEMO DATA</span>
        </div>
        <label className="ops-mobile-select">
          Workspace view
          <select value={view} onChange={(event) => changeView(event.target.value)}>
            {views.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <div className="ops-heading">
          <div>
            <span className="micro">THURSDAY, 10 SEPTEMBER · SAMPLE DAY</span>
            <h3>{view === 'Overview' ? 'A clearer day at the front desk.' : view}</h3>
          </div>
          <div className="ops-period" role="group" aria-label="Dashboard period">
            {['Today', '7 days'].map((value) => (
              <button key={value} aria-pressed={period === value} onClick={() => setPeriod(value)}>
                {value}
              </button>
            ))}
          </div>
        </div>
        {view === 'Overview' && (
          <div className="ops-banner">
            <Image
              src={dental ? '/visuals/dental-studio.webp' : '/visuals/connected-workforce.webp'}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 900px"
            />
            <div>
              <span className="micro">YOUR WORKFORCE, CONNECTED</span>
              <strong>
                Every conversation.
                <br />A visible next step.
              </strong>
              <span>Calls · appointments · follow-ups</span>
            </div>
            <span className="ops-banner-badge">
              <Icon name="network" size={16} /> 8 specialist roles
            </span>
          </div>
        )}
        {(view === 'Overview' || view === 'Performance') && (
          <>
            <div className="ops-stats">
              {[
                ['Enquiries', enquiries, 'Across configured channels', 'message'],
                ['Bookings', bookings, 'Confirmed in sample data', 'calendar'],
                ['Follow-ups', period === 'Today' ? 9 : 58, 'Scheduled in sample data', 'send'],
                [
                  'Open handoffs',
                  2,
                  period === 'Today' ? '2 resolved · 4 total today' : '16 resolved · 18 total',
                  'users',
                ],
              ].map(([name, value, note, icon]) => (
                <div key={name}>
                  <span>
                    <Icon name={String(icon)} size={17} />
                    {name}
                  </span>
                  <strong>{value}</strong>
                  <small>{note}</small>
                </div>
              ))}
            </div>
            <div className="ops-charts">
              <figure className="ops-activity-chart">
                <figcaption>
                  <strong>Enquiries & bookings</strong>
                  <span>
                    {period === 'Today' ? 'Sample day by time' : '4–10 September · sample week'}
                  </span>
                </figcaption>
                <div className="ops-chart-legend">
                  <span>Enquiries</span>
                  <span>Bookings</span>
                </div>
                <svg viewBox="0 0 560 174" role="img" aria-labelledby={chartId}>
                  <title id={chartId}>
                    {series
                      .map(
                        (item) =>
                          `${item.day}: ${item.enquiries} enquiries, ${item.bookings} bookings`,
                      )
                      .join('; ')}
                  </title>
                  {[20, 65, 110].map((y) => (
                    <line
                      key={y}
                      x1="20"
                      x2="540"
                      y1={y}
                      y2={y}
                      stroke="currentColor"
                      opacity=".1"
                    />
                  ))}
                  {series.map((item, i) => {
                    const x = 40 + i * (470 / (series.length - 1));
                    const max = period === 'Today' ? 10 : 45;
                    return (
                      <g key={item.day}>
                        <rect
                          x={x - 15}
                          y={130 - (item.enquiries / max) * 108}
                          width="16"
                          height={(item.enquiries / max) * 108}
                          rx="4"
                          fill="#7f8fc2"
                        />
                        <rect
                          x={x + 5}
                          y={130 - (item.bookings / max) * 108}
                          width="16"
                          height={(item.bookings / max) * 108}
                          rx="4"
                          fill="#ff6200"
                        />
                        <text
                          x={x + 3}
                          y="156"
                          textAnchor="middle"
                          fill="currentColor"
                          fontSize="11"
                        >
                          {item.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </figure>
              <div className="ops-conversion">
                <div
                  className="ops-ring"
                  style={{
                    background: `conic-gradient(#ff6200 ${(bookings / enquiries) * 360}deg, var(--border) 0)`,
                  }}
                >
                  <div>
                    <strong>{Math.round((bookings / enquiries) * 100)}%</strong>
                    <span>to booking</span>
                  </div>
                </div>
                <h3 className="h4">Enquiry → appointment</h3>
                <p>
                  {bookings} of {enquiries} sample enquiries.
                  <br />
                  Illustrative, not a performance claim.
                </p>
              </div>
            </div>
          </>
        )}
        {view === 'Specialists' ? (
          <div className="ops-specialists">
            {specialists.map((item) => (
              <Link key={item.id} href={`/workforce/${item.id}`}>
                <Icon name={item.icon} size={25} />
                <h3 className="h4">{item.short}</h3>
                <p>{item.description}</p>
                <span>Explore role ↗</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="ops-records">
            <div className="ops-records-heading">
              <h3 className="h4">
                {view === 'Human Handoffs'
                  ? 'Waiting for your team'
                  : view === 'Appointments'
                    ? 'Confirmed appointments'
                    : 'A few journeys in motion'}
              </h3>
              <span>Sample records · today</span>
            </div>
            {visibleRecords.map((item) => (
              <div className="ops-record" key={item.id}>
                <button
                  onClick={() => setSelected(selected === item.id ? null : item.id)}
                  aria-expanded={selected === item.id}
                >
                  <span className="ops-record-icon">
                    <Icon name={item.icon} size={18} />
                  </span>
                  <span className="ops-record-title">
                    <strong>{item.title}</strong>
                    <small>
                      {item.id} · {item.channel}
                    </small>
                  </span>
                  <time>{item.time}</time>
                  <span
                    className={`ops-status ${item.status === 'Confirmed' ? 'is-confirmed' : ''}`}
                  >
                    {item.status}
                  </span>
                  <span aria-hidden="true">{selected === item.id ? '−' : '+'}</span>
                </button>
                {selected === item.id && <p className="ops-record-detail">{item.detail}</p>}
              </div>
            ))}
          </div>
        )}
        <div className="ops-footnote">
          <Icon name="shield" size={15} /> Example data only. Production systems and channels are
          configured for each deployment.
        </div>
      </div>
    </div>
  );
}
