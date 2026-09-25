import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/blog-content';
import { PageHero, Closer, Thread, Ld, Tri, Bul } from '@/components/system';
import { SectionFigure } from '@/components/figures';
import { canonical, breadcrumbLd, articleLd } from '@/lib/seo';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ article: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ article: string }>;
}): Promise<Metadata> {
  const { article } = await params;
  const post = blogPosts.find((item) => item.slug === article);
  /* The headline stays as written; the title tag is the shorter one, because
     all three ran past the ~60 characters Google shows and were truncating. */
  return {
    title: post?.seoTitle ?? post?.title ?? 'Article not found',
    description: post?.summary,
    ...canonical(`/blogs/${article}`),
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ article: string }> }) {
  const { article } = await params;
  const post = blogPosts.find((item) => item.slug === article);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const published = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main id="main">
      <Ld
        data={[
          breadcrumbLd([['Home', '/'], ['Blogs', '/blogs'], [post.title, `/blogs/${post.slug}`]]),
          articleLd({ headline: post.title, description: post.summary, datePublished: post.date, path: `/blogs/${post.slug}` }),
        ]}
      />

      <PageHero
        eyebrow={`${post.category} · ${post.readTime}`}
        crumb={[['Home', '/'], ['Blogs', '/blogs'], [post.category]]}
        title={post.title}
        lede={post.summary}
        meta={[published, post.readTime]}
        aside={
          <div className="route pan">
            <p className="eyebrow eyebrow--sig">In this article</p>
            <ol className="route-steps">
              {post.sections.map((section, i) => (
                <li key={section.title}>
                  <span className="route-no num">{String(i + 1).padStart(2, '0')}</span>
                  <a className="route-label" href={`#s-${i}`}>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
            {post.link ? (
              <Link className="btn-3" href={post.link} style={{ fontSize: 14 }}>
                See the related journey <Tri />
              </Link>
            ) : null}
          </div>
        }
      />

      <Thread shape="split" />

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <article className="article">
            {post.sections.map((section, i) => (
              <section className="article-block" id={`s-${i}`} key={section.title}>
                <span className="article-no num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                  <SectionFigure index={i} />
                </div>
              </section>
            ))}

            {post.sources?.length ? (
              <section className="article-sources pan">
                <p className="eyebrow eyebrow--sig">Sources &amp; editorial context</p>
                <ul className="bullets">
                  {post.sources.map((source) => (
                    <li key={source.title}>
                      <Bul />
                      <span>
                        <a href={source.url} rel="noreferrer noopener" target="_blank">
                          {source.title}
                        </a>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <section className="article-sources pan">
                <p className="eyebrow eyebrow--sig">Editorial context</p>
                <p className="note">
                  The examples here describe how the work moves, not results we are promising you.
                  Your channels, systems and operating rules are configured around your own
                  business.
                </p>
              </section>
            )}
          </article>
        </div>
      </section>

      {related.length ? (
        <section className="sec" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <p className="eyebrow">Keep reading</p>
            <div className="grid-2">
              {related.map((p) => (
                <Link className="card card-link pan" href={`/blogs/${p.slug}`} key={p.slug}>
                  <div className="k">
                    {p.category} · {p.readTime}
                  </div>
                  <h3 className="h4">{p.title}</h3>
                  <p>{p.summary}</p>
                  <span className="btn-3" style={{ fontSize: 14 }}>
                    Read the article <Tri />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Closer
        title="Reading is useful. Seeing it run is better."
        lede="Describe your bottleneck and watch Stella assemble the workforce around it."
        primary={{ href: '/#ask-stella', label: 'Ask Stella' }}
        secondary={{ href: '/book-demo', label: 'Book a demo' }}
      />
    </main>
  );
}
