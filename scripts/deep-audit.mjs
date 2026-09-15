import { chromium } from '@playwright/test';
const routes=['/','/stella','/sales-coach','/integrations','/human-boundary','/security','/about','/team',
'/industries','/industries/healthcare','/industries/real-estate',
'/industries/healthcare/dental','/industries/healthcare/eye','/industries/healthcare/aesthetic','/industries/healthcare/multispecialty','/industries/healthcare/enterprise','/industries/healthcare/groups','/industries/real-estate/companies','/industries/real-estate/consultancies','/industries/financial-services/banks','/industries/financial-services/advisory','/industries/automotive/rental','/industries/automotive/service','/industries/automotive/dealerships','/use-cases','/blogs','/blogs/first-ai-workflow','/roi',
'/contact','/book-demo','/become-a-partner','/solutions/salons'];
const b=await chromium.launch({channel:'chrome',headless:true});
const c=await b.newContext({viewport:{width:1440,height:900}});
const p=await c.newPage();
await p.addInitScript(()=>{try{localStorage.setItem('hirestella-theme','dark')}catch(e){}});
for(const r of routes){
  await p.goto('http://127.0.0.1:3000'+r,{waitUntil:'load'});
  await p.evaluate(()=>new Promise(res=>{let y=0;const t=setInterval(()=>{y+=800;scrollTo(0,y);if(y>document.body.scrollHeight){clearInterval(t);scrollTo(0,0);setTimeout(res,300)}},30)}));
  const d=await p.evaluate(()=>{
    const out={clipped:[],emptyAside:false,noAside:false,overflowParent:[]};
    // text clipped horizontally (scrollWidth exceeds clientWidth on a non-scrollable box)
    for(const e of document.querySelectorAll('h1,h2,h3,h4,p,b,span,li,dd')){
      const s=getComputedStyle(e);
      if(s.overflowX==='auto'||s.overflowX==='scroll') continue;
      if(e.scrollWidth>e.clientWidth+2 && e.clientWidth>0 && (e.textContent||'').trim().length>4){
        out.clipped.push((e.className||e.tagName).toString().slice(0,26)+' sw='+e.scrollWidth+' cw='+e.clientWidth+' "'+e.textContent.trim().slice(0,34)+'"');
      }
    }
    // hero aside present?
    const aside=document.querySelector('.phero-aside');
    out.noAside=!aside;
    if(aside) out.emptyAside=aside.getBoundingClientRect().height<40;
    // child wider than its padded parent
    for(const e of document.querySelectorAll('.wrap > *, .pan, .card, .seg-detail')){
      const par=e.parentElement; if(!par) continue;
      const eb=e.getBoundingClientRect(), pb=par.getBoundingClientRect();
      if(eb.right>pb.right+2||eb.left<pb.left-2) out.overflowParent.push((e.className||'').toString().slice(0,30));
    }
    return out;
  });
  const flags=[];
  if(d.clipped.length) flags.push('CLIPPED('+d.clipped.length+'): '+d.clipped.slice(0,2).join(' | '));
  if(d.noAside && r!=='/') flags.push('NO-HERO-ASIDE');
  if(d.emptyAside) flags.push('EMPTY-ASIDE');
  if(d.overflowParent.length) flags.push('OVERFLOW-PARENT: '+[...new Set(d.overflowParent)].slice(0,2).join(','));
  if(flags.length) console.log(r.padEnd(34), flags.join('  ||  '));
}
await b.close();
console.log('done');
