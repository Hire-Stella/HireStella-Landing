import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { editorialPages } from '@/lib/pages';
import { canonical, breadcrumbLd, serviceLd, faqLd } from '@/lib/seo';
import { Thread, SectionHead, Closer, PageHero, HeroPanel, Faq, Ld, Tri, Bul } from '@/components/system';
import { WorkforceMap, DashboardPlanes } from '@/components/home-parts';
import { RoiCalculator } from '@/components/roi-calculator';
import { Icon } from '@/components/ui';
import { specialists } from '@/lib/data';
import { industryGroups } from '@/lib/industry-content';
import { FAQS } from '@/lib/faqs';

const additional = {
  solutions: {
    label: 'Solutions',
    eyebrow: 'Your industry. Your workflow.',
    title: 'Built for the problem.\nConfigured for your business.',
    intro:
      'Different operations lose capacity in different places. Explore an industry journey and the specialist connections that could help.',
  },
  roi: {
    label: 'ROI calculator',
    eyebrow: 'Your calls, your currency, your numbers',
    title: 'What those calls cost you.\nAnd what changes.',
    intro:
      'Enter the calls you take each month, what one costs to handle, and the annual figure from your proposal. The breakdown shows the cost with and without HireStella, the saving, the return and the payback.',
  },
  login: {
    label: 'Workspace access',
    eyebrow: 'Your connected workforce',
    title: 'Your operation.\nOne clear view.',
    intro:
      'This website includes an interactive workspace you can explore. Production workspace access is provided as part of your configured deployment.',
  },
} as const;

type EditorialKey = keyof typeof editorialPages;
type AdditionalKey = keyof typeof additional;

/* Routes kept in the source but withheld from the live site. The ROI calculator
   is hidden while pricing stays hidden; clearing this set restores the page,
   its sitemap entry and its links with no other edit. */
const HIDDEN_SLUGS = new Set<string>(['roi']);

export function generateStaticParams() {
  return [...Object.keys(editorialPages), ...Object.keys(additional)]
    .filter((slug) => !HIDDEN_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = editorialPages[slug as EditorialKey] ?? additional[slug as AdditionalKey];
  return page
    ? { title: page.label, description: page.intro, ...canonical(`/${slug}`) }
    : { title: 'Page not found' };
}

/** Turns the page's own blocks into a route in the hero — real content, not ornament. */
function RouteAside({ steps, caption }: { steps: string[]; caption: string }) {
  return (
    <div className="route pan">
      <p className="eyebrow eyebrow--sig">How it moves</p>
      <ol className="route-steps">
        {steps.map((step, i) => (
          <li key={step}>
            <span className="route-no num">{String(i + 1).padStart(2, '0')}</span>
            <span className="route-label">{step}</span>
          </li>
        ))}
      </ol>
      <p className="note">{caption}</p>
    </div>
  );
}

const HERO_PANELS: Record<string, React.ReactNode> = {
  workforce: (
    <HeroPanel
      kicker="Command centre · today"
      stats={[
        ['Enquiries', '34'],
        ['Bookings', '21'],
        ['Follow-ups', '9'],
        ['Open handoffs', '2', true],
      ]}
      rows={[
        ['Specialists activated', '8 / 08'],
        ['Enquiry to booking', '62%', true],
        ['Handoffs resolved', '16 / 18'],
      ]}
      note="Every figure here reconciles with every other view of the workspace."
    />
  ),
  dashboard: (
    <HeroPanel
      kicker="Thursday"
      stats={[
        ['Enquiries', '34'],
        ['Bookings', '21'],
        ['Follow-ups', '9'],
        ['Open handoffs', '2', true],
      ]}
      bars={[38, 62, 45, 78, 94, 56, 70, 41]}
      note="Every number on this page reconciles with every other view."
    />
  ),
  roi: (
    <HeroPanel
      kicker="What the calculator asks for"
      tag="Your figures"
      rows={[
        ['Your country', 'Sets the currency'],
        ['Calls each month', 'From your own records'],
        ['Cost to handle one call', 'An assumption you set'],
        ['Your annual figure', 'From your proposal', true],
      ]}
      note="Nothing is pulled from your systems and no price is assumed. The result is an estimate, not a quotation."
    />
  ),
  solutions: (
    <HeroPanel
      kicker="Across five sectors"
      rows={[
        ['Clinics', '4 segments'],
        ['Hospitals', '2 segments'],
        ['Real estate', '2 segments'],
        ['Banking & finance', '2 segments'],
        ['Automotive', '3 segments', true],
      ]}
      note="Each segment carries its own trigger, sequence and human boundary."
    />
  ),
  login: (
    <HeroPanel
      kicker="What you can open"
      rows={[
        ['Explore the workspace', 'Open'],
        ['Production workspace', 'By deployment', true],
        ['Consultation brief', 'Anytime'],
      ]}
      note="Production access is provided as part of a configured deployment."
    />
  ),
};


export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const editorial = editorialPages[slug as EditorialKey];
  const page = editorial ?? additional[slug as AdditionalKey];
  if (!page || HIDDEN_SLUGS.has(slug)) notFound();

  const [first, ...rest] = page.title.split('\n');

  return (
    <main id="main">
      <Ld
        data={[
          breadcrumbLd([['Home', '/'], [page.label, `/${slug}`]]),
          ...(FAQS[slug] ? [faqLd(FAQS[slug])] : []),
          serviceLd({ name: page.label, description: page.intro, path: `/${slug}` }),
        ]}
      />

      <PageHero
        eyebrow={page.eyebrow}
        crumb={[['Home', '/'], [page.label]]}
        title={
          <>
            {first}
            {rest.length ? (
              <>
                <br />
                {rest.join(' ')}
              </>
            ) : null}
          </>
        }
        lede={page.intro}
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
        aside={
          editorial ? (
            <RouteAside
              steps={editorial.blocks.map((b) => b.title)}
              caption="Each step is configured against your channels, systems and escalation rules."
            />
          ) : (
            HERO_PANELS[slug] ?? undefined
          )
        }
      />

      {editorial && (
        <>
          <Thread shape="split" />

          <section className="sec">
            <div className="wrap">
              <div className="statement">
                <span className="rail rail--sig" aria-hidden="true" />
                <h2>{editorial.statement}</h2>
              </div>

              <div className="grid-3" style={{ marginTop: 'var(--s12)' }}>
                {editorial.blocks.map((block, i) => (
                  <article className="card pan" key={block.title}>
                    <div className="k">
                      <i>{String(i + 1).padStart(2, '0')}</i>
                      <Icon name={block.icon} size={17} />
                    </div>
                    <h3 className="h4">{block.title}</h3>
                    <p>{block.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {slug === 'stella' && (
            <>
              <Thread shape="join" />
              <section className="sec">
                <div className="wrap">
                  <SectionHead
                    eyebrow="One manager. Eight connected specialists."
                    title={
                      <>
                        She decides who works
                        <br />
                        on what, and when.
                      </>
                    }
                  >
                    Select any role to follow the route Stella opens for it.
                  </SectionHead>
                  <WorkforceMap />
                </div>
              </section>
            </>
          )}

          {slug === 'integrations' && (
            <section className="sec">
              <div className="wrap">
                <SectionHead eyebrow="Plan-aware connections" signal title="Scoped, then confirmed.">
                  Specific providers and compatibility are confirmed during scoping. A category
                  shown here is not a claim that every product in it is supported.
                </SectionHead>
                <div className="stats">
                  <div className="stat">
                    <div className="k">Starter</div>
                    <div className="v">3</div>
                    <p className="note">integrations</p>
                  </div>
                  <div className="stat">
                    <div className="k">Pro</div>
                    <div className="v">5</div>
                    <p className="note">integrations</p>
                  </div>
                  <div className="stat hl">
                    <div className="k">Enterprise</div>
                    <div className="v">Custom</div>
                    <p className="note">APIs &amp; integrations</p>
                  </div>
                  <div className="stat">
                    <div className="k">Context</div>
                    <div className="v">1</div>
                    <p className="note">shared journey</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {slug === 'human-boundary' && (
            <section className="sec">
              <div className="wrap">
                <SectionHead
                  eyebrow="Where the handoff happens"
                  title={
                    <>
                      Structured work moves.
                      <br />
                      Judgement stays human.
                    </>
                  }
                >
                  The boundary is configured by you and visible in the interface, not buried in a
                  compliance footnote.
                </SectionHead>
                <div className="hb">
                  <div className="zone pan">
                    <p className="eyebrow eyebrow--sig">Structured zone · AI specialists</p>
                    <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>Work that follows a rule.</h3>
                    <ul className="bullets">
                      {[
                        'Routine questions answered in your voice, on every channel',
                        'Availability checked, appointments booked and rescheduled',
                        'Records updated, documents filed, email triaged',
                        'Follow-ups scheduled and dormant enquiries re-engaged',
                      ].map((l) => (
                        <li key={l}>
                          <Bul />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bound">
                    <span>Handoff</span>
                  </div>
                  <div className="zone pan">
                    <p className="eyebrow">Judgement zone · your people</p>
                    <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>Work that needs a person.</h3>
                    <ul className="bullets">
                      {[
                        'Clinical, legal and financial decisions',
                        'Complaints, sensitive conversations and exceptions',
                        'Negotiation, pricing and anything contractual',
                        'Any moment a customer asks for a human',
                      ].map((l) => (
                        <li key={l}>
                          <Bul />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {FAQS[slug] ? <Faq title="Questions buyers actually ask." items={FAQS[slug]} /> : null}




          <Closer eyebrow={editorial.closingEyebrow} title={editorial.closing} lede={editorial.closingLede} />
        </>
      )}

      {slug === 'workforce' && (
        <>
          <Thread shape="split" />
          <section className="sec">
            <div className="wrap">
              <WorkforceMap />
            </div>
          </section>
          <section className="sec">
            <div className="wrap">
              <SectionHead
                eyebrow="Every role, in full"
                title={
                  <>
                    Eight defined roles.
                    <br />
                    One coordinated workforce.
                  </>
                }
              >
                All eight specialists come with every deployment. Configuration and capacity vary
                with your operation.
              </SectionHead>
              <div className="grid-3">
                {specialists.map((s) => (
                  <Link className="card card-link pan" href="/stella#workforce" key={s.id}>
                    <div className="k">
                      <Icon name={s.icon} size={17} />
                      {s.short}
                    </div>
                    <h3 className="h4">{s.name}</h3>
                    <p>{s.description}</p>
                    <span className="btn-3" style={{ fontSize: 14 }}>
                      See the role <Tri />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          {FAQS[slug] ? <Faq title="Questions buyers actually ask." items={FAQS[slug]} /> : null}


          <Closer title="Let us map your next move." lede="Start with the workflow that is costing you the most time." />
        </>
      )}

      {slug === 'solutions' && (
        <>
          <Thread shape="split" />
          <section className="sec">
            <div className="wrap">
              <div className="ind">
                {industryGroups.map((group) => (
                  <Link className="ind-c pan" href={`/industries/${group.id}`} key={group.id}>
                    <span className="gl">
                      <Icon name={group.icon} size={19} />
                    </span>
                    <b>{group.name}</b>
                    <p>{group.intro}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          {FAQS[slug] ? <Faq title="Questions buyers actually ask." items={FAQS[slug]} /> : null}


          <Closer title="Start with the way your business works." lede="Every configuration begins with one workflow worth improving." />
        </>
      )}

      {slug === 'roi' && (
        <>
          <Thread shape="split" />
          <section className="sec sec--field">
            <div className="wrap">
              <SectionHead
                eyebrow="Set the assumptions"
                signal
                title="Start with the calls you already know."
                headMax="20ch"
              >
                Nothing here is pulled from your systems. Set your country, your monthly call
                volume and what one call costs you today, then add the annual figure from your
                proposal to see the return and the payback.
              </SectionHead>
              <RoiCalculator />
            </div>
          </section>
          {FAQS[slug] ? <Faq title="Questions buyers actually ask." items={FAQS[slug]} /> : null}


          <Closer title="Turn your assumptions into a clearer roadmap." lede="Bring your own numbers and we will map them against the workflows that move first." />
        </>
      )}

      {slug === 'dashboard' && (
        <>
          <Thread shape="split" />
          <section className="sec">
            <div className="wrap">
              <DashboardPlanes />
            </div>
          </section>
          <section className="sec">
            <div className="wrap">
              <SectionHead
                eyebrow="A view that matches your plan"
                title="The right level of visibility."
              >
                Reporting depth is scoped to your configuration, not sold as a separate product.
              </SectionHead>
              <div className="grid-3">
                {[
                  ['chart', 'Performance', 'Starter brings a view of configured activity and operational output.'],
                  ['activity', 'Growth', 'Pro adds advanced reporting to support a growing operation.'],
                  ['dashboard', 'Command Centre', 'Enterprise supports a deeper operational view, scoped to your configuration.'],
                ].map(([icon, title, body]) => (
                  <article className="card pan" key={title}>
                    <div className="k">
                      <Icon name={icon} size={17} />
                    </div>
                    <h3 className="h4">{title}</h3>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
          {FAQS[slug] ? <Faq title="Questions buyers actually ask." items={FAQS[slug]} /> : null}


          <Closer title="Let us map your next move." lede="See the same picture built around your own channels and systems." />
        </>
      )}

      {slug === 'login' && (
        <>
          <section className="sec">
            <div className="wrap">
              <div className="card pan" style={{ padding: 'var(--s12)', textAlign: 'center', justifyItems: 'center' }}>
                <Icon name="dashboard" size={36} />
                <h2 className="h3">Explore the experience.</h2>
                <p style={{ maxWidth: '46ch' }}>
                  Open the demo to see the workspace, or prepare a consultation brief to discuss a
                  configured deployment.
                </p>
                <div className="btn-row" style={{ justifyContent: 'center' }}>
                  <Link className="btn btn-1" href="/stella#dashboard">
                    Open the workspace <Tri />
                  </Link>
                  <button className="btn btn-2" type="button" data-demo>
                    Plan your deployment
                  </button>
                </div>
              </div>
            </div>
          </section>
          {FAQS[slug] ? <Faq title="Questions buyers actually ask." items={FAQS[slug]} /> : null}


          <Closer eyebrow="Your own workspace" title="See it built around your operation." lede="Production workspace access is part of a configured deployment." />
        </>
      )}
    </main>
  );
}
