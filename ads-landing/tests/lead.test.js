import test from 'node:test';
import assert from 'node:assert/strict';
import { POST, validate } from '../api/lead.js';

const valid = {
  name: 'Sara Ahmed',
  business: 'Smile Clinic',
  phone: '+971 50 123 4567',
  industry: 'Clinics & wellness',
  need: 'Bookings & reminders',
  website: '',
  utm_source: 'google',
  gclid: 'abc123',
};

function post(body, headers = {}) {
  return new Request('https://ads.hirestella.ai/api/lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://ads.hirestella.ai', host: 'ads.hirestella.ai', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function withResend(fn) {
  return async () => {
    const saved = { ...process.env };
    const realFetch = globalThis.fetch;
    const sent = [];
    Object.assign(process.env, { RESEND_API_KEY: 're_test', LEAD_EMAIL_TO: 'team@example.com', LEAD_EMAIL_FROM: 'Leads <leads@example.com>' });
    delete process.env.LEAD_WEBHOOK_URL;
    globalThis.fetch = async (url, init) => { sent.push({ url, body: JSON.parse(init.body) }); return new Response('{}', { status: 200 }); };
    try { await fn(sent); } finally { globalThis.fetch = realFetch; process.env = saved; }
  };
}

test('a complete lead validates and keeps its ad tracking', () => {
  const lead = validate(valid);
  assert.equal(lead.phone, '+971 50 123 4567');
  assert.equal(lead.gclid, 'abc123');
});

test('malformed leads are refused', () => {
  assert.equal(validate({ ...valid, phone: '12345' }), null);
  assert.equal(validate({ ...valid, phone: 'call me' }), null);
  assert.equal(validate({ ...valid, industry: 'Mining' }), null);
  assert.equal(validate({ ...valid, need: '' }), null);
  assert.equal(validate({ ...valid, name: 'A' }), null);
});

test('a delivered lead is emailed to the team', withResend(async (sent) => {
  const res = await POST(post(valid));
  assert.equal(res.status, 200);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, 'https://api.resend.com/emails');
  assert.deepEqual(sent[0].body.to, ['team@example.com']);
  assert.match(sent[0].body.subject, /Sara Ahmed, Smile Clinic/);
  assert.match(sent[0].body.text, /WhatsApp: \+971 50 123 4567/);
  assert.match(sent[0].body.text, /gclid: abc123/);
}));

test('the honeypot is answered as success but nothing is sent', withResend(async (sent) => {
  const res = await POST(post({ ...valid, website: 'spam.example' }));
  assert.equal(res.status, 200);
  assert.equal(sent.length, 0);
}));

test('posts from another site are refused', withResend(async (sent) => {
  const res = await POST(post(valid, { origin: 'https://evil.example' }));
  assert.equal(res.status, 403);
  assert.equal(sent.length, 0);
}));

test('a header-breaking name cannot add email headers', withResend(async (sent) => {
  await POST(post({ ...valid, name: 'Sara\r\nBcc: x@evil.example' }));
  assert.doesNotMatch(sent[0].body.subject, /[\r\n]/);
}));

test('without Resend or a webhook the function says so', async () => {
  const saved = { ...process.env };
  delete process.env.RESEND_API_KEY; delete process.env.LEAD_WEBHOOK_URL;
  try { assert.equal((await POST(post(valid))).status, 503); } finally { process.env = saved; }
});
