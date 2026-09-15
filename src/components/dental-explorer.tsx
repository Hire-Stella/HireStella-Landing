'use client';

import { useState } from 'react';
import Link from 'next/link';
import { dentalSegments } from '@/lib/visual-content';
import { Icon } from './ui';

/**
 * §16 — one role selected at a time, one orange active state.
 * The preview shows what the specialist actually produces, not a mock avatar.
 */
export function DentalExplorer() {
  const [active, setActive] = useState(0);
  const current = dentalSegments[active];

  return (
    <div className="explorer">
      <div className="explorer-tabs" role="tablist" aria-label="Dental specialists">
        {dentalSegments.map((segment, i) => (
          <button
            key={segment.id}
            role="tab"
            type="button"
            className="explorer-tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
          >
            <Icon name={segment.icon} size={18} />
            <span>{segment.name}</span>
            <em className="num">{String(i + 1).padStart(2, '0')}</em>
          </button>
        ))}
      </div>

      <div className="explorer-body pan">
        <div className="explorer-copy">
          <p className="eyebrow eyebrow--sig">
            {String(active + 1).padStart(2, '0')} / {String(dentalSegments.length).padStart(2, '0')}{' '}
            · {current.name}
          </p>
          <h3 style={{ fontSize: 26, maxWidth: '20ch' }}>{current.label}</h3>

          <dl className="explorer-rows">
            <div>
              <dt className="micro">The problem</dt>
              <dd>{current.problem}</dd>
            </div>
            <div>
              <dt className="micro">What Stella coordinates</dt>
              <dd>{current.action}</dd>
            </div>
            <div className="is-out">
              <dt className="micro">What happens next</dt>
              <dd>{current.result}</dd>
            </div>
          </dl>

          <Link className="btn-3" href={`/workforce/${current.id}`}>
            Meet the {current.name.toLowerCase()} specialist <span className="tri" aria-hidden="true" />
          </Link>
        </div>

        <div className="explorer-preview">
          <div className="preview-top">
            <span className="micro">Dental workspace</span>
            <span className="micro">Example</span>
          </div>
          <div className="preview-body">
            <div className="preview-icon">
              <Icon name={current.icon} size={24} />
            </div>
            <ol className="preview-lines">
              {current.preview.map((line, i) => (
                <li key={line} className={i === 1 ? 'is-lead' : ''}>
                  {line}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
