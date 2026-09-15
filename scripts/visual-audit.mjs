import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const routes = ['/', '/stella', '/workforce', ...['front-desk','voice','website','booking','admin','marketing','social','outbound-followup'].map(x=>'/workforce/'+x), '/how-it-works','/solutions', ...['dental','real-estate','banking','salons'].map(x=>'/solutions/'+x), '/integrations','/human-boundary','/security','/about','/team','/roi','/dashboard','/contact','/book-demo','/login'];
const browser = await chromium.launch({channel:'chrome',headless:true});
const context = await browser.newContext({reducedMotion:'reduce'});
await context.addInitScript(()=>sessionStorage.setItem('hirestella-demo-invitation','seen'));
const page=await context.newPage();
const report=[];
await mkdir('test-results/audit',{recursive:true});
try {
 for (const theme of ['light','dark']) {
  await page.emulateMedia({colorScheme:theme});
  for (const [i,route] of routes.entries()) {
   await page.setViewportSize({width:1440,height:1000});
   const response=await page.goto('http://127.0.0.1:3000'+route,{waitUntil:'networkidle'});
   const desktop=await page.evaluate(()=>{
    const els=[...document.querySelectorAll('main p,main button,main a,main label,main span,footer a')].filter(e=>e.getClientRects().length&&e.textContent.trim()&&![...e.children].some(c=>c.textContent.trim()));
    return {height:document.documentElement.scrollHeight,text:document.querySelector('main').innerText,smallText:els.filter(e=>parseFloat(getComputedStyle(e).fontSize)<12).map(e=>({text:e.textContent.trim().slice(0,100),size:getComputedStyle(e).fontSize,opacity:getComputedStyle(e).opacity,color:getComputedStyle(e).color})),headings:[...document.querySelectorAll('main h1,main h2')].map(e=>e.textContent),mainSections:[...document.querySelectorAll('main > section')].map(e=>({heading:e.querySelector('h1,h2')?.textContent,top:Math.round(e.getBoundingClientRect().top),height:Math.round(e.getBoundingClientRect().height)}))};
   });
   await page.screenshot({path:`test-results/audit/${theme}-${i}-desktop.png`,fullPage:true});
   await page.setViewportSize({width:390,height:844});
   await page.screenshot({path:`test-results/audit/${theme}-${i}-mobile.png`,fullPage:true});
   const mobile=await page.evaluate(()=>({height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,smallTargets:[...document.querySelectorAll('main button')].filter(e=>e.getClientRects().length&&e.getBoundingClientRect().height<32).map(e=>({text:e.textContent||e.getAttribute('aria-label'),height:e.getBoundingClientRect().height}))}));
   report.push({route,theme,status:response.status(),desktop,mobile});
  }
  console.log('Captured all routes in '+theme);
 }
 await writeFile('test-results/audit/measurements.json',JSON.stringify(report,null,2));
 // Browser-rendered contact sheets retain route labels for the visual review.
 for (const theme of ['light','dark']) for(let batch=0;batch<4;batch++) {
  const start=batch*7;
  const cards=routes.slice(start,start+7).map((r,j)=>`<article><h2>${r}</h2><div><img src="${theme}-${start+j}-desktop.png"></div></article>`).join('');
  await writeFile(`test-results/audit/${theme}-sheet-${batch}.html`,`<style>body{margin:20px;background:#dedee6;font:14px Arial}.grid{display:grid;grid-template-columns:repeat(2,720px);gap:20px}h2{margin:8px;font-size:18px}article div{height:500px;overflow:hidden}img{width:720px;display:block}</style><div class="grid">${cards}</div>`);
  await page.setViewportSize({width:1500,height:2220});
  await page.goto(new URL(`../test-results/audit/${theme}-sheet-${batch}.html`,import.meta.url).href);
  await page.screenshot({path:`test-results/audit/${theme}-sheet-${batch}.png`,fullPage:true});
 }
 console.log(JSON.stringify(report.map(r=>({route:r.route,theme:r.theme,desktopHeight:r.desktop.height,mobileHeight:r.mobile.height,smallText:r.desktop.smallText.length,smallTargets:r.mobile.smallTargets.length,overflow:r.mobile.overflow})),null,2));
}finally{await browser.close();}
