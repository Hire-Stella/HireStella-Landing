/**
 * Hunt for dividers that run past the content they are meant to divide.
 *
 * The workspace sidebar had a solid border-right and a working area three
 * times its height, so ~650px of bare line hung below the last nav item and
 * read as a stray mark on the page. This finds that shape anywhere: a
 * bordered box whose own children stop more than 140px above its bottom.
 */
import { chromium } from '@playwright/test';
const B = 'http://localhost:3000';
const routes = ['/', '/sales-coach', '/about', '/industries', '/industries/healthcare', '/industries/healthcare/dental',
  '/industries/automotive', '/industries/healthcare/eye', '/roi', '/use-cases', 
   '/blogs', '/contact',  '/book-demo', '/become-a-partner', '/solutions/dental'];
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const theme of ['dark', 'light']) {
  const p = await b.newPage({ viewport: { width: 1521, height: 960 } });
  await p.addInitScript(t => { try { localStorage.setItem('hirestella-theme', t) } catch (e) {} }, theme);
  console.log('== ' + theme);
  for (const r of routes) {
    await p.goto(B + r, { waitUntil: 'load' });
    await p.waitForTimeout(180);
    const hits = await p.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('main *, footer *')) {
        const cs = getComputedStyle(el);
        const has = ['borderRightWidth', 'borderLeftWidth'].some(k => parseFloat(cs[k]) > 0 && cs[k.replace('Width', 'Style')] !== 'none');
        if (!has) continue;
        const box = el.getBoundingClientRect();
        if (box.height < 120) continue;
        // where does this element's own painted content end?
        let contentBottom = box.top;
        for (const k of el.children) {
          const kb = k.getBoundingClientRect();
          if (kb.height > 0) contentBottom = Math.max(contentBottom, kb.bottom);
        }
        const bare = box.bottom - contentBottom - parseFloat(cs.paddingBottom || 0);
        if (bare > 140) out.push(`${el.tagName}.${String(el.className).split(' ')[0]} bare ${Math.round(bare)}px of ${Math.round(box.height)}px`);
      }
      return [...new Set(out)];
    });
    if (hits.length) console.log('  ' + r.padEnd(30), hits.join(' | '));
  }
  await p.close();
}
await b.close();
