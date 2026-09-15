import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3000';
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const report = { routes: [], interactions: [], accessibility: [] };
const routes = [
  '/',
  '/industries/healthcare/dental',
  '/industries',
  '/industries/automotive',
  '/blogs',
  '/blogs/dental-enquiry-to-appointment',
  '/blogs/dubai-healthcare-growth-clinic-operations',
  '/blogs/first-ai-workflow',
  
  
  '/security',
];
await mkdir('test-results', { recursive: true });
async function load(route) {
  const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200, route);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map(async (img) => {
        img.loading = 'eager';
        try {
          await img.decode();
        } catch {}
      }),
    );
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}
try {
  for (const width of process.env.VISUAL_FOCUS ? [] : [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1050 });
    for (const route of routes) {
      await load(route);
      assert.equal(await page.locator('h1').count(), 1, route);
      const overflow = await page.evaluate(() =>
        Array.from(document.querySelectorAll('main *'))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return (
              r.width > 0 &&
              r.right > innerWidth + 2 &&
              getComputedStyle(el).position !== 'absolute'
            );
          })
          .map((el) => el.className)
          .slice(0, 8),
      );
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
        false,
        `${route} ${width}: ${overflow}`,
      );
      assert.deepEqual(
        await page
          .locator('main img')
          .evaluateAll((images) =>
            images
              .filter((img) => !img.complete || img.naturalWidth === 0)
              .map((img) => img.getAttribute('src')),
          ),
        [],
        `Images load: ${route}`,
      );
      report.routes.push({ route, width });
      if (
        [1440, 390].includes(width) &&
        [
          '/',
          '/industries/healthcare/dental',
          '/blogs',
          '/blogs/dubai-healthcare-growth-clinic-operations',
          
        ].includes(route)
      )
        await page.screenshot({
          path: `test-results/visual-${route.replaceAll('/', '-') || 'home'}-${width}.png`,
          fullPage: true,
        });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1050 });
  await load('/industries/healthcare/dental');
  const selector = page.getByRole('group', { name: 'Choose a dental workflow specialist' });
  assert.equal(await selector.getByRole('button').count(), 8);
  for (const name of [
    'Voice',
    'Website',
    'Booking',
    'Admin',
    'Marketing',
    'Social',
    'Follow-up',
    'Front Desk',
  ]) {
    await selector.getByRole('button', { name: new RegExp(name) }).click();
    assert.equal(
      await selector.getByRole('button', { name: new RegExp(name) }).getAttribute('aria-pressed'),
      'true',
    );
    assert.ok((await page.locator('.specialist-stage').innerText()).length > 150);
  }
  const dashboard = page.locator('.operations-dashboard');
  assert.match(await dashboard.locator('.ops-stats').innerText(), /34/);
  await dashboard.getByRole('button', { name: '7 days', exact: true }).click();
  assert.match(await dashboard.locator('.ops-stats').innerText(), /224/);
  assert.match(await dashboard.locator('.ops-stats').innerText(), /137/);
  await dashboard.getByRole('button', { name: 'Human Handoffs', exact: false }).click();
  assert.equal(await dashboard.locator('.ops-record').count(), 2);
  await dashboard.locator('.ops-record button').first().click();
  await dashboard.locator('.ops-record-detail').waitFor();
  await dashboard.getByRole('button', { name: 'Appointments', exact: true }).click();
  assert.equal(await dashboard.locator('.ops-record').count(), 2);
  await page.setViewportSize({ width: 390, height: 1050 });
  await dashboard.getByLabel('Workspace view').selectOption('Specialists');
  assert.equal(await dashboard.locator('.ops-specialists > a').count(), 8);
  await dashboard.getByLabel('Workspace view').selectOption('Overview');
  await page.screenshot({
    path: 'test-results/visual-dental-dashboard-mobile.png',
    fullPage: true,
  });
  report.interactions.push(
    'Eight dental roles; today/week aggregation; handoff details; appointment filtering; mobile dashboard navigation',
  );
  for (const theme of ['light', 'dark']) {
    await page.evaluate((value) => localStorage.setItem('hirestella-theme', value), theme);
    for (const route of [
      '/industries/healthcare/dental',
      '/blogs',
      '/blogs/dental-enquiry-to-appointment',
      '/blogs/dubai-healthcare-growth-clinic-operations',
      '/blogs/first-ai-workflow',
      
    ]) {
      await load(route);
      const result = await new AxeBuilder({ page }).analyze();
      report.accessibility.push({
        theme,
        route,
        violations: result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
        })),
      });
      assert.equal(result.violations.length, 0, JSON.stringify(report.accessibility.at(-1)));
    }
    await load('/industries/healthcare/dental');
    await page.screenshot({ path: `test-results/visual-dental-${theme}.png`, fullPage: true });
  }
  await load('/blogs');
  await page.getByRole('button', { name: 'Dental', exact: true }).click();
  assert.equal(await page.locator('.article-card').count(), 2);
  await load('/blogs/dental-enquiry-to-appointment');
  await page.getByRole('link', { name: 'Sources & context' }).click();
  assert.ok(page.url().endsWith('#sources'));
  assert.equal((await page.goto(origin + '/pricing')).status(), 404);
  assert.deepEqual(errors, []);
  console.log(
    process.env.VISUAL_FOCUS ? 'Visual interactions and both-theme accessibility passed.' : 'Visual checks passed: 11 routes at 4 widths, loaded images, eight roles, dashboard interactions, blog filter/source navigation, both-theme accessibility.',
  );
} finally {
  await writeFile(process.env.VISUAL_FOCUS ? 'test-results/visual-interactions-report.json' : 'test-results/visual-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
