/**
 * POST /api/lead: the ads landing page's lead delivery. Server-only: it reads secrets.
 *
 * Same approach as hirestella.ai: the lead is emailed to the team through the
 * Resend REST API, and can also be POSTed to a webhook (CRM, sheet, automation).
 *
 * Environment variables (set on the Vercel project, never in this file):
 *   RESEND_API_KEY    Resend API key
 *   LEAD_EMAIL_TO     who receives leads, comma-separated
 *   LEAD_EMAIL_FROM   sender on a domain verified in Resend, e.g. "HireStella <leads@hirestella.ai>"
 *   LEAD_WEBHOOK_URL  optional, https only
 *   LEAD_WEBHOOK_TOKEN optional bearer token for the webhook
 *
 * A lead counts as delivered when at least one channel got it to the team.
 * There is no acknowledgement email to the visitor: the form asks for a
 * WhatsApp number, not an email, and the team replies on WhatsApp.
 */

const INDUSTRIES = [
  'Clinics & wellness', 'Real estate', 'Automotive', 'Retail & e-commerce', 'Travel & hospitality',
  'Restaurants & catering', 'Trading & B2B', 'Education & training', 'Financial services', 'Other',
];
const START_WITH = [
  'Answering enquiries', 'Phone calls', 'Bookings & reminders', 'Lead follow-up',
  'Social media & marketing', 'A new website', 'Not sure yet',
];
const TRACKING = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid'];

/* Field order and labels for the team email. */
const FIELDS = [
  ['name', 'Name'],
  ['business', 'Business'],
  ['phone', 'WhatsApp'],
  ['industry', 'Industry'],
  ['need', 'Start with'],
  ['utm_source', 'utm_source'],
  ['utm_medium', 'utm_medium'],
  ['utm_campaign', 'utm_campaign'],
  ['utm_content', 'utm_content'],
  ['utm_term', 'utm_term'],
  ['gclid', 'gclid'],
  ['gbraid', 'gbraid'],
  ['wbraid', 'wbraid'],
  ['fbclid', 'fbclid'],
  ['page', 'Page'],
];

const env = (name) => process.env[name]?.trim() || '';
const resendConfigured = () => Boolean(env('RESEND_API_KEY') && env('LEAD_EMAIL_TO') && env('LEAD_EMAIL_FROM'));
const webhookConfigured = () => env('LEAD_WEBHOOK_URL').startsWith('https://');

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const escape = (v) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/* Header-safe: a name with a newline must not become a new header line. */
const oneLine = (v) => v.replace(/[\r\n]+/g, ' ').slice(0, 120);
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/* Only posts from this site's own pages: the host the browser asked for. */
function originAllowed(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  let host;
  try { host = new URL(origin).host; } catch { return false; }
  const allowed = [request.headers.get('x-forwarded-host'), request.headers.get('host'), new URL(request.url).host]
    .filter(Boolean)
    .map((h) => h.split(',')[0].trim().toLowerCase());
  return allowed.includes(host.toLowerCase());
}

/** Returns the clean lead, or null if anything is missing or malformed. */
export function validate(body) {
  if (!body || typeof body !== 'object') return null;
  const lead = {
    name: str(body.name, 100),
    business: str(body.business, 160),
    phone: str(body.phone, 24),
    industry: str(body.industry, 60),
    need: str(body.need, 60),
    page: str(body.page, 300),
  };
  const digits = lead.phone.replace(/\D/g, '').length;
  if (lead.name.length < 2 || lead.business.length < 2) return null;
  if (!/^\+?[\d\s()-]+$/.test(lead.phone) || digits < 8 || digits > 15) return null;
  if (!INDUSTRIES.includes(lead.industry) || !START_WITH.includes(lead.need)) return null;
  for (const key of TRACKING) {
    const value = str(body[key], 200);
    if (value) lead[key] = value;
  }
  return lead;
}

async function sendEmail(lead, receivedAt) {
  const rows = FIELDS.map(([key, label]) => [label, lead[key] || '']).filter(([, v]) => v);
  const waDigits = lead.phone.replace(/\D/g, '');
  const text = [
    'Free plan request from the ads landing page',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    `Received: ${receivedAt}`,
    `Reply on WhatsApp: https://wa.me/${waDigits}`,
  ].join('\n');
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#141B45">
<h2 style="margin:0 0 16px">Free plan request from the ads landing page</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([label, value]) => `<tr><td style="vertical-align:top;color:#5b6080;white-space:nowrap"><b>${escape(label)}</b></td><td style="white-space:pre-wrap">${escape(value)}</td></tr>`)
    .join('')}</table>
<p style="margin-top:16px"><a href="https://wa.me/${waDigits}" style="color:#F26B1D">Reply on WhatsApp</a></p>
<p style="color:#5b6080">Received ${escape(receivedAt)}. They asked to be contacted on WhatsApp.</p>
</div>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env('LEAD_EMAIL_FROM'),
      to: env('LEAD_EMAIL_TO').split(',').map((a) => a.trim()).filter(Boolean),
      subject: oneLine(`Free plan request (ads): ${lead.name}, ${lead.business}`),
      text,
      html,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Resend responded ${response.status}`);
}

async function postWebhook(lead, receivedAt) {
  const response = await fetch(env('LEAD_WEBHOOK_URL'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(env('LEAD_WEBHOOK_TOKEN') ? { Authorization: `Bearer ${env('LEAD_WEBHOOK_TOKEN')}` } : {}),
    },
    body: JSON.stringify({ ...lead, source: 'hirestella-ads-landing', receivedAt }),
    signal: AbortSignal.timeout(10000),
    redirect: 'error',
  });
  if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
}

export async function POST(request) {
  if (!originAllowed(request)) return json(403, { error: 'Origin not allowed.' });
  if (!request.headers.get('content-type')?.includes('application/json')) return json(415, { error: 'JSON required.' });
  if (!resendConfigured() && !webhookConfigured()) return json(503, { error: 'Lead delivery is not configured.' });

  let body;
  try {
    const raw = await request.text();
    if (raw.length > 16000) return json(413, { error: 'Request too large.' });
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: 'Invalid request.' });
  }
  // Honeypot: a person never fills the hidden field. Answer as if it worked.
  if (typeof body?.website === 'string' && body.website.length > 0) return json(200, { received: true });

  const lead = validate(body);
  if (!lead) return json(400, { error: 'Please check the details.' });

  const receivedAt = new Date().toISOString();
  const channels = [];
  if (resendConfigured()) channels.push(sendEmail(lead, receivedAt));
  if (webhookConfigured()) channels.push(postWebhook(lead, receivedAt));
  const results = await Promise.allSettled(channels);
  for (const r of results) if (r.status === 'rejected') console.error('Lead delivery channel failed:', r.reason);
  if (!results.some((r) => r.status === 'fulfilled')) return json(502, { error: 'Delivery unavailable. Please try again.' });
  return json(200, { received: true });
}
