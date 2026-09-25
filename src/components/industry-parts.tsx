import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/blog-content';
import { marketFacts } from '@/lib/market-facts';
import { photoFor } from '@/lib/page-photo';
import { businessTypes } from '@/lib/business-types';
import { segmentPath } from '@/lib/industry-content';
import { SectionHead, Tri } from './system';

/**
 * The sourced "in focus" panel.
 *
 * Every industry page carries the same device the dental page has always
 * carried: a market fact from a named public source, linked, with a note on
 * each figure saying exactly what it counts. It states the context, never a
 * HireStella result.
 */
export function MarketPanel({ industry, flush = false }: { industry: string; flush?: boolean }) {
  const data = marketFacts[industry];
  if (!data) return null;
  return (
    <section className="sec" style={flush ? { paddingTop: 0 } : undefined}>
      <div className="wrap">
        <div className="market pan">
          <div>
            <p className="eyebrow eyebrow--sig">{data.eyebrow}</p>
            <h3 style={{ fontSize: 28, maxWidth: '18ch' }}>{data.title}</h3>
            <p style={{ fontSize: 16, maxWidth: '52ch', marginTop: 'var(--s4)' }}>{data.body}</p>
          </div>
          <div className="market-facts">
            {data.facts.map((fact) => (
              <div key={fact.label}>
                <span className="micro">{fact.label}</span>
                <b className="num">{fact.value}</b>
                <p className="note">{fact.note}</p>
              </div>
            ))}
            <div className="market-src">
              <a href={data.source.url} rel="noreferrer noopener" target="_blank">
                {data.source.title} <Tri />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The reading room.
 *
 * Three empty text boxes were the weakest thing on an industry page, so each
 * card now leads with its article cover. Sector articles come first and the
 * general one fills the row, because an industry with one article of its own
 * should still close on something worth opening.
 */
export function ReadingRoom({
  industry,
  title = 'Ideas for a more connected operation.',
}: {
  industry: string;
  title?: string;
}) {
  const own = blogPosts.filter((p) => p.industry === industry);
  const general = blogPosts.filter((p) => p.industry === 'general' && !own.includes(p));
  const reading = [...own, ...general].slice(0, 3);
  if (!reading.length) return null;

  return (
    <section className="sec sec--field" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SectionHead eyebrow="The reading room" title={title} />
        <div className={`read-room ${reading.length < 3 ? `read-room--${reading.length}` : ''}`}>
          {reading.map((post) => (
            <Link className="read-card pan" href={`/blogs/${post.slug}`} key={post.slug}>
              <span className="read-cover">
                <Image
                  src={post.cover}
                  alt=""
                  width={1536}
                  height={1024}
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </span>
              <div className="read-body">
                <span className="k">
                  {post.category} · {post.readTime}
                </span>
                <b>{post.title}</b>
                <p>{post.summary}</p>
                <span className="btn-3" style={{ fontSize: 14 }}>
                  Read the article <Tri />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The page photograph.
 *
 * Full-bleed, directly under the problem it illustrates. It is a band rather
 * than a card because these are 8K frames and a 3:2 card at a third of the
 * measure wastes them; and it is uncaptioned inside the frame because every
 * one of them is a stock environment, not a HireStella customer. The caption
 * below says what you are looking at and why it is there.
 */
export function PagePhotograph({ group, segment }: { group: string; segment?: string }) {
  const photo = photoFor(group, segment);
  if (!photo) return null;
  return (
    <figure className="pagephoto">
      <Image src={photo.src} alt={photo.alt} width={1536} height={1024} sizes="100vw" priority={false} />
      <figcaption>
        <span className="wrap">
          <span>{photo.caption}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * The businesses a sector covers.
 *
 * Ten sectors, fifty-six business types, and only eighteen of them warrant a
 * page. The rest earn their place with a line that says what is different
 * about coordinating for them, which is more useful than a page repeating the
 * sector in different words. A type with a page links to it; the others do not
 * pretend to.
 */
export function BusinessTypes({
  industry,
  title = 'The businesses we work with.',
  eyebrow = 'Who this covers',
  flush = false,
}: {
  industry: string;
  title?: string;
  eyebrow?: string;
  flush?: boolean;
}) {
  const types = businessTypes[industry];
  if (!types?.length) return null;
  return (
    <section className="sec" style={flush ? { paddingTop: 0 } : undefined}>
      <div className="wrap">
        <SectionHead eyebrow={eyebrow} title={title} headMax="22ch">
          Every one of these loses capacity in a slightly different place. The workflow is
          configured around the one you actually run.
        </SectionHead>
        <div className="btypes">
          {types.map((t) =>
            t.page ? (
              <Link className="btype btype--link pan" href={segmentPath(industry, t.page)} key={t.name}>
                <b>{t.name}</b>
                <p>{t.note}</p>
                <span className="btype-go">
                  Open the workflow <Tri />
                </span>
              </Link>
            ) : (
              <div className="btype pan" key={t.name}>
                <b>{t.name}</b>
                <p>{t.note}</p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
