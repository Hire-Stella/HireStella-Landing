import { chromium } from '@playwright/test';
const routes=['/','/stella','/sales-coach','/integrations','/human-boundary','/security','/about','/team',
'/industries','/industries/healthcare',
'/industries/real-estate','/industries/automotive','/industries/healthcare/dental','/industries/healthcare/eye','/industries/healthcare/aesthetic','/industries/healthcare/multispecialty','/industries/healthcare/enterprise','/industries/healthcare/groups','/industries/real-estate/companies','/industries/real-estate/consultancies','/industries/financial-services/banks','/industries/financial-services/advisory','/industries/automotive/rental','/industries/automotive/service','/industries/automotive/dealerships','/use-cases','/blogs',
'/blogs/first-ai-workflow','/roi','/contact','/book-demo','/become-a-partner','/solutions/salons'];
const b=await chromium.launch({channel:'chrome',headless:true});
let bad=0;
for(const w of [390,360]){
 const c=await b.newContext({viewport:{width:w,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 const p=await c.newPage();
 await p.addInitScript(()=>{try{localStorage.setItem('hirestella-theme','dark')}catch(e){}});
 for(const r of routes){
  const errs=[];const h=e=>errs.push(String(e.message||e).slice(0,70));p.on('pageerror',h);
  await p.goto('http://127.0.0.1:3000'+r,{waitUntil:'load'});
  await p.evaluate(()=>new Promise(res=>{let y=0;const t=setInterval(()=>{y+=700;scrollTo(0,y);if(y>document.body.scrollHeight){clearInterval(t);scrollTo(0,0);setTimeout(res,250)}},30)}));
  const d=await p.evaluate(()=>{
    const vw=innerWidth;
    const over=[...document.querySelectorAll('body *')].filter(e=>{
      const b=e.getBoundingClientRect();const s=getComputedStyle(e);
      if(s.overflowX==='auto'||s.overflowX==='scroll')return false;
      return b.width>0&&(b.right>vw+2||b.left<-2);
    }).slice(0,3).map(e=>(e.className||e.tagName).toString().slice(0,28));
    const tiny=[...document.querySelectorAll('body *')].filter(e=>{
      const s=getComputedStyle(e);const b=e.getBoundingClientRect();
      return b.height>0&&parseFloat(s.fontSize)<11&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1)}).length;
    // the tap target is the wrapping label where there is one, and the
    // off-screen honeypot is never a target at all
    const small=[...document.querySelectorAll('a,button,input,select,summary')].filter(e=>{
      if(e.closest('.form-honeypot')) return false;
      const box=e.closest('label')||e;
      const b=box.getBoundingClientRect();
      return b.height>0&&b.height<40}).length;
    const clipped=[...document.querySelectorAll('h1,h2,h3,h4,p,b')].filter(e=>{
      const s=getComputedStyle(e);
      return s.overflowX!=='auto'&&e.scrollWidth>e.clientWidth+2&&e.clientWidth>0}).length;
    return {scrollW:document.documentElement.scrollWidth,vw,over,tiny,small,clipped};
  });
  const f=[];
  if(d.scrollW>d.vw+1)f.push('H-SCROLL '+d.scrollW+'>'+d.vw+' ['+d.over.join(',')+']');
  if(d.tiny)f.push('TINY:'+d.tiny);
  if(d.clipped)f.push('CLIPPED:'+d.clipped);
  if(d.small>2)f.push('SMALL-TARGETS:'+d.small);
  if(errs.length)f.push('ERR '+errs[0]);
  if(f.length){bad++;console.log(w+'px '+r.padEnd(34)+f.join(' | '))}
  p.off('pageerror',h);
 }
 await c.close();
}
await b.close();
console.log(bad?`\n${bad} mobile issues`:'\nMobile clean at 390 and 360');
