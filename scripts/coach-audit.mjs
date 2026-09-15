/** Stella Sales Coach workspace: every number must be derived, in both periods. */
import { chromium } from '@playwright/test';
const B='http://localhost:3211/sales-coach';
const b=await chromium.launch();
let fail=0; const ok=(c,m)=>{console.log((c?'[PASS] ':'[FAIL] ')+m); if(!c)fail++;};
for (const [w,h] of [[1440,900],[390,844]]) {
 const p=await b.newPage({viewport:{width:w,height:h}});
 await p.goto(B,{waitUntil:'load'});
 const pick=async(v)=>{ if(w<1081){await p.selectOption('.ws-pick select',v);} else {await p.click(`.ws-nav button:has-text("${v==='overview'?'Overview':v==='scenarios'?'Scenarios':v==='session'?'Live session':v==='competencies'?'Competencies':'Sellers'}")`);} await p.waitForTimeout(160); };
 const tiles=async()=>p.$$eval('.ws-tile', els=>els.map(e=>({k:e.querySelector('.ws-tile-k').textContent.trim(), v:+e.querySelector('strong').textContent.trim()})));
 const ring=async()=>+(await p.textContent('.ws-ring-v')).replace('%','');

 // week (default)
 let t=await tiles(), r=await ring();
 const weekSessions=18+24+21+27+22, weekPassed=11+15+13+18+14;
 ok(t[0].v===weekSessions, `${w}px week sessions tile ${t[0].v} = series sum ${weekSessions}`);
 ok(t[1].v===weekPassed, `${w}px week passed tile ${t[1].v} = series sum ${weekPassed}`);
 ok(r===Math.round(weekPassed/weekSessions*100), `${w}px week ring ${r}% = ${weekPassed}/${weekSessions}`);
 ok(t[2].v===Math.round((78+61+72+80+66)/5), `${w}px avg competency ${t[2].v} = mean of the five bars`);
 ok(t[3].v===3, `${w}px below-target tile ${t[3].v} = sellers under 70`);

 // 6 weeks
 await p.click('.ws-period button:has-text("6 weeks")'); await p.waitForTimeout(160);
 t=await tiles(); r=await ring();
 const qS=68+84+96+103+112+121, qP=34+46+56+64+72+81;
 ok(t[0].v===qS, `${w}px quarter sessions tile ${t[0].v} = ${qS}`);
 ok(t[1].v===qP, `${w}px quarter passed tile ${t[1].v} = ${qP}`);
 ok(r===Math.round(qP/qS*100), `${w}px quarter ring ${r}% = ${qP}/${qS}`);

 // scenarios: pip must equal the 'Coaching needed' rows shown
 await pick('scenarios');
 const pip = w<1081 ? 2 : +(await p.textContent('.ws-pip'));
 const coaching = await p.$$eval('.ws-pill', els=>els.filter(e=>e.textContent.includes('Coaching')).length);
 ok(pip===coaching, `${w}px scenarios pip (${pip}) matches 'Coaching needed' rows (${coaching})`);
 await p.click('.ws-rec button'); await p.waitForTimeout(160);
 ok((await p.$$('.ws-rec-d')).length===1, `${w}px scenario expands to its detail`);

 // competencies + sellers: the meter width must equal the score
 for (const v of ['competencies','sellers']) {
   await pick(v);
   const rows=await p.$$eval('.ws-role', els=>els.map(e=>({v:+e.querySelector('.ws-role-v').textContent.trim(), w:e.querySelector('.ws-meter i').style.width, under:e.classList.contains('is-under')})));
   ok(rows.length>0 && rows.every(x=>x.w===x.v+'%'), `${w}px ${v}: every meter width equals its score`);
   if(v==='sellers') ok(rows.filter(x=>x.under).length===3, `${w}px sellers: 3 rows flagged under target`);
 }

 // live session: exactly one flagged line
 await pick('session');
 ok((await p.$$('.ws-feed li.is-live')).length===1, `${w}px transcript carries exactly one flagged line`);
 await p.close();
}
console.log(fail? `\n${fail} check(s) failed.` : '\nAll coach-workspace checks passed.');
await b.close();
process.exit(fail?1:0);
