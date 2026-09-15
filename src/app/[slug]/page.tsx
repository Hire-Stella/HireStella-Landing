import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { editorialPages } from '@/lib/pages';
import { canonical, breadcrumbLd, serviceLd, faqLd } from '@/lib/seo';
import { Thread, SectionHead, Closer, PageHero, HeroPanel, Related, Faq, Ld, Tri, Bul } from '@/components/system';
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
      'This website includes an interactive demonstration workspace. Production workspace access is provided as part of your configured deployment.',
  },
} as const;

type EditorialKey = keyof typeof editorialPages;
type AdditionalKey = keyof typeof additional;

export function generateStaticParams() {
  return [...Object.keys(editorialPages), ...Object.keys(additional)].map((slug) => ({ slug }));
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
      kicker="Command centre · sample day"
      tag="Demo data"
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
      note="Illustrative figures that reconcile with the demo workspace. Not a performance claim."
    />
  ),
  dashboard: (
    <HeroPanel
      kicker="Thursday · sample day"
      tag="Demo data"
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
        ['Demo workspace', 'Open'],
        ['Production workspace', 'By deployment', true],
        ['Consultation brief', 'Anytime'],
      ]}
      note="Production access is provided as part of a configured deployment."
    />
  ),
};

const RELATED: Record<string, { href: string; label: string; note: string; kind: string }[]> = {
  integrations: [
    { href: '/security', label: 'Security & trust', note: 'What is connected, what is permitted, and who takes over.', kind: 'Sibling' },
    { href: '/human-boundary', label: 'The human boundary', note: 'Where automation stops and your team decides.', kind: 'Sibling' },
    { href: '/stella#dashboard', label: 'Explore the dashboard', note: 'The operating picture those connections produce.', kind: 'Child' },
    { href: '/contact', label: 'Contact us', note: 'Tell us which systems your business runs on.', kind: 'Next step' },
  ],
  'human-boundary': [
    { href: '/security', label: 'Security & trust', note: 'Deployment scope, permissions and responsibility.', kind: 'Sibling' },
    { href: '/stella#workforce', label: 'The specialist workforce', note: 'Each role names the point it hands off to a person.', kind: 'Parent' },
    { href: '/industries/healthcare', label: 'Clinics', note: 'Where the boundary matters most: clinical judgement.', kind: 'Use case' },
    { href: '/book-demo', label: 'Book a demo', note: 'Configure the boundary around your own rules.', kind: 'Next step' },
  ],
  security: [
    { href: '/integrations', label: 'Integrations', note: 'What connects, and what is confirmed during scoping.', kind: 'Sibling' },
    { href: '/human-boundary', label: 'The human boundary', note: 'Responsibility stays visible at every handoff.', kind: 'Sibling' },
    { href: '/about', label: 'About HireStella', note: 'Why the company works this way.', kind: 'Parent' },
    { href: '/contact', label: 'Contact us', note: 'Discuss the requirements your deployment must meet.', kind: 'Next step' },
  ],
  about: [
    { href: '/team', label: 'Our approach', note: 'How we start, and what we refuse to guess at.', kind: 'Sibling' },
    { href: '/stella', label: 'Meet Stella', note: 'The product idea the company is built around.', kind: 'Child' },
    { href: '/security', label: 'Security & trust', note: 'Defined scope, visible responsibility.', kind: 'Sibling' },
    { href: '/contact', label: 'Contact us', note: 'Start a conversation about your operation.', kind: 'Next step' },
  ],
  team: [
    { href: '/about', label: 'About HireStella', note: 'The thesis behind the workforce.', kind: 'Parent' },
    { href: '/stella#how-it-works', label: 'How it works', note: 'The path from first conversation to first journey.', kind: 'Sibling' },
    { href: '/blogs', label: 'The blog', note: 'Practical pieces on operational coordination.', kind: 'Sibling' },
    { href: '/become-a-partner', label: 'Become a partner', note: 'Take the workforce to the clients you already advise.', kind: 'Next step' },
  ],
  roi: [
    { href: '/stella#how-it-works', label: 'How it works', note: 'What has to be true before those hours come back.', kind: 'Parent' },
    { href: '/stella#dashboard', label: 'Explore the dashboard', note: 'Where the recovered capacity becomes visible.', kind: 'Sibling' },
    { href: '/industries', label: 'Industries', note: 'Sector journeys and where each one loses time.', kind: 'Sibling' },
    { href: '/book-demo', label: 'Book a demo', note: 'Bring your own numbers to a scoping conversation.', kind: 'Next step' },
  ],
  solutions: [
    { href: '/industries', label: 'All industries', note: 'Five sectors, each with its own journey.', kind: 'Parent' },
    { href: '/use-cases', label: 'Use cases', note: 'Every journey, trigger to outcome.', kind: 'Sibling' },
    { href: '/stella#workforce', label: 'The specialist workforce', note: 'The roles these journeys draw on.', kind: 'Sibling' },
    { href: '/book-demo', label: 'Book a demo', note: 'Start with the way your business works.', kind: 'Next step' },
  ],
  login: [
    { href: '/stella#dashboard', label: 'Explore the dashboard', note: 'The demonstration workspace, open to anyone.', kind: 'Child' },
    { href: '/security', label: 'Security & trust', note: 'Access, permissions and deployment scope.', kind: 'Sibling' },
    { href: '/book-demo', label: 'Book a demo', note: 'Plan a configured deployment.', kind: 'Next step' },
  ],
};

export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const editorial = editorialPages[slug as EditorialKey];
  const page = editorial ?? additional[slug as AdditionalKey];
  if (!page) notFound();

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
                    <h4>{block.title}</h4>
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
                  eyebrow="Where the route changes colour"
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
                    <h4 style={{ marginBottom: 'var(--s6)' }}>Work that follows a rule.</h4>
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
                    <h4 style={{ marginBottom: 'var(--s6)' }}>Work that needs a person.</h4>
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


          {RELATED[slug] ? <Related links={RELATED[slug]} /> : null}


          <Closer title={editorial.closing} lede="One manager. One connected workforce. More capacity, without more chaos." />
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
                All eight specialists are included in every plan. Configuration and capacity vary
                with your operation.
              </SectionHead>
              <div className="grid-3">
                {specialists.map((s) => (
                  <Link className="card card-link pan" href={`/workforce/${s.id}`} key={s.id}>
                    <div className="k">
                      <Icon name={s.icon} size={17} />
                      {s.short}
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
          {FAQS[slug] ? <Faq title="Questions buyers actually ask." items={FAQS[slug]} /> : null}

          {RELATED[slug] ? <Related links={RELATED[slug]} /> : null}

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

          {RELATED[slug] ? <Related links={RELATED[slug]} /> : null}

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

          {RELATED[slug] ? <Related links={RELATED[slug]} /> : null}

          <Closer title="Turn your assumptions into a clearer roadmap." lede="Bring your own numbers and we will map them against the workflows that move first." />
        </>
      )}

      {slug === 'dashboard' && (
        <>
          <Thread shape="split" />
          <section className="sec">
            <div className="wrap">
              <DashboardPlanes />
              <p className="note" style={{ marginTop: 'var(--s6)' }}>
                Illustrative clinic data, not live customer activity. Today and seven-day totals are
                sample aggregates; the records show selected journeys from the sample day. Two open
                handoffs remain with the clinic team.
              </p>
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
                    <h4>{title}</h4>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
          {FAQS[slug] ? <Faq title="Questions buyers actually ask." items={FAQS[slug]} /> : null}

          {RELATED[slug] ? <Related links={RELATED[slug]} /> : null}

          <Closer title="Let us map your next move." lede="See the same picture built around your own channels and systems." />
        </>
      )}

      {slug === 'login' && (
        <>
          <section className="sec">
            <div className="wrap">
              <div className="card pan" style={{ padding: 'var(--s12)', textAlign: 'center', justifyItems: 'center' }}>
                <Icon name="dashboard" size={36} />
                <h3>Explore the experience.</h3>
                <p style={{ maxWidth: '46ch' }}>
                  Open the demo to see the workspace, or prepare a consultation brief to discuss a
                  configured deployment.
                </p>
                <div className="btn-row" style={{ justifyContent: 'center' }}>
                  <Link className="btn btn-1" href="/stella#dashboard">
                    Open demo workspace <Tri />
                  </Link>
                  <button className="btn btn-2" type="button" data-demo>
                    Plan your deployment
                  </button>
                </div>
              </div>
            </div>
          </section>
          {FAQS[slug] ? <Faq title="Questions buyers actually ask." items={FAQS[slug]} /> : null}

          {RELATED[slug] ? <Related links={RELATED[slug]} /> : null}

          <Closer title="Your operation. One clear view." lede="Production workspace access is part of a configured deployment." />
        </>
      )}
    </main>
  );
}
