import type { Metadata } from 'next';
import { canonical, breadcrumbLd } from '@/lib/seo';
import Link from 'next/link';
import { industryGroups, lowerName } from '@/lib/industry-content';
import { industryBrief } from '@/lib/industry-brief';
import { businessTypes } from '@/lib/business-types';
import { PageHero, Closer, Thread, SectionHead, Tri, Bul, Ld } from '@/components/system';
import { Icon } from '@/components/ui';
import { HeroLive } from '@/components/hero-live';
import { MIXED_SCENES } from '@/lib/hero-scenes';

export const metadata: Metadata = {
  ...canonical('/industries'),
  title: 'AI Workforce by Industry, 10 UAE Sectors',
  description:
    'Start with the way work actually moves in your industry, then build the AI workforce around it.',
};

/** Every journey on the site has the same four beats. That is the point.
    2026-10-01: moved here from /use-cases, which now redirects to #use-cases. */
const SHAPE = [
  ['Trigger', 'An enquiry arrives on a channel you configured.'],
  ['Coordinate', 'The specialists it needs, in the order it needs them.'],
  ['Boundary', 'The moment it stops being work a rule can do.'],
  ['Next step', 'Something is in a diary, or with a named person.'],
];

export default function IndustriesPage() {
  const journeys = industryGroups.reduce((n, g) => n + g.segments.length, 0);

  return (
    <main id="main">
      <Ld
        data={breadcrumbLd([
          ['Home', '/'],
          ['Industries', '/industries'],
        ])}
      />
      <PageHero
        eyebrow="Built around the way you sell"
        crumb={[['Home', '/'], ['Industries']]}
        title={
          <>
            One connected workforce.
            <br />
            Built for different <em>journeys.</em>
          </>
        }
        lede="There is no single script that works for every business. Stella's workflows are configured around the questions your customers ask, the actions your team takes and the moments that need a human decision."
        actions={
          <>
            <button className="btn btn-1" type="button" data-demo data-cta="industries-hero-demo">
              Book a demo for your industry <Tri />
            </button>
            <button className="btn btn-2" type="button" data-talk data-cta="industries-hero-talk">
              Talk to Stella now
            </button>
          </>
        }
        aside={<HeroLive scenes={MIXED_SCENES} />}
      />

      <Thread shape="split" />

      <section className="sec" id="use-cases">
        <div className="wrap">
          <SectionHead eyebrow="Use cases" signal title="One enquiry. Four moves." headMax="24ch">
            Every journey below has the same shape and a different week behind it. Find the sector
            that looks like yours.
          </SectionHead>
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
              {journeys} of these are written out step by step. The rest are configured the same way
              around your own channels.
            </p>
          </div>
        </div>
      </section>

      {industryGroups.map((group, i) => (
        <section className="sec" id={group.id} key={group.id} style={{ paddingTop: 0 }}>
          <div className="wrap">
            <SectionHead
              eyebrow={group.name}
              signal={false}
              title={industryBrief[group.id]?.card ?? group.name}
              headMax="26ch"
            >
              {industryBrief[group.id]?.lede ?? group.intro}
            </SectionHead>

            {/* Sectors without a written journey show the businesses they
                cover, so no section on this page is ever an empty grid. */}
            {!group.segments.length ? (
              <div className="btypes">
                {(businessTypes[group.id] ?? []).map((t) => (
                  <div className="btype pan" key={t.name}>
                    <b>{t.name}</b>
                    <p>{t.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sector">
                <div className="sector-flow pan">
                  {(() => {
                    const steps = group.segments[0]?.steps;
                    if (!steps) return null;
                    return (
                      <>
                        <div className="flow-row">
                          <span className="micro">Trigger</span>
                          <p>{steps[0]}</p>
                        </div>
                        <div className="flow-row">
                          <span className="micro">Stella coordinates</span>
                          <p>{steps.slice(1, -1).join(' · ')}</p>
                        </div>
                        <div className="flow-row flow-row--out">
                          <span className="micro">Outcome</span>
                          <p>{steps[steps.length - 1]}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="sector-segments">
                  {group.segments.map((segment) => (
                    <Link
                      key={segment.id}
                      className="seg-card pan"
                      href={
                        group.id === 'healthcare' && segment.id === 'dental'
                          ? '/industries/healthcare/dental'
                          : `/industries/${group.id}/${segment.id}`
                      }
                    >
                      <b>{segment.name}</b>
                      <p>{segment.description}</p>
                      <span className="seg-steps">
                        {segment.steps.slice(0, 4).map((s) => (
                          <em key={s}>
                            <Bul />
                            {s}
                          </em>
                        ))}
                      </span>
                      <span className="btn-3" style={{ fontSize: 14 }}>
                        Explore <Tri />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="btn-row" style={{ marginTop: 'var(--s6)' }}>
              <Link className="btn-3" href={`/industries/${group.id}`}>
                <Icon name={group.icon} size={17} />
                Open the {lowerName(group.name)} overview <Tri />
              </Link>
            </div>
          </div>
        </section>
      ))}

      <Closer
        eyebrow="Find your starting point"
        title="Let us map the work around your business."
        lede="Start with one journey worth improving and build the workforce outward from it."
      />
    </main>
  );
}
