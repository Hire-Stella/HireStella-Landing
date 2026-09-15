import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3000';
const report = [];
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(() => sessionStorage.setItem('hirestella-demo-invitation', 'seen'));
  await mkdir('test-results', { recursive: true });
  for (const theme of ['dark', 'light']) {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    for (const route of ['/', '/stella', '/workforce', '/workforce/voice', '/workforce/booking', '/workforce/website', '/workforce/admin', '/human-boundary', '/about', '/roi', '/dashboard', '/book-demo']) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(origin + route, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
      assert.equal(await page.locator('.brand-link img:visible').count(), 1, 'One logo per theme');
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      report.push({ theme, route, violations: results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
      if (route === '/stella') {
        const scene = page.locator('.hero-scene');
        assert.equal(await scene.getAttribute('data-stage'), '0');
        await page.getByRole('button', { name: 'Connect', exact: true }).click();
        assert.equal(await scene.getAttribute('data-stage'), '1');
        await page.screenshot({ path: `test-results/stella-${theme}.png` });
      }
      if (route === '/book-demo') {
        await page.getByLabel('Your name').waitFor({ state: 'visible' });
        assert.ok(await page.locator('#consultation').evaluate(e => e.getBoundingClientRect().top < innerHeight), 'Compact consultation hero exposes the form');
      }
      for (const width of [320, 390, 768]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${theme} ${route} at ${width}`);
      }
    }
  }
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', 'Theme survives reload');
  await writeFile('test-results/refinement-report.json', JSON.stringify(report, null, 2));
  const failures = report.filter(r => r.violations.length);
  console.log(JSON.stringify({ pages: report.length, failures }, null, 2));
  assert.equal(failures.length, 0, 'Theme and preview accessibility');
} finally {
  await writeFile('test-results/refinement-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
