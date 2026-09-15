import { chromium } from '@playwright/test';
const origin=process.env.ORIGIN||'http://127.0.0.1:3000';
const routes=['/','/stella','/integrations','/human-boundary','/security','/about','/team',


'/industries','/industries/healthcare','/industries/real-estate',
'/industries/financial-services','/industries/automotive','/industries/healthcare/dental','/industries/healthcare/eye','/industries/healthcare/aesthetic','/industries/healthcare/multispecialty','/industries/healthcare/enterprise','/industries/healthcare/groups','/industries/real-estate/companies','/industries/real-estate/consultancies','/industries/financial-services/banks','/industries/financial-services/advisory','/industries/automotive/rental','/industries/automotive/service','/industries/automotive/dealerships',
'/use-cases','/blogs','/blogs/dental-enquiry-to-appointment','/blogs/dubai-healthcare-growth-clinic-operations',
'/blogs/first-ai-workflow','/roi','/contact','/book-demo','/become-a-partner','/solutions/salons'];
const b=await chromium.launch({channel:'chrome',headless:true});
const c=await b.newContext({viewport:{width:1440,height:900}});
const p=await c.newPage();
const titles={},descs={},inbound={};
const rows=[];
for(const r of routes){
  await p.goto(origin+r,{waitUntil:'load'});
  const d=await p.evaluate(()=>{
    const g=s=>document.querySelector(s);
    const meta=n=>g(`meta[name="${n}"]`)?.content||g(`meta[property="${n}"]`)?.content||null;
    const links=[...document.querySelectorAll('main a[href^="/"]')].map(a=>({
      href:a.getAttribute('href').split('#')[0].replace(/\/$/,'')||'/',
      text:(a.textContent||'').trim().slice(0,40)}));
    const h=[...document.querySelectorAll('h1,h2,h3')].map(x=>+x.tagName[1]);
    const skips=[];for(let i=1;i<h.length;i++)if(h[i]-h[i-1]>1)skips.push(h[i-1]+'->'+h[i]);
    return {
      title:document.title, desc:meta('description'),
      canonical:g('link[rel=canonical]')?.href||null,
      og:{img:meta('og:image'),title:meta('og:title'),type:meta('og:type')},
      twitter:meta('twitter:card'),
      jsonld:[...document.querySelectorAll('script[type="application/ld+json"]')].length,
      h1:document.querySelectorAll('h1').length,
      h1text:g('h1')?.textContent?.trim().slice(0,60)||null,
      h2:document.querySelectorAll('h2').length,
      skips,
      words:(document.querySelector('main')?.innerText||'').split(/\s+/).filter(Boolean).length,
      imgs:document.images.length,
      imgsNoAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).length,
      links, lang:document.documentElement.lang,
      themeColor:meta('theme-color'),
    };
  });
  titles[d.title]=(titles[d.title]||0)+1;
  if(d.desc) descs[d.desc]=(descs[d.desc]||0)+1;
  for(const l of d.links){ if(l.href!==r) (inbound[l.href]??=new Set()).add(r); }
  rows.push([r,d]);
}
await b.close();

const P=(...a)=>console.log(...a);
P('\n══ C · TECHNICAL ELIGIBILITY ══');
P('canonical present:', rows.filter(([,d])=>d.canonical).length+'/'+rows.length);
P('lang attr:', [...new Set(rows.map(([,d])=>d.lang))].join(','));
P('theme-color:', rows.filter(([,d])=>d.themeColor).length+'/'+rows.length);
P('\n══ D · ON-PAGE RELEVANCE ══');
const dupT=Object.entries(titles).filter(([,n])=>n>1);
P('duplicate titles:', dupT.length?dupT.map(([t,n])=>`"${t.slice(0,45)}" x${n}`).join(' | '):'none');
P('missing meta description:', rows.filter(([,d])=>!d.desc).map(([r])=>r).join(', ')||'none');
const dupD=Object.entries(descs).filter(([,n])=>n>1);
P('duplicate descriptions:', dupD.length?dupD.map(([t,n])=>`"${t.slice(0,40)}" x${n}`).join(' | '):'none');
P('titles over 60 chars:', rows.filter(([,d])=>d.title.length>60).length);
P('h1 != 1:', rows.filter(([,d])=>d.h1!==1).map(([r,d])=>r+'('+d.h1+')').join(', ')||'none');
P('heading skips:', rows.filter(([,d])=>d.skips.length).map(([r,d])=>r+' '+d.skips.join(',')).join(' | ')||'none');
P('images missing alt attr:', rows.reduce((n,[,d])=>n+d.imgsNoAlt,0));
P('\n══ E · CONTENT DEPTH (words in main) ══');
rows.slice().sort((a,b)=>a[1].words-b[1].words).slice(0,8).forEach(([r,d])=>P('  '+String(d.words).padStart(5),r));
P('  thin pages (<300 words):', rows.filter(([,d])=>d.words<300).length);
P('\n══ F · INTERNAL LINKING ══');
const orphans=routes.filter(r=>!(inbound[r]&&inbound[r].size));
P('orphan pages (no contextual inbound link from any main):', orphans.join(', ')||'none');
P('pages with <2 inbound:', routes.filter(r=>(inbound[r]?.size||0)<2&&(inbound[r]?.size||0)>0).join(', ')||'none');
P('\n══ H · SERP & STRUCTURED DATA ══');
P('JSON-LD blocks found:', rows.reduce((n,[,d])=>n+d.jsonld,0));
P('og:image present:', rows.filter(([,d])=>d.og.img).length+'/'+rows.length);
P('twitter:card:', [...new Set(rows.map(([,d])=>d.twitter))].join(','));
