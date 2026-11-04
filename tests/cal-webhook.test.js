import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { POST, signatureValid } from '../src/lib/cal-webhook.js';

const SECRET = 'whsec-test';
const SHEET = 'https://script.google.com/macros/s/test/exec';

function hook(body, { secret = SECRET, signature } = {}) {
  const raw = JSON.stringify(body);
  const sig = signature ?? createHmac('sha256', secret).update(raw).digest('hex');
  return new Request('https://hirestella.ai/api/cal-webhook', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-cal-signature-256': sig },
    body: raw,
  });
}

const created = {
  triggerEvent: 'BOOKING_CREATED',
  payload: {
    uid: 'bk-111',
    startTime: '2026-10-31T10:00:00Z',
    attendees: [{ name: 'Sara Ahmed', email: 'sara@smileclinic.ae' }],
    responses: {
      name: { value: 'Sara Ahmed' },
      email: { value: 'sara@smileclinic.ae' },
      phone: { value: '+971 50 123 4567' },
      business: { value: 'Smile Clinic' },
      notes: { value: 'Missed calls after hours' },
    },
    metadata: { videoCallUrl: 'https://meet.google.com/abc-defg-hij', source: 'ads_get', gclid: 'abc123' },
  },
};

/* The sheet answers `sheet(body)` (default: accepted); `sent` records every row/update. */
function withSheet(fn, sheet = () => ({ status: 200 })) {
  return async () => {
    const saved = { ...process.env };
    const realFetch = globalThis.fetch;
    Object.assign(process.env, { CALCOM_WEBHOOK_SECRET: SECRET, BOOKINGS_SHEET_URL: SHEET, BOOKINGS_SHEET_TOKEN: 'sheet-secret' });
    const sent = [];
    globalThis.fetch = async (url, init) => {
      const body = JSON.parse(init.body);
      sent.push(body);
      return new Response(JSON.stringify(sheet(body)));
    };
    try { await fn(sent); } finally { globalThis.fetch = realFetch; process.env = saved; }
  };
}

test('a new booking becomes a sheet row with the meeting time and Meet link', withSheet(async (sent) => {
  assert.equal((await POST(hook(created))).status, 200);
  assert.equal(sent.length, 1);
  const row = sent[0];
  assert.equal(row.action, 'add');
  assert.equal(row.token, 'sheet-secret');
  assert.equal(row.form, 'Cal.com booking (/get)');
  assert.equal(row.name, 'Sara Ahmed');
  assert.equal(row.email, 'sara@smileclinic.ae');
  assert.equal(row.phone, '+971 50 123 4567');
  assert.equal(row.company, 'Smile Clinic');
  assert.equal(row.problem, 'Missed calls after hours');
  assert.equal(row.meetingTime, '2026-10-31T10:00:00Z');
  assert.equal(row.meetingLink, 'https://meet.google.com/abc-defg-hij');
  assert.equal(row.bookingId, 'bk-111');
  assert.equal(row.bookingStatus, 'Booked');
  assert.equal(row.gclid, 'abc123');
  assert.match(row.rescheduleUrl, /bk-111/);
}));

test('the booking source names the website, the ads page or a direct link', withSheet(async (sent) => {
  const as = (source) => ({ ...created, payload: { ...created.payload, metadata: { ...created.payload.metadata, source } } });
  await POST(hook(as('site_modal')));
  await POST(hook(as(undefined)));
  assert.equal(sent[0].form, 'Cal.com booking (website)');
  assert.equal(sent[1].form, 'Cal.com booking (direct link)');
}));

test('a reschedule moves the original row to the new time and booking ID', withSheet(async (sent) => {
  const moved = {
    triggerEvent: 'BOOKING_RESCHEDULED',
    payload: { ...created.payload, uid: 'bk-222', rescheduleUid: 'bk-111', startTime: '2026-11-02T08:00:00Z' },
  };
  assert.equal((await POST(hook(moved))).status, 200);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].action, 'update');
  assert.equal(sent[0].bookingId, 'bk-111');
  assert.equal(sent[0].fields.bookingId, 'bk-222');
  assert.equal(sent[0].fields.meetingTime, '2026-11-02T08:00:00Z');
  assert.equal(sent[0].fields.bookingStatus, 'Rescheduled');
}));

test('a reschedule of a booking the sheet never had adds a row instead', withSheet(async (sent) => {
  const moved = { triggerEvent: 'BOOKING_RESCHEDULED', payload: { ...created.payload, uid: 'bk-333', rescheduleUid: 'bk-unknown' } };
  assert.equal((await POST(hook(moved))).status, 200);
  assert.deepEqual(sent.map((s) => s.action), ['update', 'add']);
  assert.equal(sent[1].bookingStatus, 'Rescheduled');
}, (body) => (body.action === 'update' ? { status: 404 } : { status: 200 })));

test('a cancellation marks the row cancelled', withSheet(async (sent) => {
  const cancelled = { triggerEvent: 'BOOKING_CANCELLED', payload: { uid: 'bk-111', status: 'CANCELLED' } };
  assert.equal((await POST(hook(cancelled))).status, 200);
  assert.equal(sent[0].action, 'update');
  assert.equal(sent[0].bookingId, 'bk-111');
  assert.deepEqual(sent[0].fields, { bookingStatus: 'Cancelled' });
}));

test('an unsigned or wrongly signed call writes nothing', withSheet(async (sent) => {
  assert.equal((await POST(hook(created, { signature: '' }))).status, 401);
  assert.equal((await POST(hook(created, { secret: 'someone-else' }))).status, 401);
  assert.equal((await POST(hook(created, { signature: 'deadbeef' }))).status, 401);
  assert.equal(sent.length, 0);
}));

test('a sheet that is down never fails the webhook', withSheet(async () => {
  globalThis.fetch = async () => { throw new Error('network down'); };
  assert.equal((await POST(hook(created))).status, 200);
}));

test('without the webhook secret nothing is accepted', withSheet(async (sent) => {
  delete process.env.CALCOM_WEBHOOK_SECRET;
  assert.equal((await POST(hook(created))).status, 503);
  assert.equal(sent.length, 0);
}));

test('the signature check is exact', () => {
  const sig = createHmac('sha256', 's').update('body').digest('hex');
  assert.equal(signatureValid('body', sig, 's'), true);
  assert.equal(signatureValid('body', sig.toUpperCase(), 's'), true);
  assert.equal(signatureValid('body!', sig, 's'), false);
  assert.equal(signatureValid('body', sig, ''), false);
});
