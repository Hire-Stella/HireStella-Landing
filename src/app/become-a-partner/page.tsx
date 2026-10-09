import { leadDeliveryConfigured } from '@/lib/lead-delivery';
import type { Metadata } from 'next';
import { Mail, ShieldCheck, Users, Settings2, Repeat } from 'lucide-react';
import { PartnerForm } from '@/components/partner-form';
import { PageHero, Closer, Faq, Ld } from '@/components/system';
import { canonical, breadcrumbLd, faqLd } from '@/lib/seo';

export const metadata: Metadata = {
  ...canonical('/become-a-partner'),
  title: 'Become a HireStella Partner in the UAE',
  description:
    'Partner with HireStella to bring an AI workforce to the businesses you already advise. Apply as a consultant, agency, reseller or technology partner.',
};

/* What a partner gets, said once and briefly, beside the form. */
const WHY = [
  [Users, 'You keep the client relationship.'],
  [Settings2, 'We scope, configure and support every deployment.'],
  [Repeat, 'A recurring relationship, not a one-off hand-off.'],
] as const;

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

/*
 * Client review, 2026-10-09: "Become a partner should be exactly like Contact:
 * very clean, very straightforward, very premium." One screen does the job,
 * as /contact does: the promise on the left, the application on the right.
 * The why-partner cards, the "what a partnership covers" panel and the
 * duplicate expectations aside were folded into three lines beside the form.
 */
export default function BecomePartner() {
  const configured = leadDeliveryConfigured();
  return (
    <main id="main" className="contact-page partner-page">
      <Ld
        data={[
          breadcrumbLd([['Home', '/'], ['Become a partner', '/become-a-partner']]),
          faqLd(FAQS),
        ]}
      />
      <PageHero
        crumb={[['Home', '/'], ['Become a partner']]}
        title={
          <>
            Bring Stella to the
            <br />
            clients <em>you advise.</em>
          </>
        }
        lede="You already know which of your clients are losing time to work that repeats. Partner with us to give them a coordinated AI workforce, without building or supporting it yourself."
        after={
          <div className="contact-direct">
            <ul className="partner-why">
              {WHY.map(([Ic, line]) => (
                <li key={line}>
                  <Ic size={17} strokeWidth={1.6} aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="contact-direct-h">Or reach the partnerships team directly</p>
            <a href="mailto:sales@hirestella.ai">
              <Mail size={17} strokeWidth={1.6} aria-hidden="true" />
              sales@hirestella.ai
            </a>
            <p className="contact-promise">
              <ShieldCheck size={16} strokeWidth={1.7} aria-hidden="true" />
              A person reads every application. Terms are agreed in writing before anything is
              announced.
            </p>
          </div>
        }
        aside={
          <div className="contact-card pan pan--solid" id="apply">
            <h2 className="contact-card-h">Apply to partner</h2>
            <p className="contact-card-p">Takes about a minute.</p>
            <PartnerForm configured={configured} />
          </div>
        }
      />

      <Faq title="Questions partners ask." items={FAQS} />

      <Closer
        eyebrow="Not ready to apply?"
        title="See the product first."
        lede="Describe a client bottleneck and explore an example of the workforce Stella would coordinate."
        primary={{ href: '/#ask-stella', label: 'Ask Stella' }}
        secondary={null}
      />
    </main>
  );
}
