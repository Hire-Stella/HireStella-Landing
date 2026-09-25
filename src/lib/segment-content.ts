/**
 * Per-segment detail content.
 *
 * Every segment gets its own page with its own language. Nothing is shared
 * between them beyond the page template, because a car rental desk and an
 * ophthalmology clinic do not lose capacity in the same place.
 *
 * Everything here stays inside the current product scope: worked
 * journeys, no invented integrations, no measured outcomes, and a named human
 * boundary on every segment.
 */

export type SegmentDetail = {
  group: string;
  headline: [string, string];
  lede: string;
  whoFor: string;
  problems: { title: string; body: string }[];
  journey: { step: string; detail: string }[];
  specialists: string[];
  boundary: string;
  signals: [string, string, boolean?][];
  faqs: { q: string; a: string }[];
};

export const segmentDetails: Record<string, SegmentDetail> = {
  /* ── Clinics ─────────────────────────────────────────────────────── */
  eye: {
    group: 'healthcare',
    headline: ['Every eye appointment', 'starts with a question.'],
    lede: 'Routine sight tests, urgent symptoms and post-operative checks all arrive through the same phone line. Coordination decides which one reaches a clinician first.',
    whoFor: 'Optometry practices and ophthalmology clinics handling a mix of routine testing, consultations and follow-up care.',
    problems: [
      { title: 'Urgency is hard to read at the desk.', body: 'A sudden change in vision and a routine annual check sound similar on a busy phone line. Reception has to triage without clinical training.' },
      { title: 'Post-operative calls arrive out of hours.', body: 'Patients recovering from a procedure call when something worries them, which is rarely during clinic hours.' },
      { title: 'Recall lists age quietly.', body: 'A patient due for a two-year review is easy to lose. Nobody notices until they arrive with a problem instead of a check.' },
    ],
    journey: [
      { step: 'Capture the visit request', detail: 'The enquiry is answered on whichever channel it arrived on, with the patient asked the questions your clinic has approved.' },
      { step: 'Route to the appropriate team', detail: 'Anything matching your urgency rules is flagged and reaches a clinician instead of joining the booking queue.' },
      { step: 'Coordinate an appointment', detail: 'Availability is checked against the right clinic type and duration, and the appointment is written to your calendar.' },
      { step: 'Send approved visit information', detail: 'Preparation notes, dilation warnings and what to bring go out in wording your clinic has signed off.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'outbound-followup'],
    boundary: 'Any symptom assessment, urgency judgement or advice about a treatment goes to a clinician. The workforce captures and routes; it does not triage on clinical grounds.',
    signals: [['Out-of-hours enquiries', 'Captured'], ['Urgency flags', 'To a clinician', true], ['Recall reminders', 'Scheduled'], ['Visit information', 'Approved wording']],
    faqs: [
      { q: 'Can it tell an emergency from a routine booking?', a: 'It applies the rules you define. If an enquiry matches your urgency criteria it is flagged and escalated to a clinician rather than booked. The clinical judgement itself always stays with your team.' },
      { q: 'Will it talk to patients about their symptoms?', a: 'No. It captures what the patient says and passes it on. Anything resembling clinical advice is outside the configured scope.' },
    ],
  },
  aesthetic: {
    group: 'healthcare',
    headline: ['Consultations sell the', 'treatment. Not the phone call.'],
    lede: 'Aesthetic enquiries are high-consideration and high-competition. The clinic that answers first, with the right information and a clear next step, usually gets the consultation.',
    whoFor: 'Aesthetic, dermatology and cosmetic clinics where the first consultation is the commercial moment.',
    problems: [
      { title: 'Enquiries arrive on social, not the phone.', body: 'Instagram and WhatsApp messages come in at night and at weekends, when the clinic is closed and the competitor is not.' },
      { title: 'Price questions stall the conversation.', body: 'Most first messages ask what something costs. Answering badly loses the lead; answering at all needs your approved position.' },
      { title: 'No-shows cost a full consultation slot.', body: 'A booked consultation with no reminder and no confirmation is a slot that may simply go empty.' },
    ],
    journey: [
      { step: 'Capture the treatment interest', detail: 'The enquiry is answered in your brand voice with the treatment information your clinic has approved for public use.' },
      { step: 'Qualify the enquiry', detail: 'Suitability questions you have defined are asked, so the consultation starts from a useful place rather than from zero.' },
      { step: 'Coordinate a consultation', detail: 'A slot of the right length with the right practitioner is offered and confirmed in your calendar.' },
      { step: 'Confirm and remind', detail: 'A confirmation and a reminder go out, and a missed consultation is re-offered rather than abandoned.' },
    ],
    specialists: ['front-desk', 'social', 'booking', 'outbound-followup'],
    boundary: 'Suitability for a treatment, medical history and anything resembling a clinical recommendation goes to your practitioner. Pricing is only ever quoted from what you have approved in writing.',
    signals: [['Evening & weekend messages', 'Answered'], ['Consultations booked', 'In calendar', true], ['Reminders sent', 'Configured'], ['Treatment advice', 'Practitioner only']],
    faqs: [
      { q: 'Will it quote prices?', a: 'Only what you approve. Many clinics prefer a range or a consultation-first response instead of a number, and that is a configuration decision you make during scoping.' },
      { q: 'Can it assess whether someone is suitable for a treatment?', a: 'No. It can ask the screening questions you define and capture the answers, but suitability is a clinical judgement and stays with your practitioner.' },
    ],
  },
  multispecialty: {
    group: 'healthcare',
    headline: ['One number.', 'Eleven departments behind it.'],
    lede: 'In a multispecialty clinic the hardest part of an enquiry is deciding where it belongs. Getting that wrong costs the patient a second call and your team a transfer.',
    whoFor: 'Multispecialty clinics and polyclinics where one reception team fronts many departments and consultant schedules.',
    problems: [
      { title: 'Reception has to route before it can book.', body: 'The caller describes a problem, not a department. Reception guesses, transfers and sometimes guesses wrong.' },
      { title: 'Consultant availability differs everywhere.', body: 'Each specialty has its own slot lengths, preparation requirements and clinic days. One rulebook does not cover them.' },
      { title: 'Context is lost between departments.', body: 'A patient referred internally often repeats their story, because the record of the first conversation did not travel with them.' },
    ],
    journey: [
      { step: 'Capture the enquiry', detail: 'The patient describes what is wrong in their own words, on whichever channel they used.' },
      { step: 'Identify the department', detail: 'Your routing rules map the description to the right specialty, and anything ambiguous goes to a person rather than being guessed.' },
      { step: 'Coordinate with the right consultant', detail: 'Slot length, clinic day and preparation requirements follow the department, not a single default.' },
      { step: 'Carry the context forward', detail: 'What the patient said travels with the appointment, so the consultation does not start from the beginning.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'admin'],
    boundary: 'Where a symptom should be seen is a clinical decision. Ambiguous routing, urgent presentations and anything involving a patient record go to your team.',
    signals: [['Departments configured', 'Per clinic'], ['Routed on first contact', 'By rule', true], ['Context carried', 'With the booking'], ['Ambiguous cases', 'To a person']],
    faqs: [
      { q: 'How does it know which department a patient needs?', a: 'From routing rules you define during configuration, not from clinical inference. When an enquiry does not clearly match a rule it escalates to your team instead of choosing.' },
      { q: 'Can it handle different rules per specialty?', a: 'Yes. Slot lengths, clinic days, preparation notes and escalation thresholds are configured per department rather than shared across the clinic.' },
    ],
  },

  /* ── Hospitals ───────────────────────────────────────────────────── */
  enterprise: {
    group: 'healthcare',
    headline: ['A hospital switchboard', 'is a routing problem.'],
    lede: 'Most calls into a hospital are not clinical. They are appointments, results enquiries, visiting questions and directions, sitting in the same queue as the ones that are.',
    whoFor: 'Single-site hospitals coordinating outpatient appointments, patient services and general enquiries across many departments.',
    problems: [
      { title: 'Non-clinical volume blocks clinical calls.', body: 'Directions, visiting hours and appointment changes occupy the same line as callers who need a person now.' },
      { title: 'Transfers lose the caller.', body: 'Every hop between departments is a point where the call can drop and the patient starts again.' },
      { title: 'Departments keep separate rules.', body: 'Outpatients, radiology and admissions each work differently, so a single script cannot serve them.' },
    ],
    journey: [
      { step: 'Answer on first contact', detail: 'Every caller reaches something immediately instead of a queue, on phone or on your supported digital channels.' },
      { step: 'Separate routine from clinical', detail: 'Approved routine questions are handled; anything matching your clinical or urgency rules goes straight to staff.' },
      { step: 'Route with the context attached', detail: 'When a transfer is needed, what the caller already said travels with them.' },
      { step: 'Update the record', detail: 'Appointment changes and confirmations are written back to the systems in scope.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'admin'],
    boundary: 'Triage, clinical advice, results and anything touching a patient record goes to authorised staff only. Nothing clinical is answered by a configured workflow.',
    signals: [['Routine enquiries', 'Handled'], ['Clinical calls', 'Reach staff sooner', true], ['Transfers with context', 'Standard'], ['Records updated', 'In scope systems']],
    faqs: [
      { q: 'Would this replace our switchboard team?', a: 'No. It absorbs the routine volume so the team spends its time on the calls that need a person. Staffing decisions are yours.' },
      { q: 'Can it access patient records?', a: 'Only the systems and fields you explicitly connect and permit during scoping. Access is configured, not assumed, and results are never handled by a workflow.' },
    ],
  },
  groups: {
    group: 'healthcare',
    headline: ['Several sites.', 'One way in.'],
    lede: 'A hospital group with five locations usually has five front desks, five sets of rules and a patient who does not know or care which site they should be calling.',
    whoFor: 'Hospital groups and multi-site providers coordinating enquiries across locations under one brand.',
    problems: [
      { title: 'Patients call the wrong site.', body: 'They call the number they remember, not the site holding their appointment, and the call has to be re-routed.' },
      { title: 'Standards drift between locations.', body: 'Each site answers slightly differently, so the experience depends on which number was dialled.' },
      { title: 'Group-level visibility is missing.', body: 'Nobody sees demand across all sites at once, so capacity cannot be moved to where it is needed.' },
    ],
    journey: [
      { step: 'Answer under one standard', detail: 'Every site answers with the same approved wording and the same escalation rules.' },
      { step: 'Identify the right location', detail: 'The enquiry is matched to the site holding the appointment or offering the service.' },
      { step: 'Coordinate at that site', detail: 'Local availability, clinic days and preparation rules apply, configured per location.' },
      { step: 'Report across the group', detail: 'Activity is visible per site and in aggregate, so demand patterns are not hidden inside one location.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'admin'],
    boundary: 'Clinical decisions, triage and patient records stay with authorised staff at the treating site. Routing between sites never overrides a clinician.',
    signals: [['Sites under one standard', 'Configured'], ['Wrong-site calls', 'Re-routed', true], ['Local rules', 'Per location'], ['Group reporting', 'Aggregated']],
    faqs: [
      { q: 'Can each site keep its own rules?', a: 'Yes. Clinic days, slot lengths, escalation contacts and preparation notes are configured per location while the answering standard stays consistent.' },
      { q: 'Do we get group-level reporting?', a: 'Reporting depth depends on your plan and configuration. Activity can be viewed per site and in aggregate where those sites are in scope.' },
    ],
  },

  /* ── Real estate ─────────────────────────────────────────────────── */
  companies: {
    group: 'real-estate',
    headline: ['The lead arrived at 11pm.', 'Answer it at 11pm.'],
    lede: 'Portal leads do not wait. A buyer who enquires about three properties in one evening usually books a viewing with whoever replies first.',
    whoFor: 'Developers and property companies handling portal enquiries, direct website leads and viewing coordination.',
    problems: [
      { title: 'Portal leads go cold overnight.', body: 'An enquiry at 11pm reaches an agent at 10am. By then the buyer has spoken to two other agencies.' },
      { title: 'Agents receive leads without context.', body: 'A name and a phone number is not a brief. The agent starts the conversation from nothing.' },
      { title: 'Nobody owns the second follow-up.', body: 'The first call happens. The one a week later, which is where most viewings are actually won, often does not.' },
    ],
    journey: [
      { step: 'Answer the enquiry', detail: 'The lead gets an immediate, useful reply on the channel it arrived on, with the property information you have approved.' },
      { step: 'Qualify the interest', detail: 'Budget, timeline and what they are actually looking for are captured using your questions.' },
      { step: 'Coordinate a viewing', detail: 'An available slot with the right agent is offered and written to the calendar.' },
      { step: 'Keep following up', detail: 'The second and third contacts are scheduled and owned, not left to whoever remembers.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'outbound-followup'],
    boundary: 'Negotiation, pricing, offers and anything contractual stays with your agent. The workforce hands over a briefed lead, not a deal.',
    signals: [['Overnight leads', 'Answered'], ['First response', 'Immediate', true], ['Viewings coordinated', 'In calendar'], ['Second follow-up', 'Owned']],
    faqs: [
      { q: 'Will it negotiate with a buyer?', a: 'No. Price, terms and anything contractual are outside the configured scope and go to your agent with the full conversation attached.' },
      { q: 'Can it work with portal leads?', a: 'It can work with the channels connected during scoping. Which portals and feeds are supported is confirmed then rather than assumed here.' },
    ],
  },
  consultancies: {
    group: 'real-estate',
    headline: ['Advisory work starts', 'with a qualifying call.'],
    lede: 'Brokerages and consultancies lose time on enquiries that were never going to convert, and lose deals on the ones that would have if someone had called back.',
    whoFor: 'Brokerages, property consultancies and advisory firms where consultant time is the scarce resource.',
    problems: [
      { title: 'Consultant time goes to unqualified calls.', body: 'The most expensive person in the business spends the first ten minutes finding out the enquiry was not a fit.' },
      { title: 'Enquiries arrive across too many channels.', body: 'Website, referral, WhatsApp and phone, with no shared view of who has already been spoken to.' },
      { title: 'Dormant enquiries stay dormant.', body: 'A client who was not ready six months ago is rarely contacted when they are.' },
    ],
    journey: [
      { step: 'Capture the requirement', detail: 'What the client is actually asking for is captured in their words, on whichever channel they used.' },
      { step: 'Qualify against your criteria', detail: 'Your qualification questions are asked before a consultant is involved.' },
      { step: 'Book the consultation', detail: 'Only qualified enquiries reach a consultant diary, with the brief already attached.' },
      { step: 'Re-engage when the time comes', detail: 'Enquiries that were not ready are scheduled for a future contact rather than filed and forgotten.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'outbound-followup'],
    boundary: 'Advice, valuation, negotiation and fee discussions stay with your consultants. Qualification captures facts; it does not give an opinion.',
    signals: [['Enquiries qualified', 'Before the diary'], ['Consultant time', 'On real briefs', true], ['Dormant re-engagement', 'Scheduled'], ['Advice & fees', 'Consultant only']],
    faqs: [
      { q: 'Who decides what counts as qualified?', a: 'You do. The criteria are defined during scoping and can be changed. Anything that does not clearly meet them is passed to a person rather than rejected.' },
      { q: 'Will it give clients advice?', a: 'No. Advisory content, valuations and fees are outside the configured scope.' },
    ],
  },

  /* ── Banking & finance ───────────────────────────────────────────── */
  banks: {
    group: 'financial-services',
    headline: ['Most calls are status.', 'The rest need a person.'],
    lede: 'A service desk spends its day on where-is-my-document and what-is-my-status, while the cases that genuinely need expertise queue behind them.',
    whoFor: 'Banks and financial institutions where routine service volume competes with complex casework.',
    problems: [
      { title: 'Routine questions dominate the queue.', body: 'Status checks, document requests and appointment changes absorb the desk before a complex case is reached.' },
      { title: 'Verification has to happen first.', body: 'Nothing account-specific can be discussed until identity is established, which itself takes time on every call.' },
      { title: 'Complex cases wait behind simple ones.', body: 'The caller with a genuine problem waits in the same queue as the caller asking for opening hours.' },
    ],
    journey: [
      { step: 'Answer and understand the request', detail: 'Every caller is answered immediately and the nature of the request is captured.' },
      { step: 'Handle what is approved and general', detail: 'Non-account-specific questions you have approved are answered directly.' },
      { step: 'Escalate anything account-sensitive', detail: 'Anything requiring verification, advice or account access goes to authorised staff with the context attached.' },
      { step: 'Coordinate the appointment', detail: 'Where the request needs a specialist, a slot is booked rather than a callback promised.' },
    ],
    specialists: ['front-desk', 'voice', 'admin', 'booking'],
    boundary: 'Anything advisory, regulated, account-specific or requiring identity verification transfers to authorised staff only. No account data is handled by a configured workflow.',
    signals: [['General enquiries', 'Answered'], ['Complex cases', 'Reached sooner', true], ['Account-sensitive', 'Authorised staff'], ['Appointments', 'Booked, not promised']],
    faqs: [
      { q: 'Can it access customer accounts?', a: 'No. Account-specific and regulated matters transfer to authorised staff. This website makes no claim about any regulatory permission or certification.' },
      { q: 'How is identity handled?', a: 'Verification stays with your team and your existing processes. The workforce captures the request and routes it; it does not verify anyone.' },
    ],
  },
  advisory: {
    group: 'financial-services',
    headline: ['Documents, deadlines', 'and a lot of chasing.'],
    lede: 'Financial service firms lose most of their administrative time to collecting documents and chasing the people who have not sent them yet.',
    whoFor: 'Advisory firms, brokers and financial service providers with document-heavy onboarding and recurring client processes.',
    problems: [
      { title: 'Onboarding stalls on missing documents.', body: 'A file sits incomplete because one item was never chased, and nobody owns the chase.' },
      { title: 'Recurring deadlines arrive together.', body: 'Renewal and review dates cluster, and the reminders that should have gone out weeks earlier did not.' },
      { title: 'Routine status questions interrupt case work.', body: 'Clients ask where their application is, and answering takes a specialist away from progressing it.' },
    ],
    journey: [
      { step: 'Capture the request', detail: 'The enquiry and what the client needs are captured on their channel of choice.' },
      { step: 'Request and track documents', detail: 'Outstanding items are requested and followed up on a schedule you set, rather than when someone remembers.' },
      { step: 'Triage and file what arrives', detail: 'Received documents are processed into the systems in scope, with anything ambiguous flagged for review.' },
      { step: 'Keep the client informed', detail: 'Approved status updates go out so the client stops needing to ask.' },
    ],
    specialists: ['front-desk', 'admin', 'outbound-followup', 'booking'],
    boundary: 'Advice, suitability, regulated recommendations and any judgement about a client file stay with your qualified staff. Ambiguous documents are escalated, never assumed.',
    signals: [['Document chasing', 'Scheduled'], ['Status questions', 'Answered', true], ['Ambiguous items', 'Human review'], ['Advice', 'Qualified staff only']],
    faqs: [
      { q: 'Does it give financial advice?', a: 'No. Advice, suitability and regulated recommendations are entirely outside the configured scope and stay with your qualified staff.' },
      { q: 'What happens to documents it cannot read?', a: 'They are flagged for human review rather than processed on a guess. Review thresholds are set during configuration.' },
    ],
  },

  /* ── Automotive ──────────────────────────────────────────────────── */
  rental: {
    group: 'automotive',
    headline: ['Availability decides', 'the booking.'],
    lede: 'A rental enquiry has a short life. The customer is comparing two or three suppliers and usually books the first one that confirms a vehicle for their dates.',
    whoFor: 'Car rental operators handling booking enquiries, extensions and returns across phone and digital channels.',
    problems: [
      { title: 'Enquiries arrive faster than the desk can answer.', body: 'At peak, calls and messages stack up while the counter serves the person physically in front of it.' },
      { title: 'Extensions and changes interrupt everything.', body: 'A customer extending a rental takes the same attention as a new booking, and both are waiting.' },
      { title: 'Returning customers start from zero.', body: 'A repeat customer re-supplies details they have already given, because nothing connected the two rentals.' },
    ],
    journey: [
      { step: 'Capture the rental request', detail: 'Dates, vehicle class and pickup location are captured on whichever channel the enquiry arrived on.' },
      { step: 'Check what is available', detail: 'Availability is checked against the systems in scope and realistic options are offered.' },
      { step: 'Confirm the booking', detail: 'The reservation is created and confirmed, with the details written back to your system.' },
      { step: 'Handle changes and returns', detail: 'Extensions, changes and return reminders are coordinated instead of queuing behind new bookings.' },
    ],
    specialists: ['front-desk', 'booking', 'admin', 'outbound-followup'],
    boundary: 'Damage assessments, disputes, deposits and anything involving a charge go to your counter team. Payment details are never handled by a configured workflow.',
    signals: [['Peak-hour enquiries', 'Answered'], ['Availability checked', 'In your system', true], ['Extensions', 'Coordinated'], ['Disputes & damage', 'Counter team']],
    faqs: [
      { q: 'Can it take payment?', a: 'No. Payment and deposit handling stay with your existing process and your team. Nothing in the configured workflow touches payment details.' },
      { q: 'Does it know real availability?', a: 'It checks the systems connected during scoping. Which systems are supported is confirmed then; nothing is assumed on this page.' },
    ],
  },
  service: {
    group: 'automotive',
    headline: ['The workshop is full.', 'The phone still rings.'],
    lede: 'Service advisors cannot be on the phone and with a customer at the same time, so booking enquiries land in a voicemail box that gets cleared when there is a gap.',
    whoFor: 'Service centres and workshops coordinating bookings, updates and collection across a busy counter.',
    problems: [
      { title: 'Advisors are with customers, not the phone.', body: 'Every missed call is a booking that may go to the workshop down the road instead.' },
      { title: 'Status calls interrupt the work.', body: 'Customers ring to ask whether the car is ready, and answering takes an advisor off the job.' },
      { title: 'Service reminders never go out.', body: 'The next service is due and nobody contacts the customer, so the visit happens elsewhere or not at all.' },
    ],
    journey: [
      { step: 'Capture the service request', detail: 'What the vehicle needs and when the customer is available are captured without an advisor picking up.' },
      { step: 'Coordinate the slot', detail: 'A workshop slot of the right length is offered against your capacity rules and confirmed.' },
      { step: 'Share approved updates', detail: 'Status updates go out in wording you have approved, so customers stop needing to call.' },
      { step: 'Schedule the next service', detail: 'The next due date is captured and a reminder is scheduled rather than left to chance.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'outbound-followup'],
    boundary: 'Diagnosis, quotes, additional work and anything involving a vehicle assessment go to your service advisor. Nothing is approved on the customer behalf.',
    signals: [['Missed calls', 'Captured'], ['Workshop slots', 'Coordinated', true], ['Status updates', 'Approved wording'], ['Quotes & diagnosis', 'Service advisor']],
    faqs: [
      { q: 'Can it quote for repairs?', a: 'No. Diagnosis, additional work and pricing are your service advisor decisions. The workforce captures the request and books the slot.' },
      { q: 'Will customers know it is not a person?', a: 'Disclosure wording is part of your configuration and is yours to approve.' },
    ],
  },
  dealerships: {
    group: 'automotive',
    headline: ['A test drive is the', 'only real next step.'],
    lede: 'Vehicle enquiries convert when they become an appointment. Everything before that is a conversation that can stall on a missed reply.',
    whoFor: 'Dealerships coordinating sales enquiries, test drives and follow-up across showroom, phone and digital channels.',
    problems: [
      { title: 'Enquiries arrive when the showroom is closed.', body: 'Evening and weekend interest reaches the sales team a day or two later, if at all.' },
      { title: 'Sales and service do not share a customer.', body: 'Someone who serviced their car with you last month is treated as a stranger when they enquire about a new one.' },
      { title: 'Follow-up depends on the individual.', body: 'Some salespeople chase well. The pipeline reflects who does and who does not.' },
    ],
    journey: [
      { step: 'Capture vehicle interest', detail: 'Which model, which specification and what the customer is comparing are captured immediately.' },
      { step: 'Record customer preferences', detail: 'Budget, trade-in and timing are captured with your questions and written to the systems in scope.' },
      { step: 'Coordinate a test drive', detail: 'An appointment with an available salesperson is booked rather than promised.' },
      { step: 'Follow up with the sales team', detail: 'Scheduled follow-up happens consistently, and the salesperson arrives briefed.' },
    ],
    specialists: ['front-desk', 'booking', 'admin', 'outbound-followup'],
    boundary: 'Price, trade-in valuation, finance and anything contractual stay with your sales team. The workforce hands over a briefed, booked customer.',
    signals: [['Out-of-hours interest', 'Captured'], ['Test drives booked', 'In calendar', true], ['Returning customers', 'Recognised'], ['Price & finance', 'Sales team']],
    faqs: [
      { q: 'Will it discuss price or finance?', a: 'No. Pricing, trade-in valuations, finance and anything contractual go to your sales team.' },
      { q: 'Can it connect sales and service history?', a: 'Where those systems are connected during scoping, yes. Which systems are supported is confirmed then rather than assumed here.' },
    ],
  },
  /* ── Education & training ────────────────────────────────────────── */
  schools: {
    group: 'education',
    headline: ['Admissions is a season.', 'The phone is all year.'],
    lede: 'A family choosing a school asks the same twelve questions of four schools, in the evening, on whichever channel is closest to hand.',
    whoFor: 'Private schools and nurseries handling admissions enquiries, tours and the follow-up through a long decision.',
    problems: [
      { title: 'The enquiry arrives after hours.', body: 'Parents research once their own day is finished. An enquiry sent at nine at night is answered at nine the next morning, by which point three other schools have replied.' },
      { title: 'The same twelve questions.', body: 'Fees, curriculum, bus routes, uniform, term dates. All answerable from what you have already published, all currently answered one at a time by a person.' },
      { title: 'The decision takes six weeks.', body: 'Between the first enquiry and the offer there are a dozen small contacts, and nobody owns the thread from end to end.' },
    ],
    journey: [
      { step: 'Receive an admissions enquiry', detail: 'The enquiry is answered on the channel it arrived on, whatever the hour, and the child’s year group and start date are captured.' },
      { step: 'Answer the questions you have approved', detail: 'Fees, curriculum, term dates and admissions steps come from content your team has written and signed off. Nothing is improvised.' },
      { step: 'Coordinate a school tour', detail: 'An available tour slot is offered from your calendar and confirmed, with a reminder scheduled before the day.' },
      { step: 'Follow up until the family decides', detail: 'The follow-up sequence your admissions team approved continues on schedule, and stops the moment the family replies or enrols.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'outbound-followup'],
    boundary:
      'Admissions decisions, assessments, scholarship discussions, safeguarding and anything about an individual child go to your admissions team, never to the workforce.',
    signals: [
      ['Evening enquiries', 'Answered'],
      ['Enquiry to tour', 'Coordinated', true],
      ['Published questions', 'Answered from your content'],
      ['Follow-up through the decision', 'Owned'],
    ],
    faqs: [
      { q: 'Will it discuss fees?', a: 'Only the published fee schedule your team supplies, word for word. Anything about discounts, scholarships, sibling rates or a payment plan for a particular family is a conversation for your admissions team and transfers to them.' },
      { q: 'Can it decide whether to accept a child?', a: 'No. Admissions decisions, assessment outcomes and any judgement about a particular child are outside the configured scope entirely. The workforce captures the enquiry and books the steps; your team decides.' },
      { q: 'What happens with a safeguarding matter?', a: 'Anything that touches a child’s welfare stops immediately and goes to a named member of your staff with the full conversation attached. It is never answered, never triaged and never held in a queue.' },
    ],
  },
  training: {
    group: 'education',
    headline: ['The course starts Monday.', 'The enquiry came Friday.'],
    lede: 'Training enquiries have a deadline attached to them. The next intake either has a seat in it or the enquiry is worth nothing.',
    whoFor: 'Training institutes and professional development providers coordinating course enquiries, intakes and enrolment.',
    problems: [
      { title: 'Enquiries land between intakes.', body: 'Someone asks about a course that started last week. Without a fast answer about the next date, they book with whoever replies first.' },
      { title: 'The wrong course, explained slowly.', body: 'A caller describes what they want and the person answering has to work out which of forty programmes it maps to.' },
      { title: 'Enrolment stalls on paperwork.', body: 'The decision was made. The documents were not sent, nobody chased them, and the seat went unfilled.' },
    ],
    journey: [
      { step: 'Capture the course enquiry', detail: 'The enquiry is answered on arrival and what the learner actually wants is captured in your own words, not theirs.' },
      { step: 'Match it to the right programme', detail: 'The request is matched against your published course list, and anything ambiguous is flagged for an advisor rather than guessed.' },
      { step: 'Confirm the next intake date', detail: 'The next available intake is confirmed from your schedule, with the deadline for enrolment stated plainly.' },
      { step: 'Follow up on enrolment', detail: 'The document checklist your team approved is sent, and the follow-up continues until the paperwork arrives or the learner says no.' },
    ],
    specialists: ['front-desk', 'admin', 'booking', 'outbound-followup'],
    boundary:
      'Eligibility rulings, accreditation questions, fee negotiation and anything about a learner’s prior qualifications go to a course advisor.',
    signals: [
      ['Out-of-hours enquiries', 'Captured'],
      ['Matched to a programme', 'By your course list', true],
      ['Intake dates', 'Confirmed from your schedule'],
      ['Document chasing', 'Scheduled'],
    ],
    faqs: [
      { q: 'Can it tell someone whether they are eligible?', a: 'No. It states the published entry requirements and captures what the learner has. Any judgement about whether a particular qualification or experience counts goes to a course advisor.' },
      { q: 'Does it handle payment?', a: 'No. It can send the payment instructions your team has approved and tell a learner what the deadline is. It never takes card details, never processes a payment and never discusses a discount.' },
    ],
  },

  /* ── Home services ───────────────────────────────────────────────── */
  maintenance: {
    group: 'home-services',
    headline: ['The unit failed today.', 'Not next Tuesday.'],
    lede: 'A maintenance enquiry has a short life and a specific address. Whoever puts a technician in the diary first usually gets the job.',
    whoFor: 'Maintenance, HVAC, plumbing and electrical companies coordinating callouts across a field team.',
    problems: [
      { title: 'The phone rings while everyone is on site.', body: 'Your technicians are on jobs with their hands full, which is exactly the hour the calls come in.' },
      { title: 'A fault with no address.', body: 'A message describes a problem and leaves out the location, the access arrangement and a number anybody can call back.' },
      { title: 'Urgency judged by whoever answers.', body: 'A leak and a routine service sound similar on a busy line, and the order they get scheduled in depends on who picked up.' },
    ],
    journey: [
      { step: 'Capture the fault and the address', detail: 'The enquiry is answered on arrival, and the fault, the address, the access arrangement and a callback number are captured before anything else.' },
      { step: 'Check it against your urgency rules', detail: 'Anything matching the rules your team wrote for an emergency is flagged and routed to a person immediately instead of joining the booking queue.' },
      { step: 'Coordinate a technician slot', detail: 'An available window is offered from your schedule and held, with the job details attached so the technician arrives knowing what they are walking into.' },
      { step: 'Confirm and remind before the visit', detail: 'A confirmation goes out immediately and a reminder the day before, so fewer doors are locked when the van arrives.' },
    ],
    specialists: ['voice', 'front-desk', 'booking', 'outbound-followup'],
    boundary:
      'Diagnosis, pricing and any commitment about what a repair will cost or how long it will take go to your supervisor with the description and photographs attached.',
    signals: [
      ['After-hours callouts', 'Captured'],
      ['Enquiry to booked slot', 'Coordinated', true],
      ['Emergencies', 'Flagged by your rules'],
      ['Reminders before the visit', 'Scheduled'],
    ],
    faqs: [
      { q: 'Can it decide what is an emergency?', a: 'It applies the rules your team wrote, and it errs towards a person. A request that matches an emergency rule is flagged and put in front of somebody immediately; anything ambiguous is treated as urgent and escalated rather than booked.' },
      { q: 'Will it quote a price?', a: 'No. It can state a published callout fee if you supply one. What a repair will cost depends on what the technician finds, so every pricing question goes to your supervisor.' },
    ],
  },
  cleaning: {
    group: 'home-services',
    headline: ['A schedule only works', 'if it is true.'],
    lede: 'Recurring cleaning is a diary business. The cost is not winning the job, it is the changes, the reschedules and the cancellations nobody recorded.',
    whoFor: 'Cleaning and facilities companies coordinating one-off and recurring visits across a team.',
    problems: [
      { title: 'Changes arrive on every channel.', body: 'A customer reschedules by WhatsApp, cancels by phone and confirms by email, and only two of those reach the schedule.' },
      { title: 'Recurring visits drift.', body: 'A fortnightly slot moves once for a good reason and is never moved back, and nobody notices until the complaint.' },
      { title: 'The quote question stalls everything.', body: 'A request for a price on an unusual job sits unanswered because the person who can answer it is out on a site.' },
    ],
    journey: [
      { step: 'Take the booking request', detail: 'The request is answered on whichever channel it arrived on, and the property, the access and the contact are captured.' },
      { step: 'Confirm scope and frequency', detail: 'What is included and how often is confirmed against the service list your team publishes. Anything outside it is flagged for a person.' },
      { step: 'Schedule the visit', detail: 'A slot is held in your schedule, with the recurrence set up if it is a repeating booking, and a confirmation sent.' },
      { step: 'Handle changes and rebooking', detail: 'A reschedule or a cancellation is captured on any channel and applied to the same schedule, so there is one version of the diary.' },
    ],
    specialists: ['front-desk', 'booking', 'admin', 'outbound-followup'],
    boundary:
      'Pricing for anything outside your published service list, complaints and disputes over a completed visit go to your team.',
    signals: [
      ['Requests across channels', 'One schedule'],
      ['Recurring visits', 'Set up and tracked', true],
      ['Changes and cancellations', 'Applied'],
      ['Custom quotes', 'To your team'],
    ],
    faqs: [
      { q: 'Can it manage a recurring schedule?', a: 'It can set up and change recurring bookings inside the rules you configure, and record what changed and when. Your schedule remains the single source of truth; the workforce writes to it rather than keeping a list of its own.' },
      { q: 'What about a complaint over a finished visit?', a: 'It goes to your team immediately with the booking history attached. The workforce does not attempt to resolve, apologise for or explain away work that has already been done.' },
    ],
  },

  /* ── Retail & D2C ────────────────────────────────────────────────── */
  online: {
    group: 'retail',
    headline: ['A full basket', 'and one unanswered question.'],
    lede: 'The question asked before checkout is worth more than the one asked after it, and both arrive in the same queue.',
    whoFor: 'Online retailers and direct-to-consumer brands handling pre-purchase and post-purchase questions across several channels.',
    problems: [
      { title: 'The pre-purchase question waits.', body: 'Somebody with a full basket asks whether it will fit. An hour later the basket has gone and nobody knows it was a sale.' },
      { title: 'Where is my order, all day.', body: 'The same question on five channels, each answered separately by a person reading the same screen.' },
      { title: 'Every channel is somebody else’s job.', body: 'Instagram, WhatsApp, site chat and email each receive it, and there is no shared view of what has already been answered.' },
    ],
    journey: [
      { step: 'Receive the question on any channel', detail: 'The question is answered on the channel it arrived on, with the same information and the same tone on all of them.' },
      { step: 'Answer from approved product information', detail: 'Sizing, materials, delivery windows and returns policy come from content your team maintains. Nothing about a product is invented.' },
      { step: 'Check the order status', detail: 'Where your systems are connected, an order status question is answered from the order record rather than escalated to a person.' },
      { step: 'Escalate refunds and complaints', detail: 'Anything touching money or a genuine complaint stops and goes to your team with the order and the full conversation attached.' },
    ],
    specialists: ['front-desk', 'admin', 'social', 'outbound-followup'],
    boundary:
      'Refunds, goodwill gestures, complaints and anything touching a payment go to your team. The workforce never issues money.',
    signals: [
      ['Channels covered', 'Configured'],
      ['Pre-purchase questions', 'Answered first', true],
      ['Order status', 'From the order record'],
      ['Refunds and complaints', 'To your team'],
    ],
    faqs: [
      { q: 'Can it issue a refund?', a: 'No. It can explain your published returns policy and start the request, but issuing money, approving a goodwill gesture or making an exception is a decision for your team and transfers to them every time.' },
      { q: 'Will it invent product details?', a: 'It answers from the product information your team supplies and maintains. Where an answer is not in that content it says so and offers to put the customer in front of a person rather than guessing a measurement or a material.' },
    ],
  },
  stores: {
    group: 'retail',
    headline: ['Is it in stock?', 'is a buying signal.'],
    lede: 'Somebody asking whether you have it in your size, today, is further along than any web visitor. That question is worth an appointment.',
    whoFor: 'Showrooms, boutiques and store groups handling availability enquiries and in-store appointments.',
    problems: [
      { title: 'The availability call in the busy hour.', body: 'The question arrives when the floor is full, which is precisely when nobody can go and look.' },
      { title: 'A serious buyer treated as a browser.', body: 'Someone asking about a specific item in a specific size is ready. Without a next step they leave with nothing booked.' },
      { title: 'No record that they asked.', body: 'The call ends, the item comes back in stock a week later, and there is no list of who wanted it.' },
    ],
    journey: [
      { step: 'Capture the enquiry', detail: 'The question is answered on arrival and the item, the variant and the store they mean are captured.' },
      { step: 'Confirm availability from your data', detail: 'Where your stock data is connected, availability is answered from it. Where it is not, the request is routed to the store rather than guessed.' },
      { step: 'Book a store appointment', detail: 'An appointment is offered from the store diary, so a serious buyer arrives expected rather than hoping.' },
      { step: 'Follow up after the visit', detail: 'An approved follow-up goes out after the appointment, and pauses the moment the customer replies.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'outbound-followup'],
    boundary:
      'Prices outside your published list, reservations that hold stock, discounts and complaints go to the store team.',
    signals: [
      ['Availability enquiries', 'Captured'],
      ['Enquiry to store appointment', 'Coordinated', true],
      ['Back-in-stock requests', 'Recorded'],
      ['Discounts and holds', 'To the store team'],
    ],
    faqs: [
      { q: 'Does it know what is in stock?', a: 'Only where your stock system is connected during configuration. Where it is not, it captures the request and routes it to the store rather than guessing, because a wrong availability answer costs you the visit.' },
      { q: 'Can it hold an item?', a: 'Holding stock is a commercial decision with a cost attached, so it goes to your store team. The workforce captures the request and puts it in front of somebody who can decide.' },
    ],
  },
  /* ── Professional services ───────────────────────────────────────── */
  legal: {
    group: 'professional-services',
    headline: ['Every enquiry looks urgent.', 'Few of them are instructions.'],
    lede: 'A firm cannot take an instruction from an enquiry it has not qualified or conflict-checked, and a partner is the most expensive person available to find that out.',
    whoFor: 'Law firms and legal practices where intake arrives by phone, web form and referral, and a fee earner is currently the first responder.',
    problems: [
      { title: 'The partner answers the intake call.', body: 'The enquiry that turns out to have no matter, no budget and no jurisdiction still took twenty minutes of the most expensive hour in the building.' },
      { title: 'Conflict checks start too late.', body: 'The names needed to run a check sit in an inbox until someone opens it, so the clock on a time-sensitive matter starts late.' },
      { title: 'The prospect instructs whoever replied.', body: 'Someone contacting three firms about the same matter usually instructs the one that came back the same day.' },
    ],
    journey: [
      { step: 'Capture the enquiry', detail: 'The enquiry is answered on the channel it arrived on and the parties, the matter type and the timeline are captured using your own intake questions.' },
      { step: 'Gather what a check needs', detail: 'The names and entities your conflict process requires are collected up front, so the check can be run by your team without a second round of emails.' },
      { step: 'Coordinate the consultation', detail: 'Where the enquiry matches your criteria, an available slot with the right fee earner is offered and written to the diary.' },
      { step: 'Keep the file moving', detail: 'Outstanding documents and identity requirements are chased on a schedule, and the chase stops the moment they arrive or your team takes ownership.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'admin'],
    boundary: 'Legal advice, scope, fees, conflict decisions and anything privileged go to your qualified people. The workforce captures the enquiry and never answers it.',
    signals: [['Intake enquiries', 'Captured'], ['Qualified before a call', 'By your criteria', true], ['Consultations coordinated', 'In the diary'], ['Advice and conflicts', 'To your team']],
    faqs: [
      { q: 'Will it give legal advice?', a: 'No, and it is configured so it cannot. It captures the enquiry against the questions your firm has approved and hands it to a qualified person. Any question touching advice, merits or fees transfers with the full conversation attached.' },
      { q: 'Can it run our conflict check?', a: 'It collects the information your check needs and presents it to your team. The check itself, and the decision that follows it, stays with the people responsible for it.' },
    ],
  },

  accounting: {
    group: 'professional-services',
    headline: ['The deadline is fixed.', 'The documents are not.'],
    lede: 'Most of what stands between a client and a filed return is a document nobody has chased yet, and the chasing repeats every quarter.',
    whoFor: 'Accountancy practices, audit firms and tax advisers whose calendar is driven by filing deadlines and client paperwork.',
    problems: [
      { title: 'The same chase, every quarter.', body: 'The list of clients who have not sent their records is rebuilt by hand each period, usually by the person who can least afford the time.' },
      { title: 'One missing page holds a return.', body: 'A file sits complete except for a single statement, and it waits because chasing it is nobody’s named job.' },
      { title: 'Deadline week answers routine questions.', body: 'The week with the least capacity receives the most calls asking what is needed and when it is due.' },
    ],
    journey: [
      { step: 'Capture the enquiry or request', detail: 'New enquiries and existing client questions are answered from the information your practice has approved, on the channel they arrived on.' },
      { step: 'Send the checklist', detail: 'The document list for the service and the period is sent, so the client knows exactly what is outstanding rather than what is missing in general.' },
      { step: 'Chase what is outstanding', detail: 'Follow-ups run on a schedule you set against the deadline, and stop the moment the documents arrive or a member of staff takes the file over.' },
      { step: 'Hand the file to a person', detail: 'Once the records are in, the file reaches the accountant with the conversation, the checklist and what is still missing attached.' },
    ],
    specialists: ['front-desk', 'admin', 'outbound-followup', 'booking'],
    boundary: 'Tax positions, accounting treatment, audit judgements and anything a client will act on go to your qualified accountants. The workforce coordinates the paperwork around them.',
    signals: [['Client document requests', 'Sent'], ['Outstanding items', 'Chased on schedule', true], ['Deadline questions', 'Answered from your content'], ['Advice and treatment', 'To your accountants']],
    faqs: [
      { q: 'Will it answer a tax question?', a: 'No. It answers process questions your practice has published, such as what a service requires and when a deadline falls. Anything about a client position or a treatment goes to a qualified accountant.' },
      { q: 'Does the chasing stop when we take over?', a: 'Yes. A follow-up sequence stops when the documents arrive, when the client asks it to, or when a member of your team takes ownership of the file.' },
    ],
  },

  recruitment: {
    group: 'professional-services',
    headline: ['Candidates and clients', 'want the same hour.'],
    lede: 'A consultant is the only person who can place a role, and the same consultant is answering the application questions that stop them doing it.',
    whoFor: 'Recruitment and staffing agencies handling candidate applications and client briefs through the same small team.',
    problems: [
      { title: 'Candidate questions fill the consultant’s day.', body: 'Status, process and role questions arrive in volume, and each one interrupts the search work that actually earns the fee.' },
      { title: 'The client brief arrives incomplete.', body: 'A role comes in without the seniority, the range or the timeline, and the first search runs against a guess.' },
      { title: 'Good candidates go quiet.', body: 'The candidate who was not contacted this week is interviewing somewhere else next week.' },
    ],
    journey: [
      { step: 'Answer the enquiry', detail: 'Candidate and client enquiries are answered on the channel they arrived on, using the information your agency has approved.' },
      { step: 'Capture the brief', detail: 'Role, seniority, timeline and the other details your consultants need are captured through your own questions before a search begins.' },
      { step: 'Coordinate the conversation', detail: 'Screening calls and client meetings are offered against real availability and written to the consultant’s diary.' },
      { step: 'Keep candidates warm', detail: 'Scheduled follow-ups keep active candidates in contact, and stop when they withdraw, are placed, or a consultant takes over.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'outbound-followup'],
    boundary: 'Suitability, shortlisting, salary negotiation and every placement decision stay with your consultants. The workforce keeps the conversation moving between them.',
    signals: [['Candidate enquiries', 'Answered'], ['Client briefs captured', 'To your questions', true], ['Screening calls', 'In the diary'], ['Shortlisting and offers', 'To your consultants']],
    faqs: [
      { q: 'Will it screen candidates?', a: 'No. It captures the information your consultants asked for and presents it. Judging whether someone is right for a role is a consultant decision and stays that way.' },
      { q: 'Can it talk to clients as well as candidates?', a: 'Both, within the scope you configure. What it is permitted to say to each is set during scoping rather than assumed here.' },
    ],
  },

  strategy: {
    group: 'professional-services',
    headline: ['The scoping call', 'decides whether it was worth it.'],
    lede: 'A consultancy finds out whether an enquiry had a budget, a timeline and a decision-maker by spending an hour asking, and that hour is the product.',
    whoFor: 'Management, strategy and specialist business consultancies where inbound enquiries are qualified by the people who deliver the work.',
    problems: [
      { title: 'Scoping is done by the deliverer.', body: 'The consultant who should be on billable work is the one establishing whether there was any work to bill.' },
      { title: 'The enquiry with no decision-maker.', body: 'Three conversations in, it becomes clear the person asking cannot authorise anything, and the time is already spent.' },
      { title: 'Proposals built on a sentence.', body: 'A brief with no scope produces a proposal that guesses, and a guess is rewritten at least once.' },
    ],
    journey: [
      { step: 'Capture the enquiry', detail: 'The enquiry is answered promptly and the problem, the organisation and the context are captured in the client’s own words.' },
      { step: 'Qualify against your criteria', detail: 'Budget range, timeline and decision-maker are asked using the questions your firm uses, before any consultant time is committed.' },
      { step: 'Coordinate the scoping call', detail: 'Where it qualifies, a call is offered against real availability and the consultant arrives with the brief already attached.' },
      { step: 'Follow up on what is open', detail: 'Outstanding information and the second contact are scheduled and owned rather than left to whoever remembers.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'admin'],
    boundary: 'Advice, scope, methodology and fees go to your consultants. The workforce establishes whether a conversation is worth having and never has it.',
    signals: [['Inbound enquiries', 'Captured'], ['Qualified before a call', 'By your criteria', true], ['Scoping calls', 'Coordinated'], ['Scope and fees', 'To your consultants']],
    faqs: [
      { q: 'Will it quote for a piece of work?', a: 'No. Fees, scope and anything a client would rely on go to your consultants. The workforce captures what is needed for that conversation to be a short one.' },
      { q: 'Can we change the qualifying questions?', a: 'Yes. The criteria are yours and are configured during setup. They are the questions your own team would ask, asked consistently and every time.' },
    ],
  },

  agencies: {
    group: 'professional-services',
    headline: ['The brief arrives.', 'The budget does not.'],
    lede: 'Agency new business runs on inbound briefs, and most of them have no budget, no timeline and no decision-maker attached until somebody asks.',
    whoFor: 'Marketing, digital, creative and PR agencies handling inbound briefs, referrals and new business enquiries.',
    problems: [
      { title: 'Pitching before qualifying.', body: 'A team builds thinking for a brief that was never funded, because the enquiry looked serious and nobody had time to check.' },
      { title: 'The enquiry that arrives on five channels.', body: 'A form, an inbox, a direct message and a phone call reach different people, and the agency answers the same prospect three times.' },
      { title: 'Client requests arrive as urgent.', body: 'Live account requests interrupt new business work, and new business interrupts delivery, all day.' },
    ],
    journey: [
      { step: 'Answer the brief', detail: 'Inbound briefs are acknowledged quickly on whichever channel they arrived on, so the agency is the one that replied first.' },
      { step: 'Qualify the opportunity', detail: 'Budget range, timeline, decision-maker and scope are captured using the questions your new business team already asks.' },
      { step: 'Coordinate the chemistry call', detail: 'Where it qualifies, a call is offered against real availability and the brief travels with it.' },
      { step: 'Keep the pipeline warm', detail: 'Follow-ups on open briefs are scheduled and owned, and stop when the prospect responds or your team takes over.' },
    ],
    specialists: ['front-desk', 'website', 'booking', 'outbound-followup'],
    boundary: 'Creative direction, strategy, costs and anything contractual stay with your team. The workforce makes sure the brief is worth their attention before it reaches them.',
    signals: [['Inbound briefs', 'Acknowledged'], ['Budget and timeline', 'Captured up front', true], ['Chemistry calls', 'Coordinated'], ['Strategy and costs', 'To your team']],
    faqs: [
      { q: 'Will it respond to a creative brief?', a: 'It acknowledges the brief and captures what your team needs to judge it. Any thinking, recommendation or cost is your agency’s work and is never produced by the workforce.' },
      { q: 'Can it handle live client requests too?', a: 'Within the scope you configure. Which accounts, channels and request types are in scope is confirmed during scoping.' },
    ],
  },

  /* ── Hospitality ─────────────────────────────────────────────────── */
  hotels: {
    group: 'hospitality',
    headline: ['The direct booking', 'was worth answering.'],
    lede: 'A guest asking about availability directly is the most valuable enquiry a property receives, and it is lost the same way every time: the desk was busy.',
    whoFor: 'Hotels and resorts taking direct enquiries by phone, website and message alongside channel bookings.',
    problems: [
      { title: 'The direct enquiry goes to a channel.', body: 'A guest who called and got voicemail books through an aggregator instead, and the property pays a commission for a booking it nearly had for nothing.' },
      { title: 'The desk is busiest when the phone is.', body: 'Check-in, check-out and the dinner rush are also when availability questions arrive, and the guest standing in front of you comes first.' },
      { title: 'Long-lead enquiries cross time zones.', body: 'Questions about dates, packages and transfers arrive from everywhere, mostly when the desk is closed.' },
    ],
    journey: [
      { step: 'Answer the enquiry', detail: 'Availability, package and facility questions are answered from the information your property has published, at any hour.' },
      { step: 'Capture what the stay needs', detail: 'Dates, party size, room preference and any requirement are captured so the booking conversation starts complete.' },
      { step: 'Coordinate the reservation', detail: 'The request is written to your connected reservation system, or handed to the desk with everything attached where a person is required.' },
      { step: 'Follow up before arrival', detail: 'Approved pre-arrival contact is scheduled, and stops when the guest replies or your team takes it on.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'outbound-followup'],
    boundary: 'Rate negotiation, upgrades, comps and any service recovery go to your duty manager with the booking and the conversation attached.',
    signals: [['Out-of-hours enquiries', 'Answered'], ['Direct booking questions', 'Handled', true], ['Reservations and changes', 'Coordinated'], ['Rates and recovery', 'To your manager']],
    faqs: [
      { q: 'Will it quote a rate?', a: 'It can share the rates you have published. Anything outside your published list, including negotiation, upgrades and goodwill, goes to your duty manager.' },
      { q: 'Does it write to our reservation system?', a: 'Where that system is supported and connected during scoping. Which systems are supported is confirmed then rather than assumed here.' },
    ],
  },

  apartments: {
    group: 'hospitality',
    headline: ['An extended stay', 'is a different question.'],
    lede: 'Someone booking three months asks about terms, bills and what is included before they ask about a date, and none of that is answered by a room rate.',
    whoFor: 'Serviced apartment operators and extended-stay providers handling longer bookings, corporate accounts and relocation enquiries.',
    problems: [
      { title: 'The first question is terms, not dates.', body: 'Minimum stay, what is included, deposits and notice all come before availability, and each one needs the same answer every time.' },
      { title: 'Corporate enquiries need a person eventually.', body: 'A relocation or corporate account is a real conversation, but it is currently queued behind the routine questions in front of it.' },
      { title: 'Viewings and handovers go uncoordinated.', body: 'Arranging access around a resident, a cleaner and a prospective guest takes several messages that nobody owns.' },
    ],
    journey: [
      { step: 'Answer the stay question', detail: 'Minimum terms, inclusions, facilities and policies are answered from the content your operation has approved.' },
      { step: 'Capture the requirement', detail: 'Length of stay, party, budget range and whether it is corporate or private are captured before anyone is involved.' },
      { step: 'Coordinate access or a call', detail: 'A viewing or a conversation is offered against real availability and written to the right calendar.' },
      { step: 'Follow through on the open items', detail: 'Outstanding documents and the next contact are scheduled and owned until your team picks them up.' },
    ],
    specialists: ['front-desk', 'booking', 'admin', 'outbound-followup'],
    boundary: 'Contract terms, rates outside your published list, deposits and anything about an individual tenancy go to your team.',
    signals: [['Terms and inclusions', 'Answered'], ['Stay requirements captured', 'Before a call', true], ['Viewings coordinated', 'In calendar'], ['Contracts and deposits', 'To your team']],
    faqs: [
      { q: 'Can it agree a long-stay rate?', a: 'No. It shares what you have published and captures the requirement. Any negotiated rate or term is agreed by your team.' },
      { q: 'Will it handle corporate accounts?', a: 'It captures and routes them. What an account holder is told and what reaches a person is configured during scoping.' },
    ],
  },

  venues: {
    group: 'hospitality',
    headline: ['One enquiry.', 'A dozen questions.'],
    lede: 'A large party or an event is decided over several exchanges and usually a site visit, and it starts with a call arriving at the busiest hour of service.',
    whoFor: 'Restaurants, restaurant groups, event spaces and banquet venues handling reservations, large parties and event enquiries.',
    problems: [
      { title: 'The reservation call during service.', body: 'The floor is full and the phone is ringing, and the booking that was worth taking goes to voicemail.' },
      { title: 'Large parties need answers first.', body: 'Minimums, menus, private areas and timings all come before a date is agreed, and each one repeats.' },
      { title: 'The site visit that never got booked.', body: 'An event enquiry that needed a walkthrough drifts because arranging it took more messages than anyone had time for.' },
    ],
    journey: [
      { step: 'Take the enquiry', detail: 'Reservation and event enquiries are answered on the channel they arrived on, at any hour, from your published information.' },
      { step: 'Answer the standing questions', detail: 'Menus, minimum spends, private spaces and timings are answered from the content you have approved.' },
      { step: 'Coordinate the booking or visit', detail: 'A table, a party slot or a site visit is offered against real availability and written to your system or your diary.' },
      { step: 'Confirm and follow up', detail: 'Approved confirmations and reminders are scheduled, and stop when the guest replies or a manager takes over.' },
    ],
    specialists: ['front-desk', 'voice', 'booking', 'social'],
    boundary: 'Bespoke pricing, menu changes, comps and any complaint go to your manager with the booking and the conversation attached.',
    signals: [['Enquiries during service', 'Answered'], ['Large party questions', 'Handled', true], ['Bookings and site visits', 'Coordinated'], ['Pricing and complaints', 'To your manager']],
    faqs: [
      { q: 'Will it agree a price for an event?', a: 'No. It answers from your published minimums and packages, and anything bespoke goes to your manager.' },
      { q: 'Can it take bookings during service?', a: 'That is the point of it. Enquiries are answered and coordinated while the floor is busy, and anything needing a person is flagged rather than guessed at.' },
    ],
  },

  /* ── Travel & tourism ────────────────────────────────────────────── */
  agents: {
    group: 'travel',
    headline: ['Planned from everywhere.', 'Answered from one desk.'],
    lede: 'Travel is researched at every hour from every time zone, and most of what arrives is the same set of questions asked before there is a booking worth a consultant.',
    whoFor: 'Travel agencies and tour operators handling itinerary, availability and package enquiries across channels and time zones.',
    problems: [
      { title: 'The enquiry lands while you are closed.', body: 'A traveller planning from another time zone sends a question at 3am and books with whoever answered by morning.' },
      { title: 'The same itinerary questions repeat.', body: 'Inclusions, transfers, visa requirements and change policies are asked constantly and answered individually.' },
      { title: 'The quote that was never chased.', body: 'An itinerary goes out and nobody follows it up, and the traveller books the version somebody else followed up.' },
    ],
    journey: [
      { step: 'Answer the enquiry', detail: 'Destination, package and policy questions are answered from the content your agency has approved, at any hour.' },
      { step: 'Capture the trip', detail: 'Dates, party, budget range and preferences are captured so a consultant opens a brief rather than a blank page.' },
      { step: 'Coordinate the consultation', detail: 'Where it needs a person, a call is offered against real availability with the requirement already attached.' },
      { step: 'Follow up on the itinerary', detail: 'Open quotes and outstanding decisions are chased on a schedule, and stop when the traveller responds or a consultant takes over.' },
    ],
    specialists: ['front-desk', 'voice', 'admin', 'outbound-followup'],
    boundary: 'Pricing outside your published packages, supplier negotiation and any advice on a specific booking stay with your consultants.',
    signals: [['Enquiries across time zones', 'Answered'], ['Published information', 'From your content', true], ['Consultations coordinated', 'In the diary'], ['Quotes and advice', 'To your consultants']],
    faqs: [
      { q: 'Will it price an itinerary?', a: 'It shares the packages and prices you have published. Anything built for a specific traveller is quoted by your consultants.' },
      { q: 'Can it answer visa questions?', a: 'It can share published requirements. Eligibility for a specific person is not a question it answers, and it transfers to your team.' },
    ],
  },

  visas: {
    group: 'travel',
    headline: ['Published on your site.', 'Still asked all day.'],
    lede: 'Requirements, processing times and document lists are already written down, and a consultant answering them one enquiry at a time is the most expensive way to do it.',
    whoFor: 'Visa, immigration and document services handling high volumes of eligibility and paperwork questions before any real case exists.',
    problems: [
      { title: 'The question your website already answers.', body: 'Requirements and processing times are published and still arrive by phone and message every day.' },
      { title: 'Cases stall on one document.', body: 'A file waits a week for a single page because chasing it was nobody’s named job.' },
      { title: 'Consultants answer before they advise.', body: 'Licensed people spend the day on general questions instead of the applications that need their judgement.' },
    ],
    journey: [
      { step: 'Answer the standing question', detail: 'Published requirements, document lists and processing times are answered from your own approved content, at any hour.' },
      { step: 'Send the checklist', detail: 'The document list for the route the enquirer described is sent, so they know exactly what is outstanding.' },
      { step: 'Chase what is missing', detail: 'Outstanding documents are followed up on a schedule, and the chase stops when they arrive or a consultant takes the file.' },
      { step: 'Hand the case over', detail: 'Anything touching eligibility or a specific application reaches your licensed team with the full conversation attached.' },
    ],
    specialists: ['front-desk', 'admin', 'outbound-followup', 'website'],
    boundary: 'Eligibility decisions, immigration advice and anything about a specific application go to your licensed consultants, never to the workforce.',
    signals: [['Published requirements', 'Answered'], ['Document checklists', 'Sent and chased', true], ['Cases moving', 'Without a chaser'], ['Eligibility and advice', 'To your licensed team']],
    faqs: [
      { q: 'Will it tell someone whether they qualify?', a: 'No, and it is configured so it cannot. It shares published criteria and captures the enquiry. Any judgement about a person or an application goes to your licensed consultants.' },
      { q: 'Does it replace our consultants?', a: 'No. It removes the repeated questions that arrive before a case exists, so your consultants reach the real cases sooner.' },
    ],
  },
};

export const segmentIds = Object.keys(segmentDetails);
