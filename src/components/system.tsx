import Link from 'next/link';
import type { ReactNode } from 'react';

/** §7A.3 — an action or a direction. Never decoration. */
export function Tri() {
  return <span className="tri" aria-hidden="true" />;
}

/** §7A.3 — the premium bullet is Mist, never orange. */
export function Bul() {
  return <span className="bul" aria-hidden="true" />;
}

/**
 * §7A.2 — the Stella Path threading the page together. This replaces the
 * hard section dividers: sections are separated by a route, not a rule.
 */
export function Thread({ shape = 'split' }: { shape?: 'split' | 'join' }) {
  return (
    <div className="thread" aria-hidden="true">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
        {shape === 'split' ? (
          <>
            <path d="M600 4 C600 44, 320 50, 320 86" />
            <path d="M600 4 C600 44, 880 50, 880 86" />
            <circle cx="600" cy="4" r="3.5" />
          </>
        ) : (
          <>
            <path d="M320 4 C320 44, 600 50, 600 86" />
            <path d="M880 4 C880 44, 600 50, 600 86" />
            <circle cx="600" cy="88" r="3.5" />
          </>
        )}
      </svg>
    </div>
  );
}

/** The standard section opening: eyebrow, headline, and a paragraph beside it. */
export function SectionHead({
  eyebrow,
  signal = false,
  title,
  children,
  headMax,
}: {
  eyebrow: string;
  signal?: boolean;
  title: ReactNode;
  children?: ReactNode;
  headMax?: string;
}) {
  return (
    <div className="split">
      <div>
        <p className={`eyebrow ${signal ? 'eyebrow--sig' : ''}`}>{eyebrow}</p>
        <h2 style={headMax ? { maxWidth: headMax } : undefined}>{title}</h2>
      </div>
      {children ? <p>{children}</p> : <div />}
    </div>
  );
}

/**
 * The closing band. One statement, one obvious next action (brand test 05),
 * with its own space rather than sharing a band with the footer.
 */
export function Closer({
  eyebrow = 'Your next chapter',
  title,
  lede,
  primary = { href: '/book-demo', label: 'Book a demo' },
  secondary = { href: '/#ask-stella', label: 'Ask Stella' },
}: {
  eyebrow?: string;
  title: ReactNode;
  lede: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
}) {
  return (
    <section className="closer">
      <div className="wrap closer-in">
        <span className="rail" aria-hidden="true" />
        <p className="eyebrow eyebrow--sig">{eyebrow}</p>
        <h2 className="d-l closer-h">{title}</h2>
        <p className="lede" style={{ textAlign: 'center' }}>
          {lede}
        </p>
        <div className="btn-row" style={{ justifyContent: 'center', marginTop: 'var(--s2)' }}>
          {primary.href === '/book-demo' ? (
            <button className="btn btn-1" type="button" data-demo>
              {primary.label} <Tri />
            </button>
          ) : (
            <Link className="btn btn-1" href={primary.href}>
              {primary.label} <Tri />
            </Link>
          )}
          {secondary ? (
            <Link className="btn btn-2" href={secondary.href}>
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Breadcrumb for interior pages. */
export function Crumb({ trail }: { trail: [string, string?][] }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      {trail.map(([label, href], i) => (
        <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          {i > 0 && <i aria-hidden="true">/</i>}
          {href ? <Link href={href}>{label}</Link> : <span>{label}</span>}
        </span>
      ))}
    </nav>
  );
}

/**
 * The interior page hero. Every page below the homepage uses this, so the
 * whole site opens with one composition instead of eleven near-copies.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  crumb,
  actions,
  meta,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  crumb?: [string, string?][];
  actions?: ReactNode;
  meta?: string[];
  aside?: ReactNode;
}) {
  return (
    <section className="phero">
      <span className="phero-pool" aria-hidden="true" />
      <span className="phero-dots" aria-hidden="true" />
      <div className="wrap">
        {/* The visible breadcrumb is withheld: the header already carries every
            route, so the trail repeated navigation the visitor had just used and
            opened each interior page on "Home /" rather than on its own title.
            The `crumb` prop is kept on the call sites, and breadcrumbLd still
            ships the BreadcrumbList to Google, so search results are unaffected.
            Restoring the trail is this one line. */}
        <div className="phero-in">
          <div className="phero-copy">
            <p className="eyebrow eyebrow--sig">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="lede">{lede}</p>
            {actions ? <div className="btn-row">{actions}</div> : null}
            {meta?.length ? (
              <div className="phero-meta">
                {meta.map((m) => (
                  <span key={m}>
                    <Bul />
                    {m}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {aside ? <div className="phero-aside">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}

/** A hero-side operating panel. Used where a page needs proof, not prose. */
export function HeroPanel({
  kicker,
  tag,
  rows,
  stats,
  bars,
  note,
}: {
  kicker: string;
  tag?: string;
  rows?: [string, string, boolean?][];
  stats?: [string, string, boolean?][];
  bars?: number[];
  note?: string;
}) {
  return (
    <div className="hpanel pan pan--solid">
      <div className="hpanel-top">
        <span className="micro">{kicker}</span>
        {tag ? <span className="micro">{tag}</span> : null}
      </div>
      {stats?.length ? (
        <div className="stats">
          {stats.map(([k, v, hl]) => (
            <div className={`stat ${hl ? 'hl' : ''}`} key={k}>
              <div className="k">{k}</div>
              <div className="v">{v}</div>
            </div>
          ))}
        </div>
      ) : null}
      {bars?.length ? (
        <div className="bars" aria-hidden="true">
          {bars.map((h, i) => (
            <i key={i} className={h === Math.max(...bars) ? 'on' : ''} style={{ height: `${h}%` }} />
          ))}
        </div>
      ) : null}
      {rows?.length ? (
        <div className="hpanel-rows">
          {rows.map(([k, v, on]) => (
            <div key={k} className={on ? 'on' : ''}>
              <span>{k}</span>
              <b>{v}</b>
            </div>
          ))}
        </div>
      ) : null}
      {note ? <p className="note">{note}</p> : null}
    </div>
  );
}

/** Emits validated JSON-LD. Every value must mirror visible page content. */
export function Ld({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * §9.2 — a visible FAQ block. The questions here are the same strings that go
 * into FAQPage markup, which is what makes the markup eligible.
 */
export function Faq({
  eyebrow = 'Common questions',
  title,
  items,
}: {
  eyebrow?: string;
  title: string;
  items: { q: string; a: string }[];
}) {
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SectionHead eyebrow={eyebrow} title={title} headMax="20ch" />
        <div className="faq">
          {items.map(({ q, a }, i) => (
            <details className="faq-item pan" key={q} open={i === 0}>
              <summary>
                <h3>{q}</h3>
                <span className="faq-mark" aria-hidden="true" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * §8.1 — the four-link model: parent, child, sibling and a commercial bridge.
 * Contextual links in the body, not only header/footer navigation, so no page
 * is left orphaned (§8.2 treats orphans as errors).
 */
export function Related({
  title = 'Keep exploring',
  links,
}: {
  title?: string;
  links: { href: string; label: string; note: string; kind?: string }[];
}) {
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <p className="eyebrow">{title}</p>
        <div className="related">
          {links.map((l) => (
            <Link className="rel-card pan" href={l.href} key={l.href}>
              {l.kind ? <span className="micro">{l.kind}</span> : null}
              <b>{l.label}</b>
              <p>{l.note}</p>
              <span className="btn-3" style={{ fontSize: 14 }}>
                Open <Tri />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
