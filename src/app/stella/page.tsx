import type { Metadata } from 'next';
import Link from 'next/link';
import { canonical, breadcrumbLd, serviceLd, faqLd } from '@/lib/seo';
import { PageHero, Closer, Thread, SectionHead, Faq, Ld, Tri, Bul } from '@/components/system';
import { OperationsWorkspace } from '@/components/workspace';
import { clinicWorkspace } from '@/lib/workspace-content';
import { StellaWorkforce } from '@/components/stella-workforce';
import { HeroLive } from '@/components/hero-live';
import { Icon } from '@/components/ui';
import { FAQS } from '@/lib/faqs';
import { rollout, humanBoundary, revenueEngine, specialists } from '@/lib/data';
import { LanguageShowcase } from '@/components/home-stories';
import { Logo } from '@/components/ui';

export const metadata: Metadata = {
  ...canonical('/stella'),
  title: 'How Stella Works: Engine, Specialists and Dashboard',
  description:
    'One AI General Manager and eight connected specialists. See the workspace, the roles, how a deployment is built, and where your people stay in control.',
};

/**
 * One page instead of twelve.
 *
 * `/stella`, `/workforce`, `/how-it-works`, `/dashboard` and the eight
 * specialist pages each carried a hero, one real section, an FAQ and a closer,
 * and between them said the same thing four times over. Nine of them were on
 * the SEO audit's thin-page list. They are now sections here, in the order a
 * visitor actually wants them: what she is, what you get to look at, who does
 * the work, how it gets built. Every old URL redirects in.
 */

/* The canonical rollout from lib/data, with an icon per step. */
const HOW_ICONS = ['message', 'network', 'settings', 'check', 'activity', 'chart'];
const HOW = rollout.map(([title, body], i) => [HOW_ICONS[i], title, body] as const);

const ROLE_ICON: Record<string, string> = Object.fromEntries(specialists.map((x) => [x.short, x.icon]));

const PEOPLE = humanBoundary.people;
const STELLA = humanBoundary.workforce;

export default function StellaPage() {
  const faqs = [...(FAQS.stella ?? []), ...(FAQS.workforce ?? []), ...(FAQS.dashboard ?? [])];

  return (
    <main id="main">
      <Ld
        data={[
          breadcrumbLd([['Home', '/'], ['Meet Stella', '/stella']]),
          serviceLd({
            name: 'HireStella AI workforce orchestration',
            description:
              'One AI General Manager coordinating eight connected AI specialists around a configured operation.',
            path: '/stella',
          }),
          faqLd(faqs),
        ]}
      />

      <PageHero
        eyebrow="Your AI General Manager"
        crumb={[['Home', '/'], ['Meet Stella']]}
        title={
          <>
            One clear view.
            <br />
            Every <em>next move.</em>
          </>
        }
        lede="Stella is your AI General Manager. Eight AI specialists answer your calls and messages, book appointments and follow up, while Stella decides who does what and hands anything sensitive to your people. You see all of it in one place."
        actions={
          <>
            <button className="btn btn-1" type="button" data-demo>
              Book a demo <Tri />
            </button>
            <button className="btn btn-2" type="button" data-talk data-cta="stella-hero-talk">
              Talk to Stella now
            </button>
          </>
        }
        meta={['One manager, eight specialists', 'Configured, not assembled', 'Your people stay in control']}
        aside={<HeroLive />}
      />

      <Thread shape="split" />

      {/* ── the workspace, straight after the hero ── */}
      <section className="sec sec--field" id="dashboard">
        <div className="wrap">
          <SectionHead
            eyebrow="Explore the dashboard"
            title={
              <>
                Work is moving.
                <br />
                You see the whole picture.
              </>
            }
          >
            Enquiry trends, booking activity and human handoffs in one view. Every number
            reconciles across every view, and opening a record shows what was actually decided.
          </SectionHead>
          <OperationsWorkspace data={clinicWorkspace} />
          <p className="note" style={{ marginTop: 'var(--s6)' }}>
            Your channels, systems, permissions and reporting depth are configured around the way
            your business already runs.
          </p>
        </div>
      </section>

      {/* ── the revenue engine, one level deeper than the homepage ── */}
      <section className="sec" id="engine">
        <div className="wrap">
          <SectionHead
            eyebrow="How Stella runs the revenue engine"
            title={
              <>
                Five stages.
                <br />
                One manager.
              </>
            }
          >
            Each stage has its own specialists. Stella keeps the context moving between them,
            checks that nothing stalls, and knows where a person has to take over.
          </SectionHead>

          <ol className="eng eng--deep">
            {revenueEngine.map(([n, stage, line, body, roles, check, person]) => (
              <li className="eng-s pan" key={stage}>
                <span className="eng-dot" aria-hidden="true" />
                <p className="eng-k">
                  <b>{n}</b> {stage}
                </p>
                <h3 className="h4">{line}</h3>
                <p>{body}</p>
                <span className="eng-roles">
                  {roles.map((role) => (
                    <em key={role}>
                      {role === 'Stella' ? <Logo symbol /> : <Icon name={ROLE_ICON[role]} size={13} />}
                      {role}
                    </em>
                  ))}
                </span>
                <dl className="eng-more">
                  <dt>Stella checks</dt>
                  <dd>{check}</dd>
                  <dt>Your people</dt>
                  <dd>{person}</dd>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── who does the work ── */}
      <section className="sec" style={{ paddingTop: 0 }} id="workforce">
        <div className="wrap">
          <SectionHead
            eyebrow="The specialist workforce"
            signal
            title={
              <>
                One AI General Manager.
                <br />
                Eight connected specialists.
              </>
            }
          >
            You do not hire them one by one. Stella decides which ones a piece of work needs, in what
            order, and when it belongs to a person instead. Choose a role to see what it owns.
          </SectionHead>

          <StellaWorkforce />

          <p className="note" style={{ marginTop: 'var(--s6)' }}>
            The eight roles are designed to work together. Which ones start first depends on your business.
          </p>
        </div>
      </section>

      {/* ── languages ── */}
      <section className="sec" style={{ paddingTop: 0 }} id="languages">
        <div className="wrap">
          <div className="lx lx--one">
            <div className="lx-p pan">
              <p className="eyebrow eyebrow--sig">Languages</p>
              <h3 className="h4">Stella speaks to customers in the language they are comfortable using.</h3>
              <p>
                Each channel and language is configured around your customers and your brand&rsquo;s
                tone of voice, so the same business sounds like itself in every one of them.
              </p>
              <p className="note">
                Availability and quality can vary by channel, voice and provider. We confirm the
                languages you need before you start.
              </p>
            </div>
            <div className="lx-p pan">
              <LanguageShowcase />
            </div>
          </div>
        </div>
      </section>

      <Thread shape="join" />

      {/* ── how a deployment is built ── */}
      <section className="sec" id="how-it-works">
        <div className="wrap">
          <SectionHead
            eyebrow="How it works"
            title={
              <>
                A clear path.
                <br />
                A connected workforce.
              </>
            }
          >
            Start with the workflows creating the most pressure. Configure the first connected
            journey, then expand with a clear view of what is working.
          </SectionHead>

          <div className="steps-flow">
            {HOW.map(([icon, title, body], i) => (
              <article className="step-card pan" key={title}>
                <span className="step-mark" aria-hidden="true">
                  <Icon name={icon} size={18} />
                </span>
                <div>
                  <h3 className="h4">{title}</h3>
                  <p>{body}</p>
                </div>
                {i < HOW.length - 1 ? <span className="step-link" aria-hidden="true" /> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── the boundary ── */}
      <section className="sec" style={{ paddingTop: 0 }} id="boundary">
        <div className="wrap">
          <SectionHead
            eyebrow="Where your people take over"
            title={
              <>
                Stella takes the repeats.
                <br />
                Your people keep the rest.
              </>
            }
          >
            You set the boundary during scoping: what Stella may answer, which actions she may
            take, and what goes to a named person.
          </SectionHead>

          <div className="hb">
            <div className="zone pan">
              <p className="eyebrow">Your people</p>
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>What your people stay responsible for.</h3>
              <ul className="bullets">
                {PEOPLE.map((line) => (
                  <li key={line}>
                    <Bul />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bound">
              <span>Handoff</span>
            </div>

            <div className="zone pan">
              <p className="eyebrow eyebrow--sig">Stella and the specialists</p>
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>What the workforce can help with.</h3>
              <ul className="bullets">
                {STELLA.map((line) => (
                  <li key={line}>
                    <Bul />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Faq
        title="Questions buyers actually ask."
        items={faqs}
        action={
          <Link className="btn-3" href="/faq">
            See all questions <span className="tri" aria-hidden="true" />
          </Link>
        }
      />


      <Closer
        eyebrow="Build your workforce"
        title={
          <>
            One manager.
            <br className="lb" /> One connected workforce.
          </>
        }
        lede="Bring the workflow costing you the most time and we will map it with you before anything is configured."
      />
    </main>
  );
}
