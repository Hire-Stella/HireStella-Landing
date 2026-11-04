/**
 * The booking emails, sent through Resend from LEAD_EMAIL_FROM (HireStella's
 * own address): the guest's confirmation (with the Meet link, a manage link and
 * an .ics file), the team's notice, and the moved / cancelled notes.
 */
import { escape, oneLine, sendEmail, teamAddresses } from '../lead-delivery';
import { BOOKING } from './config';
import { demoIcs } from './ics';
import { dubaiLabel } from './slots';

export type Booked = {
  id: string;
  start: string;
  end: string;
  meetLink: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  problem?: string;
  manageUrl: string;
  source: string;
};

const ORANGE = '#FF6200';
const NAVY = '#141B45';
const first = (name: string) => name.split(/\s+/)[0] || name;

function layout(title: string, body: string) {
  return `<div style="background:#F4F5FA;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:${NAVY}">
<div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:16px;padding:32px 28px;border:1px solid #E3E5F0">
<p style="margin:0 0 20px;font-size:20px;font-weight:700;letter-spacing:-0.02em">Hire<span style="color:${ORANGE}">Stella</span></p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${title}</h1>
${body}
<p style="margin:28px 0 0;font-size:13px;color:#5B6080">The HireStella team · <a href="https://hirestella.ai" style="color:${ORANGE}">hirestella.ai</a></p>
</div></div>`;
}
const button = (href: string, label: string) =>
  `<a href="${escape(href)}" style="display:inline-block;background:${ORANGE};color:#FFFFFF;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">${escape(label)}</a>`;
const row = (label: string, value: string) =>
  `<tr><td style="padding:6px 16px 6px 0;color:#5B6080;white-space:nowrap;vertical-align:top">${escape(label)}</td><td style="padding:6px 0;font-weight:600">${value}</td></tr>`;

function attachment(b: Booked) {
  const ics = demoIcs({
    id: b.id,
    start: b.start,
    end: b.end,
    title: BOOKING.title,
    description: `Your HireStella demo.\nJoin: ${b.meetLink}\nNeed a different time? ${b.manageUrl}`,
    meetLink: b.meetLink,
  });
  return [{ filename: 'hirestella-demo.ics', content: Buffer.from(ics).toString('base64'), contentType: 'text/calendar' }];
}

export function guestConfirmation(b: Booked) {
  const when = dubaiLabel(b.start);
  const html = layout(
    `Your demo is booked, ${escape(first(b.name))}.`,
    `<p style="margin:0 0 16px;line-height:1.6">Thank you for booking a demo of Stella, your AI General Manager. Here are the details.</p>
<table style="border-collapse:collapse;margin:0 0 20px;font-size:15px">${row('When', escape(when))}${row('Length', `${BOOKING.lengthMinutes} minutes`)}${row('Where', `<a href="${escape(b.meetLink)}" style="color:${ORANGE}">Google Meet</a>`)}</table>
<p style="margin:0 0 24px">${button(b.meetLink, 'Join with Google Meet')}</p>
<p style="margin:0 0 8px;line-height:1.6;font-size:14px">The attached file adds the meeting to your calendar.</p>
<p style="margin:0;line-height:1.6;font-size:14px">Need a different time? <a href="${escape(b.manageUrl)}" style="color:${ORANGE}">Reschedule or cancel here</a>. Or just reply to this email.</p>`,
  );
  const text = [
    `Hi ${first(b.name)},`,
    '',
    'Your HireStella demo is booked.',
    '',
    `When: ${when}`,
    `Length: ${BOOKING.lengthMinutes} minutes`,
    `Join: ${b.meetLink}`,
    '',
    `Need a different time? Reschedule or cancel: ${b.manageUrl}`,
    'Or just reply to this email.',
    '',
    'The HireStella team',
  ].join('\n');
  return {
    to: [b.email],
    subject: oneLine(`Your HireStella demo: ${when}`),
    text,
    html,
    replyTo: teamAddresses()[0],
    attachments: attachment(b),
  };
}

export function teamNotice(b: Booked) {
  const when = dubaiLabel(b.start);
  const rows = [
    ['When', when],
    ['Name', b.name],
    ['Email', b.email],
    ['Phone', b.phone],
    ['Business', b.company],
    ['Notes', b.problem || ''],
    ['Booked from', b.source],
    ['Meet', b.meetLink],
  ].filter(([, v]) => v);
  const html = layout(
    'New demo booked',
    `<table style="border-collapse:collapse;font-size:14px">${rows.map(([l, v]) => row(l, escape(v))).join('')}</table>
<p style="margin:20px 0 0">${button(b.meetLink, 'Open Google Meet')}</p>
<p style="margin:16px 0 0;font-size:13px;color:#5B6080">It is in the HireStella calendar. Reply to this email to write to ${escape(first(b.name))}.</p>`,
  );
  return {
    to: teamAddresses(),
    subject: oneLine(`Demo booked: ${b.name}, ${b.company} · ${when}`),
    text: [...rows.map(([l, v]) => `${l}: ${v}`), '', 'Reply to this email to write to them.'].join('\n'),
    html,
    replyTo: b.email,
  };
}

export function guestMoved(b: Booked) {
  const when = dubaiLabel(b.start);
  return {
    to: [b.email],
    subject: oneLine(`Your HireStella demo has moved: ${when}`),
    text: [`Hi ${first(b.name)},`, '', `Your demo is now on ${when}.`, `Join: ${b.meetLink}`, `Manage: ${b.manageUrl}`, '', 'The HireStella team'].join('\n'),
    html: layout(
      'Your demo has moved.',
      `<p style="margin:0 0 16px;line-height:1.6">Your demo is now on <b>${escape(when)}</b>. The Meet link stays the same.</p>
<p style="margin:0 0 20px">${button(b.meetLink, 'Join with Google Meet')}</p>
<p style="margin:0;font-size:14px">The attached file updates your calendar. <a href="${escape(b.manageUrl)}" style="color:${ORANGE}">Change it again</a></p>`,
    ),
    replyTo: teamAddresses()[0],
    attachments: attachment(b),
  };
}

export function guestCancelled(b: Pick<Booked, 'name' | 'email' | 'start'>) {
  const when = dubaiLabel(b.start);
  return {
    to: [b.email],
    subject: 'Your HireStella demo is cancelled',
    text: [`Hi ${first(b.name)},`, '', `Your demo on ${when} is cancelled.`, 'Book a new time any time: https://hirestella.ai/book-demo', '', 'The HireStella team'].join('\n'),
    html: layout(
      'Your demo is cancelled.',
      `<p style="margin:0 0 20px;line-height:1.6">Your demo on <b>${escape(when)}</b> is cancelled. Whenever you are ready, pick a new time.</p>
<p style="margin:0">${button('https://hirestella.ai/book-demo', 'Book a new time')}</p>`,
    ),
    replyTo: teamAddresses()[0],
  };
}

export function teamChanged(b: Pick<Booked, 'name' | 'email' | 'company' | 'start'>, what: 'moved' | 'cancelled') {
  const when = dubaiLabel(b.start);
  const line = what === 'moved' ? `${b.name} (${b.company}) moved their demo to ${when}.` : `${b.name} (${b.company}) cancelled their demo on ${when}.`;
  return {
    to: teamAddresses(),
    subject: oneLine(`Demo ${what}: ${b.name}, ${b.company}`),
    text: line,
    html: layout(what === 'moved' ? 'Demo moved' : 'Demo cancelled', `<p style="margin:0;line-height:1.6">${escape(line)}</p>`),
    replyTo: b.email,
  };
}

export { sendEmail };
