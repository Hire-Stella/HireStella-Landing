/**
 * Layout audit at the user's own screen (1536 wide, ~1521 viewport).
 *
 * Reports, per route: whether the header, content and footer share one edge,
 * and any section whose content occupies notably less than the measure — the
 * "too empty at the sides" complaint, measured rather than eyeballed.
 */
import { chromium } from '@playwright/test';
const B = 'http://localhost:3000';
const routes = ['/', '/stella', '/sales-coach',  '/integrations', '/human-boundary', '/security', '/about', '/team',
     '/industries', '/industries/healthcare',
  '/industries/healthcare', '/industries/real-estate', '/industries/financial-services', '/industries/automotive',
  '/industries/healthcare/dental', '/industries/healthcare/eye', '/industries/healthcare/enterprise',
  '/industries/real-estate/companies', '/industries/financial-services/banks', '/industries/automotive/rental',
  '/use-cases', '/blogs', '/blogs/first-ai-workflow', '/roi',  '/contact', '/book-demo',
  '/become-a-partner', '/solutions/dental'];

const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1521, height: 960 } });
let issues = 0;
for (const r of routes) {
  await p.goto(B + r, { waitUntil: 'load' });
  await p.waitForTimeout(180);
  const d = await p.evaluate(() => {
    const box = el => el && el.getBoundingClientRect();
    const hdr = box(document.querySelector('.hdr'));
    const wrap = box(document.querySelector('main .wrap'));
    const foot = box(document.querySelector('.foot .wrap'));
    const thin = [];
    for (const sec of document.querySelectorAll('main .sec, main .phero, main .hero, main .closer')) {
      const w = sec.querySelector('.wrap') || sec;
      const ww = w.getBoundingClientRect().width;
      const kids = [...w.children].filter(k => k.getBoundingClientRect().height > 20);
      const widest = Math.max(0, ...kids.map(k => k.getBoundingClientRect().width));
      if (ww > 0 && widest / ww < 0.86) {
        const lbl = String(sec.className).split(' ')[0] + '·' + (w.querySelector('.eyebrow, h1, h2')?.textContent || '').trim().slice(0, 26);
        thin.push(`${lbl} ${Math.round(widest)}/${Math.round(ww)}`);
      }
    }
    return {
      hdrL: Math.round(hdr.left), hdrR: Math.round(hdr.right),
      wrapL: Math.round(wrap.left), wrapR: Math.round(wrap.right),
      footL: Math.round(foot.left), footR: Math.round(foot.right),
      hscroll: document.documentElement.scrollWidth > innerWidth + 1,
      thin,
    };
  });
  const aligned = d.hdrL === d.wrapL && d.hdrR === d.wrapR && d.footL === d.wrapL;
  if (!aligned || d.hscroll || d.thin.length) issues++;
  console.log(
    (aligned ? 'ALIGNED  ' : `MISALIGN(h${d.hdrL}/w${d.wrapL}/f${d.footL}) `) +
    (d.hscroll ? 'H-SCROLL ' : '') +
    r.padEnd(38) + (d.thin.length ? ' thin: ' + d.thin.join(' | ') : ''),
  );
}
console.log(`\n${issues} route(s) with something to look at.`);
await b.close();
