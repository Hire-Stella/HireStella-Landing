import { chromium } from '@playwright/test';
const routes=['/','/stella','/sales-coach','/integrations','/human-boundary','/security','/about','/team',


'/industries','/industries/healthcare','/industries/real-estate',
'/industries/financial-services','/industries/automotive','/industries/healthcare/dental','/industries/healthcare/eye','/industries/healthcare/aesthetic','/industries/healthcare/multispecialty','/industries/healthcare/enterprise','/industries/healthcare/groups','/industries/real-estate/companies','/industries/real-estate/consultancies','/industries/financial-services/banks','/industries/financial-services/advisory','/industries/automotive/rental','/industries/automotive/service','/industries/automotive/dealerships',
'/use-cases','/blogs','/blogs/dental-enquiry-to-appointment','/blogs/first-ai-workflow',
'/roi','/contact','/book-demo','/become-a-partner','/solutions/salons'];
const b=await chromium.launch({channel:'chrome',headless:true});
let bad=0;
for(const theme of ['dark','light']){
 const c=await b.newContext({viewport:{width:1440,height:900}});
 const p=await c.newPage();
 await p.addInitScript(t=>{try{localStorage.setItem('hirestella-theme',t)}catch(e){}},theme);
 for(const r of routes){
  const errs=[];const h=e=>errs.push(String(e.message||e).slice(0,90));p.on('pageerror',h);
  let st=0;
  try{const resp=await p.goto('http://127.0.0.1:3000'+r,{waitUntil:'load',timeout:40000});st=resp?.status()??0;
   await p.evaluate(()=>new Promise(res=>{let y=0;const t=setInterval(()=>{y+=800;scrollTo(0,y);if(y>document.body.scrollHeight){clearInterval(t);scrollTo(0,0);setTimeout(res,350)}},35)}));
  }catch(e){errs.push('NAV '+String(e).slice(0,60))}
  const d=await p.evaluate(()=>{
    const vw=innerWidth;
    const tiny=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);const b=e.getBoundingClientRect();
      return b.height>0&&parseFloat(s.fontSize)<11&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1)}).length;
    return {ow:document.documentElement.scrollWidth>vw+1,tiny,h1:document.querySelectorAll('h1').length,
      legacy:document.querySelectorAll('.site-header,.site-footer,.container,.section-heading,.button-primary').length};
  });
  const flag=[st!==200?'STATUS '+st:'',d.ow?'OVERFLOW':'',d.tiny?'TINY:'+d.tiny:'',d.h1!==1?'H1:'+d.h1:'',d.legacy?'LEGACY:'+d.legacy:'',errs.length?'ERR '+errs[0]:''].filter(Boolean).join(' | ');
  if(flag){bad++;console.log(theme.padEnd(5),r.padEnd(38),flag)}
  p.off('pageerror',h);
 }
 await c.close();
}
await b.close();
console.log(bad?`\n${bad} route/theme combos need attention`:'\nAll clean');
