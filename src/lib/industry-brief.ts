/**
 * Content 2.0 (2026-10-18): the revised brief's copy for each of the ten
 * industries, so the hub, the overview pages and the segment pages say what
 * the homepage card says.
 *
 *  - card:  the homepage card headline
 *  - lede:  what Stella does in this sector (the brief's body)
 *  - keep:  what stays with your people (the brief's boundary)
 *  - aim:   the brief's target outcome, written as an aim, never a result
 */
export type IndustryBrief = { card: string; lede: string; keep: string; aim: string };

export const industryBrief: Record<string, IndustryBrief> = {
  healthcare: {
    card: 'Give every patient enquiry a clear next step.',
    lede: 'Whether a patient messages after hours or calls between appointments, Stella can help answer approved practice questions, capture the enquiry and connect the patient to supported booking workflows.',
    keep: 'Your clinicians and staff handle medical advice, triage and sensitive decisions.',
    aim: 'Fewer unattended routine enquiries and a clearer booking journey.',
  },
  automotive: {
    card: 'From the first vehicle enquiry to the appointment.',
    lede: 'Keep test-drive, service and sales enquiries moving with approved lead qualification, callbacks and supported appointment bookings.',
    keep: 'Negotiation, valuation, contracts and finance decisions stay with authorised dealership staff.',
    aim: 'More consistent lead follow-up and service scheduling.',
  },
  'real-estate': {
    card: 'Reply to the property enquiry while interest is high.',
    lede: 'Stella can help capture property preferences, respond to approved listing questions, propose suitable viewing times and prepare a well-briefed handoff to the agent.',
    keep: 'Your agents remain responsible for negotiations, suitability and contractual advice.',
    aim: 'Faster enquiry handling and a more reliable route to viewing requests.',
  },
  hospitality: {
    card: 'Answer the booking question before the guest moves on.',
    lede: 'Handle routine questions about rooms, amenities, check-in and supported availability, so guests find the next step without staff stepping away from the guests already on site.',
    keep: 'Exceptions and special requests are routed to your reservations team.',
    aim: 'Better booking enquiry coverage and clearer staff escalation.',
  },
  education: {
    card: 'Make it easier to ask, enquire and visit.',
    lede: 'Capture course and admissions questions when learners or parents send them, share approved programme information and help arrange campus visits or counselling sessions through supported scheduling.',
    keep: 'Admissions decisions and sensitive student or family matters stay with your team.',
    aim: 'Clearer admissions follow-up and fewer enquiries waiting for a weekday reply.',
  },
  'financial-services': {
    card: 'Route routine requests. Protect expert time.',
    lede: 'Respond to general service questions, capture enquiry details and direct relevant cases to licensed or authorised people.',
    keep: 'Financial recommendations, eligibility decisions, sensitive account matters and regulated advice remain under human control.',
    aim: 'More consistent triage and better-prepared specialist handoffs.',
  },
  'home-services': {
    card: 'Connect a service enquiry to the right booking.',
    lede: 'Help customers describe the job, request available appointments and receive approved visit reminders.',
    keep: 'Site-specific quotations, safety assessments and changes outside policy are passed to your service team.',
    aim: 'Fewer service requests lost between the first call and the confirmed visit.',
  },
  travel: {
    card: 'Keep enquiries moving across time zones.',
    lede: 'Capture travel preferences, answer approved package and itinerary questions, support request routing and send booking reminders where connected.',
    keep: 'Visa eligibility, border rules and complex exceptions are reviewed by qualified staff.',
    aim: 'More reliable enquiry coverage and less repetitive coordination.',
  },
  'professional-services': {
    card: 'Let useful enquiries reach the right expert.',
    lede: 'Ask the right intake questions, collect approved background details and make it easier to schedule a consultation.',
    keep: 'Professionals retain responsibility for advice, confidentiality and final client acceptance.',
    aim: 'Higher-quality intake and less routine administrative work for fee earners.',
  },
  retail: {
    card: 'Answer the question that stands between browsing and buying.',
    lede: 'Handle supported pre-purchase questions, order-status requests and approved customer follow-up across connected channels.',
    keep: 'Your team handles exceptions such as refunds, disputes and sensitive payment matters.',
    aim: 'More consistent customer responses and smoother order enquiries.',
  },
};
