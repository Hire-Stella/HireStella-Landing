import type { Metadata } from 'next';
import Link from 'next/link';
import { canonical, breadcrumbLd, faqLd } from '@/lib/seo';
import { PageHero, Closer, Faq, Ld, Tri } from '@/components/system';
import { ALL_FAQS, FAQ_GROUPS } from '@/lib/faqs';

export const metadata: Metadata = {
  ...canonical('/faq'),
  title: 'Questions About Stella and HireStella',
  description:
    'Clear answers about Stella, the AI General Manager: what she handles, where your team stays in control, channels and languages, getting started, data and cost.',
};

/* Content 2.0 (2026-10-17): the homepage keeps the six questions asked first;
   every question lives here, grouped the way buyers think about it. */
export default function FaqPage() {
  return (
    <main id="main">
      <Ld data={[breadcrumbLd([['Home', '/'], ['FAQs', '/faq']]), faqLd([...ALL_FAQS])]} />

      <PageHero
        eyebrow="Good questions, clear answers"
        crumb={[['Home', '/'], ['FAQs']]}
        title={
          <>
            Everything people ask
            <br />
            <em>before they start.</em>
          </>
        }
        lede="What Stella handles, where your people stay in charge, which channels and languages she works in, how a rollout runs, and how data and cost are handled."
        actions={
          <>
            <button className="btn btn-1" type="button" data-demo data-cta="faq-hero">
              Book a demo <Tri />
            </button>
            <Link className="btn btn-2" href="/contact">
              Ask us directly
            </Link>
          </>
        }
        aside={
          <nav className="faq-index pan" aria-label="Question groups">
            <p className="eyebrow">Jump to</p>
            {FAQ_GROUPS.map((g) => (
              <a href={`#${g.id}`} key={g.id}>
                {g.title}
                <span>{g.items.length}</span>
              </a>
            ))}
          </nav>
        }
      />

      {FAQ_GROUPS.map((g) => (
        <Faq key={g.id} id={g.id} title={g.title} items={[...g.items]} />
      ))}

      <Closer
        eyebrow="Still have a question?"
        title="Ask it in a demo."
        lede="Bring the question and one workflow. We will show where Stella helps and where your people stay in charge."
      />
    </main>
  );
}
