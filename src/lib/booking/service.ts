/**
 * Booking a demo end to end: offer free slots, book one (re-checked against the
 * live calendar so two visitors cannot take the same time), move it, cancel it.
 * Each step emails the guest and the team from HireStella's own address and
 * keeps the bookings sheet in step. Emails and the sheet never undo a booking:
 * once the calendar has it, it stands.
 */
import { z } from 'zod';
import { phoneField } from '../lead-schema';
import { logBooking, updateBooking } from '../booking-sheet.js';
import { resendConfigured } from '../lead-delivery';
import { BOOKING } from './config';
import { bookedSlots, freeSlots, isFreeSlot, window, type Busy } from './slots';
import { busyTimes, calendarConfigured, cancelDemoEvent, createDemoEvent, getDemoEvent, moveDemoEvent, type DemoEvent } from './google';
import { bookingToken, linksConfigured, readBookingToken } from './links';
import { guestCancelled, guestConfirmation, guestMoved, sendEmail, teamChanged, teamNotice, type Booked } from './emails';

export const bookingConfigured = () => calendarConfigured() && linksConfigured();

const SOURCES = { site: 'Booked demo (website)', ads_get: 'Booked demo (/get)' } as const;
const TRACKING = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid'] as const;

export const bookingSchema = z.object({
  start: z.string().datetime(),
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: phoneField,
  company: z.string().trim().min(2).max(160),
  problem: z.string().trim().max(2000).optional().default(''),
  heardFrom: z.string().trim().max(60).optional().default(''),
  source: z.enum(['site', 'ads_get']).default('site'),
  page: z.string().trim().max(300).optional().default(''),
  website: z.string().max(0).optional().default(''),
  utm_source: z.string().trim().max(200).optional(),
  utm_medium: z.string().trim().max(200).optional(),
  utm_campaign: z.string().trim().max(200).optional(),
  utm_content: z.string().trim().max(200).optional(),
  utm_term: z.string().trim().max(200).optional(),
  gclid: z.string().trim().max(200).optional(),
  gbraid: z.string().trim().max(200).optional(),
  wbraid: z.string().trim().max(200).optional(),
  fbclid: z.string().trim().max(200).optional(),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export class BookingError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const endOf = (start: string) => new Date(new Date(start).getTime() + BOOKING.lengthMinutes * 60_000).toISOString();
const manageUrl = (origin: string, id: string) => `${origin}/booking/manage?t=${encodeURIComponent(bookingToken(id))}`;

async function busyNow(now: Date) {
  const { timeMin, timeMax } = window(now);
  return busyTimes(timeMin, timeMax);
}

/** Emails never fail a booking; each outcome is reported for the sheet. */
async function mail(message: Parameters<typeof sendEmail>[0] | null) {
  if (!message || !resendConfigured() || !message.to.length) return { status: 'Not configured', id: '' };
  try {
    return { status: 'Sent', id: await sendEmail(message) };
  } catch (error) {
    console.error('Booking email failed:', error);
    return { status: 'Failed', id: '' };
  }
}

export async function offeredSlots(now = new Date()) {
  if (!bookingConfigured()) return { configured: false, slots: [] as string[], booked: [] as string[] };
  const busy = await busyNow(now);
  return { configured: true, slots: freeSlots(busy, now), booked: bookedSlots(busy, now) };
}

export async function book(input: BookingInput, origin: string, now = new Date()) {
  if (!bookingConfigured()) throw new BookingError(503, 'Booking is not configured.');
  if (!isFreeSlot(input.start, await busyNow(now), now)) throw new BookingError(409, 'That time has just been taken. Please pick another.');
  const start = new Date(input.start).toISOString();
  const end = endOf(start);
  const source = SOURCES[input.source];
  const event = await createDemoEvent({
    start,
    end,
    summary: `${BOOKING.title}: ${input.name}, ${input.company}`,
    description: [
      `Booked from ${source}.`,
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone}`,
      `Business: ${input.company}`,
      input.problem ? `Notes: ${input.problem}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    guest: { name: input.name, email: input.email },
    extra: { phone: input.phone, company: input.company, source },
  });
  const booked: Booked = { ...input, id: event.id, start, end, meetLink: event.meetLink, manageUrl: manageUrl(origin, event.id), source };
  const [guest, team] = await Promise.all([mail(guestConfirmation(booked)), mail(teamNotice(booked))]);
  await logBooking({
    receivedAt: now.toISOString(),
    form: source,
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    problem: input.problem,
    heardFrom: input.heardFrom,
    teamEmail: team.status,
    visitorEmail: guest.status,
    visitorEmailId: guest.id,
    meetingTime: start,
    meetingLink: event.meetLink,
    rescheduleUrl: booked.manageUrl,
    cancelUrl: booked.manageUrl,
    bookingId: event.id,
    bookingStatus: 'Booked',
    page: input.page,
    ...Object.fromEntries(TRACKING.filter((k) => input[k]).map((k) => [k, input[k]])),
  });
  return { id: event.id, start, end, meetLink: event.meetLink };
}

/** The booking a manage link points to, if it is still on. */
async function fromToken(token: unknown): Promise<DemoEvent> {
  if (!bookingConfigured()) throw new BookingError(503, 'Booking is not configured.');
  const id = readBookingToken(token);
  if (!id) throw new BookingError(404, 'This link is not valid.');
  const event = await getDemoEvent(id);
  if (!event || event.status === 'cancelled') throw new BookingError(410, 'This booking has been cancelled.');
  return event;
}

export async function bookingDetails(token: unknown, now = new Date()) {
  const e = await fromToken(token);
  return { start: e.start, end: e.end, meetLink: e.meetLink, firstName: e.name.split(/\s+/)[0] || '', past: new Date(e.start) < now };
}

/** Free slots for moving this booking: its own time does not count as busy. */
export async function slotsForMove(token: unknown, now = new Date()) {
  const e = await fromToken(token);
  const busy = (await busyNow(now)).filter((b: Busy) => !(b.start === e.start || new Date(b.start).getTime() === new Date(e.start).getTime()));
  return freeSlots(busy, now).filter((s) => new Date(s).getTime() !== new Date(e.start).getTime());
}

export async function reschedule(token: unknown, start: string, origin: string, now = new Date()) {
  const e = await fromToken(token);
  if (new Date(e.start) < now) throw new BookingError(409, 'This demo has already taken place.');
  const busy = (await busyNow(now)).filter((b) => new Date(b.start).getTime() !== new Date(e.start).getTime());
  if (!isFreeSlot(start, busy, now)) throw new BookingError(409, 'That time has just been taken. Please pick another.');
  const newStart = new Date(start).toISOString();
  const moved = await moveDemoEvent(e.id, newStart, endOf(newStart));
  const who = { name: e.name, email: e.email, company: e.extra.company || '', start: newStart };
  const booked: Booked = {
    ...who,
    id: e.id,
    end: endOf(newStart),
    meetLink: moved.meetLink || e.meetLink,
    phone: e.extra.phone || '',
    manageUrl: manageUrl(origin, e.id),
    source: e.extra.source || '',
  };
  await Promise.all([mail(guestMoved(booked)), mail(teamChanged(who, 'moved'))]);
  await updateBooking(e.id, { meetingTime: newStart, bookingStatus: 'Rescheduled' });
  return { start: newStart, end: booked.end, meetLink: booked.meetLink };
}

export async function cancel(token: unknown) {
  const e = await fromToken(token);
  await cancelDemoEvent(e.id);
  const who = { name: e.name, email: e.email, company: e.extra.company || '', start: e.start };
  await Promise.all([mail(guestCancelled(who)), mail(teamChanged(who, 'cancelled'))]);
  await updateBooking(e.id, { bookingStatus: 'Cancelled' });
  return { cancelled: true };
}
