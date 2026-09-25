import type { Metadata } from 'next';
import Link from 'next/link';
import { canonical, breadcrumbLd, serviceLd } from '@/lib/seo';
import { PageHero, Closer, Thread, SectionHead, HeroPanel, Ld, Tri, Bul } from '@/components/system';
import { CoachWorkspace } from '@/components/coach-workspace';
import { PracticeLoop } from '@/components/figures';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  ...canonical('/sales-coach'),
  title: 'Stella Sales Coach',
  description:
    'AI role-play for sales teams: practise real customer conversations, handle objections with confidence, and improve before the next live call.',
};

/**
 * Stella Sales Coach — the practice platform.
 *
 * Sits beside Meet Stella in the header rather than under Platform, because
 * it is not a property of the workforce: it is a second thing a buyer can
 * buy, aimed at a different person (the sales leader, not the operator).
 *
 * One deliberate omission. The brief carried a line that "some vendors report
 * significant improvements in ramp time and sales performance". It is
 * unattributed, unverifiable and about other people's products, so it is not
 * on the page. The measurement section says what will be measured and states
 * plainly that the baseline comes from the customer's own team — which is the
 * honest version of the same idea, and the one this site already uses for
 * workspace figures and market facts.
 */

/** The loop. Three steps, and the page is built around them. */
const LOOP = [
  [
    'message',
    'Practice',
    'The seller enters a realistic conversation with an AI buyer, a persona with its own priorities, temperament and objections.',
  ],
  [
    'chart',
    'Improve',
    'The platform analyses the conversation and identifies strengths, gaps and the opportunities that were missed.',
  ],
  [
    'activity',
    'Perform',
    'The seller applies the feedback in real customer conversations, and the next practice session starts from where they actually are.',
  ],
] as const;

/** Signals available from the first session. */
const SIGNALS = [
  'Practice frequency: how often each seller actually rehearses, not how many were enrolled.',
  'Scenario completion: which exercises get finished, and which get abandoned halfway.',
  'Competency scores: discovery, objection handling, value articulation, and the close, scored separately.',
  'Improvement over time: the same competency for the same seller, session over session.',
  'Manager coaching hours saved: the reviews a person no longer has to sit through.',
  'Ramp time: how long a new hire takes to become conversation-ready.',
  'Early pipeline conversion: what happens to the meetings that follow the practice.',
];

/**
 * The deltas a programme is judged on, once there is a baseline to judge
 * against. Each carries its clause for a reason beyond writing: bare one-line
 * items left the right panel 180px shorter than the left, and `.pan` draws a
 * border, so the divider audit found a line running down beside nothing.
 */
const DELTAS = [
  'Reduction in time to certification: first session to signed off as ready.',
  'Increase in practice sessions per seller: the input everything else depends on.',
  'Improvement in average competency score: the same scale, applied the same way.',
  'Reduction in manager coaching time: hours handed back to the front line.',
  'Change in meeting conversion or win rate: where practice shows up commercially.',
  'Reduction in new-hire ramp time: measured against the cohort before this one.',
];

/** Feature, the icon that marks it, and what the buyer gets from it. */
const FEATURES: [string, string, string][] = [
  [
    'message',
    'Realistic AI personas',
    'Sellers practise with different buyer types, personalities, behaviours and objections, rather than one agreeable voice that always says yes.',
  ],
  [
    'network',
    'Dynamic conversations',
    'Reps cannot simply memorise a script. Every conversation can develop differently, because the buyer responds to what was actually said.',
  ],
  [
    'settings',
    'Scenario builder',
    'Managers create exercises from their own sales process, products and customer situations, not from a generic library.',
  ],
  [
    'activity',
    'Instant feedback',
    'Sellers immediately understand what they did well and what they need to improve, while the conversation is still fresh.',
  ],
  [
    'chart',
    'Competency scoring',
    'Managers measure sales skills, behaviours and performance consistently across reps, using the same scale for everyone.',
  ],
  [
    'records',
    'Transcripts and recordings',
    'Teams review the specific moment a call turned, and identify the strengths, mistakes and coaching opportunities inside it.',
  ],
  [
    'graduation',
    'Personalised practice plans',
    'Each rep gets practice aimed at their individual weaknesses and development areas, rather than the same drill as the whole team.',
  ],
  [
    'users',
    'Team analytics',
    'Leaders track progress across individuals, teams, scenarios and specific competencies, and see where a group is stuck.',
  ],
  [
    'star',
    'Custom methodology',
    'Scenarios reflect your messaging, sales framework, methodology, product and positioning, so practice matches the way you actually sell.',
  ],
];

export default function SalesCoachPage() {
  return (
    <main id="main">
      <Ld
        data={[
          breadcrumbLd([['Home', '/'], ['Stella Sales Coach', '/sales-coach']]),
          serviceLd({
            name: 'Stella Sales Coach',
            description:
              'An AI role-play platform for sales onboarding, coaching and continuous seller improvement, with competency scoring and team analytics.',
            path: '/sales-coach',
          }),
        ]}
      />

      <PageHero
        eyebrow="Stella Sales Coach"
        crumb={[['Home', '/'], ['Stella Sales Coach']]}
        title={
          <>
            Practise the hard call.
            <br />
            Before it is a real one.
          </>
        }
        lede="AI role-play helps sales teams practise real customer conversations, handle objections with confidence, and improve before the next live call."
        actions={
          <>
            <button className="btn btn-1" type="button" data-demo>
              Book a demo <Tri />
            </button>
            <Link className="btn btn-2" href="/stella">
              Meet Stella
            </Link>
          </>
        }
        meta={['Buyers who push back', 'Your own sales process', 'Scored, not just completed']}
        aside={
          <HeroPanel
            kicker="The practice loop"
            tag="Three steps"
            rows={[
              ['Practice', 'With an AI buyer'],
              ['Improve', 'On what the call showed', true],
              ['Perform', 'In the live conversation'],
            ]}
            note="The same loop for a new hire in week one and a senior seller working an unfamiliar objection."
          />
        }
      />

      <Thread shape="split" />

      {/* ── what it is ── */}
      <section className="sec" id="what-it-is">
        <div className="wrap">
          <div className="statement">
            <span className="rail rail--sig" aria-hidden="true" />
            <h2>
              A realistic AI sales practice platform for onboarding, coaching and continuous seller
              improvement.
            </h2>
          </div>
        </div>
      </section>

      {/* ── the workspace, straight after the claim it proves ── */}
      <section className="sec sec--field" id="dashboard">
        <div className="wrap">
          <SectionHead
            eyebrow="Explore the dashboard"
            title={
              <>
                Practice is happening.
                <br />
                You can see what it moved.
              </>
            }
          >
            Sessions run, scenarios passed, competencies scored separately, and the sellers a
            manager should spend the next hour with. Open a scenario to see what the platform
            actually flagged, or the live session to read a role-play back.
          </SectionHead>
          <CoachWorkspace />
          <p className="note" style={{ marginTop: 'var(--s6)' }}>
            Every figure above is derived from the series beneath it, so no two views can disagree.
            In a deployment they are your team&rsquo;s own numbers, against your own baseline.
          </p>
        </div>
      </section>

      {/* ── the loop ── */}
      <section className="sec" style={{ paddingTop: 0 }} id="how-it-works">
        <div className="wrap">
          <SectionHead
            eyebrow="How it works"
            signal
            title={
              <>
                Practice. Improve.
                <br />
                Perform.
              </>
            }
          >
            A seller does not get better by reading the objection handling document again. They get
            better by having the conversation, seeing what it cost them, and having it again.
          </SectionHead>

          <PracticeLoop />

          <div className="steps-flow" style={{ marginTop: 'var(--s6)' }}>
            {LOOP.map(([icon, title, body], i) => (
              <article className="step-card pan" key={title}>
                <span className="step-mark" aria-hidden="true">
                  <Icon name={icon} size={18} />
                </span>
                <div>
                  <h3 className="h4">{title}</h3>
                  <p>{body}</p>
                </div>
                {i < LOOP.length - 1 ? <span className="step-link" aria-hidden="true" /> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <Thread shape="join" />

      {/* ── what it is for, and how you would know ── */}
      <section className="sec sec--field" id="results">
        <div className="wrap">
          <SectionHead
            eyebrow="What it is for"
            title={
              <>
                Confidence, consistency,
                <br />
                and a shorter ramp.
              </>
            }
          >
            Sellers build confidence, improve consistency, and become conversation-ready faster.
            Whether that actually happened is a measurement question rather than a claim, so the
            programme is built to produce the numbers that answer it.
          </SectionHead>

          <div className="grid-2">
            <div className="zone pan">
              <p className="eyebrow">Tracked from the first session</p>
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>
                A completion score is not a result.
              </h3>
              <ul className="bullets">
                {SIGNALS.map((line) => (
                  <li key={line}>
                    <Bul />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="zone pan">
              <p className="eyebrow eyebrow--sig">Reported against your baseline</p>
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>
                The numbers a programme is judged on.
              </h3>
              <ul className="bullets">
                {DELTAS.map((line) => (
                  <li key={line}>
                    <Bul />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="note" style={{ marginTop: 'var(--s6)' }}>
                These are measures, not results. HireStella publishes no benchmark figures for Sales
                Coach. The baseline is taken from your own team before the programme starts, and
                every number reported afterwards is your own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── the capabilities ── */}
      <section className="sec" style={{ paddingTop: 0 }} id="features">
        <div className="wrap">
          <SectionHead
            eyebrow="What is in it"
            title={
              <>
                Nine capabilities.
                <br />
                One practice loop.
              </>
            }
          >
            Every one of these exists to make one of the three steps real: a conversation worth
            having, feedback worth acting on, or a manager who can see what changed.
          </SectionHead>

          <div className="pan" style={{ padding: 'var(--s8)', borderRadius: 'var(--r-card)' }}>
            <dl className="valuelist">
              {FEATURES.map(([icon, name, value]) => (
                <div key={name}>
                  <dt>
                    <span className="vl-ico" aria-hidden="true">
                      <Icon name={icon} size={16} />
                    </span>
                    {name}
                  </dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>


      <Closer
        title={
          <>
            The next hard call.
            <br className="lb" /> Rehearsed.
          </>
        }
        lede="Bring the objection your sellers lose most often and we will build the scenario around it before anything is configured."
        secondary={{ href: '/stella', label: 'Meet Stella' }}
      />
    </main>
  );
}
