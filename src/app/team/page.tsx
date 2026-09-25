import type { Metadata } from 'next';
import Link from 'next/link';
import { canonical, breadcrumbLd } from '@/lib/seo';
import { PageHero, Closer, Thread, SectionHead, Faq, Related, Ld, Tri } from '@/components/system';
import { Icon } from '@/components/ui';
import { FAQS } from '@/lib/faqs';

export const metadata: Metadata = {
  ...canonical('/team'),
  title: 'How We Build an AI Workforce',
  description:
    'We do not start with a list of AI features. We start with the work: where your team is under pressure, how work moves, and where human judgement has to stay.',
};

/** Four steps, in the order they actually happen. The numbers are real. */
const STEPS = [
  [
    'Listen to the real problem',
    'Understand the work that is not moving, where capacity is being lost, and where your team is spending its time.',
    'message',
  ],
  [
    'Design around the workflow',
    'Give each AI Specialist a clear role, connect the right systems, and define when work should move from the workforce to a person.',
    'network',
  ],
  [
    'Build a shared view',
    'Use the dashboard to see what the workforce is handling, where work is moving, and where your team needs to step in.',
    'chart',
  ],
  [
    'Keep improving',
    'As your business changes, the workforce expands, adapts and takes on new workflows.',
    'activity',
  ],
] as const;

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
            Human-aware, always.
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
        meta={['Four steps', 'No feature list', 'You draw the boundary']}
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
            eyebrow="How we work"
            signal
            title={
              <>
                Four steps.
                <br />
                In this order.
              </>
            }
          >
            Nothing is configured before the first one is done, because a workforce designed around
            a guess is a workforce you have to rebuild.
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

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="goal">
            <span className="rail rail--sig" aria-hidden="true" />
            <p className="eyebrow">The principle, and it is the whole thing</p>
            <h3>
              AI handles the work that follows a rule.
              <br />
              <em>People handle the work that requires judgement.</em>
            </h3>
            <p className="note">
              Where that line sits is configured with you, and it is visible in the interface rather
              than buried in a policy document.
            </p>
          </div>
        </div>
      </section>

      {FAQS.team ? <Faq title="Questions about working with us." items={FAQS.team} /> : null}

      <Related
        links={[
          { href: '/about', label: 'Our story', note: 'The idea the company was built around.', kind: 'Parent' },
          { href: '/stella', label: 'Meet Stella', note: 'The workspace, the specialists, and how a deployment is built.', kind: 'Sibling' },
          { href: '/human-boundary', label: 'The human boundary', note: 'Where automation stops and your team decides.', kind: 'Sibling' },
          { href: '/become-a-partner', label: 'Become a partner', note: 'Take the workforce to the clients you already advise.', kind: 'Next step' },
        ]}
      />

      <Closer
        title="Start with the work, not the software."
        lede="Bring one workflow and we will map the specialists, the systems and the handoffs around it."
      />
    </main>
  );
}
