import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import Link from 'next/link';
import { industryGroups, lowerName } from '@/lib/industry-content';
import { businessTypes } from '@/lib/business-types';
import { PageHero, Closer, Thread, SectionHead, Tri, Bul } from '@/components/system';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  ...canonical('/industries'),
  title: 'Industries',
  description:
    'Start with the way work actually moves in your industry, then build the AI workforce around it.',
};

export default function IndustriesPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Built around your reality"
        crumb={[['Home', '/'], ['Industries']]}
        title={
          <>
            Built around the way
            <br />
            your business works.
          </>
        }
        lede="Different operations lose capacity in different places. Start with the journey your customers actually take, then configure the specialists around it."
        actions={
          <>
            <Link className="btn btn-1" href="/#ask-stella">
              Explore my workflow <Tri />
            </Link>
            <Link className="btn btn-2" href="/use-cases">
              See use cases
            </Link>
          </>
        }
        aside={
          <div className="route pan">
            <p className="eyebrow eyebrow--sig">Ten sectors, one method</p>
            <ol className="route-steps">
              {industryGroups.map((g) => (
                <li key={g.id}>
                  <span className="route-no num">{businessTypes[g.id]?.length ?? 0}</span>
                  <span className="route-label">{g.name}</span>
                </li>
              ))}
            </ol>
            <p className="note">
              The number is how many kinds of business the sector covers. Each one loses capacity in a slightly different place.
            </p>
          </div>
        }
      />

      <Thread shape="split" />

      {industryGroups.map((group, i) => (
        <section className="sec" id={group.id} key={group.id} style={i > 0 ? { paddingTop: 0 } : undefined}>
          <div className="wrap">
            <SectionHead
              eyebrow={group.name}
              signal={i === 0}
              title={group.name}
              headMax="20ch"
            >
              {group.intro}
            </SectionHead>

            <div className={group.segments.length ? 'sector' : 'sector sector--flat'}>
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

            <div className="btn-row" style={{ marginTop: 'var(--s6)' }}>
              <Link className="btn-3" href={`/industries/${group.id}`}>
                <Icon name={group.icon} size={17} />
                Open the {lowerName(group.name)} overview <Tri />
              </Link>
            </div>
          </div>
        </section>
      ))}

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="eyebrow">Also supported</p>
          <div className="related">
            <Link className="rel-card pan" href="/solutions/salons">
              <span className="micro">Salons &amp; wellness</span>
              <b>Bookings arrive everywhere. Keep one clear schedule.</b>
              <p>Messages, calls, appointment changes and rebooking, coordinated into one place.</p>
              <span className="btn-3" style={{ fontSize: 14 }}>
                Open <Tri />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Closer
        title="Let us map the work around your business."
        lede="Start with one journey worth improving and build the workforce outward from it."
      />
    </main>
  );
}
