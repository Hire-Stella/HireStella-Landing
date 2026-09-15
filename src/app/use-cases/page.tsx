import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import Link from 'next/link';
import { industryGroups, segmentPath, lowerName } from '@/lib/industry-content';
import { businessTypes } from '@/lib/business-types';
import { PageHero, Closer, Thread, SectionHead, Tri } from '@/components/system';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  ...canonical('/use-cases'),
  title: 'Use cases',
  description:
    'Follow one enquiry from first contact to a booked outcome, in every sector HireStella is configured for.',
};

/** Every journey on the site has the same four beats. That is the point. */
const SHAPE = [
  ['Trigger', 'An enquiry arrives on a channel you configured.'],
  ['Coordinate', 'The specialists it needs, in the order it needs them.'],
  ['Boundary', 'The moment it stops being work a rule can do.'],
  ['Next step', 'Something is in a diary, or with a named person.'],
];

export default function UseCasesPage() {
  const journeys = industryGroups.reduce((n, g) => n + g.segments.length, 0);
  const types = Object.values(businessTypes).reduce((n, t) => n + t.length, 0);

  return (
    <main id="main">
      <PageHero
        eyebrow="Use cases"
        crumb={[['Home', '/'], ['Use cases']]}
        title={
          <>
            One enquiry.
            <br />
            Four moves.
          </>
        }
        lede="Every journey here has the same shape and a different week behind it. Find the sector that looks like yours."
        actions={
          <>
            <Link className="btn btn-1" href="/#ask-stella">
              Explore my workflow <Tri />
            </Link>
            <button className="btn btn-2" type="button" data-demo>
              Book a demo <Tri />
            </button>
          </>
        }
        meta={[`${industryGroups.length} sectors`, `${types} kinds of business`, 'Illustrative, not case studies']}
        aside={
          <div className="route pan">
            <p className="eyebrow eyebrow--sig">The shape of every journey</p>
            <ol className="route-steps">
              {SHAPE.map(([label, body], i) => (
                <li key={label}>
                  <span className="route-no num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="route-label">
                    <b>{label}</b> · {body}
                  </span>
                </li>
              ))}
            </ol>
            <p className="note">
              {journeys} of these are written out step by step. The rest are configured the same
              way around your own channels.
            </p>
          </div>
        }
      />

      <Thread shape="split" />

      {industryGroups.map((group, i) => {
        const types = businessTypes[group.id] ?? [];
        return (
          <section className="sec" key={group.id} style={i > 0 ? { paddingTop: 0 } : undefined}>
            <div className="wrap">
              <SectionHead
                eyebrow={group.name}
                signal={i === 0}
                title={group.headline}
                headMax="24ch"
              >
                {group.intro}
              </SectionHead>

              {/* Sectors without a written journey show the businesses they
                  cover, so no section on this page is ever an empty grid. */}
              {group.segments.length ? (
                <div className="grid-3">
                  {group.segments.map((segment) => (
                    <Link
                      className="card card-link pan"
                      key={segment.id}
                      href={segmentPath(group.id, segment.id)}
                    >
                      <div className="k">
                        <Icon name={group.icon} size={17} />
                        {group.name}
                      </div>
                      <h4>{segment.name}</h4>
                      <ol className="seg-flow">
                        {segment.steps.map((step, j) => (
                          <li key={step} className={j === segment.steps.length - 1 ? 'is-end' : ''}>
                            <span className="num">{String(j + 1).padStart(2, '0')}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      <span className="btn-3" style={{ fontSize: 14 }}>
                        Open the journey <Tri />
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="btypes">
                  {types.map((t) => (
                    <div className="btype pan" key={t.name}>
                      <b>{t.name}</b>
                      <p>{t.note}</p>
                    </div>
                  ))}
                </div>
              )}

              <p className="note" style={{ marginTop: 'var(--s5)' }}>
                <Link className="btn-3" href={`/industries/${group.id}`}>
                  Open the {lowerName(group.name)} sector <Tri />
                </Link>
              </p>
            </div>
          </section>
        );
      })}

      <Closer
        title="Start with one workflow worth improving."
        lede="Stella maps the specialists, the systems and the handoff around it before anything is configured."
      />
    </main>
  );
}
