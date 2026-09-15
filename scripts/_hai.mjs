import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir(process.env.OUT,{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true});
for(const [n,vp,theme] of [
  ['dark',{width:1440,height:1000},'dark'],
  ['light',{width:1440,height:1000},'light'],
  ['mobile',{width:390,height:844,isMobile:true,hasTouch:true},'dark']]){
  const c=await b.newContext({...vp,deviceScaleFactor:n==='mobile'?2:0.74});
  const p=await c.newPage();
  await p.addInitScript(t=>{try{localStorage.setItem('hirestella-theme',t)}catch(e){}},theme);
  await p.goto('http://127.0.0.1:3000/',{waitUntil:'load'});
  await p.evaluate(()=>new Promise(r=>{let y=0;const t=setInterval(()=>{y+=800;scrollTo(0,y);if(y>document.body.scrollHeight){clearInterval(t);scrollTo(0,0);setTimeout(r,600)}},28)}));
  const box=await p.evaluate(()=>{const s=document.querySelector('#human-boundary');const b=s.getBoundingClientRect();
    return {y:Math.round(b.top+scrollY),h:Math.round(b.height)}});
  await p.screenshot({path:`${process.env.OUT}/hai-${n}.png`,fullPage:true,clip:{x:0,y:box.y,width:vp.width,height:Math.min(box.h,n==='mobile'?2600:1500)}});
  console.log(n,'section height',box.h);
  await c.close();
}
await b.close();
