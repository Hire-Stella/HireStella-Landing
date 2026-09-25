import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { industryGroups, lowerName } from '@/lib/industry-content';
import { segmentDetails } from '@/lib/segment-content';
import { specialists } from '@/lib/data';
import {
  PageHero,
  Closer,
  Thread,
  SectionHead,
  HeroPanel,
  Related,
  Faq,
  Ld,
  Tri,
  Bul,
} from '@/components/system';
import { OperationsWorkspace } from '@/components/workspace';
import { workspaces } from '@/lib/workspace-content';
import { MarketPanel, ReadingRoom, PagePhotograph } from '@/components/industry-parts';
import { canonical, breadcrumbLd, serviceLd, faqLd } from '@/lib/seo';
import { Icon } from '@/components/ui';

export function generateStaticParams() {
  return Object.entries(segmentDetails).map(([segment, d]) => ({
    industry: d.group,
    segment,
  }));
}

function resolve(industry: string, segment: string) {
  const detail = segmentDetails[segment];
  if (!detail || detail.group !== industry) return null;
  const group = industryGroups.find((g) => g.id === industry);
  if (!group) return null;
  const seg = group.segments.find((s) => s.id === segment);
  if (!seg) return null;
  return { detail, group, seg };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string; segment: string }>;
}): Promise<Metadata> {
  const { industry, segment } = await params;
  const found = resolve(industry, segment);
  if (!found) return { title: 'Not found' };
  return {
    title: `AI Front Desk for ${lowerName(found.seg.name)}`,
    description: found.detail.lede,
    ...canonical(`/industries/${industry}/${segment}`),
  };
}

export default async function SegmentPage({
  params,
}: {
  params: Promise<{ industry: string; segment: string }>;
}) {
  const { industry, segment } = await params;
  const found = resolve(industry, segment);
  if (!found) notFound();
  const { detail, group, seg } = found;

  const roster = detail.specialists
    .map((id) => specialists.find((s) => s.id === id))
    .filter((s): s is (typeof specialists)[number] => Boolean(s));

  const siblings = group.segments.filter((s) => s.id !== segment).slice(0, 3);
  const workspace = workspaces[group.id];

  return (
    <main id="main">
      <Ld
        data={[
          breadcrumbLd([
            ['Home', '/'],
            ['Industries', '/industries'],
            [group.name, `/industries/${group.id}`],
            [seg.name, `/industries/${group.id}/${segment}`],
          ]),
          serviceLd({
            name: `AI workforce coordination for ${lowerName(seg.name)}`,
            description: detail.lede,
            path: `/industries/${group.id}/${segment}`,
          }),
          faqLd(detail.faqs),
        ]}
      />

      <PageHero
        eyebrow={seg.name}
        crumb={[
          ['Home', '/'],
          ['Industries', '/industries'],
          [group.name, `/industries/${group.id}`],
          [seg.name],
        ]}
        title={
          <>
            {detail.headline[0]}
            <br />
            {detail.headline[1]}
          </>
        }
        lede={detail.lede}
        actions={
          <>
            <button className="btn btn-1" type="button" data-demo>
              Book a demo <Tri />
            </button>
            <Link className="btn btn-2" href="/#ask-stella">
              Ask Stella
            </Link>
          </>
        }
        meta={[`${roster.length} specialists`, 'One connected journey', 'Scope confirmed in discovery']}
        aside={
          <HeroPanel
            kicker={`${seg.name} · what changes`}
            rows={detail.signals}
            note="Every figure here reconciles with the journey above it."
          />
        }
      />

      <Thread shape="split" />

      {workspace ? (
        <section className="sec sec--field">
          <div className="wrap">
            <SectionHead
              eyebrow={workspace.inView}
              title={
                <>
                  Less chasing.
                  <br />
                  More clarity.
                </>
              }
            >
              One workspace for enquiries, {workspace.bookingsLabel.toLowerCase()} and follow-ups,
              with every number reconciling across every view. Open a record to see what was
              actually decided.
            </SectionHead>
            <OperationsWorkspace data={workspace} />
          </div>
        </section>
      ) : null}

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionHead
            eyebrow="Who this is for"
            signal
            title="Where the capacity actually goes."
            headMax="18ch"
          >
            {detail.whoFor}
          </SectionHead>

          <div className="raillist">
            {detail.problems.map((p, i) => (
              <div key={p.title}>
                <span className={`rail ${i === 0 ? 'rail--sig' : ''}`} aria-hidden="true" />
                <h3 className="h4">{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PagePhotograph group={group.id} segment={segment} />

      <section className="sec">
        <div className="wrap">
          <SectionHead
            eyebrow="The journey, step by step"
            title={
              <>
                One request.
                <br />
                Four moves.
              </>
            }
          >
            One {lowerName(seg.name)} journey, end to end. Your configuration decides the sequence,
            the rules and the point a person takes over.
          </SectionHead>

          <div className="steps-flow">
            {detail.journey.map((j, i) => (
              <article className="step-card pan" key={j.step}>
                <span className="step-mark" aria-hidden="true">
                  <Icon name={group.icon} size={18} />
                </span>
                <div>
                  <h3 className="h4">{j.step}</h3>
                  <p>{j.detail}</p>
                </div>
                {i < detail.journey.length - 1 ? (
                  <span className="step-link" aria-hidden="true" />
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <Thread shape="join" />

      <MarketPanel industry={group.id} />

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionHead
            eyebrow="The specialists this draws on"
            title="Four roles, working in sequence."
            headMax="20ch"
          >
            All eight specialists are included in every plan. These are the ones Stella typically
            activates first for {lowerName(seg.name)}.
          </SectionHead>
          <div className="grid-3">
            {roster.map((s) => (
              <Link className="card card-link pan" href="/stella#workforce" key={s.id}>
                <div className="k">
                  <Icon name={s.icon} size={17} />
                  {s.short}
                </div>
                <h3 className="h4">{s.name}</h3>
                <p>{s.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="boundary-card pan">
            <span className="rail rail--sig" aria-hidden="true" />
            <div>
              <p className="eyebrow">Where your people take over</p>
              <h3 style={{ fontSize: 22, maxWidth: '62ch' }}>{detail.boundary}</h3>
            </div>
            <Link className="btn-3" href="/human-boundary">
              The human boundary <Tri />
            </Link>
          </div>
        </div>
      </section>

      <ReadingRoom
        industry={group.id}
        title={`Ideas for ${lowerName(seg.name)}.`}
      />

      <Faq title={`Questions ${lowerName(seg.name)} ask.`} items={detail.faqs} />

      <Related
        title={`More in ${lowerName(group.name)}`}
        links={[
          {
            href: `/industries/${group.id}`,
            label: `${group.name} overview`,
            note: `Every segment in ${lowerName(group.name)}, and what they share.`,
            kind: 'Parent',
          },
          ...siblings.map((s) => ({
            href:
              group.id === 'healthcare' && s.id === 'dental'
                ? '/industries/healthcare/dental'
                : `/industries/${group.id}/${s.id}`,
            label: s.name,
            note: s.description,
            kind: 'Sibling',
          })),
        ]}
      />

      <Closer
        title={`Build this around your ${lowerName(seg.name).replace(/s$/, '')}.`}
        lede="Start with the enquiries you are missing today and map the workflow around them."
      />
    </main>
  );
}
