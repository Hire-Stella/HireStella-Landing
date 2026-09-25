import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { canonical, breadcrumbLd } from '@/lib/seo';
import { PageHero, Closer, Thread, SectionHead, Faq, Related, Ld, Tri, Bul } from '@/components/system';
import { founder } from '@/lib/founder';
import { FAQS } from '@/lib/faqs';

export const metadata: Metadata = {
  ...canonical('/about'),
  title: 'About HireStella, Our Story',
  description:
    'Businesses do not always need more people. They need more capacity from the people they already have. The idea HireStella was built around, and what it means in practice.',
};

/** The four things that slip, in the order a week actually loses them. */
const SLIPS = [
  ['Calls go unanswered.', 'Somebody needed an answer while your team was already with someone else.'],
  ['Enquiries wait.', 'They arrive on a channel nobody is watching at the hour they arrive.'],
  ['Follow-ups slip.', 'The second contact, the one that converts, has no owner.'],
  ['Admin piles up.', 'And the people responsible for growth spend their day inside it.'],
] as const;

const PEOPLE = [
  'Relationships and client trust',
  'Judgement and complex decisions',
  'Situations that need empathy',
  'Strategy and where to go next',
];
const WORKFORCE = [
  'Repetitive and administrative work',
  'High-volume, structured tasks',
  'Always-on coverage, every hour',
  'Follow-up and coordination',
];

export default function AboutPage() {
  return (
    <main id="main">
      <Ld data={breadcrumbLd([['Home', '/'], ['Our story', '/about']])} />

      <PageHero
        eyebrow="Capacity, coordinated."
        crumb={[['Home', '/'], ['Our story']]}
        title={
          <>
            Good people deserve
            <br />
            more room to do good work.
          </>
        }
        lede="Work is arriving faster than teams can absorb it. HireStella was built around one idea about what to do when that happens."
        actions={
          <>
            <button className="btn btn-1" type="button" data-demo>
              Book a demo <Tri />
            </button>
            <Link className="btn btn-2" href="/team">
              Our approach
            </Link>
          </>
        }
        meta={['Dubai, UAE', 'One manager, eight specialists', 'People keep the judgement']}
        aside={
          <div className="thesis pan">
            <span className="rail rail--sig" aria-hidden="true" />
            <p className="eyebrow">The idea</p>
            <blockquote>
              Businesses don&rsquo;t always need more people.
              <em> They need more capacity from the people they already have.</em>
            </blockquote>
            <p className="note">Everything on this site follows from that sentence.</p>
          </div>
        }
      />

      <Thread shape="split" />

      {/* ── what actually happens ── */}
      <section className="sec">
        <div className="wrap">
          <SectionHead
            eyebrow="What a full week looks like"
            signal
            title={
              <>
                Nothing is broken.
                <br />
                Everything is just late.
              </>
            }
          >
            None of this is a failure of the people doing the work. It is what happens when the
            volume arriving is larger than the hours available to absorb it.
          </SectionHead>

          <div className="raillist">
            {SLIPS.map(([title, body], i) => (
              <div key={title}>
                <span className={`rail ${i === 0 ? 'rail--sig' : ''}`} aria-hidden="true" />
                <h3 className="h4">{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── vision and mission ── */}
      <section className="sec sec--field" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="vm">
            <article className="vm-card pan">
              <p className="eyebrow">Our vision</p>
              <h3>A working day where the only work left is the work that needed a person.</h3>
              <p>
                Not fewer people. Fewer hours spent on the parts of the job nobody would choose,
                and more spent on the parts only a person can do.
              </p>
            </article>
            <article className="vm-card pan">
              <p className="eyebrow eyebrow--sig">Our mission</p>
              <h3>
                Every business with a workforce built around how it already works.
              </h3>
              <p>
                Configured around your channels, your systems and your rules, with the line between
                the workforce and your team drawn by you and visible on the screen.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── how the work divides ── */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionHead
            eyebrow="How the work divides"
            title={
              <>
                One manager.
                <br />
                One connected workforce.
              </>
            }
          >
            Stella, our AI General Manager, coordinates a connected workforce of AI Specialists
            around the way your business actually works. The workforce takes the repetitive,
            high-volume and structured work. Your people keep everything else.
          </SectionHead>

          <div className="hb">
            <div className="zone pan">
              <p className="eyebrow">Your people</p>
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>Responsible for the judgement.</h3>
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
              <p className="eyebrow eyebrow--sig">The AI workforce</p>
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>Responsible for the volume.</h3>
              <ul className="bullets">
                {WORKFORCE.map((line) => (
                  <li key={line}>
                    <Bul />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="goal" style={{ marginTop: 'var(--s10)' }}>
            <span className="rail rail--sig" aria-hidden="true" />
            <p className="eyebrow">What we are actually building</p>
            <h3>
              Not a replacement for your team.
              <br />
              <em>More capacity from the one you already have.</em>
            </h3>
          </div>
        </div>
      </section>

      {/* ── the founder, once there is a real one to quote ── */}
      {founder ? (
        <section className="sec" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="founder pan">
              {founder.portrait ? (
                <span className="founder-portrait">
                  <Image
                    src={founder.portrait}
                    alt={`${founder.name}, ${founder.role} of HireStella`}
                    width={900}
                    height={1200}
                    sizes="(max-width: 900px) 100vw, 34vw"
                  />
                </span>
              ) : null}
              <div className="founder-body">
                <p className="eyebrow eyebrow--sig">From the founder</p>
                {founder.message.map((line) => (
                  <p key={line.slice(0, 24)}>{line}</p>
                ))}
                <p className="founder-sign">
                  <b>{founder.name}</b>
                  <em>{founder.role}</em>
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {FAQS.about ? <Faq title="Questions people ask about us." items={FAQS.about} /> : null}

      <Related
        links={[
          { href: '/team', label: 'Our approach', note: 'How we start, and what we refuse to guess at.', kind: 'Sibling' },
          { href: '/stella', label: 'Meet Stella', note: 'The product idea the company is built around.', kind: 'Child' },
          { href: '/human-boundary', label: 'The human boundary', note: 'Where automation stops and your team decides.', kind: 'Sibling' },
          { href: '/contact', label: 'Contact us', note: 'Start a conversation about your operation.', kind: 'Next step' },
        ]}
      />

      <Closer
        title={
          <>
            More room
            <br className="lb" /> to do good work.
          </>
        }
        lede="Bring the workflow costing your team the most time and we will map it with you."
      />
    </main>
  );
}
