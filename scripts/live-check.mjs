import { chromium } from '@playwright/test';
const B = 'https://hirestella.tactikstudio.com';
const browser = await chromium.launch();
let fails = 0;
const say = (ok, ...m) => { if (!ok) fails++; console.log(`[${ok ? 'PASS' : 'FAIL'}]`, ...m); };

for (const theme of ['dark', 'light']) {
  for (const vp of [{ width: 1440, height: 800 }, { width: 390, height: 780 }]) {
    const p = await browser.newPage({ viewport: vp });
    await p.addInitScript(t => { try { localStorage.setItem('hirestella-theme', t); } catch {} }, theme);
    await p.goto(B + '/', { waitUntil: 'load' });

    /* logo */
    const logos = await p.evaluate(() => [...document.querySelectorAll('img')]
      .filter(i => i.alt === 'HireStella')
      .map(i => ({ shown: i.offsetParent !== null, src: i.currentSrc, nat: i.naturalWidth + 'x' + i.naturalHeight })));
    const shown = logos.filter(l => l.shown);
    say(shown.length === 2, `${theme} ${vp.width} · wordmarks visible: ${shown.length} (want 2 — header + footer)`);
    say(shown.every(l => l.src.includes('-v2')), `${theme} ${vp.width} · all v2 paths`, shown.map(l => l.nat).join(' '));
    say(shown.every(l => l.naturalWidth !== 0 || true) && shown.every(l => { const [w,h]=l.nat.split('x').map(Number); return h>0 && Math.abs(w/h - 5.10) < 0.12; }), `${theme} ${vp.width} · new artwork ratio`, shown.map(l => l.nat).join(' '));

    /* next-step panel */
    await p.fill('#stella-prompt', 'We run a car workshop and a rental desk. Calls go unanswered.');
    await p.click('.cmd-foot .send');
    await p.waitForSelector('.nextstep', { state: 'visible' });
    await p.waitForTimeout(1400);
    const ns = await p.evaluate(() => {
      const rail = document.querySelector('.nextstep .rail');
      const btn = document.querySelector('.nextstep [data-demo]');
      const r = btn.getBoundingClientRect();
      return {
        railAbs: getComputedStyle(rail).position === 'absolute',
        next: document.querySelector('.nextstep-body b span').textContent.trim(),
        business: document.querySelectorAll('.an-row .an-v')[0].textContent.trim(),
        btn: [Math.round(r.width), Math.round(r.height)],
        brief: btn.dataset.demoProblem?.slice(0, 24),
      };
    });
    say(ns.railAbs, `${theme} ${vp.width} · rail out of flow`);
    say(ns.btn[1] < 70, `${theme} ${vp.width} · CTA not squeezed ${ns.btn.join('x')}`);
    say(ns.next.includes('workshop'), `${theme} ${vp.width} · next step: "${ns.next}"`);
    say(ns.business === 'From your brief', `${theme} ${vp.width} · business: "${ns.business}"`);

    /* modal */
    await p.click('.nextstep [data-demo]');
    await p.waitForSelector('.dm', { state: 'visible' });
    await p.waitForTimeout(500);
    const dm = await p.evaluate(() => {
      const btn = document.querySelector('.dm-form button[type="submit"]');
      const consent = document.querySelector('.dm-submit input[name="consent"]');
      const b = btn.getBoundingClientRect(), c = consent.getBoundingClientRect();
      const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      return {
        submitVisible: Boolean(hit && btn.contains(hit)) && b.bottom <= innerHeight + 1,
        consentVisible: c.top >= 0 && c.bottom <= innerHeight + 1,
        problem: document.querySelector('textarea[name="problem"]').value.slice(0, 24),
      };
    });
    say(dm.submitVisible, `${theme} ${vp.width} · submit visible without scrolling`);
    say(dm.consentVisible, `${theme} ${vp.width} · consent visible with the action`);
    say(dm.problem.startsWith('We run a car workshop'), `${theme} ${vp.width} · brief carried into form`);

    /* draft survives an accidental close */
    await p.fill('input[name="name"]', 'Test Person');
    await p.keyboard.press('Escape');
    await p.waitForTimeout(300);
    await p.click('.nextstep [data-demo]');
    await p.waitForSelector('.dm', { state: 'visible' });
    say(await p.inputValue('input[name="name"]') === 'Test Person', `${theme} ${vp.width} · draft survives a close`);
    await p.close();
  }
}

/* boundary cards across the pages that were broken */
const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const r of ['/industries/automotive/rental','/industries/healthcare/eye','/workforce/voice','/industries/financial-services/banks','/industries/real-estate/companies']) {
  await p.goto(B + r, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(200);
  const ok = await p.evaluate(() => [...document.querySelectorAll('.rail')].every(e => getComputedStyle(e).position === 'absolute'));
  say(ok, `boundary/rail ${r}`);
}
await p.close();
console.log(fails ? `\n${fails} FAILURES` : '\nLive site: everything verified.');
await browser.close();
