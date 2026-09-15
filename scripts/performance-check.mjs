import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.addInitScript(() => {
  window.__metrics = { lcp: 0, cls: 0 };
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) window.__metrics.lcp = entry.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__metrics.cls += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
});
const session = await context.newCDPSession(page);
await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await session.send('Network.enable');
await session.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const metrics = await page.evaluate(() => ({
  ...window.__metrics,
  resources: performance.getEntriesByType('resource').map(r => ({ path: new URL(r.name).pathname, transfer: r.transferSize, duration: Math.round(r.duration) })),
  totalTransferred: performance.getEntriesByType('resource').reduce((sum, r) => sum + r.transferSize, 0),
}));
await writeFile('test-results/performance.json', JSON.stringify(metrics, null, 2));
console.log(JSON.stringify({ lcpMilliseconds: Math.round(metrics.lcp), cumulativeLayoutShift: metrics.cls, totalTransferredBytes: metrics.totalTransferred, conditions: 'Local production server, cold cache, 390px viewport, 4x CPU slowdown, 1.6 Mbps download, 150ms latency. Diagnostic lab sample, not field data.' }, null, 2));
await browser.close();
