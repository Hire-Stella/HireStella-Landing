/* Shared by the booking API routes. */
import { NextResponse } from 'next/server';
import { BookingError } from './service';

export const noStore = { 'Cache-Control': 'no-store' };

export function reply(status: number, body: unknown) {
  return NextResponse.json(body, { status, headers: noStore });
}

/** The site's own address for links in emails: the canonical one when set. */
export function siteOrigin(request: Request) {
  const canonical = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '');
  return canonical || new URL(request.url).origin;
}

/** A small JSON body, or null. */
export async function readJson(request: Request, limit = 8000): Promise<Record<string, unknown> | null> {
  if (!request.headers.get('content-type')?.includes('application/json')) return null;
  const raw = await request.text();
  if (raw.length > limit) return null;
  try {
    const body = JSON.parse(raw);
    return body && typeof body === 'object' ? body : null;
  } catch {
    return null;
  }
}

/** A BookingError becomes its status and message; anything else is logged and hidden. */
export function failure(error: unknown) {
  if (error instanceof BookingError) return reply(error.status, { error: error.message });
  console.error('Booking failed:', error);
  return reply(502, { error: 'The calendar is not reachable right now. Please try again, or request a callback.' });
}
