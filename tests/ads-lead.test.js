import test from 'node:test';
import assert from 'node:assert/strict';
import { POST, validate } from '../src/lib/ads-lead/lead.js';

const valid = {
  name: 'Sara Ahmed',
  business: 'Smile Clinic',
  email: 'sara@smileclinic.ae',
  phone: '+971 50 123 4567',
  website: '',
  utm_source: 'google',
  gclid: 'abc123',
};

function post(body, headers = {}) {
  return new Request('https://hirestella.ai/api/get-lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://hirestella.ai', host: 'hirestella.ai', ...headers },
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
    delete process.env.BOOKINGS_SHEET_URL;
    delete process.env.BOOKINGS_SHEET_TOKEN;
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
  assert.equal(validate({ ...valid, email: '' }), null);
  assert.equal(validate({ ...valid, email: 'sara@clinic' }), null);
  assert.equal(validate({ ...valid, email: 'a@b.ae, c@d.ae' }), null);
  assert.equal(validate({ ...valid, name: 'A' }), null);
});

test('a delivered lead is emailed to the team, then confirmed to the visitor', withResend(async (sent) => {
  const res = await POST(post(valid));
  assert.equal(res.status, 200);
  assert.equal(sent.length, 2);
  const [team, visitor] = sent.map((s) => s.body);
  assert.equal(sent[0].url, 'https://api.resend.com/emails');
  assert.deepEqual(team.to, ['team@example.com']);
  assert.equal(team.reply_to, 'sara@smileclinic.ae');
  assert.match(team.subject, /Demo request \(ads\): Sara Ahmed, Smile Clinic/);
  assert.match(team.text, /Email: sara@smileclinic\.ae/);
  assert.match(team.text, /Phone: \+971 50 123 4567/);
  assert.match(team.text, /gclid: abc123/);
  assert.deepEqual(visitor.to, ['sara@smileclinic.ae']);
  assert.equal(visitor.reply_to, 'team@example.com');
  assert.match(visitor.text, /^Hi Sara,/);
}));

test('a failed confirmation email does not lose the lead', withResend(async (sent) => {
  const okFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => (sent.length ? new Response('{}', { status: 500 }) : okFetch(url, init));
  const res = await POST(post(valid));
  assert.equal(res.status, 200);
  assert.equal(sent.length, 1);
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

const SHEET = 'https://script.google.com/macros/s/test/exec';
const withSheet = (fn) => withResend(async (sent) => {
  Object.assign(process.env, { BOOKINGS_SHEET_URL: SHEET, BOOKINGS_SHEET_TOKEN: 'sheet-secret' });
  await fn(sent);
});

test('every lead is recorded in the bookings sheet with both email outcomes', withSheet(async (sent) => {
  const okFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    await okFetch(url, init);
    return url === SHEET ? new Response('{"status":200,"message":"Added"}') : new Response('{"id":"re_123"}');
  };
  const res = await POST(post(valid));
  assert.equal(res.status, 200);
  assert.equal(sent.length, 3);
  const row = sent[2];
  assert.equal(row.url, SHEET);
  assert.equal(row.body.token, 'sheet-secret');
  assert.equal(row.body.action, 'add');
  assert.equal(row.body.form, 'Ads landing (/get)');
  assert.equal(row.body.company, 'Smile Clinic');
  assert.equal(row.body.phone, '+971 50 123 4567');
  assert.equal(row.body.teamEmail, 'Sent');
  assert.equal(row.body.visitorEmail, 'Sent');
  assert.equal(row.body.visitorEmailId, 're_123');
  assert.equal(row.body.gclid, 'abc123');
}));

test('a failed confirmation email is recorded as Failed in the sheet', withSheet(async (sent) => {
  const okFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    await okFetch(url, init);
    if (url === SHEET) return new Response('{"status":200}');
    return sent.length === 2 ? new Response('{}', { status: 500 }) : new Response('{"id":"re_team"}');
  };
  assert.equal((await POST(post(valid))).status, 200);
  assert.equal(sent[2].body.teamEmail, 'Sent');
  assert.equal(sent[2].body.visitorEmail, 'Failed');
  assert.equal(sent[2].body.visitorEmailId, '');
}));

test('a sheet that refuses or is down never loses the lead', withSheet(async () => {
  const okFetch = globalThis.fetch;
  /* Apps Script answers 200 with the real status in the body. */
  globalThis.fetch = async (url, init) =>
    url === SHEET ? new Response('{"status":401,"message":"Unauthorized"}') : okFetch(url, init);
  assert.equal((await POST(post(valid))).status, 200);
  globalThis.fetch = async (url, init) => {
    if (url === SHEET) throw new Error('network down');
    return okFetch(url, init);
  };
  assert.equal((await POST(post(valid))).status, 200);
}));

test('without Resend or a webhook the function says so', async () => {
  const saved = { ...process.env };
  delete process.env.RESEND_API_KEY; delete process.env.LEAD_WEBHOOK_URL;
  try { assert.equal((await POST(post(valid))).status, 503); } finally { process.env = saved; }
});
