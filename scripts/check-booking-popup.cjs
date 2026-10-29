/* Run against TEST_ORIGIN; LIVE_CALENDLY=1 checks real dates. Never submits a real booking or lead. */
const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
const { mkdir } = require('node:fs/promises');
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3200';
const live = process.env.LIVE_CALENDLY === '1';
const widget = 'https://assets.calendly.com/assets/external/widget.js';
const mock = "window.Calendly={initInlineWidget({url,parentElement}){const f=document.createElement('iframe');f.src=url;parentElement.appendChild(f)}}";
const calendar = { contentType: 'text/html', body: '<h1>Select a Date &amp; Time</h1><button>Test date</button>' };
(async () => {
  const browser = await chromium.launch({ headless: true });
  await mkdir('test-results/booking', { recursive: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    await context.route(/(googletagmanager|google-analytics|analytics.google|doubleclick|googleadservices|facebook)/, r => r.abort());
    let requests = 0;
    await context.route(widget, async r => {
      requests++;
      if (live) return r.continue();
      await new Promise(resolve => setTimeout(resolve, 300));
      return r.fulfill({ contentType: 'application/javascript', body: mock });
    });
    if (!live) {
      await context.route('https://assets.calendly.com/assets/external/widget.css', r => r.fulfill({ contentType: 'text/css', body: '' }));
      await context.route('https://calendly.com/**', r => r.fulfill(calendar));
    }
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const response = await page.goto(origin + '/get');
    assert.equal(response.status(), 200);
    const csp = response.headers()['content-security-policy'];
    for (const directive of ['script-src', 'style-src']) assert.match(csp, new RegExp(directive + '[^;]*https://assets.calendly.com'));
    assert.match(csp, /frame-src[^;]*https:\/\/calendly.com/);
    assert.equal(requests, 0, 'Lazy load');
    await page.locator('[data-cta="header"]').click();
    await expect(page.locator('.booking-link')).toBeFocused();
    await page.locator('.booking-link').click();
    await page.locator('.booking-close').click();
    await page.locator('.booking-link').click();
    await expect(page.locator('#bookingCalendar iframe')).toHaveCount(1, { timeout: 25000 });
    const frame = page.frameLocator('#bookingCalendar iframe');
    await expect(frame.getByRole('heading', { name: /Select a (Date|Day)/ }).first()).toBeVisible({ timeout: 30000 });
    if (live) {
      const decline = frame.getByRole('button', { name: 'Decline', exact: true });
      if (await decline.isVisible()) await decline.click();
      const date = frame.getByRole('button', { name: / - Times available/i }).first();
      await expect(date).toBeVisible({ timeout: 30000 });
      await date.click();
      await expect(frame.getByRole('button', { name: /^\d{1,2}:\d{2}(am|pm)?$/i }).first()).toBeVisible({ timeout: 15000 });
      console.log('PASS: real date selection exposes time slots; no booking submitted');
    }
    assert.equal(context.pages().length, 1);
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(t => document.documentElement.dataset.theme = t, theme);
        assert.ok(await page.locator('#bookingDialog').evaluate(el => {
          const r = el.getBoundingClientRect();
          return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight && el.scrollWidth <= el.clientWidth + 1;
        }), 'Dialog fits ' + width + ' ' + theme);
        await page.screenshot({ path: 'test-results/booking/' + width + '-' + theme + '.png' });
      }
    }
    await page.locator('.booking-close').click();
    await expect(page.locator('.booking-link')).toBeFocused();
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    await page.locator('.booking-link').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#bookingDialog')).not.toBeVisible();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('.booking-link').click();
    await page.mouse.click(5, 5);
    await expect(page.locator('#bookingDialog')).not.toBeVisible();
    assert.equal(requests, 1, 'Reuse calendar');
    assert.ok(await page.evaluate(() => dataLayer.some(e => e.event === 'booking_link_clicked')));
    assert.equal(await page.evaluate(() => dataLayer.some(e => e.event === 'generate_lead')), false);
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

    const recovery = await browser.newContext({ reducedMotion: 'reduce' });
    await recovery.route(/https:\/\//, r => r.abort());
    const retry = await recovery.newPage();
    await retry.goto(origin + '/get');
    await retry.locator('.booking-link').click();
    await expect(retry.locator('.booking-retry')).toBeVisible();
    await recovery.route(widget, r => r.fulfill({ contentType: 'application/javascript', body: mock }));
    await recovery.route('https://calendly.com/**', r => r.fulfill(calendar));
    await retry.locator('.booking-retry').click();
    await expect(retry.locator('#bookingCalendar iframe')).toBeVisible();
    await expect(retry.locator('.booking-retry')).not.toBeVisible();
    await recovery.close();
    console.log('PASS: lazy load, reopen race, one tab, focus, Escape, backdrop, scroll restore, responsive themes, tracking, mocked callback and recovery');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
