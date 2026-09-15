/**
 * The operations workspace, across every industry.
 *
 * It used to assert the workspace existed on the four clinics pages and
 * nowhere else. It is now on all five industries and their segments, each with
 * its own figures, so the audit checks that every page shows ITS OWN numbers
 * and that those numbers still reconcile: the tiles are the sum of the series
 * being plotted, and the ring is bookings over enquiries.
 */
import { chromium } from '@playwright/test';
const B = 'http://localhost:3211';

/* expected today tiles [enquiries, bookings, follow-ups, open handoffs] and ring */
const INDUSTRIES = {
  healthcare: { today: ['34', '21', '9', '2'], ring: '62%', week: ['224', '137', '58', '2'], weekRing: '61%' },
  'real-estate': { today: ['40', '18', '12', '2'], ring: '45%', week: ['250', '111', '74', '2'], weekRing: '44%' },
  'financial-services': { today: ['95', '47', '18', '2'], ring: '49%', week: ['480', '237', '96', '2'], weekRing: '49%' },
  automotive: { today: ['51', '28', '11', '2'], ring: '55%', week: ['302', '164', '68', '2'], weekRing: '54%' },
  education: { today: ['42', '19', '14', '2'], ring: '45%', week: ['242', '109', '88', '2'], weekRing: '45%' },
  'home-services': { today: ['68', '38', '16', '2'], ring: '56%', week: ['407', '224', '96', '2'], weekRing: '55%' },
  retail: { today: ['155', '100', '21', '2'], ring: '65%', week: ['1038', '667', '142', '2'], weekRing: '64%' },
  hospitality: { today: ['90', '52', '17', '2'], ring: '58%', week: ['597', '345', '108', '2'], weekRing: '58%' },
  travel: { today: ['64', '34', '13', '2'], ring: '53%', week: ['364', '194', '82', '2'], weekRing: '53%' },
  'professional-services': { today: ['78', '33', '19', '2'], ring: '42%', week: ['396', '168', '104', '2'], weekRing: '42%' },
};

const ROUTES = [
  ['/industries/healthcare', 'healthcare'],
  ['/industries/healthcare/dental', 'healthcare'],
  ['/industries/healthcare/eye', 'healthcare'],
  ['/industries/healthcare/aesthetic', 'healthcare'],
  ['/industries/healthcare/multispecialty', 'healthcare'],
  ['/industries/healthcare/enterprise', 'healthcare'],
  ['/industries/healthcare/groups', 'healthcare'],
  ['/industries/automotive', 'automotive'],
  ['/industries/automotive/rental', 'automotive'],
  ['/industries/automotive/service', 'automotive'],
  ['/industries/automotive/dealerships', 'automotive'],
  ['/industries/real-estate', 'real-estate'],
  ['/industries/real-estate/companies', 'real-estate'],
  ['/industries/real-estate/consultancies', 'real-estate'],
  ['/industries/hospitality', 'hospitality'],
  ['/industries/education', 'education'],
  ['/industries/education/schools', 'education'],
  ['/industries/education/training', 'education'],
  ['/industries/financial-services', 'financial-services'],
  ['/industries/financial-services/banks', 'financial-services'],
  ['/industries/financial-services/advisory', 'financial-services'],
  ['/industries/home-services', 'home-services'],
  ['/industries/home-services/maintenance', 'home-services'],
  ['/industries/home-services/cleaning', 'home-services'],
  ['/industries/travel', 'travel'],
  ['/industries/professional-services', 'professional-services'],
  ['/industries/retail', 'retail'],
  ['/industries/retail/online', 'retail'],
  ['/industries/retail/stores', 'retail'],
];

/* pages that legitimately carry no workspace */
/* pages that legitimately carry no workspace. /stella now does carry one --
   the dashboard is a section on it -- and /dashboard and /workforce/* redirect
   into it, so none of those belong on this list. */
const rest = ['/', '/blogs', '/use-cases', '/industries', '/contact', '/become-a-partner', '/integrations', '/security'];

const b = await chromium.launch();
let fails = 0;
const say = (ok, ...m) => { if (!ok) fails++; console.log(`[${ok ? 'PASS' : 'FAIL'}]`, ...m); };

for (const theme of ['dark', 'light']) {
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 950 } });
    await p.addInitScript(t => { try { localStorage.setItem('hirestella-theme', t); } catch {} }, theme);

    for (const [r, industry] of ROUTES) {
      await p.goto(B + r, { waitUntil: 'load' });
      await p.waitForTimeout(200);
      const d = await p.evaluate(() => {
        const ws = document.querySelector('.ws');
        if (!ws) return null;
        const nums = [...ws.querySelectorAll('.ws-tile strong')].map(e => e.textContent);
        const ring = ws.querySelector('.ws-ring-v')?.textContent;
        return {
          nums, ring,
          org: ws.querySelector('.ws-org b')?.textContent ?? '',
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          tiny: [...ws.querySelectorAll('*')].filter(e => e.childElementCount === 0 && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 11).length,
          clipped: [...ws.querySelectorAll('*')].filter(e => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflowX === 'hidden').length,
        };
      });
      say(Boolean(d), `${theme} ${w} ${r} · workspace present`);
      if (d) {
        const want = INDUSTRIES[industry];
        say(
          d.nums.join(',') === want.today.join(',') && d.ring === want.ring,
          `${theme} ${w} ${r} · ${industry} figures ${d.nums.join('/')} ring ${d.ring}`,
        );
        say(!d.overflow, `${theme} ${w} ${r} · no h-scroll`);
        say(d.tiny === 0, `${theme} ${w} ${r} · no sub-11px text (${d.tiny})`);
        say(d.clipped === 0, `${theme} ${w} ${r} · nothing clipped (${d.clipped})`);
      }
    }

    for (const r of rest) {
      await p.goto(B + r, { waitUntil: 'load' });
      await p.waitForTimeout(120);
      const has = await p.evaluate(() => Boolean(document.querySelector('.ws')));
      say(!has, `${theme} ${w} ${r} · no workspace, as intended`);
    }
    await p.close();
  }
}

/* the interactions actually work, and the seven-day view reconciles too */
const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
for (const [route, industry] of [['/industries/healthcare/dental', 'healthcare'], ['/industries/automotive/rental', 'automotive']]) {
  await p.goto(B + route, { waitUntil: 'load' });
  await p.locator('.ws-nav button', { hasText: 'Human handoffs' }).click();
  await p.waitForTimeout(250);
  const pip = await p.locator('.ws-pip').textContent();
  const rows = await p.locator('.ws-rec').count();
  say(pip.trim() === String(rows), `${route} handoff badge (${pip.trim()}) matches rows shown (${rows})`);

  await p.locator('.ws-nav button', { hasText: 'Overview' }).click();
  await p.locator('.ws-period button', { hasText: '7 days' }).click();
  await p.waitForTimeout(250);
  const week = await p.evaluate(() => ({
    nums: [...document.querySelectorAll('.ws-tile strong')].map(e => e.textContent),
    ring: document.querySelector('.ws-ring-v').textContent,
  }));
  const want = INDUSTRIES[industry];
  say(
    week.nums.join(',') === want.week.join(',') && week.ring === want.weekRing,
    `${route} 7-day figures ${week.nums.join('/')} ring ${week.ring}`,
  );

  await p.locator('.ws-rec button').first().click();
  await p.waitForTimeout(200);
  say(await p.locator('.ws-rec-d').count() === 1, `${route} record expands to its detail`);
}
await p.close();

console.log(fails ? `\n${fails} FAILURES` : '\nAll checks passed.');
await b.close();
