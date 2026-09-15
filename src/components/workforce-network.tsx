'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { specialists } from '@/lib/data';
import { Icon, Logo } from './ui';

/** Connectors are derived from the same DOM geometry the visitor sees. */
export function WorkforceNetwork() {
  const [selected, setSelected] = useState(0);
  const [paths, setPaths] = useState<string[]>([]);
  const map = useRef<HTMLDivElement>(null);
  const manager = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const measure = () => {
      if (!map.current || !manager.current) return;
      const bounds = map.current.getBoundingClientRect();
      const core = manager.current.getBoundingClientRect();
      const narrow = bounds.width < 700;
      setPaths(nodes.current.map((node, index) => {
        if (!node) return '';
        const rect = node.getBoundingClientRect();
        if (narrow) {
          const middle = core.left + core.width / 2 - bounds.left;
          const start = core.bottom - bounds.top;
          const y = rect.top + rect.height / 2 - bounds.top;
          const x = (index % 2 === 0 ? rect.right : rect.left) - bounds.left;
          return `M${middle} ${start} V${y} H${x}`;
        }
        const left = index < 4;
        const sx = (left ? core.left : core.right) - bounds.left;
        const sy = core.top + core.height / 2 - bounds.top;
        const ex = (left ? rect.right : rect.left) - bounds.left;
        const ey = rect.top + rect.height / 2 - bounds.top;
        const bend = (sx + ex) / 2;
        return `M${sx} ${sy} C${bend} ${sy},${bend} ${ey},${ex} ${ey}`;
      }));
    };
    const observer = new ResizeObserver(measure);
    if (map.current) observer.observe(map.current);
    if (manager.current) observer.observe(manager.current);
    nodes.current.forEach(node => { if (node) observer.observe(node); });
    document.fonts.ready.then(measure);
    measure();
    return () => observer.disconnect();
  }, []);

  const specialist = specialists[selected];
  return <div className="workforce-network network-v2" aria-label="Stella coordinates eight connected specialists">
    <div className="network-v2-heading"><span className="eyebrow">ONE MANAGER. EIGHT CONNECTED SPECIALISTS.</span><span>Select a specialist to see its role</span></div>
    <div className="network-v2-map" ref={map}>
      <svg className="network-v2-lines" aria-hidden="true">
        {paths.map((path, index) => <path key={index} d={path} className="network-route" />)}
        {paths[selected] && <path key={`signal-${selected}`} d={paths[selected]} pathLength="1" className="network-route active-route" />}
      </svg>
      <div className="network-v2-core" ref={manager}><div className="network-core-symbol"><Logo symbol /></div><strong>Stella</strong><span>Your AI General Manager</span><small>Understands. Coordinates. Connects.</small></div>
      {specialists.map((item, index) => <button ref={node => { nodes.current[index] = node; }} key={item.id} className={`network-v2-node ${selected === index ? 'selected' : ''}`} style={{ '--node-row': index % 4 + 1, '--node-column': index < 4 ? 1 : 3 } as React.CSSProperties} aria-pressed={selected === index} onClick={() => setSelected(index)}>
        <span className="network-node-icon"><Icon name={item.icon} size={23} /></span><span><strong>{item.short}</strong><small>{['Answer & qualify', 'Speak & route', 'Capture enquiries', 'Coordinate calendars', 'Keep records current', 'Prepare campaigns', 'Keep conversations moving', 'Continue the conversation'][index]}</small></span><span className="network-node-port" aria-hidden="true" />
      </button>)}
    </div>
    <div className="network-v2-detail" aria-live="polite"><span className="network-role-index">0{selected + 1} / 08</span><div><strong>{specialist.name}</strong><p>{specialist.description}</p></div><Link href={`/workforce/${specialist.id}`} aria-label={`Explore ${specialist.short}`}>See the role<ArrowUpRight size={18} /></Link></div>
  </div>;
}
