import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { industries, specialists } from '@/lib/data';
import { PageHero, Closer, Thread, SectionHead, Tri, Bul, Ld } from '@/components/system';
import { Icon } from '@/components/ui';
import { breadcrumbLd, serviceLd } from '@/lib/seo';

export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const { industry } = await params;
  const item = industries.find((i) => i.id === industry);
  return { title: item?.name ?? 'Solution not found', description: item?.description };
}

export default async function IndustryPage({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params;
  const item = industries.find((i) => i.id === industry);
  if (!item) notFound();

  const roster = item.ids
    .map((id) => specialists.find((s) => s.id === id))
    .filter((s): s is (typeof specialists)[number] => Boolean(s));

  return (
    <main id="main">
      <Ld
        data={[
          breadcrumbLd([
            ['Home', '/'],
            ['Industries', '/industries'],
            [item.label, `/solutions/${item.id}`],
          ]),
          serviceLd({
            name: `AI coordination for ${item.name.toLowerCase()}`,
            description: item.description,
            path: `/solutions/${item.id}`,
          }),
        ]}
      />
      <PageHero
        eyebrow={`Connected capacity for ${item.name.toLowerCase()}`}
        crumb={[['Home', '/'], ['Industries', '/industries'], [item.label]]}
        title={item.headline}
        lede={item.description}
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
        meta={[`${roster.length} specialists`, 'One connected journey', 'Your team owns the exceptions']}
        aside={
          <div className="route pan">
            <p className="eyebrow eyebrow--sig">One connected journey</p>
            <ol className="route-steps">
              {item.steps.map((step, i) => (
                <li key={step}>
                  <span className="route-no num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="route-label">{step}</span>
                </li>
              ))}
            </ol>
            <p className="note">{item.systems}.</p>
          </div>
        }
      />

      <Thread shape="split" />

      <section className="sec">
        <div className="wrap">
          <SectionHead
            eyebrow="Start with what you know"
            signal
            title={
              <>
                {item.problem}
                <br />
                Stella connects the rest.
              </>
            }
            headMax="24ch"
          >
            The work already arrives. What is missing is one place where it all ends up with an
            owner and a next step.
          </SectionHead>

          <div className="grid-3">
            {roster.map((s, i) => (
              <Link className="card card-link pan" href="/stella#workforce" key={s.id}>
                <div className="k">
                  <i>{String(i + 1).padStart(2, '0')}</i>
                  <Icon name={s.icon} size={17} />
                </div>
                <h4>{s.name}</h4>
                <p>{s.description}</p>
                <span className="btn-3" style={{ fontSize: 14 }}>
                  See the role <Tri />
                </span>
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
              <h3 style={{ fontSize: 26, maxWidth: '28ch' }}>{item.boundary}</h3>
            </div>
            <Link className="btn-3" href="/human-boundary">
              The human boundary <Tri />
            </Link>
          </div>
        </div>
      </section>

      <Closer
        title="Let us connect the work around your business."
        lede="Bring the busiest hour of your week and we will map the journey through it."
      />
    </main>
  );
}
