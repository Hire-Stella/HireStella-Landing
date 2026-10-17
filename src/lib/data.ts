export const specialists = [
  {
    id: 'front-desk',
    name: 'AI Front Desk & Chat',
    short: 'Front Desk',
    icon: 'message',
    description: 'Every connected enquiry answered, with nothing for the next person to guess.',
    actions: 'ANSWERS · QUALIFIES · ROUTES',
    detail:
      'Respond to approved questions, capture intent and contact preferences, and route a qualified lead to booking or a person across connected WhatsApp, website and social conversations.',
    boundary: 'Clinical, financial, legal, upset-customer or unknown requests go to your team with the conversation history.',
  },
  {
    id: 'voice',
    name: 'AI Voice',
    short: 'Voice',
    icon: 'phone',
    description: 'Calls in and out, without customers repeating themselves.',
    actions: 'TAKES CALLS · CALLS BACK · TRANSFERS',
    detail:
      'Answer and qualify supported calls, take messages, make approved callbacks and appointment reminders, and hand complex calls to your staff.',
    boundary:
      'Recording consent, contact rules, number setup and languages are confirmed for your market before calls go live.',
  },
  {
    id: 'website',
    name: 'AI Website Builder',
    short: 'Website',
    icon: 'browser',
    description: 'Your digital front door, with a clear path to the next step.',
    actions: 'BUILDS · CONNECTS · CONVERTS',
    detail:
      'Support website and landing-page experiences, enquiry forms and calls to action that send their context into the wider workflow.',
    boundary: 'Site ownership, hosting, approvals and build scope are agreed with you first.',
  },
  {
    id: 'booking',
    name: 'Booking & Scheduling',
    short: 'Booking',
    icon: 'calendar',
    description: 'A clear route to an available appointment, without the back-and-forth.',
    actions: 'CHECKS · BOOKS · RESCHEDULES',
    detail:
      'Work with connected calendars or booking systems to check availability, suggest slots, create or change bookings and send approved confirmations.',
    boundary: 'Conflicts, special requirements and exceptions go to your staff.',
  },
  {
    id: 'admin',
    name: 'AI Admin',
    short: 'Admin',
    icon: 'records',
    description: 'Records that stay usable, not scattered across notes and inboxes.',
    actions: 'UPDATES · ORGANISES · RECORDS',
    detail:
      'Prepare and log structured information, support approved CRM updates, and write summaries for your team to review.',
    boundary: 'Invoices, accounting, payments and sensitive data need supported systems and your approval.',
  },
  {
    id: 'marketing',
    name: 'AI Marketing',
    short: 'Marketing',
    icon: 'chart',
    description: 'Consistent communication between the first enquiry and the decision.',
    actions: 'CREATES · NURTURES · TRACKS',
    detail:
      'Support approved email and message sequences, campaign drafts and handoffs, keeping your brand rules and opt-in requirements.',
    boundary: 'Marketing claims, targeting, paid budgets and final creative stay with your team.',
  },
  {
    id: 'social',
    name: 'AI Social',
    short: 'Social',
    icon: 'network',
    description: 'Social conversations connected to the right business follow-up.',
    actions: 'CREATES · RESPONDS · CONNECTS',
    detail:
      'Prepare content, handle routine replies on connected platforms, and pass useful enquiries into the customer journey.',
    boundary: 'Publishing permissions, regulated claims and reputation-sensitive replies are reviewed by a person.',
  },
  {
    id: 'outbound-followup',
    name: 'Outbound & Follow-up',
    short: 'Follow-up',
    icon: 'send',
    description: 'Quotes, missed appointments and good leads, never lost to a forgotten step.',
    actions: 'REACHES OUT · FOLLOWS THROUGH · RE-ENGAGES',
    detail:
      'Schedule approved reminders, quote checks, missed-appointment recovery and re-engagement, based on consent, timing and agreed messages.',
    boundary: 'Your team defines consent and contact frequency, and keeps sensitive negotiation.',
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
      'Your team handles treatment suitability, complaints and exceptions to booking policy.',
    systems: 'Supported booking systems, calendars and social channels',
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
      ['Education & training', '/industries/education'],
      ['Financial services', '/industries/financial-services'],
      ['Home services', '/industries/home-services'],
      ['Travel & tourism', '/industries/travel'],
      ['Professional services', '/industries/professional-services'],
      ['Retail & D2C', '/industries/retail'],
    ],
  },
  {
    label: 'Platform',
    links: [
      ['Integrations', '/integrations'],
      ['Human boundary', '/human-boundary'],
      ['Security & trust', '/security'],
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
