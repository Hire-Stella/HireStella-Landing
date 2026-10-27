/**
 * The bookings sheet: one row per lead in a Google Sheet, so the team can see
 * who booked and whether each email went out. Server-only: it reads a secret.
 *
 *   BOOKINGS_SHEET_URL    the Apps Script web app URL (…/exec)
 *   BOOKINGS_SHEET_TOKEN  the same value as TOKEN in the script's Script properties
 *
 * This is a record, not a delivery channel: a lead never counts as delivered
 * because it reached the sheet, and a sheet failure never fails the lead. The
 * generic LEAD_WEBHOOK_* channel is not reused because Apps Script answers 200
 * even when it refuses a request (the real status is in the JSON body) and its
 * /exec URL answers with a redirect, which that channel treats as an error.
 *
 * Used by both forms: the main site (lead-delivery.ts) and the ads page (ads-lead/lead.js).
 */

const env = (name) => process.env[name]?.trim() || '';

export const sheetConfigured = () =>
  env('BOOKINGS_SHEET_URL').startsWith('https://') && Boolean(env('BOOKINGS_SHEET_TOKEN'));

/** Email outcome for a sheet cell. */
export const outcome = (result) =>
  result === undefined ? 'Not configured' : result.status === 'fulfilled' ? 'Sent' : 'Failed';

/**
 * Adds one row. Never throws: a sheet problem is logged and the lead carries on.
 * `row` keys match the script's COLUMNS (receivedAt, form, name, email, …).
 */
export async function logBooking(row) {
  if (!sheetConfigured()) return;
  try {
    const response = await fetch(env('BOOKINGS_SHEET_URL'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...row, action: 'add', token: env('BOOKINGS_SHEET_TOKEN') }),
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.status !== 200)
      throw new Error(`Sheet answered ${result?.status ?? response.status}: ${result?.message ?? 'no body'}`);
  } catch (error) {
    console.error('Bookings sheet row failed:', error);
  }
}
