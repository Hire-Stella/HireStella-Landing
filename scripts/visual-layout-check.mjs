import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const report = [];
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const routes = ['/', '/industries/automotive', '/use-cases'];
try {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      assert.equal(
        (await page.goto('http://127.0.0.1:3000' + route, { waitUntil: 'networkidle' })).status(),
        200,
      );
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map(async (image) => {
            image.loading = 'eager';
            try {
              await image.decode();
            } catch {}
          }),
        );
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
        false,
        `${route} ${width}`,
      );
      if (route === '/')
        assert.equal(await page.locator('.visual-directory .industry-card').count(), 5);
      if (route === '/use-cases') assert.equal(await page.locator('.workflow-figure').count(), 5);
      if (width === 390 || width === 1440) {
        await page.screenshot({
          path: `test-results/final-layout-${route.replaceAll('/', '-')}-${width}.png`,
          fullPage: true,
        });
        const axe = await new AxeBuilder({ page }).analyze();
        assert.deepEqual(
          axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
          [],
          `${route} ${width}`,
        );
      }
      report.push({ route, width, status: 'passed' });
    }
  }
  assert.deepEqual(errors, []);
  console.log(
    'Final homepage, industry overview and use-case layouts passed at four widths, with desktop/mobile accessibility checks.',
  );
} finally {
  await writeFile('test-results/visual-layout-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
