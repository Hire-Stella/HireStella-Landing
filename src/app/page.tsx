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
import { Icon } from '@/components/ui';

const TITLE = 'Meet Stella, Your AI General Manager | HireStella';
const DESCRIPTION =
  'Meet Stella, the AI General Manager coordinating eight AI specialists to answer enquiries, support bookings, follow up with leads and keep your team informed. Book a demo.';
const SHARE =
  'From first enquiry to booked opportunity: explore how Stella coordinates a connected AI workforce around your business and keeps people in control.';

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: { title: 'Meet Stella. Your AI General Manager. | HireStella', description: SHARE },
  twitter: { card: 'summary_large_image', description: SHARE },
  ...canonical('/'),
};

/* Content 2.0 (2026-10-17): the about block's at-a-glance facts. */
const GLANCE = [
  ['Based in Dubai.', 'HireStella is a Dubai-based AI company, building Stella for growing businesses.', true],
  ['Where Stella works.', 'Connected calls, website experiences, approved messaging channels and supported business systems.', false],
  ['Done with you.', 'Workflow scoping, configuration, testing and launch, with your team approving each step.', false],
] as const;

const STEPS = [
  ['01', 'Discovery', 'Find the first workflow worth fixing.', 'Tell us where leads, bookings or follow-ups become hard to manage. We pick a measurable first use case.'],
  ['02', 'Configuration', 'Design and test it together.', 'Choose the specialists, channels and approvals, then run real examples with your team before anything goes live.'],
  ['03', 'Go live and expand', 'Improve what works.', 'Activate the approved workflow, review the results, and add channels or workflows where they earn their place.'],
] as const;

/* §2.2 — the Human Boundary is a first-class product concept, so it names
   what each side actually holds rather than implying one replaces the other. */
const PEOPLE = [
  'Difficult conversations and empathy',
  'Commercial and strategic judgement',
  'Special requests, exceptions and disputes',
  'Sensitive changes and authorisations',
  'Relationships and personal customer care',
  'The decisions that shape your business',
];
const SPECIALISTS = [
  'Answering approved routine questions',
  'Managing supported after-hours enquiries',
  'Booking and rescheduling within agreed rules',
  'Preparing approved record updates',
  'Sending permitted reminders',
  'Summarising interactions and tasks',
];

/* The homepage card line and three examples per industry. The industry
   pages keep their own longer intro. */
const INDUSTRY_CARDS: Record<string, [string, string[]]> = {
  healthcare: ['Give every patient enquiry a clear next step.', ['Dental', 'Aesthetic', 'Dermatology']],
  automotive: ['From the first vehicle enquiry to the appointment.', ['New cars', 'Used cars', 'Luxury & premium']],
  'real-estate': ['Reply to the property enquiry while interest is high.', ['Residential', 'Luxury', 'Developers']],
  hospitality: ['Answer the booking question before the guest moves on.', ['Hotels', 'Resorts', 'Serviced apartments']],
  education: ['Make it easier to ask, enquire and visit.', ['Private schools', 'Universities', 'Colleges']],
  'financial-services': ['Route routine requests. Protect expert time.', ['Insurance', 'Mortgage brokers', 'Banks & lenders']],
  'home-services': ['Connect a service enquiry to the right booking.', ['Maintenance', 'Cleaning', 'Renovation']],
  travel: ['Keep enquiries moving across time zones.', ['Travel', 'Tours', 'Visa services']],
  'professional-services': ['Let useful enquiries reach the right expert.', ['Recruitment', 'Legal', 'Accounting']],
  retail: ['Answer the question that stands between browsing and buying.', ['Fashion', 'Beauty', 'Electronics']],
};

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

      <section className="sec" id="about">
        <div className="wrap">
          <SectionHead
            eyebrow="About HireStella"
            signal
            title="More than another tool. A revenue team that works together."
            headMax="30ch"
          >
            Instead of juggling disconnected automations, Stella coordinates specialists around
            the customer journey, from the first enquiry through booking, follow-up and the next
            action your team needs to take. You do not brief eight separate tools or chase every
            handoff yourself.
          </SectionHead>

          <div className="raillist">
            {GLANCE.map(([title, body, signal]) => (
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
            eyebrow="Your rollout"
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
                We configure it with you.
                <br />
                Then improve what works.
              </>
            }
          >
            You do not need to design an AI workforce on your own. We start with one real customer
            journey, test the boundaries together, and expand by business value.
          </SectionHead>

          <StepsFlow steps={STEPS} />
        </div>
      </section>

      <Thread shape="join" />

      <section className="sec" id="workforce">
        <div className="wrap">
          <SectionHead
            eyebrow="Meet the connected workforce"
            title={
              <>
                One AI General Manager.
                <br />
                Eight connected specialists.
              </>
            }
          >
            Stella keeps the context together. As work arrives, the right specialist takes the next
            step, passes on what the next one needs to know, and reports where a person has to
            approve. Select any role to follow its route.
          </SectionHead>

          <WorkforceMap />

          <div className="cta-row">
            <p className="note">
              The eight roles are designed to work together. Which ones start first depends on your
              business.
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
            eyebrow="Clear human oversight"
            title={
              <>
                Stella takes the repeats.
                <br />
                Your people keep the rest.
              </>
            }
          >
            You set the boundary during scoping: what Stella may answer, which actions she may
            take, and what goes to a named person. Outside those rules, the work pauses and hands
            over with the full context instead of guessing.
          </SectionHead>

          <div className="hb">
            <div className="zone pan">
              <p className="eyebrow">Your people</p>
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>What your people stay responsible for.</h3>
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
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>What the workforce can help with.</h3>
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
              <em>It is more opportunity from the team you already have.</em>
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
            eyebrow="Every morning"
            action={
              <button className="btn-3" type="button" data-demo data-cta="home-dashboard">
                See a dashboard walkthrough <span className="tri" aria-hidden="true" />
              </button>
            }
            title={
              <>
                Start the day knowing
                <br />
                what moved you forward.
              </>
            }
          >
            Enquiries, bookings and follow-ups in one view: what happened, what is in the pipeline,
            and what still needs your judgement. Revenue figures appear where your connected
            systems can confirm them.
          </SectionHead>

          <DashboardPlanes />
        </div>
      </section>

      <Thread shape="split" />

      <section className="sec" id="industries">
        <div className="wrap">
          <SectionHead
            eyebrow="Built around the way you sell"
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
                One connected workforce.
                <br />
                Built for different journeys.
              </>
            }
          >
            There is no single script for every business. Stella is configured around the questions
            your customers ask, the actions your team takes, and the moments that need a person.
          </SectionHead>

          <div className="ind">
            {industryGroups.map((group) => (
              <Link className="ind-c pan" href={`/industries/${group.id}`} key={group.id}>
                <span className="gl">
                  <Icon name={group.icon} size={19} />
                </span>
                <b>{group.name}</b>
                <p>{INDUSTRY_CARDS[group.id]?.[0] ?? group.intro}</p>
                <span className="seg">
                  {(INDUSTRY_CARDS[group.id]?.[1] ?? []).map((t) => (
                    <em key={t}>{t}</em>
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
            Let&rsquo;s find your next
            <br className="lb" /> revenue opportunity.
          </>
        }
        eyebrow="Start with your strongest opportunity"
        lede="Tell us which enquiries, bookings or follow-ups you want to improve. We will map the customer journey, show where Stella’s specialists can help, and explain exactly where your people stay in charge."
        secondary={{ href: '#talk-to-stella', label: 'Talk to Stella now' }}
      />
    </main>
  );
}
