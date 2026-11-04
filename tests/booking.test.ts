import test from 'node:test';
import assert from 'node:assert/strict';
import { bookedSlots, freeSlots, isFreeSlot } from '../src/lib/booking/slots';
import { BOOKING } from '../src/lib/booking/config';
import { bookingToken, readBookingToken } from '../src/lib/booking/links';
import { demoIcs } from '../src/lib/booking/ics';
import { book, bookingSchema, cancel, offeredSlots, reschedule, BookingError } from '../src/lib/booking/service';
import { resetGoogleToken } from '../src/lib/booking/google';

/* Monday 2 November 2026, 06:00 Dubai (02:00 UTC). */
const MONDAY = new Date('2026-11-02T02:00:00Z');
const dubai = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { timeZone: 'Asia/Dubai', weekday: 'short', hour: '2-digit', minute: '2-digit' }).replace(',', '');

test('slots follow the hours, the notice and the working days', () => {
  const slots = freeSlots([], MONDAY);
  /* First slot: 10:00 Dubai (06:00 + 4h notice = 10:00). Last start: 17:00, so the hour ends at 18:00. */
  assert.equal(dubai(slots[0]), 'Mon 10:00');
  const monday = slots.filter((s) => s.startsWith('2026-11-02'));
  assert.equal(dubai(monday.at(-1)!), 'Mon 17:00');
  assert.equal(monday.length, 8); // one-hour slots, 10:00 to 17:00
  assert.equal(slots.some((s) => /^(Sat|Sun)/.test(dubai(s))), false);
});

test('the notice period hides slots too soon to prepare for', () => {
  const lateMorning = new Date('2026-11-02T07:20:00Z'); // 11:20 Dubai → nothing before 15:20
  const monday = freeSlots([], lateMorning).filter((s) => s.startsWith('2026-11-02'));
  assert.equal(dubai(monday[0]), 'Mon 16:00');
});

test('a meeting in the calendar shows its hour as booked, not free', () => {
  const busy = [{ start: '2026-11-02T08:00:00Z', end: '2026-11-02T09:00:00Z' }]; // 12:00–13:00 Dubai
  const monday = freeSlots(busy, MONDAY).filter((s) => s.startsWith('2026-11-02')).map(dubai);
  assert.ok(monday.includes('Mon 11:00')); // ends as the meeting starts
  assert.ok(!monday.includes('Mon 12:00'));
  assert.ok(monday.includes('Mon 13:00')); // starts as the meeting ends
  assert.deepEqual(bookedSlots(busy, MONDAY).map(dubai), ['Mon 12:00']);
  /* A meeting off the grid blocks every hour it touches. */
  const odd = [{ start: '2026-11-02T08:30:00Z', end: '2026-11-02T09:15:00Z' }]; // 12:30–13:15 Dubai
  assert.deepEqual(bookedSlots(odd, MONDAY).map(dubai), ['Mon 12:00', 'Mon 13:00']);
});

test('only offered slots can be booked', () => {
  assert.equal(isFreeSlot('2026-11-02T06:00:00.000Z', [], MONDAY), true); // 10:00 Dubai
  assert.equal(isFreeSlot('2026-11-02T06:10:00.000Z', [], MONDAY), false); // off the grid
  assert.equal(isFreeSlot('2026-11-07T06:00:00.000Z', [], MONDAY), false); // Saturday
  assert.equal(isFreeSlot('not a date', [], MONDAY), false);
});

test('the slots cover the booking window', () => {
  const slots = freeSlots([], MONDAY);
  const last = new Date(slots.at(-1)!).getTime();
  /* Monday 2 November: open to the end of October 2027, and the last weekday there is Friday 29 October. */
  assert.equal(new Date(last).toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' }), '2027-10-29');
});

test('manage links open only the booking they were issued for', () => {
  process.env.BOOKING_LINK_SECRET = 'x'.repeat(32);
  const token = bookingToken('abc123def');
  assert.equal(readBookingToken(token), 'abc123def');
  assert.equal(readBookingToken(token.replace('abc123def', 'abc123deg')), null);
  assert.equal(readBookingToken(`${token}x`), null);
  assert.equal(readBookingToken('abc123def.forged'), null);
  assert.equal(readBookingToken(42), null);
  process.env.BOOKING_LINK_SECRET = 'y'.repeat(32);
  assert.equal(readBookingToken(token), null);
});

test('the calendar file is valid and escapes text', () => {
  const ics = demoIcs({ id: 'e1', start: '2026-11-02T06:00:00Z', end: '2026-11-02T07:00:00Z', title: 'Demo, HireStella', description: 'Line one\nLine; two', meetLink: 'https://meet.google.com/abc' });
  assert.match(ics, /DTSTART:20261102T060000Z\r\n/);
  assert.match(ics, /SUMMARY:Demo\\, HireStella/);
  assert.match(ics, /DESCRIPTION:Line one\\nLine\\; two/);
  assert.ok(ics.split('\r\n').every((l) => Buffer.byteLength(l) <= 75));
});

/* ── the whole flow, with Google, Resend and the sheet simulated ── */
const SHEET = 'https://script.google.com/macros/s/test/exec';
type Call = { url: string; method: string; body: unknown };

function withServices(fn: (calls: Call[], events: Map<string, Record<string, unknown>>) => Promise<void>, busy: { start: string; end: string }[] = []) {
  return async () => {
    const saved = { ...process.env };
    const realFetch = globalThis.fetch;
    resetGoogleToken();
    Object.assign(process.env, {
      GOOGLE_CLIENT_ID: 'id',
      GOOGLE_CLIENT_SECRET: 'secret',
      GOOGLE_REFRESH_TOKEN: 'refresh',
      BOOKING_LINK_SECRET: 'z'.repeat(32),
      RESEND_API_KEY: 're_test',
      LEAD_EMAIL_TO: 'team@hirestella.ai',
      LEAD_EMAIL_FROM: 'HireStella <hello@hirestella.ai>',
      BOOKINGS_SHEET_URL: SHEET,
      BOOKINGS_SHEET_TOKEN: 'sheet-secret',
    });
    const calls: Call[] = [];
    const events = new Map<string, Record<string, unknown>>();
    globalThis.fetch = (async (input: string | URL, init: RequestInit = {}) => {
      const url = String(input);
      const method = init.method || 'GET';
      const body = typeof init.body === 'string' ? (url.includes('oauth2') ? init.body : JSON.parse(init.body)) : undefined;
      calls.push({ url, method, body });
      const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status });
      if (url.includes('oauth2.googleapis.com/token')) return json({ access_token: 'at', expires_in: 3600 });
      if (url.endsWith('/freeBusy')) return json({ calendars: { primary: { busy } } });
      if (url.includes('api.resend.com')) return json({ id: `re_${calls.length}` });
      if (url === SHEET) return json({ status: 200 });
      const match = url.match(/\/events(?:\/([^?]+))?/);
      if (match) {
        const id = match[1] ? decodeURIComponent(match[1]) : '';
        if (method === 'POST') {
          const ev = { ...(body as object), id: 'evt12345', status: 'confirmed', hangoutLink: 'https://meet.google.com/abc-defg-hij' } as Record<string, unknown>;
          events.set('evt12345', ev);
          return json(ev);
        }
        const ev = events.get(id);
        if (!ev) return json({ error: 'not found' }, 404);
        if (method === 'PATCH') {
          Object.assign(ev, body as object);
          return json(ev);
        }
        if (method === 'DELETE') {
          ev.status = 'cancelled';
          return new Response(null, { status: 204 });
        }
        return json(ev);
      }
      return json({ error: 'unexpected' }, 500);
    }) as typeof fetch;
    try {
      await fn(calls, events);
    } finally {
      globalThis.fetch = realFetch;
      process.env = saved;
      resetGoogleToken();
    }
  };
}

const guest = bookingSchema.parse({
  start: '2026-11-02T06:00:00.000Z',
  name: 'Sara Ahmed',
  email: 'sara@smileclinic.ae',
  phone: '+971 50 123 4567',
  company: 'Smile Clinic',
  problem: 'Missed calls after hours',
  source: 'site',
  gclid: 'abc123',
});

test('booking creates the Meet event, emails from HireStella and adds the sheet row', withServices(async (calls) => {
  const result = await book(guest, 'https://hirestella.ai', MONDAY);
  assert.equal(result.meetLink, 'https://meet.google.com/abc-defg-hij');

  const create = calls.find((c) => c.method === 'POST' && /\/events\?/.test(c.url))!;
  assert.match(create.url, /conferenceDataVersion=1/);
  assert.match(create.url, /sendUpdates=none/); // Google sends nothing; the site does
  const ev = create.body as Record<string, any>;
  assert.equal(ev.start.dateTime, '2026-11-02T06:00:00.000Z');
  assert.equal(ev.end.dateTime, '2026-11-02T07:00:00.000Z');
  assert.equal(ev.conferenceData.createRequest.conferenceSolutionKey.type, 'hangoutsMeet');
  assert.deepEqual(ev.attendees, [{ email: 'sara@smileclinic.ae', displayName: 'Sara Ahmed' }]);

  const mails = calls.filter((c) => c.url.includes('api.resend.com')).map((c) => c.body as Record<string, any>);
  const toGuest = mails.find((m) => m.to[0] === 'sara@smileclinic.ae')!;
  assert.equal(toGuest.from, 'HireStella <hello@hirestella.ai>');
  assert.match(toGuest.html, /meet\.google\.com\/abc-defg-hij/);
  assert.match(toGuest.html, /\/booking\/manage\?t=/);
  assert.equal(toGuest.attachments[0].filename, 'hirestella-demo.ics');
  const toTeam = mails.find((m) => m.to[0] === 'team@hirestella.ai')!;
  assert.equal(toTeam.reply_to, 'sara@smileclinic.ae');

  const row = calls.find((c) => c.url === SHEET)!.body as Record<string, any>;
  assert.equal(row.form, 'Booked demo (website)');
  assert.equal(row.meetingLink, 'https://meet.google.com/abc-defg-hij');
  assert.equal(row.bookingId, 'evt12345');
  assert.equal(row.bookingStatus, 'Booked');
  assert.equal(row.visitorEmail, 'Sent');
  assert.equal(row.gclid, 'abc123');
}));

test('a taken slot is refused before anything is created', withServices(async (calls) => {
  await assert.rejects(book(guest, 'https://hirestella.ai', MONDAY), (e: unknown) => e instanceof BookingError && e.status === 409);
  assert.equal(calls.some((c) => c.method === 'POST' && /\/events/.test(c.url)), false);
}, [{ start: '2026-11-02T06:00:00Z', end: '2026-11-02T07:00:00Z' }]));

test('the manage link moves and cancels the booking, and the sheet follows', withServices(async (calls) => {
  await book(guest, 'https://hirestella.ai', MONDAY);
  const token = bookingToken('evt12345');
  const moved = await reschedule(token, '2026-11-03T08:00:00.000Z', 'https://hirestella.ai', MONDAY);
  assert.equal(moved.start, '2026-11-03T08:00:00.000Z');
  const updates = () => calls.filter((c) => c.url === SHEET && (c.body as any).action === 'update').map((c) => (c.body as any).fields);
  assert.deepEqual(updates()[0], { meetingTime: '2026-11-03T08:00:00.000Z', bookingStatus: 'Rescheduled' });
  await cancel(token);
  assert.deepEqual(updates()[1], { bookingStatus: 'Cancelled' });
  await assert.rejects(cancel(token), (e: unknown) => e instanceof BookingError && e.status === 410);
  await assert.rejects(cancel('evt12345.forged'), (e: unknown) => e instanceof BookingError && e.status === 404);
}));

test('without the Google settings the calendar is simply not offered', async () => {
  const saved = { ...process.env };
  delete process.env.GOOGLE_REFRESH_TOKEN;
  try {
    assert.deepEqual(await offeredSlots(MONDAY), { configured: false, slots: [], booked: [] });
  } finally {
    process.env = saved;
  }
});
