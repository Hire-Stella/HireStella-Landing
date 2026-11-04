/**
 * When a demo can be booked. Edit here; everything else (the slot list, the
 * booking check, the emails) follows.
 *
 * Times are Dubai time. The UAE keeps UTC+4 all year (no daylight saving), so a
 * fixed offset is exact; the visitor's browser shows each slot in their own zone.
 */
export const BOOKING = {
  timeZone: 'Asia/Dubai',
  utcOffsetMinutes: 240,
  /** Days a demo can happen: 0 Sunday … 6 Saturday. The UAE week is Monday to Friday. */
  days: [1, 2, 3, 4, 5],
  /** First start and last end of the bookable day, 24h "HH:MM", Dubai time. */
  open: '10:00',
  close: '18:00',
  lengthMinutes: 60,
  /** Kept free before and after every meeting already in the calendar. */
  gapMinutes: 0,
  /** Slots start on this grid: 60 means one-hour slots on the hour. */
  stepMinutes: 60,
  /** The soonest a demo can be booked, from now. */
  noticeMinutes: 4 * 60,
  /** How far ahead the calendar opens: the rest of this month plus this many whole months. */
  monthsAhead: 11,
  title: 'HireStella demo',
} as const;

export type BookingConfig = typeof BOOKING;
