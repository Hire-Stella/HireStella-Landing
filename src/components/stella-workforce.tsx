'use client';

import { useState } from 'react';
import { specialists } from '@/lib/data';
import { Icon } from './ui';

/**
 * The eight specialists, in one section.
 *
 * They used to be eight pages of about 280 words each, which the SEO audit
 * flagged as thin and which said the same thing eight times with a different
 * noun. One role is selected at a time and the panel swaps, so the reader
 * compares them instead of navigating between near-identical pages.
 *
 * §16 — one selected role, one orange active state. The panel shows what the
 * specialist actually owns and where it stops, because the boundary is the
 * product, not a disclaimer.
 */
export function StellaWorkforce() {
  const [active, setActive] = useState(0);

  return (
    <div className="explorer">
      <div className="explorer-tabs" role="tablist" aria-label="The specialist workforce">
        {specialists.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            className="explorer-tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
          >
            <Icon name={s.icon} size={18} />
            <span>{s.short}</span>
            <em className="num">{String(i + 1).padStart(2, '0')}</em>
          </button>
        ))}
      </div>

      {specialists.map((current, i) => (
        <div className={`explorer-body pan ${i === active ? 'is-on' : ''}`} key={current.id}>
          <div className="explorer-copy">
            <p className="eyebrow eyebrow--sig">
              {String(i + 1).padStart(2, '0')} / {String(specialists.length).padStart(2, '0')} ·{' '}
              {current.short}
            </p>
            <h3 style={{ fontSize: 26, maxWidth: '20ch' }}>{current.name}</h3>

            <dl className="explorer-rows">
              <div>
                <dt className="micro">What it is for</dt>
                <dd>{current.description}</dd>
              </div>
              <div>
                <dt className="micro">What it does</dt>
                <dd>{current.detail}</dd>
              </div>
              <div className="is-out">
                <dt className="micro">Where your people take over</dt>
                <dd>{current.boundary}</dd>
              </div>
            </dl>
          </div>

          <div className="explorer-preview">
            <div className="preview-top">
              <span className="micro">{current.short}</span>
              <span className="micro">{String(i + 1).padStart(2, '0')} of 08</span>
            </div>
            <div className="preview-body">
              <div className="preview-icon">
                <Icon name={current.icon} size={24} />
              </div>
              <ol className="preview-lines">
                {current.actions.split(' · ').map((a, j) => (
                  <li key={a} className={j === 1 ? 'is-lead' : ''}>
                    {a.charAt(0) + a.slice(1).toLowerCase()}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
