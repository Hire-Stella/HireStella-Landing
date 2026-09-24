/**
 * One set per sector, placed after the reading room.
 *
 * These are objections, not features. The question a dental clinic raises is
 * not the one a recruitment agency raises, so nothing here is shared between
 * sectors. Every answer stays inside the actual service boundary: the
 * workforce coordinates, people decide, and nothing claims a measured result.
 *
 * Rendered visibly and as FAQPage JSON-LD, so each set works twice.
 */
export const SECTOR_FAQS: Record<string, { q: string; a: string }[]> = {
  healthcare: [
    {
      q: 'Will it give medical advice to a patient?',
      a: 'No, and it is configured so it cannot. It answers the questions your clinic has approved in writing (opening hours, what a service involves, what to bring), and anything clinical transfers to your team with the full conversation attached. A clinician makes every clinical judgement.',
    },
    {
      q: 'What happens with patient data?',
      a: 'Scope, retention and which systems are connected are agreed during discovery and configured per deployment, not assumed. The workforce only reaches the systems you connect it to, and only performs the actions you have approved.',
    },
    {
      q: 'Our reception team is good. Why would we need this?',
      a: 'The point is not to replace them. It is the calls arriving while they are already with a patient, the enquiry that came in at nine at night, and the recall nobody owns. That is the work this covers, so your reception team keeps the patient in front of them.',
    },
  ],

  automotive: [
    {
      q: 'Can it quote a price or a trade-in value?',
      a: 'No. Anything involving a valuation, a discount or a repair estimate goes to your advisor, because it depends on a vehicle nobody has inspected yet. The workforce captures the enquiry, the vehicle details and the photographs so your advisor opens it already briefed.',
    },
    {
      q: 'Will it book into our existing DMS or workshop diary?',
      a: 'Where that system is supported and connected during configuration, yes. Where it is not, it captures the request and routes it to the team rather than guessing at availability, because a booking your diary does not know about is worse than no booking.',
    },
    {
      q: 'We already miss calls at the busiest times. Does this just add another channel?',
      a: 'It is the opposite: it answers the channels you already have when nobody is free. Rental, workshop and sales enquiries arrive in one place, and a returning customer is recognised rather than starting again.',
    },
  ],

  'real-estate': [
    {
      q: 'Will it negotiate or discuss price with a buyer?',
      a: 'Never. Price, terms and anything contractual go straight to your agent with the conversation attached. The workforce qualifies the requirement and coordinates the viewing, which is the part that is usually lost to a slow reply.',
    },
    {
      q: 'Portal leads are the problem. Can it answer those?',
      a: 'That is the case it was built for. Portal and website enquiries arriving after hours are answered on arrival, the requirement is captured, and a viewing is held against your diary before the buyer books with whoever replied first.',
    },
    {
      q: 'How does an agent know what was said before they call?',
      a: 'The full conversation, the captured requirement and the viewing details are attached to the handoff. The agent opens it briefed rather than starting the qualifying call again.',
    },
  ],

  hospitality: [
    {
      q: 'Will it undercut our rates or give away upgrades?',
      a: 'No. It quotes only the published rates you supply. Any request for a discount, an upgrade or a goodwill gesture is a commercial decision and goes to your duty manager.',
    },
    {
      q: 'Does this compete with our booking channels?',
      a: 'It works in favour of the direct one. A direct enquiry answered while the guest is still deciding is a booking you keep the margin on, and those are the enquiries that currently arrive when the desk is busiest.',
    },
    {
      q: 'What happens if a guest complains?',
      a: 'It stops. A complaint about a stay is never answered by the workforce; it reaches your duty manager immediately with the booking history attached, because service recovery is a person’s job.',
    },
  ],

  education: [
    {
      q: 'Can it decide whether to accept a child or a student?',
      a: 'No. Admissions decisions, assessments and any judgement about an individual applicant are outside the configured scope entirely. The workforce answers published questions, books tours and keeps the follow-up moving; your admissions team decides.',
    },
    {
      q: 'What about a safeguarding matter?',
      a: 'Anything touching a child’s welfare stops immediately and goes to a named member of your staff with the full conversation attached. It is never answered, never triaged and never left in a queue.',
    },
    {
      q: 'Will it talk about fees?',
      a: 'It quotes the published fee schedule your team supplies, word for word. Scholarships, sibling rates, payment plans and anything specific to one family are conversations for your admissions team.',
    },
  ],

  'financial-services': [
    {
      q: 'Can it give financial or regulated advice?',
      a: 'No, and that boundary is the design. Anything advisory, regulated or account-sensitive transfers to authorised staff. The workforce answers published process questions and captures what the case needs, so your people reach the real work sooner.',
    },
    {
      q: 'Will it access customer accounts?',
      a: 'Only where a system is connected during configuration and only for the actions you approve, typically a status lookup. It does not authenticate a customer, does not move money, and does not read out account data it has not been permitted to.',
    },
    {
      q: 'Most of our volume is document chasing. Does that help?',
      a: 'That is one of the clearest cases. The approved checklist goes out, the follow-up runs on schedule, and it stops the moment the documents arrive, which is the work that currently decides whether a case completes on time.',
    },
  ],

  'home-services': [
    {
      q: 'Can it tell a customer what a repair will cost?',
      a: 'No. What a job costs depends on what the technician finds, so every pricing question goes to your supervisor with the description and photographs attached. It can state a published callout fee if you supply one.',
    },
    {
      q: 'How does it know what counts as an emergency?',
      a: 'It applies the rules your team writes, and it errs towards a person. Anything matching an emergency rule is flagged and put in front of dispatch immediately, and anything ambiguous is escalated rather than quietly booked into next week.',
    },
    {
      q: 'Will it double-book my technicians?',
      a: 'It books against your schedule rather than keeping a list of its own, so the diary stays the single source of truth. Where a schedule is not connected, it captures the request and routes it instead of promising a slot.',
    },
  ],

  travel: [
    {
      q: 'Can it tell someone whether they will get a visa?',
      a: 'No. Eligibility is a judgement for your licensed consultants and nothing here rules a case in or out. It states the published requirements, captures the applicant’s situation and books the consultation.',
    },
    {
      q: 'Our enquiries come from every time zone. Does that matter?',
      a: 'That is the reason it helps. The published requirements answer most of what arrives, at whatever hour it arrives, so a consultant’s day starts with the cases that actually needed one.',
    },
    {
      q: 'What happens to a refused application?',
      a: 'It goes straight to your consultants with the history attached. A refusal is a case matter and the workforce does not attempt to explain, reassure or advise on it.',
    },
  ],

  'professional-services': [
    {
      q: 'Will it give advice or quote a fee?',
      a: 'Neither. Advice, scope, fees and anything privileged go to your qualified people. The workforce asks the qualifying questions you define (budget, timeline, decision-maker), so a fee earner opens an enquiry already worth their time.',
    },
    {
      q: 'How does it handle a possible conflict?',
      a: 'It stops and escalates before any substantive reply is sent. A possible conflict is put in front of a partner with what has been captured, and nothing is answered in the meantime.',
    },
    {
      q: 'We are not a volume business. Is this for us?',
      a: 'The case is not volume, it is what an hour costs. If a consultant is spending afternoons finding out an enquiry had no budget, that is the most expensive way to qualify. Speed helps too: the firm that replies the same day usually gets the meeting.',
    },
  ],

  retail: [
    {
      q: 'Can it issue a refund or approve a return?',
      a: 'No. It explains your published returns policy and can start the request, but issuing money, approving a goodwill gesture or making an exception is a decision for your team every time.',
    },
    {
      q: 'Will it invent product details?',
      a: 'It answers from the product information your team maintains. Where an answer is not in that content it says so and offers a person, rather than guessing a measurement, a material or a delivery date.',
    },
    {
      q: 'Where does it actually make a difference?',
      a: 'The question asked with a full basket open. Sizing, fit and delivery questions decide whether that order happens, and right now they queue behind where-is-my-order on the same channels.',
    },
  ],
};
