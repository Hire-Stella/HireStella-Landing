import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/blog-content';
import { PageHero, Closer, Thread, SectionHead, Tri } from '@/components/system';

export const metadata: Metadata = {
  ...canonical('/blogs'),
  title: 'Blogs',
  description:
    'Practical ideas for the work between the moments: capturing enquiries, coordinating bookings, and keeping judgement with your team.',
};

export default function BlogsPage() {
  const [lead, ...rest] = blogPosts;
  return (
    <main id="main">
      <PageHero
        eyebrow="The HireStella blog"
        crumb={[['Home', '/'], ['Blogs']]}
        title={
          <>
            Ideas for the work
            <br />
            between the moments.
          </>
        }
        lede="Short, practical pieces on operational coordination. Every claim carries its source and its date, and nothing here is a performance promise."
        aside={
          lead ? (
            <Link className="route pan card-link" href={`/blogs/${lead.slug}`}>
              <p className="eyebrow eyebrow--sig">
                Latest · {lead.category} · {lead.readTime}
              </p>
              <h2 style={{ fontSize: 26, marginBottom: 'var(--s4)' }}>{lead.title}</h2>
              <p style={{ fontSize: 15, marginBottom: 'var(--s5)' }}>{lead.summary}</p>
              <span className="btn-3" style={{ fontSize: 14 }}>
                Read the article <Tri />
              </span>
            </Link>
          ) : undefined
        }
      />

      <Thread shape="split" />

      <section className="sec">
        <div className="wrap">
          <SectionHead eyebrow="Every article" title="The reading room." />
          <div className={`read-room ${rest.length < 3 ? `read-room--${rest.length}` : ''}`}>
            {rest.map((post) => (
              <Link className="read-card pan" href={`/blogs/${post.slug}`} key={post.slug}>
                <span className="read-cover">
                  <Image
                    src={post.cover}
                    alt=""
                    width={1536}
                    height={1024}
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </span>
                <span className="read-body">
                  <span className="k">
                    {post.category} · {post.readTime}
                  </span>
                  <b>{post.title}</b>
                  <p>{post.summary}</p>
                  <span className="btn-3" style={{ fontSize: 14 }}>
                    Read the article <Tri />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Closer
        title="Reading is useful. Seeing it run is better."
        lede="Describe your bottleneck and watch Stella assemble the workforce around it."
        primary={{ href: '/#ask-stella', label: 'Ask Stella' }}
        secondary={{ href: '/book-demo', label: 'Book a demo' }}
      />
    </main>
  );
}
