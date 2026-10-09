'use client';

import { useEffect, useRef } from 'react';

/*
 * The home page's signature background (client review, 2026-10-09: "some
 * visual on the background ... that says wow"). A drifting constellation: the
 * workforce as a network, a few points drawn as the Stella star, and orange
 * signals hopping from point to point the way Stella routes work. Lines reach
 * for the pointer, and the field moves with depth as the page scrolls.
 *
 * One canvas, fixed behind the page. Pauses when the tab is hidden; reduced
 * motion draws a single still frame.
 */

type Node = { x: number; y: number; vx: number; vy: number; r: number; star: boolean; tw: number };
type Signal = { from: number; to: number; t: number; hops: number; speed: number };

const LINK = 170;
const REACH = 220;

export function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    const signals: Signal[] = [];
    const pointer = { x: -9999, y: -9999, on: false };
    let frame = 0;
    let last = performance.now();
    let spawnIn = 600;

    const seed = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
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
    };

    const light = () => document.documentElement.dataset.theme === 'light';

    /* Scroll moves the field at a fraction of the page: depth, not drift. */
    const shift = () => (window.scrollY * 0.12) % h;
    const py = (n: Node) => {
      const y = n.y - shift();
      return y < -20 ? y + h + 40 : y;
    };

    const neighbours = (i: number) => {
      const a = nodes[i];
      const out: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, py(a) - py(b));
        if (d < LINK) out.push(j);
      }
      return out;
    };

    const star = (x: number, y: number, s: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.quadraticCurveTo(x, y, x + s, y);
      ctx.quadraticCurveTo(x, y, x, y + s);
      ctx.quadraticCurveTo(x, y, x - s, y);
      ctx.quadraticCurveTo(x, y, x, y - s);
      ctx.fill();
    };

    const draw = (dt: number) => {
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

      /* links */
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

      /* points */
      for (const n of nodes) {
        const y = py(n);
        if (n.star) {
          const glow = 0.55 + Math.sin(n.tw) * 0.35;
          ctx.fillStyle = `rgba(255, 140, 70, ${0.14 * glow})`;
          ctx.beginPath();
          ctx.arc(n.x, y, n.r * 4.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(255, 176, 120, ${0.6 + glow * 0.4})`;
          star(n.x, y, n.r * 2.1);
        } else {
          ctx.fillStyle = `rgba(${ink}, ${lt ? 0.4 : 0.75})`;
          ctx.beginPath();
          ctx.arc(n.x, y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* signals: work hopping across the network */
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
        if (Math.abs(ay - by) > LINK * 1.5) {
          signals.splice(k, 1);
          continue;
        }
        const e = s.t < 0.5 ? 2 * s.t * s.t : 1 - Math.pow(-2 * s.t + 2, 2) / 2;
        const x = a.x + (b.x - a.x) * e;
        const y = ay + (by - ay) * e;
        /* the lit segment behind the signal */
        const tail = Math.max(0, e - 0.35);
        const grad = ctx.createLinearGradient(a.x + (b.x - a.x) * tail, ay + (by - ay) * tail, x, y);
        grad.addColorStop(0, 'rgba(255, 98, 0, 0)');
        grad.addColorStop(1, 'rgba(255, 140, 61, 0.85)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(a.x + (b.x - a.x) * tail, ay + (by - ay) * tail);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 98, 0, 0.22)';
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffb27a';
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        if (s.t >= 1) {
          if (s.hops <= 0) {
            signals.splice(k, 1);
            continue;
          }
          const near = neighbours(s.to).filter((j) => j !== s.from);
          if (!near.length) {
            signals.splice(k, 1);
            continue;
          }
          s.from = s.to;
          s.to = near[Math.floor(Math.random() * near.length)];
          s.t = 0;
          s.hops -= 1;
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      draw(dt);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      if (still) draw(0);
      else frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.on = e.pointerType === 'mouse';
    };
    const onLeave = () => {
      pointer.on = false;
    };
    const onVisible = () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else start();
    };
    let resizeT: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        seed();
        start();
      }, 200);
    };
    const onScroll = () => {
      if (still) draw(0);
    };

    seed();
    start();
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeT);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <canvas ref={ref} className="constellation" />;
}
