'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MessageSquare,
  Phone,
  AppWindow,
  CalendarDays,
  Files,
  TrendingUp,
  Network,
  Send,
  Check,
} from 'lucide-react';
import { Logo } from './ui';

/*
 * Home page motion (client review, 2026-10-09: "when I scroll down there
 * should be animation"). Two pieces:
 *
 *  - ScrollMotion tags the home sections once they are below the fold, and
 *    plays each one in as it reaches the viewport. Anything already on screen
 *    is left alone, so nothing blinks out after hydration.
 *  - StepsFlow turns Analysis / Configuration / Management into a route that
 *    draws with the scroll, lighting each stage as the line reaches it, and
 *    gives each stage its own looping scene.
 *
 * Reduced motion: no tagging, and the flow renders complete and still.
 */

const REVEAL: [string, string][] = [
  ['.home .sec .split', 'rv rv-split'],
  ['.home .raillist > div', 'rv'],
  ['.home .flow', 'rv'],
  ['.home #workforce .wrap > :not(.split)', 'rv'],
  ['.home .hb > .zone', 'rv'],
  ['.home .hb > .bound', 'rv rv-line'],
  ['.home .goal', 'rv'],
  ['.home #dashboard .wrap > :not(.split)', 'rv'],
  ['.home .ind > *', 'rv'],
  ['.home .faq-item', 'rv'],
  ['.home .closer-in > *', 'rv'],
];

export function ScrollMotion() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    const tagged: Element[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('rv-in');
          io.unobserve(e.target);
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    );
    for (const [selector, cls] of REVEAL) {
      document.querySelectorAll(selector).forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
        const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
        const tagSiblings = siblings.filter((s) => s.matches(selector));
        (el as HTMLElement).style.setProperty('--rv-i', String(Math.max(0, tagSiblings.indexOf(el))));
        el.classList.add(...cls.split(' '));
        tagged.push(el);
        io.observe(el);
      });
    }
    root.classList.add('rv-armed');

    return () => {
      io.disconnect();
      root.classList.remove('rv-armed');
      tagged.forEach((el) => el.classList.remove('rv', 'rv-split', 'rv-line', 'rv-in'));
    };
  }, []);
  return null;
}

const ROLES = [MessageSquare, Phone, AppWindow, CalendarDays, Files, TrendingUp, Network, Send];
const BARS = [38, 52, 44, 61, 47, 92, 56, 41, 50];

function Analysis() {
  return (
    <div className="fx fx-scan">
      <div className="fx-bars">
        {BARS.map((h, i) => (
          <i
            key={i}
            className={i === 5 ? 'hot' : undefined}
            style={{ '--h': `${h}%`, '--j': i } as React.CSSProperties}
          />
        ))}
      </div>
      <span className="fx-beam" />
      <span className="fx-tag">Bottleneck found</span>
    </div>
  );
}

function Configuration() {
  return (
    <div className="fx fx-cfg">
      {ROLES.map((Ic, i) => (
        <span key={i} style={{ '--j': i } as React.CSSProperties}>
          <Ic size={15} strokeWidth={1.6} />
        </span>
      ))}
    </div>
  );
}

function Management() {
  return (
    <div className="fx fx-run">
      <span className="fx-end">Enquiry</span>
      <span className="fx-lane">
        <i />
        <i />
        <i />
      </span>
      <span className="fx-hub">
        <Logo symbol />
      </span>
      <span className="fx-lane">
        <i />
        <i />
        <i />
      </span>
      <span className="fx-end fx-done">
        <Check size={13} strokeWidth={2.4} /> Handled
      </span>
    </div>
  );
}

const SCENES = [Analysis, Configuration, Management];

export function StepsFlow({ steps }: { steps: readonly (readonly [string, string, string, string])[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setP(1);
      return;
    }
    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      /* Starts as the row enters the lower fifth, done by the time it sits
         a third of the way down the screen. Never runs backwards. */
      const next = Math.min(1, Math.max(0, (vh * 0.9 - top) / (vh * 0.62)));
      setP((prev) => (next > prev ? next : prev));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={`flow ${p >= 1 ? 'is-done' : ''}`} ref={ref} style={{ '--p': p } as React.CSSProperties}>
      <div className="flow-track" aria-hidden="true">
        <span className="flow-fill" />
        <span className="flow-comet" />
        {steps.map(([no], i) => (
          <span className={`flow-node ${p >= i / 2 - 0.001 && p > 0 ? 'on' : ''}`} key={no} style={{ left: `${i * 50}%` }} />
        ))}
      </div>
      <div className="flow-grid">
        {steps.map(([no, kicker, title, body], i) => {
          const Scene = SCENES[i];
          return (
            <div className={`card pan flow-c ${p >= i / 2 - 0.001 && p > 0 ? 'on' : ''}`} key={no}>
              <div aria-hidden="true">
                <Scene />
              </div>
              <div className="k">
                <i>{no}</i>
                {kicker}
              </div>
              <h3 className="h4">{title}</h3>
              <p>{body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
