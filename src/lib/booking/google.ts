/**
 * Google Calendar, server-only. Reads busy times, creates the demo event with
 * a Google Meet link, moves and cancels it.
 *
 *   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET  the OAuth client (Google Cloud → Credentials)
 *   GOOGLE_REFRESH_TOKEN                      from `node scripts/google-auth.mjs`, once
 *   BOOKING_CALENDAR_ID                       where demos are created (default: primary)
 *   BOOKING_BUSY_CALENDARS                    extra calendars whose busy times block slots, comma-separated
 *
 * Moving to another Google account only means new values for these settings.
 * Google sends no emails of its own (sendUpdates=none): the site sends them.
 */
import type { Busy } from './slots';

const env = (name: string) => process.env[name]?.trim() || '';
const API = 'https://www.googleapis.com/calendar/v3';

export function calendarConfigured() {
  return Boolean(env('GOOGLE_CLIENT_ID') && env('GOOGLE_CLIENT_SECRET') && env('GOOGLE_REFRESH_TOKEN'));
}
const calendarId = () => env('BOOKING_CALENDAR_ID') || 'primary';

/* An access token lasts an hour; one is kept per server instance. */
let cached: { token: string; until: number } | null = null;

async function accessToken() {
  if (cached && cached.until > Date.now() + 60_000) return cached.token;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env('GOOGLE_CLIENT_ID'),
      client_secret: env('GOOGLE_CLIENT_SECRET'),
      refresh_token: env('GOOGLE_REFRESH_TOKEN'),
      grant_type: 'refresh_token',
    }),
    signal: AbortSignal.timeout(10000),
  });
  const data = (await response.json().catch(() => null)) as { access_token?: string; expires_in?: number } | null;
  if (!response.ok || !data?.access_token) throw new Error(`Google token refresh failed (${response.status})`);
  cached = { token: data.access_token, until: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cached.token;
}

/** Forget the cached token (tests, or after a settings change). */
export function resetGoogleToken() {
  cached = null;
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json', ...init.headers },
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Google Calendar ${init.method || 'GET'} ${path.split('?')[0]} → ${response.status}`);
  return data as T;
}

/** Busy times across the booking calendar and any extra ones. */
export async function busyTimes(timeMin: string, timeMax: string): Promise<Busy[]> {
  const ids = [calendarId(), ...env('BOOKING_BUSY_CALENDARS').split(',').map((s) => s.trim()).filter(Boolean)];
  const data = await call<{ calendars: Record<string, { busy?: Busy[]; errors?: unknown[] }> }>('/freeBusy', {
    method: 'POST',
    body: JSON.stringify({ timeMin, timeMax, items: ids.map((id) => ({ id })) }),
  });
  const out: Busy[] = [];
  for (const [id, cal] of Object.entries(data.calendars || {})) {
    if (cal.errors?.length) throw new Error(`Google Calendar cannot read busy times of ${id}`);
    out.push(...(cal.busy || []));
  }
  return out;
}

export type DemoEvent = {
  id: string;
  status?: string;
  start: string;
  end: string;
  meetLink: string;
  htmlLink?: string;
  name: string;
  email: string;
  /** What the site stored on the event: phone, company, source, …. */
  extra: Record<string, string>;
};

type GoogleEvent = {
  id: string;
  status?: string;
  htmlLink?: string;
  hangoutLink?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
  conferenceData?: { createRequest?: { status?: { statusCode?: string } }; entryPoints?: { entryPointType?: string; uri?: string }[] };
  extendedProperties?: { private?: Record<string, string> };
};

function toDemo(e: GoogleEvent): DemoEvent {
  const video = e.conferenceData?.entryPoints?.find((p) => p.entryPointType === 'video')?.uri;
  return {
    id: e.id,
    status: e.status,
    start: e.start?.dateTime || '',
    end: e.end?.dateTime || '',
    meetLink: e.hangoutLink || video || '',
    htmlLink: e.htmlLink,
    name: e.extendedProperties?.private?.name || '',
    email: e.extendedProperties?.private?.email || '',
    extra: e.extendedProperties?.private || {},
  };
}

const pending = (e: GoogleEvent) => !e.hangoutLink && e.conferenceData?.createRequest?.status?.statusCode === 'pending';

/** Google can take a moment to attach the Meet link; ask again briefly. */
async function withMeetLink(e: GoogleEvent) {
  for (let i = 0; i < 3 && pending(e); i++) {
    await new Promise((r) => setTimeout(r, 1500));
    e = await call<GoogleEvent>(`/calendars/${encodeURIComponent(calendarId())}/events/${encodeURIComponent(e.id)}`);
  }
  return e;
}

export async function createDemoEvent(input: {
  start: string;
  end: string;
  summary: string;
  description: string;
  guest: { name: string; email: string };
  extra: Record<string, string>;
}): Promise<DemoEvent> {
  const event = await call<GoogleEvent>(
    `/calendars/${encodeURIComponent(calendarId())}/events?conferenceDataVersion=1&sendUpdates=none`,
    {
      method: 'POST',
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: { dateTime: input.start },
        end: { dateTime: input.end },
        attendees: [{ email: input.guest.email, displayName: input.guest.name }],
        conferenceData: { createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
        extendedProperties: { private: { ...input.extra, name: input.guest.name, email: input.guest.email, bookedVia: 'hirestella-site' } },
        guestsCanModify: false,
        guestsCanInviteOthers: false,
      }),
    },
  );
  return toDemo(await withMeetLink(event));
}

/** A demo booked through the site, or null (unknown, or not one of ours). */
export async function getDemoEvent(id: string): Promise<DemoEvent | null> {
  try {
    const e = await call<GoogleEvent>(`/calendars/${encodeURIComponent(calendarId())}/events/${encodeURIComponent(id)}`);
    if (e.extendedProperties?.private?.bookedVia !== 'hirestella-site') return null;
    return toDemo(e);
  } catch {
    return null;
  }
}

export async function moveDemoEvent(id: string, start: string, end: string): Promise<DemoEvent> {
  const e = await call<GoogleEvent>(
    `/calendars/${encodeURIComponent(calendarId())}/events/${encodeURIComponent(id)}?conferenceDataVersion=1&sendUpdates=none`,
    { method: 'PATCH', body: JSON.stringify({ start: { dateTime: start }, end: { dateTime: end } }) },
  );
  return toDemo(e);
}

export async function cancelDemoEvent(id: string) {
  await call<void>(`/calendars/${encodeURIComponent(calendarId())}/events/${encodeURIComponent(id)}?sendUpdates=none`, {
    method: 'DELETE',
  });
}
