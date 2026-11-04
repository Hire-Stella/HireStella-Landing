/**
 * An "add to calendar" file for the guest's email. METHOD:PUBLISH, so it adds
 * the event without asking the guest to reply to an invitation.
 */
const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/* RFC 5545: escape \ ; , and newlines, fold lines at 75 octets. */
const text = (v: string) => v.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
function fold(line: string) {
  const out: string[] = [];
  let rest = line;
  while (Buffer.byteLength(rest) > 75) {
    let cut = 75;
    while (Buffer.byteLength(rest.slice(0, cut)) > 75) cut--;
    out.push(rest.slice(0, cut));
    rest = ' ' + rest.slice(cut);
  }
  out.push(rest);
  return out.join('\r\n');
}

export function demoIcs(e: { id: string; start: string; end: string; title: string; description: string; meetLink: string }) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HireStella//Demo booking//EN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${e.id}@hirestella.ai`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(e.start)}`,
    `DTEND:${stamp(e.end)}`,
    `SUMMARY:${text(e.title)}`,
    `DESCRIPTION:${text(e.description)}`,
    ...(e.meetLink ? [`LOCATION:${text(e.meetLink)}`, `URL:${e.meetLink}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
