import { BOOKING, type BookingConfig } from './config';

/** A busy stretch in the calendar, as Google's freeBusy returns it. */
export type Busy = { start: string; end: string };

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** UTC instant of a local (calendar-zone) date at `minuteOfDay`. `localDay` is midnight local, as a UTC-epoch day number. */
function instant(localDayMs: number, minuteOfDay: number, cfg: BookingConfig) {
  return new Date(localDayMs + (minuteOfDay - cfg.utcOffsetMinutes) * MINUTE);
}

/** The local calendar day (midnight, as an epoch ms in "local as UTC") containing `date`. */
function localDay(date: Date, cfg: BookingConfig) {
  const shifted = date.getTime() + cfg.utcOffsetMinutes * MINUTE;
  return shifted - (shifted % DAY);
}

/**
 * Every bookable start (ISO, UTC) from `now` to the end of the window, given
 * what the calendar already holds. A slot is free when the meeting plus the
 * gap on either side touches nothing busy.
 */
export function freeSlots(busy: Busy[], now: Date, cfg: BookingConfig = BOOKING): string[] {
  const earliest = now.getTime() + cfg.noticeMinutes * MINUTE;
  const blocks = busy
    .map((b) => [new Date(b.start).getTime(), new Date(b.end).getTime()] as const)
    .filter(([s, e]) => Number.isFinite(s) && Number.isFinite(e) && e > s);
  const open = minutes(cfg.open);
  const lastStart = minutes(cfg.close) - cfg.lengthMinutes;
  const gap = cfg.gapMinutes * MINUTE;
  const length = cfg.lengthMinutes * MINUTE;
  const out: string[] = [];
  const first = localDay(now, cfg);
  for (let d = 0; d <= cfg.windowDays; d++) {
    const day = first + d * DAY;
    if (!(cfg.days as readonly number[]).includes(new Date(day).getUTCDay())) continue;
    for (let m = open; m <= lastStart; m += cfg.stepMinutes) {
      const start = instant(day, m, cfg).getTime();
      if (start < earliest) continue;
      const from = start - gap;
      const to = start + length + gap;
      if (blocks.some(([s, e]) => s < to && e > from)) continue;
      out.push(new Date(start).toISOString());
    }
  }
  return out;
}

/** Whether `start` is one of the slots offered now (the server's re-check before booking). */
export function isFreeSlot(start: string, busy: Busy[], now: Date, cfg: BookingConfig = BOOKING) {
  const wanted = new Date(start).getTime();
  if (!Number.isFinite(wanted)) return false;
  return freeSlots(busy, now, cfg).some((s) => new Date(s).getTime() === wanted);
}

/** The window to ask the calendar about: now to the end of the last bookable day. */
export function window(now: Date, cfg: BookingConfig = BOOKING) {
  const end = localDay(now, cfg) + (cfg.windowDays + 1) * DAY - cfg.utcOffsetMinutes * MINUTE;
  return { timeMin: now.toISOString(), timeMax: new Date(end).toISOString() };
}

/** "Tuesday 4 November 2026, 14:00 (Dubai time)" for emails and the team. */
export function dubaiLabel(start: string, cfg: BookingConfig = BOOKING) {
  return (
    new Date(start).toLocaleString('en-GB', {
      timeZone: cfg.timeZone,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' (Dubai time)'
  );
}
