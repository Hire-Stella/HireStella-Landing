'use client';

import { useMemo, useState } from 'react';
import { Icon } from './ui';
import {
  CALLS_PER_AGENT,
  calculateRoi,
  count,
  countries,
  defaultInputs,
  money,
  regions,
  type RoiInputs,
} from '@/lib/roi-model';

/**
 * Inputs on the left, a breakdown on the right, and a Calculate button between
 * them so the result is something the visitor asked for rather than something
 * that twitched while they were typing. After the first calculation the panel
 * says when the inputs have moved away from the result on screen.
 */
export function RoiCalculator() {
  const [draft, setDraft] = useState<RoiInputs>(defaultInputs);
  const [committed, setCommitted] = useState<RoiInputs>(defaultInputs);

  const country = countries.find((c) => c.id === committed.country) ?? countries[0];
  const draftCountry = countries.find((c) => c.id === draft.country) ?? countries[0];
  const result = useMemo(() => calculateRoi(committed), [committed]);

  const stale = (Object.keys(draft) as (keyof RoiInputs)[]).some(
    (key) => draft[key] !== committed[key],
  );

  function set<K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  /* Changing country moves the currency, so the cost per call moves with it. */
  function pickCountry(id: string) {
    const next = countries.find((c) => c.id === id);
    if (!next) return;
    setDraft((current) => ({ ...current, country: id, costPerCall: next.callCost }));
  }

  /* Both bars read off the same ceiling, so a figure that costs more than the
     calls it removes draws longer than the baseline instead of matching it. */
  const ceiling = Math.max(result.baseline, result.withStella);
  const bar = (value: number) =>
    ceiling > 0 ? Math.min(100, Math.max(2, (value / ceiling) * 100)) : 2;

  const number = (raw: string) => {
    const parsed = Number(raw.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  return (
    <div className="roi pan pan--solid">
      {/* ── what you already know ── */}
      <div className="roi-in">
        <p className="eyebrow eyebrow--sig">01 · Your numbers</p>
        <h3 style={{ maxWidth: '20ch' }}>Start with the calls you already take.</h3>

        <div className="roi-fields">
          <label className="field field--full">
            <span>Your country</span>
            <select value={draft.country} onChange={(e) => pickCountry(e.target.value)}>
              {regions.map((region) => (
                <optgroup label={region} key={region}>
                  {countries
                    .filter((c) => c.region === region)
                    .map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.name} · {c.currency}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Calls each month</span>
            <input
              type="number"
              min={0}
              max={1000000}
              inputMode="numeric"
              value={draft.callsPerMonth}
              onChange={(e) => set('callsPerMonth', number(e.target.value))}
            />
          </label>

          <label className="field">
            <span>Cost to handle one call</span>
            <div className="roi-money">
              <em>{draftCountry.currency}</em>
              <input
                type="number"
                min={0}
                step="any"
                inputMode="decimal"
                value={draft.costPerCall}
                onChange={(e) => set('costPerCall', number(e.target.value))}
              />
            </div>
          </label>

          <div className="field field--full">
            <span className="roi-row">
              Calls the workforce is expected to handle
              <b className="num">{draft.sharePercent}%</b>
            </span>
            <input
              className="roi-range"
              type="range"
              min={0}
              max={100}
              step={5}
              value={draft.sharePercent}
              onChange={(e) => set('sharePercent', Number(e.target.value))}
              aria-label="Share of calls the workforce is expected to handle"
            />
            <span className="roi-scale" aria-hidden="true">
              <i>0%</i>
              <i>
                {count((draft.callsPerMonth * draft.sharePercent) / 100)} of{' '}
                {count(draft.callsPerMonth)} calls a month
              </i>
              <i>100%</i>
            </span>
          </div>

          <label className="field field--full">
            <span>Your HireStella cost each year</span>
            <div className="roi-money">
              <em>{draftCountry.currency}</em>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="From your proposal"
                value={draft.stellaAnnual || ''}
                onChange={(e) => set('stellaAnnual', number(e.target.value))}
              />
            </div>
          </label>
        </div>

        <button
          className="btn btn-1 roi-go"
          type="button"
          onClick={() => setCommitted(draft)}
          aria-describedby="roi-result"
        >
          Calculate my result
          <span className="tri" aria-hidden="true" />
        </button>

        <p className="note">
          The starting cost per call is {draftCountry.currency} {draftCountry.callCost} — one
          front-desk salary of about {money(draftCountry.salary, draftCountry)} a month spread over{' '}
          {count(CALLS_PER_AGENT)} calls. It is an assumption to replace with your own figure, not a
          measured benchmark.
        </p>
      </div>

      {/* ── what it comes to ── */}
      <div className="roi-out" id="roi-result" role="region" aria-live="polite">
        <div className="roi-out-top">
          <p className="eyebrow">02 · The result</p>
          {stale ? (
            <span className="roi-stale">Inputs changed · calculate again</span>
          ) : (
            <span className="roi-tag">{country.name}</span>
          )}
        </div>

        <div className="roi-break">
          <p className="micro">Annual cost breakdown</p>
          <div className="roi-line">
            <span>Without HireStella</span>
            <b className="num">{money(result.baseline, country)}</b>
          </div>
          <div className="roi-bar" aria-hidden="true">
            <i style={{ width: `${bar(result.baseline)}%` }} />
          </div>
          <div className="roi-line">
            <span>With HireStella</span>
            <b className="num">{money(result.withStella, country)}</b>
          </div>
          <div className="roi-bar roi-bar--with" aria-hidden="true">
            <i style={{ width: `${bar(result.withStella)}%` }} />
          </div>
          <p className="note">
            With HireStella is the {count(result.remainingAnnual)} calls a year still handled by
            your team, plus the annual figure you entered.
          </p>
        </div>

        <div className="roi-headline">
          <p className="micro">{result.netSaving < 0 ? 'Annual shortfall' : 'Annual saving'}</p>
          <div className="roi-big">
            <b className="num">{money(Math.abs(result.netSaving), country)}</b>
          </div>
          <p className="sm">
            {result.netSaving < 0
              ? 'At these numbers the annual figure costs more than the calls it removes.'
              : `${money(Math.abs(result.netSaving) / 12, country)} a month, against the way those calls are handled today.`}
          </p>
        </div>

        <div className="roi-stats">
          {[
            [
              'Calls handled',
              count(result.handledAnnual),
              'a year, across configured channels',
              'phone',
            ],
            [
              'Cost reduction',
              `${result.reductionPercent.toFixed(0)}%`,
              'of the annual cost above',
              'chart',
            ],
            [
              'Return on the figure',
              result.roiPercent === null ? '—' : `${result.roiPercent.toFixed(0)}%`,
              result.roiPercent === null ? 'add your annual figure' : 'net saving over the figure',
              'activity',
            ],
            [
              'Payback',
              result.paybackMonths === null
                ? '—'
                : `${result.paybackMonths.toFixed(1)} mo`,
              result.paybackMonths === null ? 'add your annual figure' : 'to cover the figure',
              'calendar',
            ],
          ].map(([label, value, note, icon], i) => (
            <div className={`roi-stat ${i === 0 ? 'is-sig' : ''}`} key={String(label)}>
              <span className="roi-stat-k">
                <Icon name={String(icon)} size={15} />
                {String(label)}
              </span>
              <strong className="num">{String(value)}</strong>
              <small>{String(note)}</small>
            </div>
          ))}
        </div>

        <p className="note">
          <Icon name="shield" size={14} />
          An estimate built from your own assumptions. It is not a quotation, a performance claim or
          a guarantee of savings, and it does not include the work your team keeps.
        </p>
      </div>
    </div>
  );
}
