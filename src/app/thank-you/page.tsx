import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { SITE } from '@/lib/seo';
import { LeadConversion } from '@/components/lead-conversion';
import { PageHero, Thread, Tri, Bul } from '@/components/system';
import { Icon } from '@/components/ui';

/**
 * The confirmation a visitor lands on after a request is delivered.
 *
 * It exists because a conversion measured on a destination URL is the signal
 * Google Ads imports most reliably: the modal, the book a demo page and the
 * contact page all end here, so one page view is one lead however it started.
 *
 * It is deliberately not indexed and not in the sitemap. A thank you page that
 * ranks collects arrivals that never submitted anything, and every one of them
 * would be counted as a conversion.
 *
 * `noindex` is set here rather than in robots.txt on purpose: a disallowed page
 * is a page Google cannot crawl, and a page it cannot crawl is one where it
 * never reads the noindex.
 */
export const metadata: Metadata = {
  title: 'Thank you',
  description: 'Your request has reached the HireStella team.',
  robots: { index: false, follow: false },
  alternates: undefined,
};

/* Only these reach analytics. Anything else is normalised away, so a pasted or
   edited query string cannot write arbitrary values into the data layer. */
const SOURCES: Record<string, string> = {
  modal: 'demo_modal',
  'book-demo': 'book_demo_page',
  contact: 'contact_page',
  partner: 'partner_page',
};

const NEXT = [
  ['A person reads your brief', 'Not an autoresponder. Someone who works with operations like yours.'],
  ['We map your workflow', 'The specialists it would use, the systems it touches, and where your team takes over.'],
  ['You get a reply with questions', 'The ones that decide whether this fits, before anything is configured.'],
] as const;

export default async function ThankYou({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = typeof params.src === 'string' ? params.src : '';
  const source = SOURCES[raw] ?? 'unknown';

  return (
    <main id="main">
      <LeadConversion source={source} />
      <PageHero
        eyebrow="Request received"
        title={
          <>
            Thank you.
            <br />
            Your request is with the team.
          </>
        }
        lede="We have your brief. Someone will read it properly and come back to you with the questions that matter, usually within one business day."
        meta={['A person reads every brief', 'No obligation', 'Nothing is configured yet']}
        aside={
          <div className="convert-aside pan">
            <p className="eyebrow eyebrow--sig">While you wait</p>
            <h2 style={{ fontSize: 26 }}>Meet the workforce you just asked about.</h2>
            <p style={{ fontSize: 15 }}>
              Stella coordinates a connected set of specialists. You can walk through how that works
              before your conversation.
            </p>
            <Link className="btn-3" href="/stella#workforce">
              See the workforce <Tri />
            </Link>
          </div>
        }
      />

      <Thread shape="join" />

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="form-success pan pan--solid" role="status">
            <Icon name="check" size={30} />
            <h2>What happens next</h2>
            <ul className="bullets" style={{ textAlign: 'left' }}>
              {NEXT.map(([title, detail]) => (
                <li key={title}>
                  <Bul />
                  <span>
                    <b>{title}.</b> {detail}
                  </span>
                </li>
              ))}
            </ul>
            <p className="note">
              A demo is not confirmed until the team arranges a time with you. If anything is
              urgent, reply to us directly at{' '}
              <a href={`mailto:${SITE.email}`}>
                <Mail size={14} strokeWidth={1.8} aria-hidden="true" /> {SITE.email}
              </a>
              .
            </p>
            <div className="inline-actions">
              <Link className="btn btn-2" href="/">
                Back to the homepage
              </Link>
              <Link className="btn btn-3" href="/blogs">
                Read the thinking behind it <Tri />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
