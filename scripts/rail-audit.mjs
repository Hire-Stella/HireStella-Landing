import { chromium } from '@playwright/test';
const B = 'http://localhost:3211';
const routes = ['/','/stella','/sales-coach','/integrations','/human-boundary','/security','/about','/team','/industries','/industries/healthcare','/industries/real-estate','/industries/automotive','/industries/healthcare/dental','/industries/healthcare/eye','/industries/healthcare/aesthetic','/industries/healthcare/enterprise','/industries/real-estate/companies','/industries/financial-services/banks','/industries/automotive/rental','/industries/automotive/dealerships','/use-cases','/blogs','/blogs/first-ai-workflow','/roi','/contact','/book-demo','/become-a-partner','/solutions/salons','/solutions/dental'];
const browser = await chromium.launch();
const bad = [];
for (const theme of ['dark','light']) {
  for (const w of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.addInitScript(t => { try { localStorage.setItem('hirestella-theme', t); } catch {} }, theme);
    for (const r of routes) {
      await page.goto(B + r, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(140);
      const issues = await page.evaluate(() => {
        const out = [];
        /* 1. every rail must be out of flow */
        document.querySelectorAll('.rail').forEach(el => {
          if (getComputedStyle(el).position !== 'absolute')
            out.push(`rail in flow inside .${el.parentElement.className.split(' ')[0]}`);
        });
        /* 2. no button or link may be squeezed so its label wraps into a column */
        document.querySelectorAll('.btn, .btn-1, .btn-2, .btn-3').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 78 && r.width < 170)
            out.push(`squeezed control "${el.textContent.trim().slice(0,28)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
        });
        /* 3. nothing may overflow the page sideways */
        if (document.documentElement.scrollWidth > innerWidth + 1)
          out.push(`h-scroll ${document.documentElement.scrollWidth}>${innerWidth}`);
        return out;
      });
      if (issues.length) bad.push(`${theme} ${w}px ${r}: ${issues.join(' | ')}`);
    }
    await page.close();
  }
}
console.log(bad.length ? bad.join('\n') : `Clean across ${routes.length} routes x 2 themes x 2 widths.`);
await browser.close();
