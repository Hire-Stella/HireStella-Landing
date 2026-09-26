import type { Metadata } from 'next';
import Link from 'next/link';
import { dentalUseCases } from '@/lib/industry-content';
import { DentalExplorer } from '@/components/dental-explorer';
import { OperationsWorkspace } from '@/components/workspace';
import { clinicWorkspace } from '@/lib/workspace-content';
import { MarketPanel, ReadingRoom, PagePhotograph } from '@/components/industry-parts';
import { PageHero, Closer, Thread, SectionHead, Tri, Bul, Ld } from '@/components/system';
import { Icon } from '@/components/ui';
import { canonical, breadcrumbLd, serviceLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'AI Front Desk for Dental Clinics in Dubai',
  description:
    'Explore dental call handling, appointment coordination, reminders and follow-ups, with example workflows and sourced Dubai market context.',
  ...canonical('/industries/healthcare/dental'),
};

const PROBLEMS = [
  ['The unanswered call.', 'Reception is already with a patient, so the phone goes to nobody.', true],
  ['The scattered enquiry.', 'Website, phone and social do not share the same context.', false],
  ['The forgotten follow-up.', 'The next contact has no clear owner and quietly slips.', false],
];

export default function DentalPage() {
  return (
    <main id="main">
      <Ld
        data={[
          breadcrumbLd([
            ['Home', '/'],
            ['Industries', '/industries'],
            ['Healthcare & clinics', '/industries/healthcare'],
            ['Dental clinics', '/industries/healthcare/dental'],
          ]),
          serviceLd({
            name: 'AI coordination for dental clinics',
            description:
              'Capture missed-call enquiries, coordinate consultations, send reminders and run recall follow-ups, with clinical questions handed to your team.',
            path: '/industries/healthcare/dental',
          }),
        ]}
      />
      <PageHero
        eyebrow="Dental clinics"
        crumb={[['Home', '/'], ['Industries', '/industries'], ['Clinics', '/industries/healthcare'], ['Dental']]}
        title={
          <>
            Keep patient enquiries moving.
            <br />
            From first call to next appointment.
          </>
        }
        lede="Give calls, bookings and follow-ups a coordinated next step, while your people stay focused on the patient in front of them."
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
        meta={['8 specialists, one patient journey', 'Clinical decisions stay with your team']}
        aside={
          <div className="route pan">
            <p className="eyebrow eyebrow--sig">One patient journey</p>
            <ol className="route-steps">
              {[
                'A consultation enquiry arrives',
                'Routine questions answered in your voice',
                'An appointment is coordinated',
                'A reminder and a follow-up are scheduled',
              ].map((s, i) => (
                <li key={s}>
                  <span className="route-no num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="route-label">{s}</span>
                </li>
              ))}
            </ol>
            <p className="note">
              Clinical questions, treatment decisions and complaints transfer to your team with the
              full conversation attached.
            </p>
          </div>
        }
      />

      <Thread shape="split" />

      <section className="sec sec--field">
        <div className="wrap">
          <SectionHead
            eyebrow={clinicWorkspace.inView}
            title={
              <>
                Less chasing.
                <br />
                More clarity.
              </>
            }
          >
            A visual workspace for calls, appointments and follow-ups, with every number
            reconciling across every view.
          </SectionHead>
          <OperationsWorkspace data={clinicWorkspace} />
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionHead
            eyebrow="Where the time goes"
            signal
            title={
              <>
                Great care.
                <br />
                Too many loose ends.
              </>
            }
          >
            The patient journey starts before the chair. That is where coordination can make room
            for your people.
          </SectionHead>

          <div className="raillist">
            {PROBLEMS.map(([title, body, sig]) => (
              <div key={title as string}>
                <span className={`rail ${sig ? 'rail--sig' : ''}`} aria-hidden="true" />
                <h3 className="h4">{title as string}</h3>
                <p>{body as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PagePhotograph group="clinics" segment="dental" />

      <section className="sec">
        <div className="wrap">
          <SectionHead
            eyebrow="Eight specialists. One patient journey."
            title={
              <>
                See who does what.
                <br />
                And what happens next.
              </>
            }
          >
            Choose a role to explore the problem it solves, the work Stella coordinates around it,
            and the next step your team can see.
          </SectionHead>

          <DentalExplorer />

          <p className="note" style={{ marginTop: 'var(--s6)' }}>
            Eight configurable roles, one coordinated journey. Your team approves content, contact
            rules and exceptions; clinicians own treatment decisions.
          </p>
        </div>
      </section>

      <Thread shape="join" />

      <MarketPanel industry="clinics" />

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionHead
            eyebrow="Where it actually helps"
            title={
              <>
                Six moments where
                <br />
                clinics lose capacity.
              </>
            }
          >
            Each one is a configured workflow with a trigger, a coordinated action and a visible
            outcome.
          </SectionHead>

          <div className="grid-2">
            {dentalUseCases.map((useCase) => (
              <article className="seg-detail pan" key={useCase.id}>
                <div className="k">
                  <Icon name={useCase.icon} size={17} />
                  Dental clinics
                </div>
                <h3 style={{ fontSize: 24 }}>{useCase.title}</h3>
                <dl className="explorer-rows">
                  <div>
                    <dt className="micro">Trigger</dt>
                    <dd>{useCase.trigger}</dd>
                  </div>
                  <div>
                    <dt className="micro">Stella coordinates</dt>
                    <dd>{useCase.action}</dd>
                  </div>
                  <div className="is-out">
                    <dt className="micro">Outcome</dt>
                    <dd>{useCase.outcome}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Thread shape="split" />

      <ReadingRoom industry="clinics" title="Fresh perspectives on dental operations." />

      <Closer
        eyebrow="Dental clinics"
        title={
          <>
            Build a clearer patient journey
            <br className="lb" /> around your clinic.
          </>
        }
        lede="Start with the enquiries you are missing today and map the workflow around them."
      />
    </main>
  );
}
