import type { Metadata } from 'next';
import { canonical, breadcrumbLd } from '@/lib/seo';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { ConsultationForm } from '@/components/consultation-form';
import { PageHero, Closer, Thread, Tri, Bul, Ld } from '@/components/system';

export const metadata: Metadata = {
  ...canonical('/book-demo'),
  title: 'Book an AI Workforce Demo',
  description:
    'Prepare a consultation brief around your business, your workflows, and your next step with HireStella.',
};

const STEPS = [
  'Understand your business and the work that repeats.',
  'Map relevant specialists and connected steps.',
  'Identify supported systems and human boundaries.',
  'Discuss capacity, plan fit, and implementation scope.',
];

export default async function BookDemo({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const get = (key: string) =>
    typeof params[key] === 'string' ? (params[key] as string) : undefined;
  const configured = Boolean(process.env.LEAD_WEBHOOK_URL);

  return (
    <main id="main">
      <Ld data={breadcrumbLd([['Home', '/'], ['Book a demo', '/book-demo']])} />
      <PageHero
        eyebrow="Start with your business"
        crumb={[['Home', '/'], ['Book a demo']]}
        title={
          <>
            A useful conversation.
            <br />
            A clearer next step.
          </>
        }
        lede="Tell us what business you run and where work is slowing down. We will build a brief around the workforce, systems and operating level that may fit."
        meta={['No obligation', 'A person reads every brief', 'Scope confirmed in discovery']}
        aside={
          <div className="convert-aside pan">
            <p className="eyebrow eyebrow--sig">Clarity before commitment</p>
            <h2 style={{ fontSize: 26 }}>A conversation with a purpose.</h2>
            <p style={{ fontSize: 15 }}>
              Start with the pressure points. Leave the scoping process with a clearer picture of
              what your operation needs.
            </p>
            <ol>
              {STEPS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        }
      />

      <Thread shape="split" />

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="convert">
            <div className="form-panel pan pan--solid">
              <p className="eyebrow eyebrow--sig">Your brief</p>
              <h2 style={{ fontSize: 26, marginBottom: 'var(--s6)' }}>
                Tell Stella what is slowing you down.
              </h2>
              <ConsultationForm
                configured={configured}
                initialProblem={get('problem')}
              />
            </div>

            <aside className="convert-aside pan" style={{ position: 'sticky', top: 100 }}>
              <p className="eyebrow">What happens next</p>
              <ul className="bullets">
                <li>
                  <Bul />A person reads your brief and replies with the questions that matter.
                </li>
                <li>
                  <Bul />
                  We map the specialists your workflow would actually use.
                </li>
                <li>
                  <Bul />
                  You see where your people stay in control before anything is configured.
                </li>
              </ul>
              <div className="notice">
                <ShieldCheck size={16} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  Please do not include confidential customer data. Deployment-specific handling and
                  retention are agreed during scoping.
                </span>
              </div>
              <Link className="btn-3" href="/security">
                Security &amp; trust <Tri />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <Closer
        eyebrow="Prefer to explore first"
        title="Try it before you talk to anyone."
        lede="Describe your bottleneck and watch Stella assemble the workforce around it."
        primary={{ href: '/#ask-stella', label: 'Ask Stella' }}
        secondary={{ href: '/stella#workforce', label: 'See the workforce' }}
      />
    </main>
  );
}
