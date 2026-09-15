export const artwork = {
  dental: {
    src: '/visuals/dental-studio.webp',
    alt: 'Sculptural dental studio with a porcelain tooth and a connected appointment pathway',
  },
  dubai: {
    src: '/visuals/dubai-healthcare.webp',
    alt: 'Architectural illustration of Dubai with a healthcare pavilion and glass towers',
  },
  coordination: {
    src: '/visuals/connected-workforce.webp',
    alt: 'Eight sculptural workstations connected to a central glass sphere',
  },
};

export const dentalSegments = [
  {
    id: 'front-desk',
    name: 'Front Desk',
    icon: 'message',
    problem: 'The enquiry is waiting.',
    action: 'Answer routine questions and capture what the patient needs.',
    result: 'A useful response. A clear next step.',
    preview: [
      'Patient enquiry',
      '“Can I arrange a consultation?”',
      'Request captured · reception informed',
    ],
    label: 'A conversation that continues',
  },
  {
    id: 'voice',
    name: 'Voice',
    icon: 'phone',
    problem: 'The phone rings during a busy visit.',
    action: 'Handle configured calls and pass requests to the right workflow.',
    result: 'Call context reaches your team.',
    preview: [
      'Incoming call',
      'Consultation enquiry · 01:24',
      'Intent understood · booking requested',
    ],
    label: 'A call becomes an action',
  },
  {
    id: 'website',
    name: 'Website',
    icon: 'browser',
    problem: 'A visitor cannot find the next step.',
    action: 'Connect approved service pages to enquiry and appointment requests.',
    result: 'Your digital front door leads somewhere.',
    preview: [
      'Dental consultation',
      'A clearer first visit starts here.',
      'Enquire → Coordinate → Confirm',
    ],
    label: 'A better digital front door',
  },
  {
    id: 'booking',
    name: 'Booking',
    icon: 'calendar',
    problem: 'Booking takes another round of calls.',
    action: 'Check supported availability and coordinate bookings or changes.',
    result: 'Confirmed appointments are easy to see.',
    preview: [
      'Consultation request',
      'Thursday · 10:30',
      'Availability checked · appointment confirmed',
    ],
    label: 'From interest to in the calendar',
  },
  {
    id: 'admin',
    name: 'Admin',
    icon: 'records',
    problem: 'The same details get entered again.',
    action: 'Organise enquiry details and update supported records.',
    result: 'Context moves with the patient journey.',
    preview: [
      'Enquiry D-024',
      'Contact preference · morning call',
      'Request linked · record updated',
    ],
    label: 'The details, in the right place',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: 'chart',
    problem: 'Campaign enquiries lose momentum.',
    action: 'Support approved content and nurture activity around your strategy.',
    result: 'Campaign interest has a follow-through.',
    preview: [
      'Consultation campaign',
      'Content → Review → Approved',
      'Enquiry captured · source recorded',
    ],
    label: 'A campaign with a connected next step',
  },
  {
    id: 'social',
    name: 'Social',
    icon: 'network',
    problem: 'Messages arrive in different inboxes.',
    action: 'Respond on supported channels and connect routine enquiries.',
    result: 'A social conversation can become a visit.',
    preview: [
      'Social enquiry',
      '“Where is your clinic located?”',
      'Approved information shared · enquiry routed',
    ],
    label: 'From an inbox to a patient journey',
  },
  {
    id: 'outbound-followup',
    name: 'Follow-up',
    icon: 'send',
    problem: 'The next contact slips through.',
    action: 'Coordinate approved reminders and recall follow-ups using your contact rules.',
    result: 'Due, replied and completed stay visible.',
    preview: ['Appointment reminder', 'Tomorrow · 10:30', 'Reminder scheduled · reply tracked'],
    label: 'Follow-ups with an owner',
  },
] as const;

export const articleVisuals: Record<
  string,
  {
    art: keyof typeof artwork;
    kicker: string;
    takeaway: string;
    steps: string[];
    evidence: { title: string; url: string; text: string; scope: string };
    evidenceAfter: number;
  }
> = {
  'dental-enquiry-to-appointment': {
    art: 'dental',
    kicker: 'THE PATIENT JOURNEY',
    takeaway: 'The useful outcome is a confirmed next step, with the conversation still attached.',
    steps: [
      'Enquiry captured',
      'Staff review if needed',
      'Appointment confirmed',
      'Reminder & reply',
    ],
    evidenceAfter: 2,
    evidence: {
      title: 'Cochrane · 5 December 2013',
      url: 'https://www.cochrane.org/evidence/CD007458_mobile-phone-messaging-reminders-attendance-healthcare-appointments',
      text: 'A review of eight trials found low-to-moderate quality evidence that text-message reminders improved healthcare appointment attendance compared with no reminders or postal reminders.',
      scope:
        'Trials published through August 2012. This is evidence about reminders, not a study of HireStella or a dental AI booking guarantee.',
    },
  },
  'dubai-healthcare-growth-clinic-operations': {
    art: 'dubai',
    kicker: 'MARKET IN FOCUS',
    takeaway: 'Use market data for context. Use your clinic’s data to choose the next improvement.',
    steps: ['Read the market', 'Find the service gap', 'Pilot one workflow', 'Measure the result'],
    evidenceAfter: 0,
    evidence: {
      title: 'Dubai Government Media Office · 18 February 2026',
      url: 'https://prod.mediaoffice.ae/en/news/2026/february/18-02/dubais-healthcare-ecosystem-posts-record-growth-in-2025',
      text: 'The official update cites approximately 5,800 licensed healthcare facilities in 2025 versus 5,340 in 2024, and lists 70 general dental clinics as a specific category.',
      scope:
        'Dubai, 2025; DHA figures reported by the Media Office. The general dental category is not all locations offering dentistry.',
    },
  },
  'first-ai-workflow': {
    art: 'coordination',
    kicker: 'THE OPERATING PLAYBOOK',
    takeaway: 'Choose one repeatable task. Define the handoff. Measure what happens next.',
    steps: ['Define the task', 'Connect the systems', 'Assign the handoff', 'Measure & refine'],
    evidenceAfter: 2,
    evidence: {
      title: 'NIST · AI Risk Management Framework 1.0 (2023)',
      url: 'https://airc.nist.gov/airmf-resources/airmf/5-sec-core/',
      text: 'NIST’s framework organises AI risk management around Govern, Map, Measure and Manage, including responsibilities for human oversight and ongoing measurement.',
      scope:
        'A voluntary framework, not a HireStella certification. The workflow examples and pilot suggestions here are HireStella’s editorial interpretation.',
    },
  },
};
