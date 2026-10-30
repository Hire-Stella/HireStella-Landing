/**
 * One-time Google approval for demo booking.
 *
 *   node scripts/google-auth.mjs
 *
 * Reads GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from .env.local (a "Desktop
 * app" OAuth client), opens Google's sign-in page, and on approval writes
 * GOOGLE_REFRESH_TOKEN into .env.local. The token is never printed.
 *
 * Access asked for: read free/busy times, and create/change events. Nothing else
 * (no Gmail, no Drive, no reading event contents of other calendars).
 * Run it again with another account's client to move booking to that account.
 */
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
import { exec } from 'node:child_process';

const ENV = new URL('../.env.local', import.meta.url);
const SCOPES = ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.freebusy'];

const text = readFileSync(ENV, 'utf8');
const read = (key) => text.match(new RegExp(`^${key}=(.*)$`, 'm'))?.[1]?.trim() || '';
const clientId = read('GOOGLE_CLIENT_ID');
const clientSecret = read('GOOGLE_CLIENT_SECRET');
if (!clientId || !clientSecret) {
  console.error('Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local first.');
  process.exit(1);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname !== '/callback') return res.writeHead(404).end();
  const code = url.searchParams.get('code');
  const finish = (ok, message) => {
    res.writeHead(ok ? 200 : 400, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<p style="font:16px sans-serif;padding:32px">${message}</p>`);
    console.log(ok ? `\n${message}` : `\nFailed: ${message}`);
    server.close();
    process.exitCode = ok ? 0 : 1;
  };
  if (!code) return finish(false, `Google did not approve (${url.searchParams.get('error') || 'no code'}).`);
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirect, grant_type: 'authorization_code' }),
  });
  const data = await response.json().catch(() => ({}));
  if (!data.refresh_token) return finish(false, `No refresh token from Google (${response.status} ${data.error || ''}).`);
  const current = readFileSync(ENV, 'utf8');
  const nl = current.includes('\r\n') ? '\r\n' : '\n';
  const line = `GOOGLE_REFRESH_TOKEN=${data.refresh_token}`;
  const next = /^GOOGLE_REFRESH_TOKEN=.*$/m.test(current)
    ? current.replace(/^GOOGLE_REFRESH_TOKEN=.*$/m, line)
    : current + (current.endsWith('\n') ? '' : nl) + line + nl;
  writeFileSync(ENV, next);
  finish(true, 'Approved. GOOGLE_REFRESH_TOKEN is saved in .env.local. You can close this tab.');
});

let redirect = '';
server.listen(0, '127.0.0.1', () => {
  redirect = `http://127.0.0.1:${server.address().port}/callback`;
  const consent =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({ client_id: clientId, redirect_uri: redirect, response_type: 'code', scope: SCOPES.join(' '), access_type: 'offline', prompt: 'consent' });
  console.log('Opening Google sign-in. If it does not open, paste this into your browser:\n\n' + consent + '\n');
  const open = process.platform === 'win32' ? `start "" "${consent}"` : process.platform === 'darwin' ? `open "${consent}"` : `xdg-open "${consent}"`;
  exec(open);
});
