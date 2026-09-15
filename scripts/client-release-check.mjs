import { chromium, devices } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const origin = 'https://hirestella.tactikstudio.com';
const browser = await chromium.launch({channel:'chrome',headless:true});
const report = { origin, release:'visual-industries-v8', routes:[], checks:[], errors:[] };
try {
 if (process.argv.includes('--mobile-only')) {
  for (const device of ['iPhone 13', 'Pixel 7']) {
   const context = await browser.newContext({ ...devices[device] });
   const page = await context.newPage();
   page.on('pageerror', error => report.errors.push(error.message));
   const response = await page.goto(origin, { waitUntil: 'networkidle' });
   assert.equal(response.status(), 200);
   assert.equal(await page.locator('.visual-directory .industry-card').count(), 5, `${device} sees v8 homepage`);
   await page.getByRole('button', { name: 'Open menu', exact: true }).click();
   await page.getByRole('button', { name: 'Industries', exact: true }).click();
   await page.locator('.industries-menu').getByRole('link', { name: 'Dental clinics', exact: true }).click();
   await page.waitForURL('**/industries/healthcare/dental');
   assert.equal(await page.locator('.specialist-selector button').count(), 8);
   await mkdir('test-results', { recursive: true });
   await page.screenshot({ path: `test-results/live-v8-${device.replaceAll(' ', '-')}.png` });
   report.checks.push(`${device}: new homepage, Industries menu and eight-specialist dental page verified`);
   await context.close();
  }
  assert.deepEqual(report.errors, []);
  console.log(JSON.stringify(report, null, 2));
 } else {
 const context=await browser.newContext();const page=await context.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',error=>report.errors.push(error.message));
 for(const route of ['/','/industries','/industries/healthcare','/industries/real-estate','/industries/financial-services','/industries/automotive','/industries/healthcare/dental','/use-cases','/blogs','/blogs/dental-enquiry-to-appointment','/blogs/dubai-healthcare-growth-clinic-operations','/blogs/first-ai-workflow','/stella']) {
  const response=await page.goto(origin+route,{waitUntil:'networkidle'});assert.equal(response.status(),200,route);
  assert.equal(await page.locator('h1').count(),1,route);
  assert.equal(await page.locator('a[href="/pricing"]').count(),0);
  if(route==='/')assert.equal(await page.locator('.visual-directory .industry-card').count(),5);
  if(route==='/industries/healthcare/dental')assert.equal(await page.locator('.specialist-selector button').count(),8);
  report.routes.push(route);
 }
 await page.getByRole('button',{name:'7 days',exact:true}).click();assert.match(await page.locator('.ops-stats').innerText(),/224/);
 await page.getByRole('button',{name:/Human Handoffs/}).click();assert.equal(await page.locator('.ops-record').count(),2);
 await page.locator('.ops-record button').first().click();await page.locator('.ops-record-detail').waitFor();
 const redirect=await page.request.get(origin+'/solutions/dental',{maxRedirects:0});assert.equal(redirect.status(),308);
 assert.equal((await page.request.get(origin+'/pricing')).status(),404);
 const sitemap=await (await page.request.get(origin+'/sitemap.xml')).text();assert.ok(sitemap.includes('/industries/healthcare/dental'));assert.ok(sitemap.includes('/blogs/first-ai-workflow'));assert.ok(!sitemap.includes('/pricing'));
 await page.setViewportSize({width:390,height:844});await page.goto(origin,{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.getByRole('button',{name:'Industries',exact:true}).click();await page.locator('.industries-menu').getByRole('link',{name:'Dental clinics',exact:true}).click();await page.waitForURL('**/industries/healthcare/dental');
 await page.getByRole('group',{name:'Choose a dental workflow specialist'}).getByRole('button',{name:/Booking/}).click();assert.match(await page.locator('.specialist-stage').innerText(),/From interest to in the calendar/);
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:950});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`Dental at ${width}`);}
 await page.evaluate(async()=>{await Promise.all([...document.images].map(async image=>{image.loading='eager';try{await image.decode();}catch{}}));});
 assert.deepEqual(await page.locator('main img').evaluateAll(images=>images.filter(image=>image.naturalWidth===0).map(image=>image.src)),[]);
 await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/live-v8-dental.png'});
 report.checks.push('New release markers; dashboard period/filter/details; legacy redirect; pricing 404; sitemap; mobile industry menu; eight-role interaction; image loading; dental responsive widths');
 assert.deepEqual(report.errors,[]);console.log(JSON.stringify(report,null,2));
 }
} finally {await mkdir('test-results',{recursive:true});await writeFile(process.argv.includes('--mobile-only') ? 'test-results/mobile-release-report.json' : 'test-results/client-release-report.json',JSON.stringify(report,null,2));await browser.close();}
