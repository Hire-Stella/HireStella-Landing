export const editorialPages = {
  integrations: {
    label: 'Integrations',
    eyebrow: 'YOUR SYSTEMS. ONE CONNECTED JOURNEY.',
    title: 'Keep your context.\nConnect your systems.',
    intro:
      'Build the workforce around the systems your operation uses. Availability, permissions and integration scope are confirmed before deployment.',
    statement: 'A useful connection carries context into the next action.',
    blocks: [
      {
        icon: 'records',
        title: 'CRM & supported records',
        text: 'Capture relevant information and coordinate approved updates to your supported customer or operational records.',
      },
      {
        icon: 'calendar',
        title: 'Calendars & booking systems',
        text: 'Connect availability and appointment workflows to compatible systems, with booking rules agreed during scoping.',
      },
      {
        icon: 'message',
        title: 'Customer channels',
        text: 'Scope conversations across website, WhatsApp, Instagram, social, voice and email according to provider access and your selected configuration.',
      },
      {
        icon: 'network',
        title: 'Custom APIs',
        text: 'Enterprise and bespoke configurations can scope custom API work. Feasibility, permissions, effort and system limits are reviewed first.',
      },
    ],
    closingEyebrow: 'Connect your systems',
    closing: 'Tell us which systems your business runs on.',
    closingLede: 'We confirm what connects, and how, before anything is configured.',
  },
  'human-boundary': {
    label: 'Human boundary',
    eyebrow: 'YOUR PEOPLE, PLUS STELLA',
    title: 'More capacity.\nHuman judgement intact.',
    intro:
      'AI handles configured, structured work. Your people own sensitive conversations, exceptions and decisions that need experience and judgement.',
    statement: 'The goal is more output and capacity per person.',
    blocks: [
      {
        icon: 'network',
        title: 'Structured work moves',
        text: 'Routine responses, approved qualification, bookings, reminders and supported record updates follow your agreed workflows.',
      },
      {
        icon: 'shield',
        title: 'Judgement stays human',
        text: 'Clinical, legal, financial, sensitive, or exceptional requests are routed to the appropriate people instead of being treated as routine automation.',
      },
      {
        icon: 'users',
        title: 'Context travels with the handoff',
        text: 'The human team receives the relevant conversation and reason for escalation so the next step starts with understanding.',
      },
      {
        icon: 'activity',
        title: 'Responsibility stays visible',
        text: 'A handoff is an intentional part of the workflow. Review what needs attention and which next action belongs with your team.',
      },
    ],
    closingEyebrow: 'Set your boundary',
    closing: 'You decide where the line sits.',
    closingLede: 'In a demo we map which work Stella takes on and which stays with your people.',
  },
  security: {
    label: 'Security & trust',
    eyebrow: 'CLARITY IS PART OF TRUST',
    title: 'Defined scope.\nVisible responsibility.',
    intro:
      'Security, hosting and integration requirements are scoped to the selected configuration. Contact our team for the controls applicable to your deployment.',
    statement: 'Know what is connected, what is permitted, and who takes over.',
    blocks: [
      {
        icon: 'shield',
        title: 'Deployment requirements',
        text: 'Discuss hosting, access, data handling, retention and your organisation’s requirements during scoping. The applicable controls must be confirmed for your configuration.',
      },
      {
        icon: 'settings',
        title: 'Integration permissions',
        text: 'Define which supported systems the workforce can access and what actions are permitted. Scope these decisions around the tasks it needs to perform.',
      },
      {
        icon: 'users',
        title: 'Escalation boundaries',
        text: 'Agree the requests that need an authorised person. Sensitive or judgement-led decisions remain with your team.',
      },
      {
        icon: 'records',
        title: 'Review before commitment',
        text: 'Request the relevant deployment documentation and evidence for your needs. Certifications, provider controls, and regulated capabilities should be verified for the actual scope.',
      },
    ],
    closingEyebrow: 'Scope your deployment',
    closing: 'Let’s discuss the requirements your deployment needs to meet.',
    closingLede: 'Hosting, data handling and access are scoped to your deployment before anything goes live.',
  },
} as const;
