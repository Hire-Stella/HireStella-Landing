import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const routes = [
  '/industries',
  '/industries/healthcare',
  '/industries/healthcare',
  '/industries/real-estate',
  '/industries/financial-services',
  '/industries/automotive',
  '/industries/healthcare/dental',
  '/use-cases',
  '/blogs',
  '/blogs/dental-enquiry-to-appointment',
  '/blogs/dubai-healthcare-growth-clinic-operations',
  '/blogs/first-ai-workflow',
];
const report = { routes: [], checks: [], accessibility: [] };
await mkdir('test-results', { recursive: true });
try {
  for (const width of [320, 390, 768, 800, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(origin + '/industries/healthcare/dental', { waitUntil: 'networkidle' });
    const header = await page.locator('.site-header').boundingBox();
    const actions = await page.locator('.header-actions').boundingBox();
    assert.ok(
      actions.x + actions.width <= header.x + header.width - 5,
      `Header controls fit inside header at ${width}: ${JSON.stringify({ header, actions, items: await page.locator('.header-actions > *, .brand-link').evaluateAll((nodes) => nodes.map((n) => ({ class: n.className, width: n.getBoundingClientRect().width, display: getComputedStyle(n).display }))) })}`,
    );
    if (width === 390) await page.screenshot({ path: 'test-results/header-mobile-fixed.png' });
  }
  report.checks.push('Header controls fit within header at 320, 390, 768, 800, 1024 and 1440px');
  for (const width of process.env.INTERACTION_ONLY ? [] : [1440, 1024, 800, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, route);
      assert.equal(await page.locator('h1').count(), 1, route);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
        false,
        `${route} overflow at ${width}`,
      );
    }
    if (width >= 768) {
      const bounds = await page.locator('.header-actions').boundingBox();
      assert.ok(bounds.x + bounds.width <= width, `Header fits at ${width}`);
    }
    report.checks.push(`12 routes without overflow at ${width}px`);
  }
  for (const [from, to] of [
    ['/solutions', '/industries'],
    ['/solutions/dental', '/industries/healthcare/dental'],
    ['/solutions/real-estate', '/industries/real-estate'],
    ['/solutions/banking', '/industries/financial-services'],
  ]) {
    const response = await page.request.get(origin + from, { maxRedirects: 0 });
    assert.equal(response.status(), 308);
    assert.equal(response.headers().location, to);
  }
  report.checks.push('Four legacy routes redirect permanently');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(origin + '/industries/healthcare/dental', { waitUntil: 'networkidle' });
    if (width === 390) await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    await page.getByRole('button', { name: 'Industries', exact: true }).click();
    await page.locator('.industries-menu').waitFor();
    assert.equal(await page.locator('.industry-menu-group').count(), 5);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      false,
    );
    const menuAxe = await new AxeBuilder({ page }).include('.site-header').analyze();
    assert.deepEqual(
      menuAxe.violations.map((v) => v.id),
      [],
      `Menu a11y ${width}`,
    );
    await page.screenshot({ path: `test-results/industries-menu-${width}.png` });
    await page
      .locator('.industries-menu')
      .getByRole('link', { name: 'Dental clinics', exact: true })
      .click();
    await page.locator('.industries-menu').waitFor({ state: 'hidden' });
    if (width === 390)
      assert.equal(
        await page
          .getByRole('button', { name: 'Open menu', exact: true })
          .getAttribute('aria-expanded'),
        'false',
      );
    await page.screenshot({ path: `test-results/dental-${width}.png`, fullPage: true });
  }
  await page.goto(origin + '/blogs', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Dental', exact: true }).click();
  assert.equal(await page.locator('.article-card').count(), 2);
  await page.getByRole('button', { name: 'General', exact: true }).click();
  assert.equal(await page.locator('.article-card').count(), 1);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  assert.equal(await page.locator('.article-card').count(), 3);
  report.checks.push('Desktop/mobile industry navigation, menu dismissal, blog filters');
  for (const theme of ['dark', 'light']) {
    await page.evaluate((theme) => {
      localStorage.setItem('hirestella-theme', theme);
      document.documentElement.dataset.theme = theme;
    }, theme);
    for (const route of [
      '/industries/healthcare/dental',
      '/blogs',
      '/blogs/dubai-healthcare-growth-clinic-operations',
    ]) {
      await page.goto(origin + route, { waitUntil: 'networkidle' });
      await page.evaluate((theme) => {
        document.documentElement.dataset.theme = theme;
      }, theme);
      const results = await new AxeBuilder({ page }).analyze();
      report.accessibility.push({
        route,
        theme,
        violations: results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      });
      assert.equal(
        results.violations.length,
        0,
        `${route} ${theme}: ${JSON.stringify(report.accessibility.at(-1))}`,
      );
    }
    await page.goto(origin + '/industries/healthcare/dental', { waitUntil: 'networkidle' });
    await page.evaluate((theme) => {
      document.documentElement.dataset.theme = theme;
    }, theme);
    await page.screenshot({ path: `test-results/dental-${theme}-mobile.png`, fullPage: true });
  }
  assert.equal((await page.goto(origin + '/pricing')).status(), 404);
  assert.equal((await page.goto(origin + '/industries/unknown')).status(), 404);
  assert.equal((await page.goto(origin + '/blogs/unknown')).status(), 404);
  assert.deepEqual(errors, []);
  report.routes = routes;
  console.log(
    process.env.INTERACTION_ONLY
      ? 'Header, redirects, navigation, filters and accessibility checks passed.'
      : 'Industry checks passed: 12 routes, 6 widths, redirects, navigation, filters, accessibility in both themes.',
  );
} finally {
  await writeFile('test-results/industry-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
