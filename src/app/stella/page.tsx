import type { Metadata } from 'next';
import Link from 'next/link';
import { canonical, breadcrumbLd, serviceLd, faqLd } from '@/lib/seo';
import { PageHero, Closer, Thread, SectionHead, HeroPanel, Faq, Ld, Tri, Bul } from '@/components/system';
import { OperationsWorkspace } from '@/components/workspace';
import { clinicWorkspace } from '@/lib/workspace-content';
import { StellaWorkforce } from '@/components/stella-workforce';
import { Icon } from '@/components/ui';
import { FAQS } from '@/lib/faqs';

export const metadata: Metadata = {
  ...canonical('/stella'),
  title: 'Meet Stella, Your AI General Manager',
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

const HOW = [
  ['message', 'Discovery', 'Describe your business, where work slows down, and what a better outcome would look like.'],
  ['chart', 'Analysis', 'Review channels, volume, systems, repetitive tasks, and the points where context or capacity is lost.'],
  ['network', 'Identification', 'Map the relevant specialists to the workflow, with the business reason for each one.'],
  ['settings', 'Construction', 'Configure supported integrations, knowledge, approved actions, and the boundaries that keep people in control.'],
  ['activity', 'Management', 'Keep actions and context moving between specialists, and see where more capacity is worth adding.'],
] as const;

const PEOPLE = [
  'Strategy and future planning',
  'Relationships and client trust',
  'Judgement and moral decisions',
  'Sensitive situations and empathy',
];
const STELLA = [
  'Repetitive and administrative work',
  'High-volume tasks and data processing',
  'Always-on coverage, every hour',
  'Structured follow-up and coordination',
];

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
              'One AI General Manager coordinating eight connected AI Specialists around a configured operation.',
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
            Every next move.
          </>
        }
        lede="Stella is your AI General Manager. Eight AI specialists answer your calls and messages, book appointments and follow up, while Stella decides who does what and hands anything sensitive to your people. You see all of it in one place."
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
        meta={['Eight specialists included', 'Configured, not assembled', 'Your people stay in control']}
        aside={
          <HeroPanel
            kicker="What is on this page"
            tag="In order"
            rows={[
              ['The workspace', 'What you look at'],
              ['The specialists', 'Who does the work', true],
              ['How it is built', 'Discovery to management'],
              ['The boundary', 'Where people take over'],
            ]}
            note="Everything about Stella in one place, rather than four pages saying it differently."
          />
        }
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

      {/* ── who does the work ── */}
      <section className="sec" style={{ paddingTop: 0 }} id="workforce">
        <div className="wrap">
          <SectionHead
            eyebrow="The specialist workforce"
            signal
            title={
              <>
                Eight specialists.
                <br />
                One shared direction.
              </>
            }
          >
            You do not hire them one by one. Stella decides which ones a piece of work needs, in what
            order, and when it belongs to a person instead. Choose a role to see what it owns.
          </SectionHead>

          <StellaWorkforce />

          <p className="note" style={{ marginTop: 'var(--s6)' }}>
            All eight come with every deployment. Capacity scales with you, not the headcount.
          </p>
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
            title="Each doing what they are for."
            headMax="20ch"
          >
            Some work follows a rule. Some work needs a person who knows your business. You decide
            where the line between them sits.
          </SectionHead>

          <div className="hb">
            <div className="zone pan">
              <p className="eyebrow">Your people</p>
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>The work only a person can hold.</h3>
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
              <h3 className="h4" style={{ marginBottom: 'var(--s6)' }}>The work that follows a rule.</h3>
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

      <Faq title="Questions buyers actually ask." items={faqs} />


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
