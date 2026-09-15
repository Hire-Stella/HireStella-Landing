import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import Link from 'next/link';
import { Mail, MapPin, ShieldCheck } from 'lucide-react';
import { ConsultationForm } from '@/components/consultation-form';
import { PageHero, Closer, Thread, Tri, Bul } from '@/components/system';

export const metadata: Metadata = {
  ...canonical('/contact'),
  title: 'Contact',
  description:
    'Start a conversation about your business capacity, integration requirements, or a bespoke HireStella workforce.',
};

const EXPLORE = [
  'The workflows creating pressure for your team.',
  'Your channels, systems, and integration needs.',
  'Language, voice, and operational capacity.',
  'Custom requirements and human oversight.',
];

export default function Contact() {
  const configured = Boolean(process.env.LEAD_WEBHOOK_URL);
  return (
    <main id="main">
      <PageHero
        eyebrow="Let us find your starting point"
        crumb={[['Home', '/'], ['Contact']]}
        title={
          <>
            Your business has a next chapter.
            <br />
            Let us talk about it.
          </>
        }
        lede="Discuss a workforce configuration, integration requirements, or a more complex operation. Start with a little context about what you need."
        aside={
          <div className="convert-aside pan">
            <p className="eyebrow eyebrow--sig">What we can explore</p>
            <h2 style={{ fontSize: 26 }}>Bring the problem. We will map the questions.</h2>
            <ol>
              {EXPLORE.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="note">
              All workforce configurations and commercial scope are confirmed through discovery.
            </p>
          </div>
        }
      />

      <Thread shape="split" />

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="convert">
            <div className="form-panel pan pan--solid">
              <p className="eyebrow eyebrow--sig">Tell us what you need</p>
              <h2 style={{ fontSize: 26, marginBottom: 'var(--s6)' }}>
                Start with the work that is not moving.
              </h2>
              <ConsultationForm configured={configured} id="contact-form" />
            </div>

            <aside className="convert-aside pan" style={{ position: 'sticky', top: 100 }}>
              <p className="eyebrow">Reach us directly</p>
              <div className="foot-contact">
                <a href="mailto:sales@hirestella.ai">
                  <Mail size={15} strokeWidth={1.6} aria-hidden="true" />
                  sales@hirestella.ai
                </a>
                <span>
                  <MapPin size={15} strokeWidth={1.6} aria-hidden="true" />
                  <span>
                    Lake Central Towers 1903,
                    <br />
                    Business Bay, Dubai, UAE
                  </span>
                </span>
              </div>
              <ul className="bullets">
                <li>
                  <Bul />
                  Enquiries are answered by a person, not an autoresponder.
                </li>
                <li>
                  <Bul />
                  Nothing is configured or committed before a scoping conversation.
                </li>
              </ul>
              <div className="notice">
                <ShieldCheck size={16} strokeWidth={1.7} aria-hidden="true" />
                <span>Please do not include confidential customer data in this form.</span>
              </div>
              <Link className="btn-3" href="/human-boundary">
                Where people stay in control <Tri />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <Closer
        eyebrow="Or start it yourself"
        title="Describe the bottleneck. See the workforce."
        lede="Stella reads the brief and shows which specialists the work would actually need."
        primary={{ href: '/#ask-stella', label: 'Ask Stella' }}
        secondary={{ href: '/book-demo', label: 'Book a demo' }}
      />
    </main>
  );
}
