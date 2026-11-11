import type { Metadata } from 'next';
import Link from 'next/link';
import { canonical, breadcrumbLd } from '@/lib/seo';
import { PageHero, Closer, Thread, SectionHead, Faq, Ld, Tri, Bul } from '@/components/system';
import { Icon } from '@/components/ui';
import { FAQS } from '@/lib/faqs';
import { rollout } from '@/lib/data';

export const metadata: Metadata = {
  ...canonical('/team'),
  title: 'How We Build an AI Workforce',
  description:
    'We do not start with a list of AI features. We start with the work: where your team is under pressure, how work moves, and where human judgement has to stay.',
};

/* The one rollout (lib/data), with an icon per step. */
const ICONS = ['message', 'network', 'settings', 'check', 'activity', 'chart'];
const STEPS = rollout.map(([title, body], i) => [title, body, ICONS[i]] as const);

const NEED = [
  'Your product or service information',
  'Up-to-date prices or approved answers',
  'How the workflow runs today',
  'Authorised access to the agreed systems',
  'A responsible contact on your team',
  'Time for acceptance testing',
];

export default function TeamPage() {
  return (
    <main id="main">
      <Ld data={breadcrumbLd([['Home', '/'], ['Our approach', '/team']])} />

      <PageHero
        eyebrow="Built around people"
        crumb={[['Home', '/'], ['Our approach']]}
        title={
          <>
            Business first.
            <br />
            Human-aware, <em>always.</em>
          </>
        }
        lede="We understand where your team is under pressure, how work moves through your business, which systems are involved, and where human judgement needs to remain. Then we design the workforce around it."
        actions={
          <>
            <button className="btn btn-1" type="button" data-demo>
              Book a demo <Tri />
            </button>
            <Link className="btn btn-2" href="/about">
              Our story
            </Link>
          </>
        }
        meta={['Six steps', 'One workflow first', 'You draw the boundary']}
        aside={
          <div className="thesis pan">
            <span className="rail rail--sig" aria-hidden="true" />
            <p className="eyebrow">Where we start</p>
            <blockquote>
              We don&rsquo;t start with a list of AI features.
              <em> We start with the work.</em>
            </blockquote>
            <p className="note">
              Which is why the first conversation is about your week, not our product.
            </p>
          </div>
        }
      />

      <Thread shape="split" />

      <section className="sec sec--field">
        <div className="wrap">
          <SectionHead
            eyebrow="Your rollout"
            signal
            title={
              <>
                We configure it with you.
                <br />
                Then improve what works.
              </>
            }
          >
            You do not need to design an AI workforce on your own. We start with one concrete
            customer journey, verify the data and system access it needs, test the boundaries
            together and expand by business value.
          </SectionHead>

          <div className="steps-flow">
            {STEPS.map(([title, body, icon], i) => (
              <article className="step-card pan" key={title}>
                <span className="step-mark" aria-hidden="true">
                  <Icon name={icon} size={18} />
                </span>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 'var(--s3)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="h4">{title}</h3>
                  <p>{body}</p>
                </div>
                {i < STEPS.length - 1 ? <span className="step-link" aria-hidden="true" /> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }} id="what-we-need">
        <div className="wrap">
          <div className="grid-2">
            <div className="zone pan">
              <p className="eyebrow eyebrow--sig">What we need from you</p>
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>Six things, and we handle the rest.</h3>
              <ul className="bullets">
                {NEED.map((line) => (
                  <li key={line}>
                    <Bul />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="zone pan">
              <p className="eyebrow">How long it takes</p>
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>Timing is confirmed after scoping.</h3>
              <p>
                Dates depend on the channels, technical access, integrations, languages, your
                internal approvals and how complex the first workflow is. We would rather give you
                a date we can keep than a fast one we cannot.
              </p>
            </div>
          </div>

          <div className="goal">
            <span className="rail rail--sig" aria-hidden="true" />
            <p className="eyebrow">Our principle</p>
            <h3>
              AI handles the work that follows a rule.
              <br />
              <em>People handle the work that requires judgement.</em>
            </h3>
          </div>
        </div>
      </section>

      {FAQS.team ? <Faq title="Questions about working with us." items={FAQS.team} /> : null}


      <Closer
        eyebrow="Map your first workflow"
        title="Start with the work, not the software."
        lede="Bring one workflow and we will map the specialists, the systems and the handoffs around it."
      />
    </main>
  );
}
