import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, ShieldCheck } from 'lucide-react';
import { PartnerForm } from '@/components/partner-form';
import { PageHero, Closer, Thread, SectionHead, HeroPanel, Faq, Ld, Tri, Bul } from '@/components/system';
import { canonical, breadcrumbLd, faqLd } from '@/lib/seo';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  ...canonical('/become-a-partner'),
  title: 'Become a HireStella Partner in the UAE',
  description:
    'Partner with HireStella to bring an AI workforce to the businesses you already advise. Apply as a consultant, agency, reseller or technology partner.',
};

const WHY = [
  ['users', 'Bring it to clients you already advise', 'You know where their work stops moving. We configure the workforce that moves it.'],
  ['settings', 'We handle the configuration', 'Scoping, specialists, integrations and the human boundary are ours to build and support.'],
  ['chart', 'A recurring relationship', 'A configured deployment is an ongoing engagement, not a one-off project hand-off.'],
];

const EXPECT = [
  'A scoping conversation about your clients and where you see the pressure',
  'A working walkthrough of Stella and the specialist workforce',
  'Clear commercial terms agreed in writing before anything is announced',
  'Support during configuration, so you are never left to explain it alone',
];

const FAQS = [
  {
    q: 'Who can apply?',
    a: 'Individual consultants, agencies, resellers and technology partners. What matters more than the label is whether you already advise businesses on how their operations run.',
  },
  {
    q: 'What are the commercial terms?',
    a: 'They depend on the partnership type and are agreed in writing before anything is announced. We do not publish a rate card here, because the right structure differs between a referral, a reseller relationship and a technology integration.',
  },
  {
    q: 'Do I need technical knowledge?',
    a: 'No. Configuration, integration and support are ours. You bring the relationship and the understanding of the client operation.',
  },
  {
    q: 'What happens after I apply?',
    a: 'A person reads the application and replies. If there is a fit we arrange a conversation. Nothing is agreed until we have both spoken.',
  },
];

export default function BecomePartner() {
  const configured = Boolean(process.env.LEAD_WEBHOOK_URL);
  return (
    <main id="main">
      <Ld
        data={[
          breadcrumbLd([['Home', '/'], ['Become a partner', '/become-a-partner']]),
          faqLd(FAQS),
        ]}
      />

      <PageHero
        eyebrow="Partnerships"
        crumb={[['Home', '/'], ['Become a partner']]}
        title={
          <>
            Bring an AI workforce
            <br />
            to the clients you advise.
          </>
        }
        lede="You already know which of your clients are losing capacity to work that repeats. Partner with us to give them a coordinated workforce, without building or supporting it yourself."
        actions={
          <>
            <Link className="btn btn-1" href="#apply">
              Apply to partner <Tri />
            </Link>
            <Link className="btn btn-2" href="/#ask-stella">
              See what Stella does
            </Link>
          </>
        }
        meta={['Consultants, agencies, resellers', 'Terms agreed in writing', 'We handle configuration']}
        aside={
          <HeroPanel
            kicker="What a partnership covers"
            rows={[
              ['Scoping & configuration', 'Ours'],
              ['Client relationship', 'Yours', true],
              ['Integration & support', 'Ours'],
              ['Commercial terms', 'Agreed in writing'],
            ]}
            note="Structures differ between referral, reseller and technology partnerships. Nothing is fixed before a conversation."
          />
        }
      />

      <Thread shape="split" />

      <section className="sec" id="apply">
        <div className="wrap">
          <div className="convert">
            <div className="form-panel pan pan--solid">
              <p className="eyebrow eyebrow--sig">Your application</p>
              <h2 style={{ fontSize: 26, marginBottom: 'var(--s6)' }}>
                Tell us who you are and who you work with.
              </h2>
              <PartnerForm configured={configured} />
            </div>

            <aside className="convert-aside pan" style={{ position: 'sticky', top: 100 }}>
              <p className="eyebrow">What to expect</p>
              <ul className="bullets">
                {EXPECT.map((line) => (
                  <li key={line}>
                    <Bul />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="notice">
                <ShieldCheck size={16} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  We review every application. Commercial terms are agreed in writing before
                  anything is announced.
                </span>
              </div>
              <div className="foot-contact">
                <a href="mailto:sales@hirestella.ai">
                  <Mail size={15} strokeWidth={1.6} aria-hidden="true" />
                  sales@hirestella.ai
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionHead
            eyebrow="Why partner"
            signal
            title="You keep the relationship. We do the build."
            headMax="20ch"
          >
            The work that makes a deployment succeed is scoping, configuration and support. That
            side is ours, so partnering does not turn into a delivery burden.
          </SectionHead>
          <div className="grid-3">
            {WHY.map(([icon, title, body]) => (
              <article className="card pan" key={title}>
                <div className="k">
                  <Icon name={icon} size={17} />
                </div>
                <h3 className="h4">{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Faq title="Questions partners ask." items={FAQS} />

      <Closer
        eyebrow="Not ready to apply"
        title="See the product first."
        lede="Describe a client bottleneck and explore an example of the workforce Stella would coordinate."
        primary={{ href: '/#ask-stella', label: 'Ask Stella' }}
        secondary={{ href: '/stella#workforce', label: 'See the workforce' }}
      />
    </main>
  );
}
