import { healthcareSource } from './industry-content';

export const blogPosts = [
  {
    slug: 'dental-enquiry-to-appointment',
    category: 'Dental',
    industry: 'clinics',
    title: 'From a missed dental call to a clear next appointment',
    seoTitle: 'Missed Dental Call to Booked Appointment',
    summary:
      'A practical workflow for capturing enquiries, coordinating bookings and keeping clinical questions with your team.',
    readTime: '4 min read',
    cover: '/visuals/photo/healthcare-dental.webp',
    date: '2026-09-10',
    link: '/industries/healthcare/dental',
    sections: [
      {
        title: 'Start with the moment reception is busy',
        text: 'Consider a dental clinic at the end of the working day. Reception is checking in a patient when another person calls to ask about a consultation. The useful outcome is a captured request with a clear owner: who called, what they are asking for, how they prefer to be contacted and what should happen next. An answer alone does not complete that work.',
      },
      {
        title: 'Separate a booking request from a confirmed appointment',
        text: 'A configured HireStella workflow can capture preferred times and coordinate availability through a supported booking system. Confirmation should follow the clinic’s actual scheduling rules. If availability cannot be checked, or staff need to review the request, the patient should receive an acknowledgement and a next step. The team should see a pending request rather than an appointment that does not exist.',
      },
      {
        title: 'Connect the reminder and the reply',
        text: 'Once the appointment is confirmed, an approved reminder can give the patient a way to confirm or ask for a change. That reply needs to reach the same appointment workflow. Follow-ups should stop or change when the patient responds, opts out, or a member of staff takes ownership. A connected process makes these states visible to reception.',
      },
      {
        title: 'Keep treatment questions with clinicians',
        text: 'A question about suitability for a procedure changes the next step. Stella can carry the conversation context into a staff handoff; the qualified team provides the clinical answer. The workflow described here is service coordination, with supported systems and clinic-approved information configured during setup.',
      },
      {
        title: 'Measure the whole journey',
        text: 'Before a pilot, define what counts as an enquiry, a confirmed booking and an attended visit. Track missed enquiries, time to first response, bookings from enquiries, attendance and unresolved handoffs over comparable periods. Keep channel mix and opening hours in view. These measures help assess the workflow; they are not a promise of a particular sales or booking increase.',
      },
    ],
    sources: [],
  },
  {
    slug: 'dubai-healthcare-growth-clinic-operations',
    category: 'Healthcare',
    industry: 'clinics',
    title: 'Dubai’s growing healthcare market: what to examine at the front desk',
    seoTitle: 'Dubai Healthcare Growth: The Front Desk Gap',
    summary:
      'The official 2025 figures provide market context. Your own enquiry and appointment data should guide the operational response.',
    readTime: '3 min read',
    cover: '/visuals/photo/dubai-healthcare.webp',
    date: '2026-09-10',
    link: '/industries/healthcare/dental',
    sections: [
      {
        title: 'Read the categories carefully',
        text: 'Dubai Government Media Office reported approximately 5,800 licensed healthcare facilities in 2025, compared with 5,340 in 2024, citing Dubai Health Authority statistics. Its breakdown includes 70 general dental clinics. That is a named facility category, not a count of every location offering dentistry. The total healthcare figure also covers many different types of facilities.',
      },
      {
        title: 'Translate context into questions',
        text: 'Our operational interpretation is that a growing healthcare market makes it useful to examine how easy it is for a patient to reach your clinic and arrange a visit. The published figures do not establish that a particular clinic is losing calls or that AI will increase its bookings. Start by checking your own unanswered enquiries, response times and requests that never reach a confirmed next step.',
      },
      {
        title: 'Choose one workflow to improve',
        text: 'A manageable starting point is after-hours consultation enquiries. Define which routine information can be shared, what information is necessary to coordinate a visit and who owns exceptions. Configure the supported booking and communication systems around that process. Keep requests awaiting staff review visible, and distinguish them from confirmed appointments.',
      },
      {
        title: 'Evaluate progress with clinic data',
        text: 'Compare the pilot with a documented baseline. Review enquiry-to-booking conversion alongside appointment attendance, patient replies and staff time spent resolving exceptions. If advertising, staffing or appointment capacity changes during the pilot, record those changes too. HireStella’s role in this example is to coordinate the work; any improvement should be demonstrated through the clinic’s results.',
      },
    ],
    sources: [healthcareSource],
  },
  {
    slug: 'first-ai-workflow',
    category: 'General',
    industry: 'general',
    title: 'How to choose your first AI coordination workflow',
    seoTitle: 'Choosing Your First AI Workflow',
    summary:
      'Start with a repeatable operational task, define its handoffs and measure a useful outcome.',
    readTime: '3 min read',
    cover: '/visuals/photo/coordination.webp',
    date: '2026-09-10',
    link: '/use-cases',
    sections: [
      {
        title: 'Choose a task with a clear finish',
        text: 'A useful pilot begins with a specific trigger and an observable next step. A property enquiry can lead to a viewing request, a rental enquiry to an availability check, and a clinic call to an appointment request. Write down what completion means and which exceptions require a person. This makes it easier to configure the workflow and assess whether it helps.',
      },
      {
        title: 'Map the information and systems',
        text: 'Identify the minimum information needed to move the request forward, the system holding availability or status, and the team responsible for the next action. Confirm that your actual providers and required actions are supported. If a system cannot supply a reliable answer, define a staff handoff and an honest acknowledgement for the customer.',
      },
      {
        title: 'Make the handoff part of the workflow',
        text: 'Give staff the request, relevant conversation context and the reason they need to step in. Decide how ownership is recorded and when automated follow-up should pause. A workflow is only complete when people can understand what happened and what remains to be done.',
      },
      {
        title: 'Agree on a baseline before launch',
        text: 'Choose a small set of measures: response time, requests reaching a confirmed next step, unresolved exceptions and staff time per request. Compare similar periods and document changes in demand or staffing. Use the findings to refine the workflow before widening its scope. The examples on this website describe how the work moves; your own channels, systems and operating rules are configured around your business.',
      },
    ],
    sources: [],
  },
];
