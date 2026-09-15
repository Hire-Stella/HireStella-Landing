import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.TEST_ORIGIN || 'https://hirestella.tactikstudio.com';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { origin, routes: [], errors: [] };
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  await page.addInitScript(() => sessionStorage.setItem('hirestella-demo-invitation', 'seen'));
  for (const route of ['/', '/stella', '/workforce', '/workforce/voice', '/solutions/dental', '/book-demo']) {
    const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator('a[href="/pricing"]').count(), 0);
    if (route === '/') assert.equal(await page.locator('.pricing-section').count(), 0);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${route} at ${width}px`);
    }
    report.routes.push(route);
  }
  const missing = await page.goto(origin + '/pricing', { waitUntil: 'networkidle' });
  assert.equal(missing.status(), 404);
  const sitemap = await page.request.get(origin + '/sitemap.xml');
  assert.equal(sitemap.status(), 200);
  assert.ok((await sitemap.text()).includes(origin + '/stella'));
  assert.ok(!(await sitemap.text()).includes('/pricing'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('button', { name: 'Product', exact: true }).click();
  await page.getByRole('link', { name: 'Meet Stella', exact: true }).first().click();
  await page.waitForURL('**/stella');
  await page.goto(origin, { waitUntil: 'networkidle' });
  await mkdir('test-results', { recursive: true });
  await page.screenshot({ path: 'test-results/live-mobile.png', fullPage: true });
  assert.deepEqual(report.errors, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await mkdir('test-results', { recursive: true });
  await writeFile('test-results/deployment-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
