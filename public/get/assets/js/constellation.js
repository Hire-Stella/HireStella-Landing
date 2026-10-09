/* HireStella · Ads landing page background (client review, 2026-10-09).
   The same constellation as the main site's home page: drifting points, some
   drawn as the Stella star, orange signals hopping from point to point the way
   Stella routes work, lines reaching for the pointer, depth on scroll.
   One canvas behind the page. Pauses when the tab is hidden; reduced motion
   draws a single still frame. No dependencies. */

(() => {
  const canvas = document.getElementById('constellation');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LINK = 170;
  const REACH = 220;

  let w = 0;
  let h = 0;
  let nodes = [];
  const signals = [];
  const pointer = { x: -9999, y: -9999, on: false };
  let frame = 0;
  let last = performance.now();
  let spawnIn = 600;

  function seed() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(28, Math.min(76, Math.round((w * h) / 21000)));
    nodes = Array.from({ length: count }, () => {
      const star = Math.random() < 0.12;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: star ? 2.4 + Math.random() * 1.4 : 0.9 + Math.random() * 1.2,
        star,
        tw: Math.random() * Math.PI * 2,
      };
    });
    signals.length = 0;
  }

  const light = () => document.documentElement.dataset.theme === 'light';
  const shift = () => (window.scrollY * 0.12) % h;
  const py = (n) => {
    const y = n.y - shift();
    return y < -20 ? y + h + 40 : y;
  };

  function neighbours(i) {
    const a = nodes[i];
    const out = [];
    for (let j = 0; j < nodes.length; j++) {
      if (j === i) continue;
      if (Math.hypot(a.x - nodes[j].x, py(a) - py(nodes[j])) < LINK) out.push(j);
    }
    return out;
  }

  function star(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.quadraticCurveTo(x, y, x + s, y);
    ctx.quadraticCurveTo(x, y, x, y + s);
    ctx.quadraticCurveTo(x, y, x - s, y);
    ctx.quadraticCurveTo(x, y, x, y - s);
    ctx.fill();
  }

  function draw(dt) {
    const lt = light();
    const ink = lt ? '40, 50, 110' : '226, 230, 255';
    ctx.clearRect(0, 0, w, h);

    for (const n of nodes) {
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      if (n.x < -20) n.x = w + 20;
      if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20;
      if (n.y > h + 20) n.y = -20;
      n.tw += dt * 0.002;
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const ay = py(a);
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const by = py(b);
        const d = Math.hypot(a.x - b.x, ay - by);
        if (d > LINK) continue;
        ctx.strokeStyle = `rgba(${ink}, ${(1 - d / LINK) * (lt ? 0.16 : 0.2)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, ay);
        ctx.lineTo(b.x, by);
        ctx.stroke();
      }
      if (pointer.on) {
        const d = Math.hypot(a.x - pointer.x, ay - pointer.y);
        if (d < REACH) {
          ctx.strokeStyle = `rgba(255, 120, 40, ${(1 - d / REACH) * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(a.x, ay);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      const y = py(n);
      if (n.star) {
        const glow = 0.55 + Math.sin(n.tw) * 0.35;
        ctx.fillStyle = `rgba(255, 140, 70, ${0.14 * glow})`;
        ctx.beginPath();
        ctx.arc(n.x, y, n.r * 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255, ${lt ? 120 : 176}, ${lt ? 40 : 120}, ${0.6 + glow * 0.4})`;
        star(n.x, y, n.r * 2.1);
      } else {
        ctx.fillStyle = `rgba(${ink}, ${lt ? 0.4 : 0.75})`;
        ctx.beginPath();
        ctx.arc(n.x, y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    spawnIn -= dt;
    if (spawnIn <= 0 && signals.length < 7) {
      spawnIn = 520 + Math.random() * 700;
      const from = Math.floor(Math.random() * nodes.length);
      const near = neighbours(from);
      if (near.length) {
        signals.push({ from, to: near[Math.floor(Math.random() * near.length)], t: 0, hops: 2 + Math.floor(Math.random() * 3), speed: 0.0011 + Math.random() * 0.0006 });
      }
    }
    for (let k = signals.length - 1; k >= 0; k--) {
      const s = signals[k];
      s.t += dt * s.speed;
      const a = nodes[s.from];
      const b = nodes[s.to];
      const ay = py(a);
      const by = py(b);
      if (Math.abs(ay - by) > LINK * 1.5) { signals.splice(k, 1); continue; }
      const e = s.t < 0.5 ? 2 * s.t * s.t : 1 - Math.pow(-2 * s.t + 2, 2) / 2;
      const x = a.x + (b.x - a.x) * e;
      const y = ay + (by - ay) * e;
      const tail = Math.max(0, e - 0.35);
      const tx = a.x + (b.x - a.x) * tail;
      const ty = ay + (by - ay) * tail;
      const grad = ctx.createLinearGradient(tx, ty, x, y);
      grad.addColorStop(0, 'rgba(255, 98, 0, 0)');
      grad.addColorStop(1, 'rgba(255, 140, 61, 0.85)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(255, 98, 0, 0.22)';
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = lt ? '#ff7a26' : '#ffb27a';
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      if (s.t >= 1) {
        const next = s.hops > 0 ? neighbours(s.to).filter((j) => j !== s.from) : [];
        if (!next.length) { signals.splice(k, 1); continue; }
        s.from = s.to;
        s.to = next[Math.floor(Math.random() * next.length)];
        s.t = 0;
        s.hops -= 1;
      }
    }
  }

  function loop(now) {
    const dt = Math.min(48, now - last);
    last = now;
    draw(dt);
    frame = requestAnimationFrame(loop);
  }
  function start() {
    cancelAnimationFrame(frame);
    last = performance.now();
    if (still) draw(0);
    else frame = requestAnimationFrame(loop);
  }

  window.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.on = e.pointerType === 'mouse';
  }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer.on = false; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else start();
  });
  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { seed(); start(); }, 200);
  });
  if (still) window.addEventListener('scroll', () => draw(0), { passive: true });

  seed();
  start();
})();
