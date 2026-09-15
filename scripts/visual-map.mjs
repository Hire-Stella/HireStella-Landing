import { chromium } from '@playwright/test';
const B = 'https://hirestella.tactikstudio.com';
const routes = ['/','/stella','/integrations','/human-boundary','/security','/about','/team','/industries','/industries/healthcare','/industries/real-estate','/industries/financial-services','/industries/automotive','/industries/healthcare/dental','/industries/healthcare/eye','/industries/healthcare/aesthetic','/industries/healthcare/multispecialty','/industries/healthcare/enterprise','/industries/healthcare/groups','/industries/real-estate/companies','/industries/real-estate/consultancies','/industries/financial-services/banks','/industries/financial-services/advisory','/industries/automotive/rental','/industries/automotive/service','/industries/automotive/dealerships','/use-cases','/blogs','/blogs/first-ai-workflow','/blogs/dental-enquiry-to-appointment','/blogs/dubai-healthcare-growth-clinic-operations','/roi','/contact','/book-demo','/become-a-partner'];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const rows = [];
for (const r of routes) {
  let res;
  try { res = await p.goto(B + r, { waitUntil: 'load', timeout: 40000 }); } catch { continue; }
  if (!res || res.status() >= 400) { rows.push({ r, status: res?.status() }); continue; }
  await p.waitForTimeout(200);
  const d = await p.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const words = (main.innerText.match(/\S+/g) || []).length;
    const secs = [...main.querySelectorAll('section')];
    /* raster art only — logos and icons excluded */
    const raster = [...main.querySelectorAll('img')].filter(i => {
      const s = i.currentSrc || i.src;
      return !/logo|symbol|favicon/i.test(s) && i.getBoundingClientRect().width > 90;
    }).map(i => (i.currentSrc || i.src).split('/').pop().slice(0, 34));
    /* a "figure" = a purpose-built drawn illustration, not a decorative device */
    const figs = [...main.querySelectorAll('svg')].filter(s => {
      const r = s.getBoundingClientRect();
      return r.width >= 130 && r.height >= 90;
    }).length;
    /* structured visual blocks that already carry weight */
    const panels = main.querySelectorAll('.pan, .card, .step-card, .explorer, .hero-panel, .figure').length;
    /* the wall-of-text measure: consecutive sections with no image, no big svg, no panel grid */
    let run = 0, worst = 0, worstAt = -1;
    secs.forEach((s, i) => {
      const hasArt = [...s.querySelectorAll('img')].some(x => x.getBoundingClientRect().width > 90 && !/logo|symbol/i.test(x.currentSrc || x.src))
        || [...s.querySelectorAll('svg')].some(x => { const q = x.getBoundingClientRect(); return q.width >= 130 && q.height >= 90; });
      if (hasArt) { run = 0; } else { run++; if (run > worst) { worst = run; worstAt = i; } }
    });
    const heroAside = Boolean(document.querySelector('.phero-aside, .hero-panel, .route, .phero .pan'));
    return { words, secs: secs.length, raster, figs, panels, worstRun: worst, worstAt, heroAside,
             h2: [...main.querySelectorAll('h2')].map(h => h.innerText.replace(/\s+/g,' ').trim().slice(0,46)) };
  });
  rows.push({ r, ...d });
}
console.log(JSON.stringify(rows, null, 0));
await b.close();
