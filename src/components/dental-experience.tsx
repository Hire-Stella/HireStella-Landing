'use client';
import { useState } from 'react';
import Link from 'next/link';
import { dentalSegments } from '@/lib/visual-content';
import { Icon } from './ui';

export function DentalSpecialists() {
  const [active, setActive] = useState(0);
  const item = dentalSegments[active];
  return (
    <div className="dental-specialists">
      <div
        className="specialist-selector"
        role="group"
        aria-label="Choose a dental workflow specialist"
      >
        {dentalSegments.map((segment, i) => (
          <button key={segment.id} aria-pressed={active === i} onClick={() => setActive(i)}>
            <span>0{i + 1}</span>
            <Icon name={segment.icon} size={20} />
            <strong>{segment.name}</strong>
          </button>
        ))}
      </div>
      <div className="specialist-stage" aria-live="polite">
        <div className="specialist-stage-copy">
          <span className="micro">
            0{active + 1} / 08 · {item.name.toUpperCase()}
          </span>
          <h3>{item.label}</h3>
          <dl>
            <div>
              <dt>The problem</dt>
              <dd>{item.problem}</dd>
            </div>
            <div>
              <dt>What Stella coordinates</dt>
              <dd>{item.action}</dd>
            </div>
            <div>
              <dt>What happens next</dt>
              <dd>{item.result}</dd>
            </div>
          </dl>
          <Link href={`/workforce/${item.id}`} className="text-link">
            Meet the {item.name.toLowerCase()} specialist ↗
          </Link>
        </div>
        <div className={`specialist-demo demo-${item.id}`}>
          <div className="specialist-demo-top">
            <span className="signal-dot" /> DENTAL WORKSPACE <small>EXAMPLE</small>
          </div>
          <div className="specialist-demo-icon">
            <Icon name={item.icon} size={40} />
          </div>
          <span className="micro">{item.preview[0]}</span>
          <h3 className="h4">{item.preview[1]}</h3>
          {item.id === 'voice' ? (
            <div className="large-wave" aria-hidden="true">
              {Array.from({ length: 25 }, (_, i) => (
                <i key={i} style={{ height: 12 + Math.abs(Math.sin(i * 1.6)) * 58 }} />
              ))}
            </div>
          ) : item.id === 'booking' || item.id === 'outbound-followup' ? (
            <div className="demo-week">
              {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
                <div key={i} className={i === 3 ? 'selected' : ''}>
                  <span>{day}</span>
                  <b>{7 + i}</b>
                </div>
              ))}
            </div>
          ) : (
            <div className="demo-path" aria-hidden="true">
              <Icon name={item.icon} />
              <i />
              <Icon name="network" />
              <i />
              <Icon name="calendar" />
            </div>
          )}
          <div className="demo-result">
            <Icon name="activity" size={17} />
            {item.preview[2]}
          </div>
        </div>
      </div>
      <p className="industry-note">
        Eight configurable roles, one coordinated journey. Your team approves content, contact rules
        and exceptions; clinicians own treatment decisions.
      </p>
    </div>
  );
}
