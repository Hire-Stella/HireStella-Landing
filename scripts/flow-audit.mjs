import { chromium } from '@playwright/test';
const B = 'http://localhost:3211';
const OUT = 'C:/Users/admin/AppData/Local/Temp/claude/C--Users-admin-Desktop-Projects-Hirestella-New/ae4b04a5-5472-41bd-9887-c7b972b0844f/scratchpad';
const browser = await chromium.launch();
let fails = 0;
for (const theme of ['dark', 'light']) {
  for (const vp of [{width:1440,height:760},{width:1280,height:640},{width:1600,height:900},{width:1024,height:700},{width:390,height:780},{width:360,height:640}]) {
    const page = await browser.newPage({ viewport: vp });
    await page.addInitScript(t => { try { localStorage.setItem('hirestella-theme', t); } catch {} }, theme);
    await page.goto(B + '/', { waitUntil: 'networkidle' });
    await page.locator('[data-demo]').first().click();
    await page.waitForSelector('.dm', { state: 'visible' });
    await page.waitForTimeout(450);
    const r = await page.evaluate(() => {
      const btn = document.querySelector('.dm-form button[type="submit"]');
      const b = btn.getBoundingClientRect();
      const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      const bar = getComputedStyle(document.querySelector('.dm-submit'));
      return {
        visible: Boolean(hit && btn.contains(hit)),
        inViewport: b.top >= 0 && b.bottom <= innerHeight + 1,
        barBg: bar.backgroundImage.slice(0, 24),
        pos: bar.position,
        blocker: hit && !btn.contains(hit) ? hit.className || hit.tagName : null,
      };
    });
    const ok = r.visible && r.inViewport;
    if (!ok) { fails++; await page.screenshot({ path: `${OUT}/fail-${theme}-${vp.width}x${vp.height}.png` }); }
    console.log(`[${ok ? 'PASS' : 'FAIL'}] ${theme} ${vp.width}x${vp.height}`, JSON.stringify(r));
    await page.close();
  }
}
console.log(fails ? `\n${fails} FAILURES` : '\nAll viewports: submit visible without scrolling.');
await browser.close();
