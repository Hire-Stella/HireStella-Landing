'use client';

import { useEffect, useState } from 'react';
import { FAQ_GROUPS } from '@/lib/faqs';
import { Icon, Logo } from './ui';

/* /faq hero: Stella at the centre of the four question groups. A signal
   travels to one group at a time and a question from it settles underneath.
   Geometry is fixed in a 600x300 box, so the lines need no measuring. */
const ICONS = ['users', 'message', 'calendar', 'shield'];
const SPOTS = [
  { x: 0, y: 14 },
  { x: 0, y: 214 },
  { x: 410, y: 14 },
  { x: 410, y: 214 },
];
const NODE_W = 190;
const NODE_H = 72;
const CORE = { x: 300, y: 150, r: 58 };

function route(i: number) {
  const s = SPOTS[i];
  const left = i < 2;
  const ex = left ? s.x + NODE_W : s.x;
  const ey = s.y + NODE_H / 2;
  const sx = left ? CORE.x - CORE.r : CORE.x + CORE.r;
  const mid = (sx + ex) / 2;
  return `M${sx} ${CORE.y} C${mid} ${CORE.y},${mid} ${ey},${ex} ${ey}`;
}

export function FaqVisual() {
  /* one counter: the group is tick % 4, the question advances each lap */
  const [tick, setTick] = useState(0);
  const n = FAQ_GROUPS.length;
  const active = tick % n;
  const round = Math.floor(tick / n);
  const setActive = (i: number) => setTick(round * n + i);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setTick((v) => v + 1), 3600);
    return () => clearInterval(t);
  }, []);

  const group = FAQ_GROUPS[active];
  const question = group.items[round % group.items.length];
  return (
    <div className="fqv pan">
      <div className="fqv-map">
        <svg className="fqv-lines" viewBox="0 0 600 300" preserveAspectRatio="none" aria-hidden="true">
          {FAQ_GROUPS.map((g, i) => (
            <path key={g.id} d={route(i)} className={i === active ? 'on' : ''} />
          ))}
          <path key={`sig-${active}`} d={route(active)} pathLength={1} className="sig" />
        </svg>
        <div className="fqv-core" aria-hidden="true">
          <span className="fqv-mark">
            <Logo symbol />
          </span>
          <b>Stella</b>
          <small>Coordinates the answer</small>
        </div>
        {FAQ_GROUPS.map((g, i) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            className={`fqv-node ${i === active ? 'on' : ''}`}
            style={{ left: `${(SPOTS[i].x / 600) * 100}%`, top: `${(SPOTS[i].y / 300) * 100}%` }}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <span className="fqv-ico">
              <Icon name={ICONS[i]} size={16} />
            </span>
            <span>
              {g.title}
              <small>{g.items.length} questions</small>
            </span>
          </a>
        ))}
      </div>
      <p className="fqv-q" aria-live="polite" key={`${active}-${round}`}>
        <span className="fqv-qm" aria-hidden="true">
          ?
        </span>
        <span>
          <small>{group.title}</small>
          {question.q}
        </span>
      </p>
    </div>
  );
}
