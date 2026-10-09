import { leadDeliveryConfigured } from '@/lib/lead-delivery';
import type { Metadata } from 'next';
import { canonical, breadcrumbLd, localBusinessLd, SITE, BUSINESS } from '@/lib/seo';
import { Mail, Phone, ShieldCheck } from 'lucide-react';
import { ConsultationForm } from '@/components/consultation-form';
import { PageHero, Closer, Ld } from '@/components/system';

export const metadata: Metadata = {
  ...canonical('/contact'),
  title: 'Contact Us, Business Bay Dubai',
  description:
    'Tell us what you need and book a demo of Stella, your AI General Manager. A person reads every request.',
};

/*
 * Client review, 2026-10-09: the form belongs in the hero, the page should ask
 * for a demo rather than a "consultation brief", and the explore list, the
 * second panel and the eyebrows read as template. One screen now does the job:
 * the promise and direct contact on the left, the booking form on the right.
 */
export default function Contact() {
  const configured = leadDeliveryConfigured();
  return (
    <main id="main" className="contact-page">
      <Ld
        data={[
          breadcrumbLd([['Home', '/'], ['Contact', '/contact']]),
          localBusinessLd(),
        ]}
      />
      <PageHero
        crumb={[['Home', '/'], ['Contact']]}
        title={
          <>
            Tell us what
            <br />
            you <em>need.</em>
          </>
        }
        lede="Leave your details and we will arrange a demo around your business: your enquiries, your channels and the work your team wants off its plate."
        after={
          <div className="contact-direct">
            <p className="contact-direct-h">Or reach us directly</p>
            <a href={`mailto:${SITE.email}`}>
              <Mail size={17} strokeWidth={1.6} aria-hidden="true" />
              {SITE.email}
            </a>
            {BUSINESS.phone ? (
              <a href={`tel:${BUSINESS.phone.replace(/\s/g, '')}`}>
                <Phone size={17} strokeWidth={1.6} aria-hidden="true" />
                {BUSINESS.phone}
              </a>
            ) : null}
            <p className="contact-promise">
              <ShieldCheck size={16} strokeWidth={1.7} aria-hidden="true" />
              A person reads every request. Nothing is configured or committed before we talk.
            </p>
          </div>
        }
        aside={
          <div className="contact-card pan pan--solid">
            <h2 className="contact-card-h">Book a demo</h2>
            <p className="contact-card-p">Takes under a minute.</p>
            <ConsultationForm configured={configured} id="contact-form" source="contact" />
          </div>
        }
      />

      <Closer
        eyebrow="Not ready to talk yet?"
        title="Describe the bottleneck. See the workforce."
        lede="Explore a preset example of how Stella would coordinate work like yours."
        primary={{ href: '/#ask-stella', label: 'Ask Stella' }}
        secondary={null}
      />
    </main>
  );
}
