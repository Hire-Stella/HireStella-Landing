/**
 * The "manage your booking" link in the guest's email: the event ID plus an
 * HMAC with BOOKING_LINK_SECRET, so only the person who got the email can move
 * or cancel that one booking, and nobody can guess another.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

const secret = () => process.env.BOOKING_LINK_SECRET?.trim() || '';

export const linksConfigured = () => secret().length >= 24;

const sign = (id: string) => createHmac('sha256', secret()).update(`booking:${id}`).digest('base64url');

export function bookingToken(id: string) {
  return `${id}.${sign(id)}`;
}

/** The event ID the token names, or null if it was not issued by this site. */
export function readBookingToken(token: unknown): string | null {
  if (typeof token !== 'string' || !linksConfigured()) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const id = token.slice(0, dot);
  if (!/^[a-z0-9]{5,1024}$/i.test(id)) return null;
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(id));
  return given.length === expected.length && timingSafeEqual(given, expected) ? id : null;
}
