/**
 * Cal.com bookings → the bookings sheet.
 *
 * Cal.com calls this for the HireStella demo event (the webhook is set on that
 * event type only): BOOKING_CREATED adds a row, BOOKING_RESCHEDULED moves the
 * original row to the new time, BOOKING_CANCELLED marks it cancelled. Bookings
 * from a direct Cal.com link arrive here too, not only those made on the site.
 *
 *   CALCOM_WEBHOOK_SECRET  the secret set on the webhook in Cal.com
 *
 * Every call is signed: x-cal-signature-256 is an HMAC-SHA256 of the raw body
 * with that secret. An unsigned or wrongly signed call is refused and writes
 * nothing. Cal.com sends its own confirmation emails, so nothing is emailed here.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { logBooking, updateBooking, sheetConfigured } from './booking-sheet.js';

const env = (name) => process.env[name]?.trim() || '';
const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : typeof v === 'number' ? String(v) : '');

/* Where the booking was made, from the `metadata[source]` the embed passes. */
const SOURCES = { ads_get: 'Cal.com booking (/get)', site_modal: 'Cal.com booking (website)' };
const TRACKING = ['utm_source', 'utm_campaign', 'gclid'];

/* Constant-time check of the signature, hex as Cal.com sends it. */
export function signatureValid(raw, signature, secret) {
  if (!signature || !secret) return false;
  const expected = createHmac('sha256', secret).update(raw).digest('hex');
  const given = String(signature).trim().toLowerCase();
  if (given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

/* A booking-question answer: Cal.com sends { value } per field (or a plain value). */
function answer(responses, ...keys) {
  for (const key of keys) {
    const v = responses?.[key];
    const value = v && typeof v === 'object' && 'value' in v ? v.value : v;
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function meetingLink(p) {
  const link = str(p.metadata?.videoCallUrl, 500) || str(p.videoCallData?.url, 500);
  if (link) return link;
  const loc = str(p.location, 500);
  return /^https?:\/\//.test(loc) ? loc : '';
}

function row(p) {
  const attendee = Array.isArray(p.attendees) ? p.attendees[0] || {} : {};
  const r = p.responses || {};
  const notes = answer(r, 'notes');
  const out = {
    receivedAt: new Date().toISOString(),
    form: SOURCES[p.metadata?.source] || 'Cal.com booking (direct link)',
    name: str(answer(r, 'name') || attendee.name, 100),
    email: str(answer(r, 'email') || attendee.email, 254),
    phone: str(answer(r, 'phone', 'attendeePhoneNumber') || attendee.phoneNumber, 24),
    company: str(answer(r, 'business', 'company'), 160),
    problem: str(notes, 2000),
    teamEmail: 'Sent by Cal.com',
    visitorEmail: 'Sent by Cal.com',
    meetingTime: str(p.startTime, 40),
    meetingLink: meetingLink(p),
    rescheduleUrl: p.uid ? `https://app.cal.com/reschedule/${p.uid}` : '',
    cancelUrl: p.uid ? `https://app.cal.com/booking/${p.uid}?cancel=true` : '',
    bookingId: str(p.uid, 100),
    bookingStatus: 'Booked',
  };
  for (const key of TRACKING) {
    const value = str(p.metadata?.[key], 200);
    if (value) out[key] = value;
  }
  return out;
}

export async function POST(request) {
  const secret = env('CALCOM_WEBHOOK_SECRET');
  if (!secret || !sheetConfigured()) return json(503, { error: 'Booking records are not configured.' });

  const raw = await request.text();
  if (raw.length > 64000) return json(413, { error: 'Request too large.' });
  if (!signatureValid(raw, request.headers.get('x-cal-signature-256'), secret)) return json(401, { error: 'Bad signature.' });

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: 'Invalid JSON.' });
  }
  const p = body?.payload || {};
  if (!p.uid) return json(200, { ignored: true });

  switch (body.triggerEvent) {
    case 'BOOKING_CREATED':
      await logBooking(row(p));
      return json(200, { recorded: true });
    case 'BOOKING_RESCHEDULED': {
      /* Cal.com gives the new booking a new uid and names the old one. */
      const next = row(p);
      const moved = p.rescheduleUid
        ? await updateBooking(p.rescheduleUid, {
            meetingTime: next.meetingTime,
            meetingLink: next.meetingLink,
            rescheduleUrl: next.rescheduleUrl,
            cancelUrl: next.cancelUrl,
            bookingId: next.bookingId,
            bookingStatus: 'Rescheduled',
          })
        : false;
      if (!moved) await logBooking({ ...next, bookingStatus: 'Rescheduled' });
      return json(200, { recorded: true });
    }
    case 'BOOKING_CANCELLED':
      await updateBooking(p.uid, { bookingStatus: 'Cancelled' });
      return json(200, { recorded: true });
    default:
      return json(200, { ignored: true });
  }
}
