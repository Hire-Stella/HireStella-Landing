/**
 * Where a submitted lead goes. Server-only: it reads secrets.
 *
 * Two channels, either or both:
 *  - Resend email: the team gets the lead (reply-to set to the visitor) and
 *    the visitor gets a short acknowledgement. Needs RESEND_API_KEY,
 *    LEAD_EMAIL_TO (comma-separated) and LEAD_EMAIL_FROM on a verified domain.
 *  - Webhook: the lead is POSTed as JSON to LEAD_WEBHOOK_URL (https only),
 *    for a CRM, a sheet or an automation.
 *
 * A lead counts as delivered when at least one channel got it to the team.
 * The visitor's acknowledgement is a courtesy: if it fails, the lead still
 * stands.
 */

type Details = Record<string, unknown> & { name: string; email: string; company: string };

const KIND_LABEL = {
  consultation: 'Consultation request',
  demo: 'Demo request',
  partner: 'Partner application',
} as const;
type Kind = keyof typeof KIND_LABEL;

/* Field order and labels for the team email. Anything not listed is omitted. */
const FIELDS: [string, string][] = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['company', 'Company'],
  ['partnerType', 'Partner type'],
  ['site', 'Website'],
  ['country', 'Country'],
  ['clients', 'Clients'],
  ['sectors', 'Sectors'],
  ['problem', 'What they need'],
  ['why', 'Why partner'],
  ['heardFrom', 'Heard from'],
  ['referral', 'Referred by'],
];

function env(name: string) {
  return process.env[name]?.trim() || '';
}

export function resendConfigured() {
  return Boolean(env('RESEND_API_KEY') && env('LEAD_EMAIL_TO') && env('LEAD_EMAIL_FROM'));
}

export function webhookConfigured() {
  return env('LEAD_WEBHOOK_URL').startsWith('https://');
}

/** Whether the forms can deliver at all. Pages read this to show a fallback. */
export function leadDeliveryConfigured() {
  return resendConfigured() || webhookConfigured();
}

function escape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Header-safe: a name with a newline must not become a new header line. */
function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, ' ').slice(0, 120);
}

async function sendEmail(message: {
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env('LEAD_EMAIL_FROM'),
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Resend responded ${response.status}`);
}

function teamEmail(kind: Kind, details: Details, receivedAt: string) {
  const rows = FIELDS.map(
    ([key, label]) => [label, String(details[key] ?? '').trim()] as const,
  ).filter(([, value]) => value);
  const text = [
    `${KIND_LABEL[kind]} from hirestella.ai`,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    `Received: ${receivedAt}`,
    'Reply to this email to answer them directly.',
  ].join('\n');
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#141B45">
<h2 style="margin:0 0 16px">${KIND_LABEL[kind]} from hirestella.ai</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="vertical-align:top;color:#5b6080;white-space:nowrap"><b>${escape(label)}</b></td><td style="white-space:pre-wrap">${escape(value)}</td></tr>`,
    )
    .join('')}</table>
<p style="color:#5b6080;margin-top:16px">Received ${escape(receivedAt)}. Reply to this email to answer them directly.</p>
</div>`;
  return {
    to: env('LEAD_EMAIL_TO')
      .split(',')
      .map((address) => address.trim())
      .filter(Boolean),
    subject: oneLine(`${KIND_LABEL[kind]}: ${details.name}, ${details.company}`),
    text,
    html,
    replyTo: details.email,
  };
}

function visitorEmail(kind: Kind, details: Details) {
  const first = details.name.split(/\s+/)[0];
  const what =
    kind === 'partner'
      ? 'your partner application'
      : kind === 'demo'
        ? 'your demo request'
        : 'your message';
  const text = [
    `Hi ${first},`,
    '',
    `Thank you for contacting HireStella. We have received ${what} and someone from our team will be in touch with you soon.`,
    '',
    'If you want to add anything, just reply to this email.',
    '',
    'The HireStella team',
    'https://hirestella.ai',
  ].join('\n');
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#141B45">
<p>Hi ${escape(first)},</p>
<p>Thank you for contacting HireStella. We have received ${what} and someone from our team will be in touch with you soon.</p>
<p>If you want to add anything, just reply to this email.</p>
<p>The HireStella team<br><a href="https://hirestella.ai" style="color:#F26B1D">hirestella.ai</a></p>
</div>`;
  return {
    to: [details.email],
    subject: 'We have received your request | HireStella',
    text,
    html,
    /* Replies from the visitor reach the team, not the sending address. */
    replyTo: env('LEAD_EMAIL_TO').split(',')[0]?.trim(),
  };
}

async function postWebhook(details: Details, receivedAt: string) {
  const response = await fetch(env('LEAD_WEBHOOK_URL'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(env('LEAD_WEBHOOK_TOKEN')
        ? { Authorization: `Bearer ${env('LEAD_WEBHOOK_TOKEN')}` }
        : {}),
    },
    body: JSON.stringify({ ...details, source: 'hirestella-website', receivedAt }),
    signal: AbortSignal.timeout(10000),
    redirect: 'error',
  });
  if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
}

/** Returns true when the lead reached the team through at least one channel. */
export async function deliverLead(kind: Kind, details: Details) {
  const receivedAt = new Date().toISOString();
  const channels: Promise<void>[] = [];
  if (resendConfigured()) channels.push(sendEmail(teamEmail(kind, details, receivedAt)));
  if (webhookConfigured()) channels.push(postWebhook(details, receivedAt));

  const results = await Promise.allSettled(channels);
  for (const result of results)
    if (result.status === 'rejected') console.error('Lead delivery channel failed:', result.reason);
  const delivered = results.some((result) => result.status === 'fulfilled');

  if (delivered && resendConfigured()) {
    try {
      await sendEmail(visitorEmail(kind, details));
    } catch (error) {
      console.error('Lead acknowledgement email failed:', error);
    }
  }
  return delivered;
}
