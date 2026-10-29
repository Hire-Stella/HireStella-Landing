/**
 * HireStella Bookings: receives each booking from the website and adds it as a row.
 * Paste into the sheet's Extensions → Apps Script, then Deploy → Web app
 * (Execute as: Me, Who has access: Anyone). The website side is src/lib/booking-sheet.js.
 *
 * Every request must carry the secret token saved in Project Settings →
 * Script properties as TOKEN (the website's BOOKINGS_SHEET_TOKEN).
 * As a stand-alone project (script.google.com), also set SHEET_ID: see getSheet().
 *
 *   { token, action: 'add', ... }                    a new booking → a new row
 *   { token, action: 'update', bookingId, fields }   a Cal.com reschedule or cancellation → that row
 *   { token, action: 'status', emailId, status }     an email delivery result → that row
 *
 * After changing the code: Deploy → Manage deployments → Edit → New version,
 * which keeps the same URL.
 */

const SHEET_NAME = 'Bookings';

/* New columns only ever go at the end, so existing rows stay aligned. */
const COLUMNS = [
  ['receivedAt', 'Received at'],
  ['form', 'Form'],
  ['name', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['company', 'Business'],
  ['problem', 'Message'],
  ['heardFrom', 'Heard from'],
  ['teamEmail', 'Team email'],
  ['visitorEmail', 'Visitor email'],
  ['visitorEmailId', 'Visitor email ID'],
  ['statusUpdatedAt', 'Status updated'],
  ['utm_source', 'utm_source'],
  ['utm_campaign', 'utm_campaign'],
  ['gclid', 'gclid'],
  ['page', 'Page'],
  ['meetingTime', 'Meeting time'],
  ['meetingLink', 'Meeting link'],
  ['rescheduleUrl', 'Reschedule link'],
  ['cancelUrl', 'Cancel link'],
  ['bookingId', 'Booking ID'],
  ['bookingStatus', 'Booking status'],
];

/* Dates are saved as real dates, so the sheet shows them in its own time zone
   (File → Settings → Time zone, e.g. (GMT+04:00) Dubai) and they sort correctly. */
const DATE_FORMAT = 'dd/MM/yyyy HH:mm:ss';
const DATE_KEYS = ['receivedAt', 'statusUpdatedAt', 'meetingTime'];

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply(400, 'Invalid JSON');
  }

  const token = PropertiesService.getScriptProperties().getProperty('TOKEN');
  if (!token || body.token !== token) return reply(401, 'Unauthorized');

  // One write at a time, so two bookings arriving together never overwrite each other.
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getSheet();
    if (body.action === 'status') return updateStatus(sheet, body);
    if (body.action === 'update') return updateBooking(sheet, body);
    return addBooking(sheet, body);
  } finally {
    lock.releaseLock();
  }
}

function addBooking(sheet, body) {
  /* A booking reported twice is recorded once. */
  if (body.bookingId && findRow(sheet, 'bookingId', body.bookingId)) return reply(200, 'Already recorded');
  const row = COLUMNS.map(([key]) => cell(key, body[key]));
  if (!(row[0] instanceof Date)) row[0] = new Date();
  sheet.appendRow(row);
  const last = sheet.getLastRow();
  DATE_KEYS.forEach((key) => sheet.getRange(last, column(key)).setNumberFormat(DATE_FORMAT));
  return reply(200, 'Added');
}

/* Cal.com reschedule or cancellation: change only the given columns of that booking's row. */
function updateBooking(sheet, body) {
  if (!body.bookingId || !body.fields) return reply(400, 'bookingId and fields are required');
  const row = findRow(sheet, 'bookingId', body.bookingId);
  if (!row) return reply(404, 'Not found');
  Object.keys(body.fields).forEach((key) => {
    const col = column(key);
    if (!col) return;
    const range = sheet.getRange(row, col).setValue(cell(key, body.fields[key]));
    if (DATE_KEYS.includes(key)) range.setNumberFormat(DATE_FORMAT);
  });
  sheet.getRange(row, column('statusUpdatedAt')).setValue(new Date()).setNumberFormat(DATE_FORMAT);
  return reply(200, 'Updated');
}

/* Resend reports Delivered / Bounced / Complained later: find the row by the email ID. */
function updateStatus(sheet, body) {
  if (!body.emailId || !body.status) return reply(400, 'emailId and status are required');
  const row = findRow(sheet, 'visitorEmailId', body.emailId);
  if (!row) return reply(404, 'Not found');
  sheet.getRange(row, column('visitorEmail')).setValue(safe(body.status));
  sheet.getRange(row, column('statusUpdatedAt')).setValue(new Date()).setNumberFormat(DATE_FORMAT);
  return reply(200, 'Updated');
}

/* A date column gets a real date; everything else is safe text. */
function cell(key, value) {
  if (DATE_KEYS.includes(key) && value) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
  return safe(value);
}

function column(key) {
  return COLUMNS.findIndex(([k]) => k === key) + 1;
}

/* The newest row whose `key` column equals `value`, or 0. */
function findRow(sheet, key, value) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const values = sheet.getRange(2, column(key), last - 1, 1).getValues();
  for (let i = values.length - 1; i >= 0; i--) if (String(values[i][0]) === String(value)) return i + 2;
  return 0;
}

/* Creates the Bookings tab and its headings, and rewrites the headings when this
   version has columns an older one did not.
   A script attached to the sheet uses that sheet. A stand-alone script (one
   created at script.google.com, e.g. by an editor who cannot deploy the
   sheet owner's script) sets the Script property SHEET_ID to the sheet's ID. */
function getSheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0 || sheet.getRange(1, COLUMNS.length).getValue() !== COLUMNS[COLUMNS.length - 1][1]) {
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS.map(([, label]) => label)]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/* Text starting with = + - @ would run as a formula (a "+971…" phone, or a
   malicious name). A leading apostrophe keeps it plain text. */
function safe(value) {
  if (value === undefined || value === null) return '';
  const text = String(value).slice(0, 5000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(status, message) {
  return ContentService.createTextOutput(JSON.stringify({ status: status, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Run this once from the editor to check the sheet works. It adds one test row. */
function testAddRow() {
  addBooking(getSheet(), {
    receivedAt: new Date().toISOString(),
    form: 'test',
    name: 'Test Booking',
    email: 'test@example.com',
    phone: '+971 50 000 0000',
    company: 'Test Co',
    teamEmail: 'Sent by Cal.com',
    visitorEmail: 'Sent by Cal.com',
    meetingTime: new Date(Date.now() + 86400000).toISOString(),
    meetingLink: 'https://meet.google.com/test-test-tst',
    bookingId: 'test-' + Date.now(),
    bookingStatus: 'Booked',
  });
}
