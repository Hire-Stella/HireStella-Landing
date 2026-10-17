/**
 * §9.2 — FAQ strategy. Questions are the ones buyers actually ask during
 * scoping. Every answer stays inside the current commercial and product scope;
 * nothing here claims a capability, integration or certification we do not have.
 *
 * These strings are rendered visibly AND emitted as FAQPage markup, which is
 * what makes the markup eligible (§7.4: structured data matches visible content).
 */
export type Faq = { q: string; a: string };

/** The homepage takes the objections a first-time visitor arrives with.
    Content 2.0 (2026-10-17): the eighteen questions from the revised brief. */
export const HOME_FAQS = [
  {
    q: 'Is Stella just another chatbot?',
    a: 'No. Stella is an AI General Manager that coordinates several specialist workflows, not a single question-and-answer chat. Depending on your setup, those workflows can span conversations, qualification, booking, follow-up and reporting. The scope of every workflow is agreed during configuration.',
  },
  {
    q: 'Will it replace my employees?',
    a: 'It is designed to take on repetitive, high-volume and structured work, while your employees stay responsible for relationships, exceptions and decisions that need judgement. Your team sets the escalation rules and controls what Stella is allowed to do.',
  },
  {
    q: 'Can Stella answer calls and make outbound calls?',
    a: 'Inbound and outbound voice workflows can be configured where supported, including routine enquiries, callback requests and appointment reminders. Phone number setup, call recording, consent rules, permitted contact hours and languages are confirmed for your market.',
  },
  {
    q: 'Does Stella work on WhatsApp?',
    a: 'WhatsApp can be part of a configured workflow, subject to approved WhatsApp Business access, provider policies and the features in your deployment. Any messaging or provider fees are made clear in your proposal.',
  },
  {
    q: 'Which languages does Stella speak?',
    a: 'Languages are agreed when your deployment is scoped. English, Arabic, Hindi, Urdu, Tagalog, French, Russian, Spanish and Turkish are among the languages we work with, but availability can differ between chat, calls and providers. Ask us to confirm the languages you need before you start.',
  },
  {
    q: 'What systems can you connect to?',
    a: 'Common categories include CRMs, calendars, booking tools, messaging channels and other business systems. We check each provider and workflow for compatibility, permissions, security and scope before confirming what will connect. The integrations page has more detail.',
  },
  {
    q: 'Can Stella use our existing phone number?',
    a: 'That depends on your current provider, country, telephony setup and support for routing or forwarding. We review your number during scoping before confirming the arrangement.',
  },
  {
    q: 'Can Stella book and reschedule appointments?',
    a: 'Yes, where your calendar or booking system is supported and connected. We define availability rules, confirmation steps, rescheduling policies and when a conflicting or unusual request goes to a person.',
  },
  {
    q: 'How fast can we go live?',
    a: 'We recommend starting with one clearly defined workflow and expanding from there. The schedule depends on channel access, integrations, testing and approvals, and you receive a confirmed timeline after discovery and scoping.',
  },
  {
    q: 'What does my team have to provide?',
    a: 'Usually your business FAQs, services and approved prices or policies, the owners of each workflow, access to the agreed systems, your language needs, and one team contact who can test scenarios and approve the final configuration.',
  },
  {
    q: 'Can Stella follow up with leads who have not replied?',
    a: 'Yes, through approved reminder and re-engagement workflows that follow your contact preferences, consent requirements, permitted frequency and escalation rules. Stella does not message people outside those rules.',
  },
  {
    q: 'Can Stella send invoices or take payments?',
    a: 'Invoicing, payment links and other financial actions are not part of every deployment. We confirm what your connected systems allow and where staff approval is required. Payment details stay with your approved payment providers and existing controls.',
  },
  {
    q: 'What will I see in the dashboard?',
    a: 'Enquiry, booking, follow-up and handoff activity within your agreed reporting scope. Revenue and payment figures appear only where a connected system can confirm them. The figures shown on this website are examples, not customer results.',
  },
  {
    q: 'Is our customer data safe?',
    a: 'Hosting, data handling, access permissions and retention depend on your deployment and are reviewed during scoping, so you see the relevant controls and documentation before you commit. Security & trust covers how we approach it.',
  },
  {
    q: 'How much does HireStella cost?',
    a: 'Your proposal depends on volume, channels, voice needs, languages, integrations, reporting, support and setup complexity. We set out the scope and any separate provider fees before you make a decision.',
  },
  {
    q: 'Can we begin with a single workflow?',
    a: 'Yes. Starting with one meaningful customer journey lets you test the fit and measure its value before expanding. Several specialists may support that single journey behind the scenes.',
  },
  {
    q: 'Does every conversation run without a person involved?',
    a: 'No. You decide what can be handled automatically and when an authorised member of staff steps in. Sensitive questions, unclear information and requests outside policy are handed over with the context attached.',
  },
  {
    q: 'Is there a product for sales training?',
    a: 'Yes. Stella Sales Coach is a separate product for sales teams: AI role-play where sellers practise real customer conversations and objections, get feedback, and improve before the next live call.',
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
      a: 'No. The eight specialists are designed to work together, and Stella recommends which ones to activate and configure first, based on your volume, channels, languages, systems and reporting needs.',
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
      a: 'That depends on your deployment and is set out in your proposal. What matters more than the count is whether context carries from one step to the next, which is what the configuration is designed around.',
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
      a: 'Disclosure is part of your configuration, and the approved wording is yours. Your team can also see, in the workspace, which conversations are waiting on a person.',
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
      a: 'No. Your proposal is driven by volume, voice, languages, complexity, integrations and reporting rather than by how many roles you switch on.',
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
      a: 'The structure will be familiar, but the views, metrics and records are scoped to your configuration and plan. Reporting depth is agreed in your proposal.',
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
