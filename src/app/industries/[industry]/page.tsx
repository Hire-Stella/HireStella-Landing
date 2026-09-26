import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { industryGroups, lowerName } from '@/lib/industry-content';
import { specialists } from '@/lib/data';
import { canonical, breadcrumbLd, serviceLd, faqLd } from '@/lib/seo';
import { PageHero, Closer, Thread, SectionHead, HeroPanel, Faq, Ld, Tri, Bul } from '@/components/system';
import { OperationsWorkspace } from '@/components/workspace';
import { workspaces } from '@/lib/workspace-content';
import { MarketPanel, ReadingRoom, PagePhotograph, BusinessTypes } from '@/components/industry-parts';
import { SECTOR_FAQS } from '@/lib/sector-faqs';
import { Icon } from '@/components/ui';

export function generateStaticParams() {
  return industryGroups.map((g) => ({ industry: g.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const { industry } = await params;
  const group = industryGroups.find((g) => g.id === industry);
  /* `name` is the label the site shows in navigation, cards and headings, and
     it stays as written. The title tag is what a searcher reads in Google, so
     it leads with the thing they typed rather than the category noun. */
  return {
    title: group?.seoTitle ?? 'Industry not found',
    description: group?.intro,
    ...canonical(`/industries/${industry}`),
  };
}

type Profile = {
  title: [string, string];
  journey: string;
  lede: string;
  rosterTitle: string;
  core: string[];
  signals: [string, string, boolean?][];
  signalNote: string;
  boundary: string;
  problemTitle: [string, string];
  problemLede: string;
  problems: [string, string][];
};

/* Each sector gets its own language, roster and signals. Nothing is shared. */
const PROFILES: Record<string, Profile> = {
  healthcare: {
    title: ['Care for your patients.', 'We connect everything else.'],
    journey: 'One patient journey',
    lede: 'Follow a patient from the first enquiry to a confirmed appointment, while your clinicians stay with the person in front of them.',
    rosterTitle: 'Reception never works alone again.',
    core: ['voice', 'front-desk', 'booking', 'outbound-followup'],
    signals: [['After-hours enquiries', 'Answered'], ['Enquiry to appointment', '62%', true], ['Clinical questions', 'To your team'], ['Recall follow-ups', 'Scheduled']],
    signalNote: 'Treatment decisions always stay with a clinician.',
    boundary: 'Clinical questions, treatment decisions and complaints transfer to your team with the full conversation attached.',
    problemTitle: ['Great care.', 'Too many loose ends.'],
    problemLede: 'The patient journey starts long before the chair. That is where coordination can make room for your people.',
    problems: [
      ['The call reception cannot reach.', 'Someone is already at the desk, so the phone rings out and the enquiry leaves without leaving a record.'],
      ['Three channels, three conversations.', 'Phone, website and social do not share context, so a patient explains themselves again at every step.'],
      ['The follow-up nobody owns.', 'The recall, the reminder and the second contact are real work with no name against them.'],
    ],
  },
  'real-estate': {
    title: ['Answer the lead tonight.', 'Show the property this week.'],
    journey: 'One buyer journey',
    lede: 'Give a portal lead a response before it cools, a viewing before it drifts, and an agent who arrives already briefed.',
    rosterTitle: 'Every lead reaches an agent warm.',
    core: ['front-desk', 'voice', 'booking', 'outbound-followup'],
    signals: [['Overnight portal leads', 'Answered'], ['First response', 'Immediate', true], ['Viewings coordinated', 'In calendar'], ['Second follow-up', 'Owned']],
    signalNote: 'Negotiation and pricing always stay with your agent.',
    boundary: 'Negotiation, pricing and anything contractual stays with your agent, briefed and ready.',
    problemTitle: ['The lead is warm.', 'For about an hour.'],
    problemLede: 'Portal enquiries do not wait for office hours, and the agent who answers first is usually the agent who gets the viewing.',
    problems: [
      ['The enquiry that arrives at midnight.', 'Portal leads land outside working hours and go to whoever replies first, which is rarely the office that is closed.'],
      ['The agent who arrives unbriefed.', 'The requirement was captured in a chat window nobody reads before the viewing starts.'],
      ['The second follow-up that never happens.', 'The first one is easy. The one that converts is the one that quietly slips.'],
    ],
  },
  'financial-services': {
    title: ['Routine questions handled.', 'Complex cases reached sooner.'],
    journey: 'One service request journey',
    lede: 'Clear the routine status and document questions off the service desk so complex cases stop queuing behind them.',
    rosterTitle: 'The desk keeps its hardest cases.',
    core: ['front-desk', 'voice', 'admin', 'booking'],
    signals: [['Routine status questions', 'Handled'], ['Complex cases', 'Reach staff sooner', true], ['Documents processed', 'Triaged'], ['Advisory requests', 'Authorised staff']],
    signalNote: 'Regulated and advisory matters never leave your team.',
    boundary: 'Anything advisory, regulated or account-sensitive transfers to authorised staff only.',
    problemTitle: ['Routine questions.', 'Complex cases waiting.'],
    problemLede: 'The volume is not the hard work. It is what the hard work is queuing behind.',
    problems: [
      ['Simple questions block difficult ones.', 'Status and document queries fill the same queue a genuinely complex case is sitting in.'],
      ['The same question on five channels.', 'App, phone, email, branch and social each receive it, and each answers it separately.'],
      ['Nothing moves outside working hours.', 'A customer waits until Monday for an answer your own policy already contains.'],
    ],
  },
  automotive: {
    title: ['Rental, service and sales.', 'One customer, one journey.'],
    journey: 'One customer journey',
    lede: 'Connect rental, workshop and sales enquiries so a returning customer is recognised instead of starting again.',
    rosterTitle: 'Rental, service and sales stop working apart.',
    core: ['front-desk', 'booking', 'admin', 'outbound-followup'],
    signals: [['Rental enquiries', 'Captured'], ['Workshop bookings', 'Coordinated', true], ['Returning customers', 'Recognised'], ['Quotes & disputes', 'To your advisor']],
    signalNote: 'Vehicle assessments and quotes go to a service advisor.',
    boundary: 'Quotes, disputes and anything involving a vehicle assessment go to your service advisor.',
    problemTitle: ['One customer.', 'Three separate systems.'],
    problemLede: 'Rental, workshop and sales each meet the same person, and none of them knows the other two already have.',
    problems: [
      ['The customer nobody recognises.', 'The same person is a brand new enquiry in three systems on the same day.'],
      ['The workshop phone rings mid-job.', 'Service advisors are under a car, so the booking call goes to nobody at all.'],
      ['The quote request that cools.', 'An enquiry needing an assessment waits for a free moment, and by then they have called somewhere else.'],
    ],
  },
  education: {
    title: ['Parents enquire at night.', 'Admissions answers in the morning.'],
    journey: 'One admissions journey',
    lede: 'An admissions decision takes weeks and a dozen small contacts. Losing one of them is how a family quietly chooses somewhere else.',
    rosterTitle: 'Admissions stops living in one inbox.',
    core: ['front-desk', 'voice', 'booking', 'outbound-followup'],
    signals: [
      ['Evening enquiries', 'Answered'],
      ['Enquiry to tour', 'Coordinated', true],
      ['Fee and curriculum questions', 'From approved answers'],
      ['Follow-up through the decision', 'Owned'],
    ],
    signalNote: 'Admissions decisions, assessments and fee negotiation stay with your team.',
    boundary:
      'Admissions decisions, assessments, safeguarding and anything about a specific child go to your staff, never to the workforce.',
    problemTitle: ['A long decision.', 'A dozen small contacts.'],
    problemLede:
      'Nobody enrols on the first call. The work is everything between the first question and the offer: the questions, the visit requests and the follow-up.',
    problems: [
      ['The enquiry that arrives at 9pm.', 'Parents research after their own working day. By the time the office opens they have messaged three other schools.'],
      ['The tour nobody booked.', 'An interested family asked about visiting and the thread ended there, with nothing in the diary.'],
      ['The follow-up across six weeks.', 'A decision this long needs several contacts, and no one person is holding the thread.'],
    ],
  },
  'home-services': {
    title: ['The job is urgent.', 'The phone is engaged.'],
    journey: 'One service call journey',
    lede: 'A broken air conditioner does not wait for a callback. The company that puts a technician in the diary first is usually the one that gets the job.',
    rosterTitle: 'The diary fills without anyone chasing it.',
    core: ['voice', 'front-desk', 'booking', 'outbound-followup'],
    signals: [
      ['After-hours callouts', 'Captured'],
      ['Enquiry to booked slot', 'Coordinated', true],
      ['Technician schedule', 'Kept current'],
      ['Quotes and disputes', 'To your supervisor'],
    ],
    signalNote: 'Pricing, diagnosis and anything requiring a site visit stay with your team.',
    boundary:
      'Diagnosis, pricing and any commitment about what a repair will cost go to your supervisor, with the description and photographs attached.',
    problemTitle: ['Urgent work.', 'Nobody free to take it.'],
    problemLede:
      'Your people are on jobs, which is exactly when the phone rings. The enquiry does not wait; it calls the next company on the list.',
    problems: [
      ['The call that comes while everyone is out.', 'The team is on site with tools in their hands. The phone rings out and the customer calls somebody else.'],
      ['The job with no address.', 'A message arrives with a fault and no location, no access details and no contact number that anybody checked.'],
      ['The slot that was never confirmed.', 'A time was discussed, nothing was written down, and the technician arrives at a locked door.'],
    ],
  },
  retail: {
    title: ['Before they buy.', 'And after it ships.'],
    journey: 'One customer journey',
    lede: 'Pre-purchase questions decide whether there is an order. Post-purchase questions decide whether there is another one. They arrive on the same channels.',
    rosterTitle: 'Two different jobs, one front door.',
    core: ['front-desk', 'admin', 'outbound-followup', 'voice'],
    signals: [
      ['Product questions', 'Answered'],
      ['Order status requests', 'Handled', true],
      ['Channels covered', 'Configured'],
      ['Refunds and complaints', 'To your team'],
    ],
    signalNote: 'Refunds, goodwill and anything about a specific payment stay with your team.',
    boundary:
      'Refunds, goodwill gestures, complaints and anything touching a payment go to your team, with the order and the conversation attached.',
    problemTitle: ['One question sells.', 'One question keeps.'],
    problemLede:
      'A sizing question and a where-is-my-order question look identical in the queue, and one of them has a cart waiting behind it.',
    problems: [
      ['The pre-purchase question that waits.', 'Someone with a full basket asks whether it fits. An hour later the basket is gone.'],
      ['Where is my order, five times a day.', 'The same question, on five channels, each answered separately by someone reading the same screen.'],
      ['The channel nobody owns.', 'Instagram, WhatsApp, the site chat and email all receive it, and each one is somebody else’s job.'],
    ],
  },
  hospitality: {
    title: ['The guest is deciding now.', 'Not when the desk is free.'],
    journey: 'One guest journey',
    lede: 'A direct enquiry is worth more than the same booking through a channel, and it is lost the same way every time: nobody was free to answer it.',
    rosterTitle: 'The desk keeps the guests in front of it.',
    core: ['front-desk', 'voice', 'booking', 'outbound-followup'],
    signals: [
      ['Out-of-hours enquiries', 'Answered'],
      ['Direct booking questions', 'Handled', true],
      ['Reservations and changes', 'Coordinated'],
      ['Complaints and comps', 'To your manager'],
    ],
    signalNote: 'Rates outside your published list, upgrades and service recovery stay with your team.',
    boundary:
      'Rate negotiation, upgrades, comps and any service recovery go to your duty manager with the booking and the conversation attached.',
    problemTitle: ['A full house.', 'And a ringing phone.'],
    problemLede:
      'The busiest hour on the floor is the busiest hour on the phone, and only one of them has a guest already standing in front of you.',
    problems: [
      ['The enquiry during service.', 'The floor is full, the desk is three deep, and the direct booking call goes to voicemail or to a channel that charges you for it.'],
      ['The question asked in another time zone.', 'Guests plan from everywhere. The enquiry arrives at three in the morning local time and is answered after they have booked elsewhere.'],
      ['The change nobody recorded.', 'A date moved by message, a dietary note given by phone, and neither reached the system the team actually reads.'],
    ],
  },
  travel: {
    title: ['The same questions.', 'Before any real case.'],
    journey: 'One traveller journey',
    lede: 'Most of what reaches a travel or visa desk is eligibility and document questions, asked repeatedly, before there is a case worth a consultant.',
    rosterTitle: 'Consultants reach the real cases sooner.',
    core: ['front-desk', 'voice', 'admin', 'outbound-followup'],
    signals: [
      ['Enquiries across time zones', 'Answered'],
      ['Published requirements', 'From your content', true],
      ['Document checklists', 'Sent and chased'],
      ['Case advice', 'To your consultants'],
    ],
    signalNote: 'Eligibility rulings and any advice on a specific application stay with your licensed team.',
    boundary:
      'Eligibility decisions, immigration advice and anything about a specific application go to your licensed consultants, never to the workforce.',
    problemTitle: ['Answered a hundred times.', 'Still asked every day.'],
    problemLede:
      'The published requirements answer most of the questions arriving. A consultant answering them one at a time is the most expensive way to do it.',
    problems: [
      ['The question already on your website.', 'Requirements, processing times and document lists are published, and still arrive by phone and message all day.'],
      ['The enquiry from another time zone.', 'Travel is planned from everywhere at once, which means the desk is never open when half the enquiries land.'],
      ['The file that stalls on a document.', 'One missing page holds a case for a week because nobody had time to chase it.'],
    ],
  },
  'professional-services': {
    title: ['Qualify before the fee earner.', 'Not after.'],
    journey: 'One enquiry journey',
    lede: 'The scarce resource is a consultant hour. Spending it on an enquiry that was never going to convert is the most expensive mistake the desk makes.',
    rosterTitle: 'The billable hour stops being the intake desk.',
    core: ['front-desk', 'voice', 'booking', 'admin'],
    signals: [
      ['Inbound enquiries', 'Captured'],
      ['Qualified before a call', 'By your criteria', true],
      ['Meetings coordinated', 'In the diary'],
      ['Advice and scope', 'To your team'],
    ],
    signalNote: 'Advice, scope, fees and anything privileged stay with your qualified people.',
    boundary:
      'Advice, scope, fees, conflict decisions and anything privileged go to your qualified team. The workforce captures the enquiry and never answers it.',
    problemTitle: ['Every enquiry looks the same.', 'Until someone asks.'],
    problemLede:
      'A serious brief and a fishing expedition arrive identically. The only way to tell them apart is to ask, and asking is currently a fee earner’s job.',
    problems: [
      ['The consultant hour spent qualifying.', 'The most expensive person available spends it finding out there was no budget, no timeline and no decision-maker.'],
      ['The brief with nothing in it.', 'An enquiry arrives with a sentence, and three emails later it still has no scope attached to it.'],
      ['The callback that decided it.', 'A prospect who contacted four firms went with the one that responded the same day.'],
    ],
  },
};

export default async function IndustryGroupPage({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const { industry } = await params;
  const group = industryGroups.find((g) => g.id === industry);
  if (!group) notFound();

  const workspace = workspaces[group.id];
  const profile = PROFILES[group.id];
  const core = profile.core
    .map((id) => specialists.find((s) => s.id === id))
    .filter((s): s is (typeof specialists)[number] => Boolean(s));

  return (
    <main id="main">
      <Ld
        data={[
          breadcrumbLd([['Home', '/'], ['Industries', '/industries'], [group.name, `/industries/${group.id}`]]),
          serviceLd({ name: `AI workforce coordination for ${lowerName(group.name)}`, description: group.intro, path: `/industries/${group.id}` }),
          faqLd(SECTOR_FAQS[group.id] ?? []),
        ]}
      />

      <PageHero
        eyebrow={group.name}
        crumb={[['Home', '/'], ['Industries', '/industries'], [group.name]]}
        title={
          <>
            {profile.title[0]}
            <br />
            {profile.title[1]}
          </>
        }
        lede={group.intro}
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
        meta={[`${group.segments.length} segments`, profile.journey, 'Scope confirmed in discovery']}
        aside={
          <HeroPanel
            kicker={`${group.name} · what changes`}
            rows={profile.signals}
            note={profile.signalNote}
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
            eyebrow="Where the capacity goes"
            signal
            title={
              <>
                {profile.problemTitle[0]}
                <br />
                {profile.problemTitle[1]}
              </>
            }
          >
            {profile.problemLede}
          </SectionHead>

          <div className="raillist">
            {profile.problems.map(([title, body], i) => (
              <div key={title}>
                <span className={`rail ${i === 0 ? 'rail--sig' : ''}`} aria-hidden="true" />
                <h3 className="h4">{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PagePhotograph group={group.id} />

      <Thread shape="join" />

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionHead
            eyebrow="The specialists this usually needs"
            title={profile.rosterTitle}
            headMax="20ch"
          >
            All eight specialists are included. These are the ones Stella typically activates first
            for {lowerName(group.name)}.
          </SectionHead>
          <div className="grid-3">
            {core.map((s) => (
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
              <h3 style={{ fontSize: 23, maxWidth: '58ch' }}>{profile.boundary}</h3>
            </div>
            <Link className="btn-3" href="/human-boundary">
              The human boundary <Tri />
            </Link>
          </div>
        </div>
      </section>

      <MarketPanel industry={group.id} flush />

      {group.segments.length ? (
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionHead
            eyebrow="Find your workflow"
            signal
            title={
              <>
                The right starting point
                <br />
                for your team.
              </>
            }
          >
            {profile.lede}
          </SectionHead>

          <div className="grid-2">
            {group.segments.map((segment) => (
              <article className="seg-detail pan" id={segment.id} key={segment.id}>
                <div className="k">
                  <Icon name={group.icon} size={17} />
                  {group.name}
                </div>
                <h3 style={{ fontSize: 24 }}>{segment.name}</h3>
                <p>{segment.description}</p>
                <ol className="seg-flow">
                  {segment.steps.map((step, j) => (
                    <li key={step} className={j === segment.steps.length - 1 ? 'is-end' : ''}>
                      <span className="num">{String(j + 1).padStart(2, '0')}</span>
                      {step}
                    </li>
                  ))}
                </ol>
                <Link
                  className="btn-3"
                  href={
                    group.id === 'healthcare' && segment.id === 'dental'
                      ? '/industries/healthcare/dental'
                      : `/industries/${group.id}/${segment.id}`
                  }
                >
                  Open the {lowerName(segment.name)} journey <Tri />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      <BusinessTypes industry={group.id} flush={group.segments.length > 0} />

      <ReadingRoom industry={group.id} />


      {SECTOR_FAQS[group.id] ? (
        <Faq title={`Questions ${lowerName(group.name)} ask.`} items={SECTOR_FAQS[group.id]} />
      ) : null}

      <Closer
        eyebrow={group.name}
        title="Bring one workflow. See what Stella takes on."
        lede="We map the specialists, the systems and the handoffs around it with you, before anything is configured."
      />
    </main>
  );
}
