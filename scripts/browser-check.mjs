import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await mkdir('test-results', { recursive: true });
const report = { routes: [], accessibility: [], checks: [] };
try {
  const routes = [
    '/',
    '/stella',
    '/workforce',
    ...[
      'front-desk',
      'voice',
      'website',
      'booking',
      'admin',
      'marketing',
      'social',
      'outbound-followup',
    ].map((id) => `/workforce/${id}`),
    '/how-it-works',
    '/solutions',
    ...['dental', 'real-estate', 'banking', 'salons'].map((id) => `/solutions/${id}`),
    '/integrations',
    '/human-boundary',
    '/security',
    '/about',
    '/team',
    '/roi',
    '/dashboard',
    '/contact',
    '/book-demo',
    '/login',
  ];
  for (const route of routes) {
    const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator('h1').count(), 1, `Single h1: ${route}`);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    assert.equal(overflow, false, `Desktop overflow: ${route}`);
    report.routes.push({ route, status: 200 });
  }
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  await page.screenshot({ path: 'test-results/hero-desktop.png' });
  await page.getByRole('button', { name: 'Dental', exact: true }).click();
  assert.match(await page.locator('#business-problem').inputValue(), /patients/);
  await page.getByRole('button', { name: 'Build my workforce preview' }).click();
  await page.getByRole('heading', { name: /A connected starting point/ }).waitFor();
  assert.match(await page.locator('.workforce-result').innerText(), /clinical team/);
  await page.getByRole('button', { name: 'Refine my problem' }).click();
  assert.equal(
    await page.locator('#business-problem').evaluate((el) => el === document.activeElement),
    true,
  );
  assert.equal(await page.locator('.visual-directory .industry-card').count(), 5);
  assert.equal(await page.locator('.visual-directory a[href="/industries/real-estate"]').count(), 1);
  await page.getByRole('tab', { name: /Human judgement/ }).click();
  assert.match(await page.locator('#journey-panel').innerText(), /clinical question/);
  report.checks.push(
    'Scenario selection, workforce preview, refine focus, industry switching, journey steps',
  );
  assert.equal(await page.locator('a[href="/pricing"]').count(), 0);
  assert.equal(await page.locator('.pricing-section').count(), 0);
  const removedPricing = await page.goto(origin + '/pricing');
  assert.equal(removedPricing.status(), 404);
  report.checks.push('Pricing removed from homepage, navigation, and public routes');
  await page.goto(origin + '/roi', { waitUntil: 'networkidle' });
  await page.getByLabel('Assumed automatable share', { exact: false }).fill('0');
  assert.match(await page.locator('.capacity-number').innerText(), /^0/);
  await page.getByLabel('Assumed automatable share', { exact: false }).fill('40');
  await page.getByLabel('Expected voice minutes').fill('200');
  assert.match(await page.locator('.calculator-results').innerText(), /AED 25/);
  report.checks.push('Calculator live recalculation and overage');
  await page.goto(origin + '/dashboard', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Human Handoffs/ }).click();
  assert.equal(await page.locator('.ops-record').count(), 2);
  await page.locator('.ops-record>button').first().click();
  assert.match(await page.locator('.ops-record-detail').innerText(), /clinician/);
  await page.getByRole('button', { name: 'Specialists', exact: true }).click();
  assert.equal(await page.locator('.ops-specialists>a').count(), 8);
  report.checks.push('Dashboard views, coherent handoff details, eight specialists');
  await page.goto(origin + '/book-demo?plan=Pro&term=six&problem=We%20miss%20clinic%20calls.', {
    waitUntil: 'networkidle',
  });
  assert.equal(await page.locator('[name=plan]').inputValue(), 'Pro');
  assert.equal(await page.locator('[name=term]').inputValue(), 'six');
  assert.equal(await page.locator('[name=problem]').inputValue(), 'We miss clinic calls.');
  await page.getByLabel('Your name').fill('Demo User');
  await page.getByLabel('Work email').fill('demo@example.com');
  await page.getByLabel('Business name', { exact: true }).fill('Demo Clinic');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Prepare my consultation brief' }).click();
  await page.getByRole('heading', { name: 'Your brief is ready.' }).waitFor();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download my brief' }).click(),
  ]);
  assert.equal(download.suggestedFilename(), 'HireStella-Consultation-Brief.txt');
  report.checks.push('Consultation context carryover and honest local brief download');
  const unavailable = await page.request.post(origin + '/api/leads', { data: {} });
  assert.equal(unavailable.status(), 503);
  const badOrigin = await page.request.post(origin + '/api/leads', {
    data: {},
    headers: { origin: 'https://example.com' },
  });
  assert.equal(badOrigin.status(), 403);
  const missing = await page.goto(origin + '/missing-page');
  assert.equal(missing.status(), 404);
  report.checks.push('Unconfigured endpoint, cross-origin rejection, actual 404 status');
  for (const route of ['/', '/roi', '/dashboard', '/book-demo']) {
    await page.goto(origin + route, { waitUntil: 'networkidle' });
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    report.accessibility.push({
      route,
      violations: axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(origin + route, { waitUntil: 'networkidle' });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      false,
      `Mobile overflow: ${route}`,
    );
  }
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  await page.screenshot({ path: 'test-results/hero-mobile.png' });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('button', { name: 'Product', exact: true }).click();
  await page.getByRole('link', { name: 'Meet Stella', exact: true }).first().click();
  await page.waitForURL('**/stella');
  assert.equal(new URL(page.url()).pathname, '/stella');
  await page.getByRole('button', { name: 'Talk to Stella' }).click();
  await page.getByRole('link', { name: 'Try the workforce preview' }).click();
  await page.locator('#business-problem').waitFor();
  report.checks.push(
    'Mobile navigation, conversation widget, every route without horizontal overflow',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(origin, { waitUntil: 'networkidle' });
  assert.equal(
    await page.locator('.active-route').evaluate((el) => getComputedStyle(el).animationName),
    'none',
  );
  report.checks.push('Reduced-motion route fallback');
  assert.deepEqual(errors, [], 'Browser runtime errors');
  const violations = report.accessibility.flatMap((r) =>
    r.violations.map((v) => ({ route: r.route, ...v })),
  );
  await writeFile('test-results/report.json', JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        routes: report.routes.length,
        checks: report.checks,
        accessibilityViolations: violations,
        runtimeErrors: errors,
      },
      null,
      2,
    ),
  );
  assert.equal(violations.length, 0, 'Accessibility violations');
} finally {
  await writeFile('test-results/report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
