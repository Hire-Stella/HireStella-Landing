/**
 * The ten sectors, in the order the business targets them.
 *
 * `segments` are the workflow pages that exist. The full list of businesses a
 * sector covers lives in `business-types.ts`, because most business types are
 * a line of copy on the sector page rather than a page of their own.
 */
export const industryGroups = [
  {
    id: 'healthcare',
    name: 'Healthcare & clinics',
    headline: 'From the first call to a confirmed appointment.',
    icon: 'medical',
    intro:
      'Keep patient enquiries, appointments and follow-ups moving around the care your clinicians provide, across every kind of practice.',
    segments: [
      {
        id: 'dental',
        name: 'Dental clinics',
        description:
          'Connect missed-call capture, consultation booking, reminders and recall follow-ups.',
        steps: [
          'Capture a dental enquiry',
          'Coordinate a consultation',
          'Schedule a reminder',
          'Follow up with the patient',
        ],
      },
      {
        id: 'eye',
        name: 'Eye clinics',
        description:
          'Coordinate eye consultation enquiries, appointment changes and approved visit instructions.',
        steps: [
          'Capture the visit request',
          'Route to the appropriate team',
          'Coordinate an appointment',
          'Send approved visit information',
        ],
      },
      {
        id: 'aesthetic',
        name: 'Aesthetic clinics',
        description:
          'Follow up on treatment enquiries and coordinate consultations with your qualified team.',
        steps: [
          'Receive a treatment enquiry',
          'Share approved service information',
          'Book a clinician consultation',
          'Follow up on the next step',
        ],
      },
      {
        id: 'multispecialty',
        name: 'Multispecialty clinics',
        description:
          'Help enquiries reach the right department, location and appointment workflow.',
        steps: [
          'Understand the requested service',
          'Identify the department',
          'Check supported availability',
          'Coordinate the next step',
        ],
      },
    
      {
        id: 'enterprise',
        name: 'Enterprise hospitals',
        description:
          'Route routine enquiries across departments and coordinate outpatient appointment requests.',
        steps: [
          'Receive the enquiry',
          'Identify the department',
          'Transfer context to the team',
          'Track the service request',
        ],
      },
      {
        id: 'groups',
        name: 'Hospital groups',
        description:
          'Coordinate location preferences and service enquiries across a hospital network.',
        steps: [
          'Capture location preference',
          'Find the relevant service team',
          'Coordinate the request',
          'Maintain a clear handoff',
        ],
      },
    ],
  },
  {
    id: 'automotive',
    name: 'Automotive',
    headline: 'Rental, workshop and showroom. One customer.',
    icon: 'car',
    intro:
      'Connect rental enquiries, workshop bookings and customer follow-ups in one coordinated journey.',
    segments: [
      {
        id: 'rental',
        name: 'Car rental',
        description:
          'Capture rental dates and vehicle preferences, then coordinate availability and reservation requests.',
        steps: [
          'Capture dates and preferences',
          'Check supported availability',
          'Coordinate the reservation request',
          'Schedule collection reminders',
        ],
      },
      {
        id: 'service',
        name: 'Service & maintenance',
        description:
          'Coordinate workshop appointments, approved status updates and service reminders.',
        steps: [
          'Capture the service request',
          'Coordinate a workshop slot',
          'Share approved status updates',
          'Schedule a service reminder',
        ],
      },
      {
        id: 'dealerships',
        name: 'Dealerships',
        description:
          'Respond to vehicle enquiries and coordinate test drives with your sales team.',
        steps: [
          'Capture vehicle interest',
          'Record customer preferences',
          'Coordinate a test drive',
          'Follow up with the sales team',
        ],
      },
    ],
  },
  {
    id: 'real-estate',
    name: 'Real estate',
    headline: 'Answer tonight. Show this week.',
    icon: 'home',
    intro:
      'Give property enquiries a clear path from first response to a viewing and an agent follow-up.',
    segments: [
      {
        id: 'companies',
        name: 'Real estate companies',
        description:
          'Capture property preferences, coordinate viewings and keep your agents informed.',
        steps: [
          'Capture a property enquiry',
          'Record budget and preferences',
          'Coordinate a viewing',
          'Schedule agent follow-up',
        ],
      },
      {
        id: 'consultancies',
        name: 'Consultancies & brokerages',
        description:
          'Route buyer and tenant enquiries to the appropriate consultant with useful context.',
        steps: [
          'Receive the enquiry',
          'Capture requirements',
          'Assign the relevant consultant',
          'Follow up after the meeting',
        ],
      },
    ],
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    headline: 'Answer the guest who is still deciding.',
    icon: 'hotel',
    intro:
      'Answer the booking question while the guest is still deciding, and keep the floor free to look after the ones already here.',
    segments: [],
  },
  {
    id: 'education',
    name: 'Education & training',
    headline: 'Admissions that answer after hours.',
    icon: 'graduation',
    intro:
      'Answer admissions and course enquiries when parents and learners actually send them, which is rarely during the school day.',
    segments: [
      {
        id: 'schools',
        name: 'Schools & nurseries',
        description:
          'Capture admissions enquiries, coordinate tours and keep the follow-up moving through a long decision.',
        steps: [
          'Receive an admissions enquiry',
          'Answer the questions you have approved',
          'Coordinate a school tour',
          'Follow up until the family decides',
        ],
      },
      {
        id: 'training',
        name: 'Training institutes',
        description:
          'Qualify course enquiries, confirm the next intake and chase the enrolment paperwork.',
        steps: [
          'Capture the course enquiry',
          'Match it to the right programme',
          'Confirm the next intake date',
          'Follow up on enrolment',
        ],
      },
    ],
  },
  {
    id: 'financial-services',
    name: 'Financial services',
    headline: 'Routine cleared. Complex cases reached.',
    icon: 'bank',
    intro:
      'Clear the routine service volume off the desk so the cases that need expertise reach a person while they still matter.',
    segments: [
      {
        id: 'banks',
        name: 'Banks',
        description:
          'Share approved service information, coordinate branch appointments and route account-specific enquiries.',
        steps: [
          'Identify the service request',
          'Share approved information',
          'Coordinate a branch appointment',
          'Route sensitive matters to staff',
        ],
      },
      {
        id: 'advisory',
        name: 'Advisory & brokerage firms',
        description: 'Capture enquiries and coordinate meetings with authorised advisers.',
        steps: [
          'Capture the enquiry',
          'Identify the relevant team',
          'Coordinate a meeting',
          'Track the staff follow-up',
        ],
      },
    ],
  },
  {
    id: 'home-services',
    name: 'Home services',
    headline: 'The job booked while the vans are out.',
    icon: 'tools',
    intro:
      'Book the job while the customer is still on the phone, and keep the technician, the slot and the follow-up in one place.',
    segments: [
      {
        id: 'maintenance',
        name: 'Maintenance & repairs',
        description:
          'Capture the fault, judge the urgency against your rules and put a technician in the diary.',
        steps: [
          'Capture the fault and the address',
          'Check it against your urgency rules',
          'Coordinate a technician slot',
          'Confirm and remind before the visit',
        ],
      },
      {
        id: 'cleaning',
        name: 'Cleaning & facilities',
        description:
          'Coordinate one-off and recurring visits, handle changes, and keep the schedule honest.',
        steps: [
          'Take the booking request',
          'Confirm scope and frequency',
          'Schedule the visit',
          'Handle changes and rebooking',
        ],
      },
    ],
  },
  {
    id: 'travel',
    name: 'Travel & tourism',
    headline: 'Answered in every time zone.',
    icon: 'plane',
    intro:
      'Handle the itinerary and eligibility questions that arrive at every hour from every time zone, before a consultant is ever needed.',
    segments: [],
  },
  {
    id: 'professional-services',
    name: 'Professional services',
    headline: 'Qualified before a fee earner sees it.',
    icon: 'briefcase',
    intro:
      'Qualify inbound enquiries before they reach a fee earner, so consultant hours go to the work that was always going to convert.',
    segments: [],
  },
  {
    id: 'retail',
    name: 'Retail & D2C',
    headline: 'Before they buy. After it ships.',
    icon: 'store',
    intro:
      'Answer the pre-purchase question and the where-is-my-order question without either one queuing behind the other.',
    segments: [
      {
        id: 'online',
        name: 'Online & D2C brands',
        description:
          'Answer product and delivery questions across every channel, and escalate the ones that need a person.',
        steps: [
          'Receive the question on any channel',
          'Answer from approved product information',
          'Check the order status',
          'Escalate refunds and complaints',
        ],
      },
      {
        id: 'stores',
        name: 'Showrooms & stores',
        description:
          'Capture stock and availability enquiries and turn the serious ones into a store appointment.',
        steps: [
          'Capture the enquiry',
          'Confirm availability from your data',
          'Book a store appointment',
          'Follow up after the visit',
        ],
      },
    ],
  },
] as const;

export const healthcareSource = {
  title: 'Dubai Government Media Office · 18 February 2026',
  url: 'https://prod.mediaoffice.ae/en/news/2026/february/18-02/dubais-healthcare-ecosystem-posts-record-growth-in-2025',
};

export const dentalUseCases = [
  {
    id: 'calls',
    icon: 'phone',
    title: 'Give missed calls a next step.',
    trigger: 'A patient calls while reception is helping someone at the desk.',
    action:
      'A configured voice workflow captures the enquiry and contact preference, answers approved routine questions, and creates a callback or booking request.',
    outcome: 'Reception receives the request and its context instead of starting again.',
  },
  {
    id: 'bookings',
    icon: 'calendar',
    title: 'Turn an enquiry into an appointment.',
    trigger: 'Someone asks for a dental consultation after closing time.',
    action:
      'Stella captures their preferred time and coordinates availability through a supported booking system. If a staff decision is needed, the request stays pending.',
    outcome: 'The patient gets a clear confirmation or a clear next step.',
  },
  {
    id: 'changes',
    icon: 'records',
    title: 'Keep appointment changes connected.',
    trigger: 'A patient needs to move an existing appointment.',
    action:
      'The configured workflow follows your verification and scheduling rules, checks supported availability and coordinates the change.',
    outcome: 'Staff can see the updated request and any unresolved exception.',
  },
  {
    id: 'reminders',
    icon: 'message',
    title: 'Make the next visit easier to remember.',
    trigger: 'A confirmed consultation is approaching.',
    action:
      'Send an approved reminder through configured channels, with a clear way to confirm or request a change.',
    outcome: 'The team can distinguish confirmed visits from appointments needing attention.',
  },
  {
    id: 'follow-ups',
    icon: 'send',
    title: 'Give follow-ups an owner.',
    trigger: 'An enquiry is still awaiting a reply, or a staff-approved recall is due.',
    action:
      'Schedule follow-ups using the clinic’s timing, consent preferences and approved wording. Pause when the patient replies or staff take over.',
    outcome: 'The front desk sees what is due, completed or waiting for a person.',
  },
  {
    id: 'handoffs',
    icon: 'users',
    title: 'Bring your clinical team in with context.',
    trigger: 'The patient asks whether a treatment is suitable for them.',
    action:
      'Route the question and conversation history to clinic staff rather than generating a treatment decision.',
    outcome: 'A qualified person owns the clinical answer and the next step.',
  },
] as const;

/**
 * Industry and segment names read in running copy as "more in retail and D2C",
 * not "more in retail & d2c". A blind toLowerCase() destroys the acronym and
 * an ampersand mid-sentence reads as a label rather than a phrase.
 */
const KEEP = ['D2C'];
export function lowerName(name: string) {
  return name
    .replace(/ & /g, ' and ')
    .split(' ')
    .map((word) => (KEEP.includes(word) ? word : word.toLowerCase()))
    .join(' ');
}

/** Dental keeps its bespoke page; every other segment is the generic route. */
export function segmentPath(group: string, segment: string) {
  return group === 'healthcare' && segment === 'dental'
    ? '/industries/healthcare/dental'
    : `/industries/${group}/${segment}`;
}
