import { canonical } from '@/lib/seo';
import Link from 'next/link';
import { StellaHero } from '@/components/stella-hero';
import { WorkforceMap, DashboardPlanes } from '@/components/home-parts';
import { ScrollMotion, StepsFlow } from '@/components/home-motion';
import { Constellation } from '@/components/constellation';
import { Thread, SectionHead, Closer, Faq, Ld, Bul } from '@/components/system';
import { HOME_FAQS } from '@/lib/faqs';
import { faqLd, serviceLd } from '@/lib/seo';
import { industryGroups } from '@/lib/industry-content';
import { businessTypes } from '@/lib/business-types';
import { Icon } from '@/components/ui';

export const metadata = { ...canonical('/') };

const PROBLEMS = [
  ['The call you could not take.', 'A customer needs an answer while your team is already with someone else.', true],
  ['The enquiry still waiting.', 'Another channel, another conversation, and no shared context between them.', false],
  ['The follow-up that slipped.', 'A good opportunity disappears quietly between the next steps.', false],
] as const;

const STEPS = [
  ['01', 'Analysis', 'Understand the pressure.', 'Identify bottlenecks and the places where your team needs capacity.'],
  ['02', 'Configuration', 'Assemble the workforce.', 'Configure specialists around your workflows, channels and systems.'],
  ['03', 'Management', 'Keep the work connected.', 'Coordinate actions, surface handoffs, and see where to expand next.'],
] as const;

/* §2.2 — the Human Boundary is a first-class product concept, so it names
   what each side actually holds rather than implying one replaces the other. */
const PEOPLE = [
  'Strategy and future planning',
  'Relationships and client trust',
  'Judgement and moral decisions',
  'Sensitive situations and empathy',
  'Complex, unstructured decisions',
];
const SPECIALISTS = [
  'Repetitive and administrative work',
  'High-volume tasks and data processing',
  'Always-on 24/7 coverage',
  'Routine workflows and automation',
  'Structured follow-up and coordination',
];

export default function HomePage() {
  return (
    <main id="main" className="home">
      <ScrollMotion />
      <div className="ambient" aria-hidden="true">
        <i className="orb o1" />
        <i className="orb o2" />
        <i className="orb o3" />
        <Constellation />
      </div>
      <Ld
        data={[
          faqLd([...HOME_FAQS]),
          serviceLd({
            name: 'AI workforce orchestration',
            description:
              'One AI General Manager and eight connected AI Specialists that coordinate enquiries, bookings and follow-ups across your channels.',
            path: '/',
          }),
        ]}
      />
      <StellaHero />

      <section className="sec" id="capacity-gap">
        <div className="wrap">
          <SectionHead
            eyebrow="The capacity gap"
            signal
            title="Your ambition is not the problem. Your team’s bandwidth is."
            headMax="30ch"
          >
            Calls come in. Messages pile up. Follow-ups slip. The work is not stopping. It is
            waiting for someone who already has too much to do.
          </SectionHead>

          <div className="raillist">
            {PROBLEMS.map(([title, body, signal]) => (
              <div key={title}>
                <span className={`rail ${signal ? 'rail--sig' : ''}`} aria-hidden="true" />
                <h3 className="h4">{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead
            eyebrow="Meet your general manager"
            action={
              <>
                <button className="btn btn-1" type="button" data-demo data-cta="home-steps">
                  Book a demo <span className="tri" aria-hidden="true" />
                </button>
                <Link className="btn-3" href="/stella">
                  Meet Stella <span className="tri" aria-hidden="true" />
                </Link>
              </>
            }
            title={
              <>
                Understand it first.
                <br />
                Then run it every day.
              </>
            }
          >
            Stella understands how work moves through your business, brings the right specialists
            together, and keeps the handoffs connected.
          </SectionHead>

          <StepsFlow steps={STEPS} />
        </div>
      </section>

      <Thread shape="join" />

      <section className="sec" id="workforce">
        <div className="wrap">
          <SectionHead
            eyebrow="The workforce Stella coordinates"
            title={
              <>
                Eight specialists.
                <br />
                One shared direction.
              </>
            }
          >
            You do not hire them one by one. Stella decides which ones a piece of work needs, in
            what order, and when it belongs to a person instead. Select any role to follow its
            route.
          </SectionHead>

          <WorkforceMap />

          <div className="cta-row">
            <p className="note">
              The full specialist workforce comes with every deployment. Capacity scales with you.
            </p>
            <button className="btn btn-1" type="button" data-demo data-cta="home-workforce">
              See your workforce in a demo <span className="tri" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section className="sec" id="human-boundary">
        <div className="wrap">
          <SectionHead
            eyebrow="Human + AI · your people, plus Stella"
            title={
              <>
                Human and AI,
                <br />
                each doing what they are for.
              </>
            }
          >
            Some work follows a rule. Some work needs a person who knows your business. You decide
            where the line between them sits.
          </SectionHead>

          <div className="hb">
            <div className="zone pan">
              <p className="eyebrow">Your people</p>
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>The work only a person can hold.</h3>
              <ul className="bullets">
                {PEOPLE.map((line) => (
                  <li key={line}>
                    <Bul />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bound">
              <span>Handoff</span>
            </div>

            <div className="zone pan">
              <p className="eyebrow eyebrow--sig">Your AI Specialists</p>
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>The work that follows a rule.</h3>
              <ul className="bullets">
                {SPECIALISTS.map((line) => (
                  <li key={line}>
                    <Bul />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="goal">
            <span className="rail rail--sig" aria-hidden="true" />
            <h3>
              The goal is not fewer people.
              <br />
              <em>It is more output and capacity per person.</em>
            </h3>
            <button className="btn btn-1 goal-act" type="button" data-demo data-cta="home-boundary">
              Book a demo <span className="tri" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section className="sec" id="dashboard">
        <div className="wrap">
          <SectionHead
            eyebrow="The view from here"
            action={
              <button className="btn-3" type="button" data-demo data-cta="home-dashboard">
                See it with your own numbers <span className="tri" aria-hidden="true" />
              </button>
            }
            title={
              <>
                Everything moving.
                <br />
                Everything in view.
              </>
            }
          >
            See what your workforce handled, where work is going, and when your people need to step
            in.
          </SectionHead>

          <DashboardPlanes />
        </div>
      </section>

      <Thread shape="split" />

      <section className="sec" id="industries">
        <div className="wrap">
          <SectionHead
            eyebrow="Built around your reality"
            action={
              <>
                <button className="btn btn-1" type="button" data-demo data-cta="home-industries">
                  Book a demo for your industry <span className="tri" aria-hidden="true" />
                </button>
                <Link className="btn-3" href="/industries">
                  All industries <span className="tri" aria-hidden="true" />
                </Link>
              </>
            }
            title={
              <>
                Different businesses.
                <br />
                The right connections.
              </>
            }
          >
            Start with the way work actually moves in your industry. Build the workforce around it.
          </SectionHead>

          <div className="ind">
            {industryGroups.map((group) => (
              <Link className="ind-c pan" href={`/industries/${group.id}`} key={group.id}>
                <span className="gl">
                  <Icon name={group.icon} size={19} />
                </span>
                <b>{group.name}</b>
                <p>{group.intro}</p>
                {/* business types, not segment pages: three sectors have no
                    workflow pages yet and an empty chip row left the card
                    stretched around nothing. */}
                <span className="seg">
                  {(businessTypes[group.id] ?? []).slice(0, 3).map((t) => (
                    <em key={t.name}>{t.name.replace(/ (clinics|companies|agencies|retailers|brands)$/i, '')}</em>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Faq title="Questions people ask first." items={[...HOME_FAQS]} />

      <Closer
        title={
          <>
            You already know the problem.
            <br className="lb" /> Tell Stella.
          </>
        }
        eyebrow="Start with one problem"
        lede="Describe what is slowing you down. Stella shows which specialists would take it on, and where your team stays in charge."
      />
    </main>
  );
}
