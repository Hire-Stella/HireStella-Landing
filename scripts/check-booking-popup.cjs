/* Run against TEST_ORIGIN. Calendly is mocked; never submits a real booking or lead. */
const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
const { mkdir } = require('node:fs/promises');
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3200';
const calendly = 'https://calendly.com/hirestella-marketing-nqfz/30min';
(async () => {
  const browser = await chromium.launch({ headless: true });
  await mkdir('test-results/booking', { recursive: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    await context.route(/(googletagmanager|google-analytics|analytics.google|doubleclick|googleadservices|facebook)/, r => r.abort());
    await context.route('https://calendly.com/**', r => r.fulfill({ contentType: 'text/html', body: '<h1>Select a Date &amp; Time</h1>' }));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const response = await page.goto(origin + '/get');
    assert.equal(response.status(), 200);
    assert.equal(await page.locator('dialog').count(), 0, 'No booking popup');
    const link = page.locator('.booking-link');
    assert.equal(await link.getAttribute('target'), '_blank');
    assert.match(await link.getAttribute('rel'), /noopener/);
    assert.ok((await link.getAttribute('href')).startsWith(calendly));
    await page.locator('[data-cta="header"]').click();
    await expect(link).toBeFocused();
    const [tab] = await Promise.all([context.waitForEvent('page'), link.click()]);
    await tab.waitForLoadState();
    assert.ok(tab.url().startsWith(calendly), 'Calendly opens in a new tab');
    assert.equal(page.url(), origin + '/get', 'Landing page stays open');
    await tab.close();
    assert.ok(await page.evaluate(() => dataLayer.some(e => e.event === 'booking_link_clicked')));
    assert.equal(await page.evaluate(() => dataLayer.some(e => e.event === 'generate_lead')), false);
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(t => document.documentElement.dataset.theme = t, theme);
        await link.scrollIntoViewIfNeeded();
        assert.ok(await link.evaluate(el => {
          const r = el.getBoundingClientRect();
          return r.left >= 0 && r.right <= innerWidth && document.documentElement.scrollWidth <= innerWidth;
        }), 'Booking link fits ' + width + ' ' + theme);
        await page.screenshot({ path: 'test-results/booking/' + width + '-' + theme + '.png' });
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('#submitBtn').click();
    await expect(page.locator('#f-name')).toHaveAttribute('aria-invalid', 'true');
    let lead;
    await page.route('**/api/get-lead', r => { lead = r.request().postDataJSON(); return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); });
    await page.locator('#f-name').fill('Booking QA');
    await page.locator('#f-business').fill('QA example');
    await page.locator('#f-email').fill('qa@example.com');
    await page.locator('#f-phone').fill('+971501234567');
    await page.locator('#submitBtn').click();
    await page.waitForURL('**/get/thank-you');
    assert.equal(lead.email, 'qa@example.com');
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS: no popup, Calendly in a new tab, landing stays open, focus, tracking, responsive themes, mocked callback');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
