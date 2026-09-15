'use client';

import { useState } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { plans, money, termNames, type Term } from '@/lib/data';
import { calculateCapacity, defaultCapacity, type CapacityInputs } from '@/lib/logic';
import { ButtonLink, Icon } from './ui';

export function PricingCards() {
  const [term, setTerm] = useState<Term>('annual');
  return (
    <div className="pricing-block">
      <div className="pricing-toolbar">
        <p>The full specialist workforce. In every plan.</p>
        <div className="segmented" aria-label="Commitment term">
          {(Object.keys(termNames) as Term[]).map((key) => (
            <button key={key} aria-pressed={term === key} onClick={() => setTerm(key)}>
              {termNames[key]}
              {key === 'annual' && <span>Best value</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="pricing-grid">
        {plans.map((plan, i) => (
          <article key={plan.name} className={`plan-card ${i === 1 ? 'featured' : ''}`}>
            <div className="plan-name">
              <h3>{plan.name}</h3>
              {i === 1 && <span className="micro">ROOM TO GROW</span>}
            </div>
            <p>{plan.description}</p>
            <div className="plan-price">
              <span>AED</span>
              <strong>{money(plan.prices[term])}</strong>
              <span>/ mo</span>
            </div>
            <div className="plan-commitment">
              {term === 'monthly'
                ? 'Flexible monthly commitment'
                : `${term === 'six' ? '6' : '12'}-month commitment · priced per month`}
            </div>
            <ButtonLink href={`/book-demo?plan=${plan.name}&term=${term}`} secondary={i !== 1}>
              Map this plan to my business
            </ButtonLink>
            <div className="plan-divider" />
            <span className="micro">CONNECTED CAPACITY</span>
            <ul>
              {[
                `${i === 2 ? '20+' : `Up to ${plan.languages}`} languages`,
                `${plan.minutes} voice minutes / month`,
                plan.workflows,
                plan.integrations,
                plan.dashboard,
                plan.support,
              ].map((feature) => (
                <li key={feature}>
                  <Check size={14} aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="pricing-footnote">
        <span>Voice overage: AED 0.50/minute. Provider and scoped setup fees may apply.</span>
        <span>
          Something more complex?{' '}
          <a href="/book-demo?plan=Custom">
            Let’s scope it together <ArrowUpRight size={12} />
          </a>
        </span>
      </div>
    </div>
  );
}

export function CapacityCalculator({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState<CapacityInputs>(defaultCapacity);
  const result = calculateCapacity(input);
  function update(key: keyof CapacityInputs, value: number | Term) {
    setInput((current) => ({ ...current, [key]: value }));
  }
  function numberField(label: string, key: keyof CapacityInputs, max = 1000000, suffix = '') {
    return (
      <label className="field" key={key}>
        <span>
          {label}
          {suffix && <small>{suffix}</small>}
        </span>
        <input
          type="number"
          min={0}
          max={max}
          step="any"
          value={input[key]}
          onChange={(e) => update(key, Math.min(max, Math.max(0, Number(e.target.value) || 0)))}
        />
      </label>
    );
  }
  return (
    <div className={`capacity-calculator ${compact ? 'compact' : ''}`}>
      <div className="calculator-inputs">
        <span className="micro">01 / YOUR TEAM’S CAPACITY</span>
        <h3>
          What could your team
          <br />
          do with more time?
        </h3>
        <div className="range-field">
          <label htmlFor={`hours-${compact}`}>
            Hours spent on repetitive work each week
            <strong>
              {input.weeklyHours}
              <small> hrs</small>
            </strong>
          </label>
          <input
            id={`hours-${compact}`}
            type="range"
            min={0}
            max={100}
            step={1}
            value={input.weeklyHours}
            onChange={(e) => update('weeklyHours', +e.target.value)}
          />
          <div className="range-extents">
            <span>0 hours</span>
            <span>100 hours</span>
          </div>
        </div>
        <div className="calculator-fields">
          {numberField('Fully loaded hourly cost', 'hourlyCost', 100000, 'AED')}
          {numberField('Assumed automatable share', 'automatableShare', 100, '%')}
        </div>
        <p className="small muted">
          The automatable share is an adjustable assumption, not a promised outcome.
        </p>
        {!compact && (
          <>
            <div className="calculator-section">
              <span className="micro">02 / YOUR OPPORTUNITIES</span>
              <div className="calculator-fields">
                {numberField('Monthly enquiries', 'enquiries')}
                {numberField('Missed or late enquiries', 'missedPercent', 100, '%')}
                {numberField('Baseline conversion', 'conversionPercent', 100, '%')}
                {numberField('Average deal value', 'dealValue', 10000000, 'AED')}
                {numberField('Assumed recovery', 'recoveryPercent', 100, '%')}
                {numberField('Gross margin', 'marginPercent', 100, '%')}
              </div>
            </div>
            <div className="calculator-section">
              <span className="micro">03 / YOUR WORKFORCE COST</span>
              <div className="calculator-fields">
                <label className="field">
                  <span>Plan</span>
                  <select value={input.plan} onChange={(e) => update('plan', +e.target.value)}>
                    {plans.map((p, i) => (
                      <option key={p.name} value={i}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Commitment</span>
                  <select
                    value={input.term}
                    onChange={(e) => update('term', e.target.value as Term)}
                  >
                    {Object.entries(termNames).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                {numberField('Expected voice minutes', 'voiceMinutes')}
                {numberField('Provider fees / month', 'providerFees', 1000000, 'AED')}
                {numberField('Allocated setup cost / month', 'setupCost', 1000000, 'AED')}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="calculator-results" aria-live="polite">
        <Icon name="chart" size={26} />
        <span className="micro">POTENTIAL MONTHLY CAPACITY</span>
        <div className="capacity-number">
          {money(result.hoursReturned)}
          <span>hours</span>
        </div>
        <p>
          That’s time your people could spend
          <br />
          on the work only they can do.
        </p>
        <div className="result-rule" />
        <div className="result-metric">
          <span>Indicative capacity value</span>
          <strong>AED {money(result.capacityValue)}</strong>
        </div>
        {!compact && (
          <>
            <div className="result-metric">
              <span>Potential recovered contribution</span>
              <strong>AED {money(result.contribution)}</strong>
            </div>
            <div className="result-metric">
              <span>Voice overage</span>
              <strong>AED {money(result.overage)}</strong>
            </div>
            <div className="result-metric">
              <span>Estimated monthly cost</span>
              <strong>AED {money(result.cost)}</strong>
            </div>
            <div className="result-metric">
              <span>Indicative monthly benefit</span>
              <strong>AED {money(result.benefit)}</strong>
            </div>
            <div className="result-metric">
              <span>Indicative ROI</span>
              <strong>{money(result.roi)}%</strong>
            </div>
          </>
        )}
        <ButtonLink
          href={
            compact
              ? '/roi'
              : `/book-demo?problem=${encodeURIComponent(`Capacity estimate: ${money(result.hoursReturned)} potential hours returned per month. ${input.weeklyHours} repetitive hours per week, ${input.automatableShare}% assumed automatable share. Indicative only.`)}`
          }
          secondary={compact}
        >
          {compact ? 'Explore the full calculator' : 'Map these workflows with Stella'}
        </ButtonLink>
        <small>
          Illustrative estimate. Capacity value is not cash savings or guaranteed revenue.
        </small>
        <details className="formula-details">
          <summary>See the assumptions & formulas</summary>
          <p>
            Monthly hours = weekly repetitive hours × 4.33.
            <br />
            Hours returned = monthly hours × automatable share.
            <br />
            Capacity value = hours returned × fully loaded hourly cost.
          </p>
          {!compact && (
            <p>
              Recovered opportunity = enquiries × missed share × conversion rate × deal value ×
              assumed recovery. Gross contribution = opportunity × gross margin. Monthly cost = plan
              + max(0, voice minutes − allowance) × AED 0.50 + entered provider fees + allocated
              setup cost. Benefit = capacity value + recovered contribution − cost. ROI = benefit ÷
              cost × 100. All percentage inputs are divided by 100.
            </p>
          )}
        </details>
      </div>
    </div>
  );
}
