export const specialists = [
  {
    id: 'front-desk',
    name: 'AI Front Desk / Chat',
    short: 'Front Desk',
    icon: 'message',
    description: 'Every enquiry gets a thoughtful first response.',
    actions: 'ANSWERS · QUALIFIES · ROUTES',
    detail:
      'Answer routine questions, capture the right details, and route each conversation to its next step across configured digital channels.',
    boundary: 'Sensitive questions and exceptions go to your team with the conversation history.',
  },
  {
    id: 'voice',
    name: 'AI Voice Specialist',
    short: 'Voice',
    icon: 'phone',
    description: 'Keep the conversation moving. Even after hours.',
    actions: 'RESPONDS · QUALIFIES · TRANSFERS',
    detail:
      'Handle configured inbound and outbound calls, understand intent, capture details, and transfer to a person when the conversation needs one.',
    boundary:
      'Complex or sensitive calls transfer to an available human, following agreed escalation rules.',
  },
  {
    id: 'website',
    name: 'AI Website Builder',
    short: 'Website',
    icon: 'browser',
    description: 'Your digital front door, connected to what follows.',
    actions: 'BUILDS · CONNECTS · CONVERTS',
    detail:
      'Create a conversion-ready website connected to enquiries, qualification, bookings, and the wider workforce journey.',
    boundary: 'Your team approves content, brand presentation, and publication.',
  },
  {
    id: 'booking',
    name: 'Booking & Scheduling',
    short: 'Booking',
    icon: 'calendar',
    description: 'From interested to in the calendar.',
    actions: 'CHECKS · BOOKS · RESCHEDULES',
    detail:
      'Check supported availability, coordinate bookings and changes, and sync appointments with the systems agreed in your configuration.',
    boundary: 'Exceptions, conflicting availability, and requests outside policy are escalated.',
  },
  {
    id: 'admin',
    name: 'AI Admin Specialist',
    short: 'Admin',
    icon: 'records',
    description: 'Less repetitive work. More room to think.',
    actions: 'UPDATES · ORGANISES · RECORDS',
    detail:
      'Keep supported records current, triage routine email, and move structured information into the right place.',
    boundary: 'Ambiguous data and sensitive changes require human review.',
  },
  {
    id: 'marketing',
    name: 'AI Marketing Specialist',
    short: 'Marketing',
    icon: 'chart',
    description: 'Turn a good strategy into consistent execution.',
    actions: 'CREATES · NURTURES · TRACKS',
    detail:
      'Support content, nurture sequences, campaign execution, and engagement tracking within an approved strategy.',
    boundary: 'People own strategy, budgets, claims, and final creative approval.',
  },
  {
    id: 'social',
    name: 'AI Social Specialist',
    short: 'Social',
    icon: 'network',
    description: 'Keep your brand present in the conversation.',
    actions: 'MONITORS · RESPONDS · CONNECTS',
    detail:
      'Monitor supported social channels, respond to routine enquiries in your brand voice, and connect relevant conversations to the lead journey.',
    boundary: 'Reputation-sensitive conversations and unfamiliar requests go to a person.',
  },
  {
    id: 'outbound-followup',
    name: 'Outbound & Follow-up',
    short: 'Follow-up',
    icon: 'send',
    description: 'The next step should never be forgotten.',
    actions: 'REACHES · FOLLOWS UP · RE-ENGAGES',
    detail:
      'Coordinate approved outreach, timely reminders, and re-engagement workflows so opportunities keep moving.',
    boundary: 'Your team defines consent, contact rules, messaging, and escalation.',
  },
] as const;

export type SpecialistId = (typeof specialists)[number]['id'];
export const plans = [
  {
    name: 'Starter',
    description: 'A strong foundation for the work that repeats.',
    prices: { monthly: 1499, six: 999, annual: 799 },
    languages: 5,
    minutes: 150,
    integrations: '3 integrations',
    workflows: 'Core workflows',
    dashboard: 'Performance dashboard',
    support: 'Guided onboarding',
  },
  {
    name: 'Pro',
    description: 'More capacity for a business finding its stride.',
    prices: { monthly: 1799, six: 1399, annual: 1099 },
    languages: 12,
    minutes: 250,
    integrations: '5 integrations',
    workflows: 'Advanced workflows',
    dashboard: 'Growth dashboard',
    support: 'Priority support & enhanced onboarding',
  },
  {
    name: 'Enterprise',
    description: 'Deeper coordination for more complex operations.',
    prices: { monthly: 1999, six: 1599, annual: 1299 },
    languages: 20,
    minutes: 500,
    integrations: 'Custom APIs & integrations',
    workflows: 'Bespoke workflows',
    dashboard: 'Command Centre',
    support: 'Dedicated support & custom SLA',
  },
] as const;
export type Term = 'monthly' | 'six' | 'annual';
export const termNames: Record<Term, string> = {
  monthly: 'Monthly',
  six: '6 months',
  annual: '12 months',
};
export const money = (value: number) =>
  new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 }).format(value);

export const industries = [
  {
    id: 'dental',
    name: 'Dental clinics',
    label: 'Dental',
    icon: 'medical',
    headline: 'Care for your patients. We’ll coordinate the rest.',
    problem: 'We miss calls while the team is with patients.',
    description:
      'From the first late-night enquiry to the appointment reminder, give your front desk the capacity to keep up.',
    steps: [
      'Enquiry received',
      'Routine question answered',
      'Availability checked',
      'Appointment coordinated',
      'Reminder scheduled',
    ],
    boundary:
      'Clinical questions, treatment decisions, and sensitive patient conversations always belong with your clinical team.',
    systems: 'Practice management, supported calendars, and enquiry channels',
    ids: ['front-desk', 'voice', 'booking', 'admin', 'outbound-followup'],
  },
  {
    id: 'real-estate',
    name: 'Real estate',
    label: 'Real estate',
    icon: 'building',
    headline: 'The value of a lead falls while it waits.',
    problem: 'Portal leads arrive faster than our agents can qualify them.',
    description:
      'Connect first response, lead qualification, viewing coordination, and follow-up into one continuous journey.',
    steps: [
      'Lead arrives',
      'Requirements captured',
      'Agent matched',
      'Viewing coordinated',
      'Follow-up scheduled',
    ],
    boundary:
      'Your agents own negotiations, financial advice, legal questions, and relationship decisions.',
    systems: 'Supported CRM, property enquiry channels, and calendars',
    ids: ['front-desk', 'voice', 'booking', 'outbound-followup'],
  },
  {
    id: 'banking',
    name: 'Banking & finance',
    label: 'Banking',
    icon: 'building',
    headline: 'Faster routing. Human judgement where it matters.',
    problem: 'Routine enquiries keep reaching the wrong team.',
    description:
      'Help routine enquiries reach the right workflow while sensitive matters move to authorised people with context.',
    steps: [
      'Enquiry arrives',
      'Intent understood',
      'Routine information shared',
      'Authorised team engaged',
      'Interaction recorded',
    ],
    boundary:
      'Regulated advice, eligibility decisions, account authorisation, and sensitive judgement remain with authorised people.',
    systems: 'Supported service channels and scoped enterprise systems',
    ids: ['front-desk', 'voice', 'admin'],
  },
  {
    id: 'salons',
    name: 'Salons & wellness',
    label: 'Salons',
    icon: 'scissors',
    headline: 'Bookings arrive everywhere. Keep one clear schedule.',
    problem: 'Bookings come through calls, WhatsApp and Instagram.',
    description:
      'Bring messages, calls, appointment changes, and rebooking into a coordinated experience.',
    steps: [
      'Message arrives',
      'Service identified',
      'Availability checked',
      'Booking confirmed',
      'Rebooking reminder sent',
    ],
    boundary:
      'Your team handles treatment suitability, complaints, and exceptions to booking policy.',
    systems: 'Supported booking systems, calendars, and social channels',
    ids: ['front-desk', 'voice', 'booking', 'social', 'outbound-followup'],
  },
] as const;

export const navigation = [
  {
    /* One page, one link. The four it replaced each carried a hero, one real
       section and a closer, and between them said the same thing four times. */
    label: 'Meet Stella',
    href: '/stella',
    links: [],
  },
  {
    /* The practice platform. One page with no menu behind it, like Meet
       Stella: everything it has to say fits on the page it links to. */
    label: 'Stella Sales Coach',
    href: '/sales-coach',
    links: [],
  },
  {
    label: 'Industries',
    links: [
      ['Healthcare & clinics', '/industries/healthcare'],
      ['Automotive', '/industries/automotive'],
      ['Real estate', '/industries/real-estate'],
      ['Hospitality', '/industries/hospitality'],
      ['Education', '/industries/education'],
      ['Financial services', '/industries/financial-services'],
      ['Home & local services', '/industries/home-services'],
      ['Travel & tourism', '/industries/travel'],
      ['Professional services', '/industries/professional-services'],
      ['Retail & D2C', '/industries/retail'],
      ['Use cases', '/use-cases'],
    ],
  },
  {
    label: 'Platform',
    links: [
      ['Integrations', '/integrations'],
      ['Human boundary', '/human-boundary'],
      ['Security & trust', '/security'],
      ['ROI calculator', '/roi'],
    ],
  },
  {
    label: 'About HireStella',
    links: [
      ['Our story', '/about'],
      ['Blogs', '/blogs'],
      ['Our approach', '/team'],
      ['Become a partner', '/become-a-partner'],
      ['Contact', '/contact'],
    ],
  },
];
