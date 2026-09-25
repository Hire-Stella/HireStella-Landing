/**
 * §9.2 — FAQ strategy. Questions are the ones buyers actually ask during
 * scoping. Every answer stays inside the current commercial and product scope;
 * nothing here claims a capability, integration or certification we do not have.
 *
 * These strings are rendered visibly AND emitted as FAQPage markup, which is
 * what makes the markup eligible (§7.4: structured data matches visible content).
 */
export type Faq = { q: string; a: string };

/** The homepage takes the objections a first-time visitor arrives with. */
export const HOME_FAQS = [
  {
    q: 'Is this a chatbot?',
    a: 'No. A chatbot answers a question and stops. Stella coordinates a piece of work from the first contact to a booked outcome across the channels and systems you connect, and hands it to a person at the point you decide. The conversation is the smallest part of it.',
  },
  {
    q: 'Does it replace my team?',
    a: 'It is configured around the work your team does not have time for: the call that arrives while they are with someone, the enquiry at ten at night, the follow-up nobody owns. The goal is more output per person, not fewer people, and the boundary between the two is something you set and can see.',
  },
  {
    q: 'What does it connect to?',
    a: 'The channels and systems supported for your deployment, agreed during discovery and configured rather than assumed. Where a system is not connected, the workforce captures the request and routes it to a person instead of guessing.',
  },
  {
    q: 'How long before it is doing anything useful?',
    a: 'It starts with one workflow, not your whole operation. Discovery establishes where capacity is being lost, the first connected journey is configured around that, and it expands from what is working. Scope and timing are confirmed in the scoping conversation.',
  },
] as const;

export const FAQS: Record<string, Faq[]> = {
  stella: [
    {
      q: 'Is Stella a chatbot?',
      a: 'No. A chatbot answers a message. Stella is the manager layer above the specialists: she reads what is slowing the business down, decides which specialists a piece of work needs, in what order, and where a person has to take over. The conversation is how you brief her, not the product itself.',
    },
    {
      q: 'Do I have to pick which specialists I want?',
      a: 'No. All eight specialists are included in every plan. Stella recommends which ones to activate and configure first, based on your volume, channels, languages, systems and reporting needs. You are not buying them one at a time.',
    },
    {
      q: 'How much does Stella decide on her own?',
      a: 'Only what you configure her to decide. Routing, approved answers, booking rules and escalation thresholds are set during scoping. Anything outside those rules becomes a handoff to a named person with the full conversation attached.',
    },
  ],
  'how-it-works': [
    {
      q: 'How long does a first configuration take?',
      a: 'It depends on how many channels and systems are in scope and how quickly approvals come back. Discovery and analysis come first, then one connected journey is configured and tested before the scope widens. We do not quote a timeline before seeing the workflow.',
    },
    {
      q: 'Do we need to replace our existing systems?',
      a: 'No. The workforce is designed to work with the calendar, CRM and records you already run, where those systems are supported. Specific providers and compatibility are confirmed during scoping rather than assumed.',
    },
    {
      q: 'What do you need from us to start?',
      a: 'A description of where work is slowing down, the channels customers actually use, access to the systems in scope, your approved answers and tone, and the rules for when something must reach a person.',
    },
  ],
  integrations: [
    {
      q: 'Which systems can HireStella connect to?',
      a: 'Integration categories on this site describe the kinds of systems the workforce is built to work with: CRM and records, calendars, messaging channels, voice and custom APIs. A category shown here is not a claim that every product in it is supported. Specific providers and compatibility are confirmed during scoping.',
    },
    {
      q: 'How many integrations are included?',
      a: 'Starter includes three, Pro includes five, and Enterprise supports custom APIs and integrations. What matters more than the count is whether context carries from one step to the next, which is what the configuration is designed around.',
    },
    {
      q: 'What happens to our data?',
      a: 'Deployment-specific data handling, retention and access requirements are agreed during scoping. This website does not claim any certification or compliance standard.',
    },
  ],
  'human-boundary': [
    {
      q: 'Where exactly does automation stop?',
      a: 'At the rules you set. In practice the recurring boundaries are clinical, legal and financial decisions, complaints and sensitive conversations, negotiation and anything contractual, and any moment a customer asks for a human. Those transfer to a person with the full context attached.',
    },
    {
      q: 'Will customers know they are talking to AI?',
      a: 'Disclosure is part of your configuration, and the approved wording is yours. The boundary itself is visible in the interface rather than buried in a policy document, so your team can see which conversations are waiting on a person.',
    },
    {
      q: 'What happens if a specialist gets something wrong?',
      a: 'Anything outside the configured rules escalates rather than guesses. Ambiguous data and sensitive changes require human review, and every handoff carries the conversation history so the person picking it up is not starting again.',
    },
  ],
  security: [
    {
      q: 'Is HireStella certified or compliant with a specific standard?',
      a: 'This website makes no certification or compliance claim. Deployment requirements, permissions, data handling and retention are defined during scoping and confirmed in writing for each deployment.',
    },
    {
      q: 'Who can see our customer conversations?',
      a: 'Access is scoped to your configuration. Which team members see what, which systems are connected and which actions are permitted are all set during configuration rather than defaulted.',
    },
    {
      q: 'What is not connected by default?',
      a: 'Nothing is connected until you approve it. Channels, systems and permitted actions are enabled one at a time as part of the configuration, which is also what keeps the scope of any single specialist explicit.',
    },
  ],
  workforce: [
    {
      q: 'Do I pay per specialist?',
      a: 'No. All eight specialists are included in every plan. Plans are driven by volume, voice, languages, complexity, integrations and reporting rather than by how many roles you switch on.',
    },
    {
      q: 'Can we start with just one?',
      a: 'You can start with one workflow, which usually draws on three or four specialists in sequence. Starting with a single role in isolation tends to move the bottleneck rather than remove it.',
    },
    {
      q: 'Is there a per-message price?',
      a: 'There is no per-message price. Capacity is part of the plan, and the operating level is recommended based on your actual volume during scoping.',
    },
  ],
  roi: [
    {
      q: 'Where do these numbers come from?',
      a: 'From the assumptions you set on this page: your country, the calls you take each month, what one call costs you to handle, the share the workforce is expected to answer, and the annual figure from your proposal. Nothing is pulled from your systems and nothing here is a measured result.',
    },
    {
      q: 'Is the saving the same as cash in the bank?',
      a: 'No. It is the cost of the calls the workforce would answer, less the annual figure you entered. Your own staffing decisions determine how much of that becomes cash rather than returned time, so treat it as a way to rank what is worth assessing first, not as a financial projection.',
    },
  ],
  dashboard: [
    {
      q: 'Is this real customer data?',
      a: 'No. The workspace shows a worked example of a clinic day so you can see how the views fit together. The totals and the records are consistent with one another, but they belong to that example, not to a HireStella customer. Your own workspace shows your own activity.',
    },
    {
      q: 'Will our dashboard look like this?',
      a: 'The structure will be familiar, but the views, metrics and records are scoped to your configuration and plan. Reporting depth differs between Starter, Pro and Enterprise.',
    },
  ],
  about: [
    {
      q: 'What does HireStella actually sell?',
      a: 'An AI workforce orchestration platform: one AI General Manager and eight connected AI Specialists, configured around the workflows where your business loses capacity. It is sold as a configured deployment, not as software you assemble yourself.',
    },
    {
      q: 'Where is HireStella based?',
      a: 'HireStella AI for Software Solutions Co LLC is based at Lake Central Towers 1903, Business Bay, Dubai, United Arab Emirates.',
    },
  ],
  team: [
    {
      q: 'How does an engagement start?',
      a: 'With a conversation about the work that is not moving. We map the workflows creating pressure, the channels and systems involved, and where human judgement has to stay, before anything is configured.',
    },
    {
      q: 'What will you not do?',
      a: 'We do not invent capabilities, integrations, certifications or outcomes to win a scoping conversation. Where something is unverified, it stays a question until it is answered.',
    },
  ],
};
