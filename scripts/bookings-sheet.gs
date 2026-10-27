/**
 * HireStella Bookings: receives each booking from the website and adds it as a row.
 * Paste into the sheet's Extensions → Apps Script, then Deploy → Web app
 * (Execute as: Me, Who has access: Anyone). The website side is src/lib/booking-sheet.js.
 *
 * Every request must carry the secret token saved in Project Settings →
 * Script properties as TOKEN (the website's BOOKINGS_SHEET_TOKEN).
 * As a stand-alone project (script.google.com), also set SHEET_ID: see getSheet().
 *
 *   { token, action: 'add', ... }                  a new booking → a new row
 *   { token, action: 'status', emailId, status }   a delivery result → updates that row
 */

const SHEET_NAME = 'Bookings';

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
];

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
    return addBooking(sheet, body);
  } finally {
    lock.releaseLock();
  }
}

/* Dates are saved as real dates, so the sheet shows them in its own time zone
   (File → Settings → Time zone, e.g. (GMT+04:00) Dubai) and they sort correctly. */
const DATE_FORMAT = 'dd/MM/yyyy HH:mm:ss';

function addBooking(sheet, body) {
  const row = COLUMNS.map(([key]) => safe(body[key]));
  const at = new Date(body.receivedAt);
  row[0] = isNaN(at.getTime()) ? new Date() : at;
  sheet.appendRow(row);
  sheet.getRange(sheet.getLastRow(), 1).setNumberFormat(DATE_FORMAT);
  return reply(200, 'Added');
}

/* Resend reports Delivered / Bounced / Complained later: find the row by the email ID. */
function updateStatus(sheet, body) {
  if (!body.emailId || !body.status) return reply(400, 'emailId and status are required');
  const idCol = COLUMNS.findIndex(([key]) => key === 'visitorEmailId') + 1;
  const statusCol = COLUMNS.findIndex(([key]) => key === 'visitorEmail') + 1;
  const timeCol = COLUMNS.findIndex(([key]) => key === 'statusUpdatedAt') + 1;
  const last = sheet.getLastRow();
  if (last < 2) return reply(404, 'Not found');
  const ids = sheet.getRange(2, idCol, last - 1, 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === String(body.emailId)) {
      sheet.getRange(i + 2, statusCol).setValue(safe(body.status));
      sheet.getRange(i + 2, timeCol).setValue(new Date()).setNumberFormat(DATE_FORMAT);
      return reply(200, 'Updated');
    }
  }
  return reply(404, 'Not found');
}

/* Creates the Bookings tab and its headings the first time.
   A script attached to the sheet uses that sheet. A stand-alone script (one
   created at script.google.com, e.g. by an editor who cannot deploy the
   sheet owner's script) sets the Script property SHEET_ID to the sheet's ID. */
function getSheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(([, label]) => label));
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
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
    form: 'test',
    name: 'Test Booking',
    email: 'test@example.com',
    phone: '+971 50 000 0000',
    company: 'Test Co',
    teamEmail: 'Sent',
    visitorEmail: 'Sent',
  });
}
