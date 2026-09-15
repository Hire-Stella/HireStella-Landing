/**
 * Crop, resize and convert the supplied photography to web WebP.
 *
 * The supplied frames are 2528 x 1696 (1.491). The cards are 3:2, so each is
 * centre-cropped a hair and written at 1536 x 1024, which is the size the
 * reading-room cover and the page band both ask for at 2x on a laptop.
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const SRC = 'C:/Users/admin/Desktop/Projects/Hirestella New/04-Assets/05-Photography';
const OUT = 'C:/Users/admin/Desktop/Projects/Hirestella New/06-Website/public/visuals';

/** short id from the supplied filename -> the name the site uses */
const MAP = {
  vjopsr: 'coordination',
  '3n2s5a': 'dubai-healthcare',

  unh6yq: 'clinics',
  p56kkq: 'hospitals',
  kzetgy: 'real-estate',
  f95xzf: 'banking-finance',
  x73q0e: 'automotive',

  '2nrcnf': 'clinics-dental',
  yg5sp2: 'clinics-eye',
  gedkmv: 'clinics-aesthetic',
  r9y0h2: 'clinics-multispecialty',

  x6mhlg: 'hospitals-enterprise',
  lu478z: 'hospitals-groups',

  '6xocdx': 'real-estate-companies',
  gauzg4: 'real-estate-consultancies',

  cyohwg: 'banking-banks',
  pt2uat: 'banking-financial-services',

  dglmpr: 'automotive-rental',
  '4nbm20': 'automotive-service',
  '50olmp': 'automotive-dealerships',

  /* the twenty-first frame: a quiet lit corner, no page of its own yet */
  vwwh6r: 'quiet-corner',
};

const files = fs.readdirSync(SRC).filter((f) => /\.jpg$/i.test(f));
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
await p.goto('about:blank');

let done = 0;
for (const f of files) {
  const id = f.replace('Gemini_Generated_Image_', '').slice(0, 6);
  const name = MAP[id];
  if (!name) {
    console.log('SKIP (unmapped)', id);
    continue;
  }
  const b64 = fs.readFileSync(SRC + '/' + f).toString('base64');
  const out = await p.evaluate(async (src) => {
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + src;
    await img.decode();
    const W = 1536, H = 1024;                       // 3:2
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    return c.toDataURL('image/webp', 0.86);
  }, b64);
  const buf = Buffer.from(out.split(',')[1], 'base64');
  fs.writeFileSync(`${OUT}/${name}.webp`, buf);
  console.log(String(Math.round(buf.length / 1024)).padStart(4) + ' KB', name + '.webp', '<-', id);
  done++;
}
console.log('\nwrote', done);
await b.close();
