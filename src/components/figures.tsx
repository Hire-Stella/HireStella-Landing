/**
 * Article figures.
 *
 * §30.5 of the brand book keeps photography to a minimum and names the
 * interface as the primary visual asset, so each article block gets a drawn
 * figure built from the brand devices rather than a stock photograph. Every
 * figure carries a caption and a text equivalent, per §12.4.
 */

const STROKE = 'var(--mist)';

function Frame({
  caption,
  children,
  label,
}: {
  caption: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="fig pan">
      <div className="fig-top">
        <span className="micro">{label}</span>
      </div>
      {/* Focusable because at phone width the drawing scrolls sideways, and a
          keyboard user can only scroll a region that can take focus. */}
      <div className="fig-art" tabIndex={0} role="region" aria-label={`${label} diagram`}>
        {children}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** Scattered channels arriving at one owner. */
export function FigChannels() {
  const channels = ['Phone', 'Website', 'WhatsApp', 'Social'];
  return (
    <Frame label="Before · four channels, no owner" caption="Four arrivals, four separate conversations, and no shared record of who is waiting.">
      <svg viewBox="0 0 520 180" role="img" aria-label="Four channels arriving separately with no shared owner">
        {channels.map((c, i) => {
          const y = 26 + i * 42;
          return (
            <g key={c}>
              <rect x="8" y={y - 15} width="128" height="30" rx="8" fill="none" stroke={STROKE} strokeOpacity=".3" />
              <text x="24" y={y + 4} fill="var(--t2)" fontSize="12" fontFamily="Montserrat">{c}</text>
              <path d={`M 140 ${y} C 210 ${y}, 220 90, 290 90`} fill="none" stroke={STROKE} strokeOpacity=".26" strokeWidth="1.5" strokeDasharray="4 5" />
            </g>
          );
        })}
        <rect x="292" y="66" width="150" height="48" rx="12" fill="none" stroke="var(--orange)" strokeOpacity=".5" />
        <text x="312" y="88" fill="var(--t3)" fontSize="11" fontFamily="Montserrat" letterSpacing="1.4">WAITING</text>
        <text x="312" y="104" fill="var(--t1)" fontSize="13" fontWeight="600" fontFamily="Montserrat">No clear owner</text>
      </svg>
    </Frame>
  );
}

/** One request moving through the workforce to a confirmed next step. */
export function FigRoute() {
  const steps = ['Enquiry', 'Front Desk', 'Stella', 'Booking', 'Confirmed'];
  return (
    <Frame label="After · one route, one owner" caption="The same request, carried through the workforce with its context intact and a named next step at the end.">
      <svg viewBox="0 0 520 130" role="img" aria-label="Enquiry routed through Front Desk and Stella to a confirmed booking">
        <path d="M 40 78 C 150 78, 130 34, 260 34 C 390 34, 370 78, 480 78" fill="none" stroke={STROKE} strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" />
        {steps.map((s, i) => {
          const x = 40 + i * 110;
          const y = i === 0 || i === 4 ? 78 : i === 2 ? 34 : i === 1 ? 50 : 50;
          const last = i === steps.length - 1;
          return (
            <g key={s}>
              <circle cx={x} cy={y} r={last ? 8 : 6} fill={last || i === 2 ? 'var(--orange)' : 'var(--bg)'} stroke={last || i === 2 ? 'var(--orange)' : STROKE} strokeOpacity={last || i === 2 ? 1 : 0.5} strokeWidth="1.5" />
              <text x={x} y={y + 26} textAnchor="middle" fill={last || i === 2 ? 'var(--t1)' : 'var(--t3)'} fontSize="12" fontWeight="600" fontFamily="Montserrat">{s}</text>
            </g>
          );
        })}
      </svg>
    </Frame>
  );
}

/** The handoff: orange becomes Mist at the boundary. */
export function FigBoundary() {
  return (
    <Frame label="The handoff" caption="At the boundary the route changes colour from orange to Mist. That marks a transfer to a person, not a failure.">
      <svg viewBox="0 0 520 140" role="img" aria-label="A route changing from orange to Mist where work transfers to a person">
        <defs>
          <linearGradient id="handoff" x1="0" x2="1">
            <stop offset="0%" stopColor="#FF6200" />
            <stop offset="48%" stopColor="#FF6200" />
            <stop offset="58%" stopColor="#C7C9E8" />
            <stop offset="100%" stopColor="#C7C9E8" />
          </linearGradient>
        </defs>
        <path d="M 30 70 H 490" stroke="url(#handoff)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <line x1="264" y1="34" x2="264" y2="106" stroke={STROKE} strokeOpacity=".45" strokeDasharray="3 5" />
        <text x="264" y="26" textAnchor="middle" fill="var(--t3)" fontSize="11" fontWeight="600" letterSpacing="1.6" fontFamily="Montserrat">HANDOFF</text>
        <circle cx="30" cy="70" r="6" fill="#FF6200" />
        <circle cx="490" cy="70" r="6" fill="#C7C9E8" />
        <text x="30" y="98" fill="var(--t2)" fontSize="12" fontWeight="600" fontFamily="Montserrat">Structured work</text>
        <text x="490" y="98" textAnchor="end" fill="var(--t2)" fontSize="12" fontWeight="600" fontFamily="Montserrat">Human judgement</text>
      </svg>
    </Frame>
  );
}

/** A day of activity, with the busiest hour marked. */
export function FigVolume() {
  /* Ten bars at two-hour steps from 08:00 ran off the end of the clock and
     labelled the last two 24:00 and 26:00. Eight bars cover 08:00 to 22:00,
     which is the working day the caption is actually talking about. */
  const bars = [22, 41, 33, 58, 72, 96, 64, 48];
  const peak = Math.max(...bars);
  return (
    <Frame label="Enquiries by hour" caption="Demand does not arrive evenly across the working day. The shape is the point.">
      <svg viewBox="0 0 520 150" role="img" aria-label="Enquiry volume by hour across a working day, peaking in the late afternoon">
        <line x1="24" y1="118" x2="496" y2="118" stroke={STROKE} strokeOpacity=".22" />
        {bars.map((v, i) => {
          /* Geometry follows the array so the run always fills the axis and the
             last label always lands on a real hour, whatever the bar count. */
          const step = (496 - 24) / bars.length;
          const barW = 26;
          const x = 24 + i * step + (step - barW) / 2;
          const h = (v / 110) * 96;
          const on = v === peak;
          return (
            <g key={i}>
              <rect x={x} y={118 - h} width={barW} height={h} rx="4" fill={on ? '#FF6200' : STROKE} opacity={on ? 1 : 0.34} />
              <text x={x + barW / 2} y="134" textAnchor="middle" fill="var(--t3)" fontSize="11" fontFamily="Montserrat">{8 + i * 2}:00</text>
            </g>
          );
        })}
      </svg>
    </Frame>
  );
}

/** What a baseline set of measures looks like. */
export function FigBaseline() {
  const rows: [string, string][] = [
    ['Response time', 'Before vs after'],
    ['Requests reaching a next step', 'Counted, not estimated'],
    ['Unresolved exceptions', 'Owned by a person'],
    ['Staff time per request', 'Compared like for like'],
  ];
  return (
    <Frame label="A baseline worth agreeing" caption="Four measures, captured before launch and compared across similar periods. Without a baseline there is nothing to improve against.">
      <svg viewBox="0 0 520 150" role="img" aria-label="Four baseline measures agreed before launch">
        {rows.map(([k, v], i) => {
          const y = 24 + i * 34;
          return (
            <g key={k}>
              <rect x="10" y={y - 13} width="500" height="27" rx="7" fill="none" stroke={STROKE} strokeOpacity={i === 0 ? '.45' : '.22'} />
              <circle cx="28" cy={y} r="3.5" fill={i === 0 ? '#FF6200' : STROKE} opacity={i === 0 ? 1 : 0.5} />
              <text x="44" y={y + 4} fill="var(--t1)" fontSize="13" fontWeight="600" fontFamily="Montserrat">{k}</text>
              <text x="498" y={y + 4} textAnchor="end" fill="var(--t3)" fontSize="12" fontFamily="Montserrat">{v}</text>
            </g>
          );
        })}
      </svg>
    </Frame>
  );
}

const FIGURES = [FigChannels, FigRoute, FigBoundary, FigVolume, FigBaseline];

/** Picks a figure for an article section by position, so each block has one. */
export function SectionFigure({ index }: { index: number }) {
  const Fig = FIGURES[index % FIGURES.length];
  return <Fig />;
}


/**
 * The practice loop.
 *
 * Not on the article rotation above — `/sales-coach` asks for it by name — and
 * deliberately not one SVG. `.fig-art svg` is `width: 100%`, so on a
 * full-width page a 620-unit viewBox renders at 2.2x and every `<text>` in it
 * comes out at 30px; shrink the viewBox to fit a phone and the same labels
 * come out at 6px. That is the rule the workspace chart already records: bars
 * scale, type must not. So the geometry is SVG and every word is HTML.
 *
 * The return arc is the point of the drawing. Three steps in a row is a
 * course; what makes this a loop is that the third feeds the first, and the
 * seller comes back from wherever the live call actually left them.
 */
export function PracticeLoop() {
  const steps = ['Practice', 'Improve', 'Perform'];
  return (
    <figure className="fig pan loop">
      <div className="fig-top">
        <span className="micro">The loop</span>
        <span className="micro">It repeats</span>
      </div>

      <div className="loop-row">
        {steps.map((label, i) => (
          <div className="loop-cell" key={label}>
            {i > 0 && <span className="loop-link" aria-hidden="true" />}
            <div className={`loop-node ${i === steps.length - 1 ? 'is-end' : ''}`}>
              <span className="loop-no" aria-hidden="true">
                {'0' + (i + 1)}
              </span>
              <b>{label}</b>
            </div>
          </div>
        ))}
      </div>

      <div className="loop-back" aria-hidden="true">
        <svg viewBox="0 0 1200 64" preserveAspectRatio="none">
          <path d="M 1000 0 C 1000 62, 200 62, 200 0" />
        </svg>
        <span className="loop-arrow" />
      </div>

      <p className="loop-again">and again, from where the live call actually left them</p>

      <figcaption>
        Three steps, and a fourth move that matters more than any of them: the next session starts
        from the gap the last live call exposed.
      </figcaption>
    </figure>
  );
}
