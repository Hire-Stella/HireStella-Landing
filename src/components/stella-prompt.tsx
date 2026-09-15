'use client';

import { useRef, useState } from 'react';
import { ArrowUp, ArrowRight, RotateCcw, LoaderCircle } from 'lucide-react';
import { industries, specialists } from '@/lib/data';
import { workforcePreview } from '@/lib/logic';
import { Icon, Logo, ButtonLink } from './ui';

export function StellaPrompt() {
  const [problem, setProblem] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const result = submitted ? workforcePreview(submitted) : null;
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (problem.trim().length < 10 || busy) {
      input.current?.focus();
      return;
    }
    setBusy(true);
    // Keep the demonstration transition brief and explicitly distinct from live AI.
    await new Promise((resolve) => setTimeout(resolve, 650));
    setSubmitted(problem.trim());
    setBusy(false);
    requestAnimationFrame(() => {
      resultRef.current?.focus({ preventScroll: true });
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
  return (
    <div className="command-wrap" id="ask-stella">
      <form className="command-panel" onSubmit={submit}>
        <div className="command-top">
          <span>
            <Logo symbol />
            YOUR BUSINESS. YOUR STARTING POINT.
          </span>
          <span className="demo-label">Interactive preview</span>
        </div>
        <label className="sr-only" htmlFor="business-problem">
          What is slowing your business down?
        </label>
        <textarea
          ref={input}
          id="business-problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Tell Stella about your business and what’s slowing you down…"
          required
          minLength={10}
          maxLength={2000}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <div className="command-bottom">
          <span>
            <span className="tiny-ring" />
            Clarity starts with a conversation.
          </span>
          <button className="command-send" aria-label="Build my workforce preview" disabled={busy}>
            {busy ? <LoaderCircle size={20} className="spin" /> : <ArrowUp size={23} />}
          </button>
        </div>
      </form>
      <div className="scenario-row">
        <span>TRY A SCENARIO</span>
        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => {
              setProblem(industry.problem);
              input.current?.focus();
            }}
          >
            <Icon name={industry.icon} size={14} />
            {industry.label}
            <ArrowRight size={12} aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="prompt-privacy">
        No sign-up needed. Please don’t enter confidential customer data.
      </p>
      <div role="status" className="sr-only">
        {busy
          ? 'Preparing your illustrative workforce preview.'
          : result
            ? 'Workforce preview ready.'
            : ''}
      </div>
      {result && (
        <div className="workforce-result" ref={resultRef} tabIndex={-1}>
          <div className="result-top">
            <div className="eyebrow">
              <span className="signal-dot" />
              YOUR WORKFORCE PREVIEW
            </div>
            <span className="demo-label">Illustrative · scenario-based</span>
          </div>
          <h3>
            A connected starting point
            <br />
            for {result.industry.toLowerCase()}.
          </h3>
          <p>{result.summary}</p>
          <blockquote>“{submitted}”</blockquote>
          <div className="result-specialists">
            {result.ids.map((id) => {
              const s = specialists.find((item) => item.id === id)!;
              return (
                <div key={id}>
                  <Icon name={s.icon} />
                  <div>
                    <strong>{s.short}</strong>
                    <span>{s.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="result-flow">
            {result.steps.map((step, index) => (
              <span key={step}>
                {index > 0 && <ArrowRight size={12} aria-hidden="true" />}
                {step}
              </span>
            ))}
          </div>
          <div className="boundary-note">
            <Icon name="shield" />
            <p>
              <strong>Your people keep the judgement.</strong> {result.boundary}
            </p>
          </div>
          <p className="small muted">
            This preview uses local scenario rules. Volume, languages, integration needs, and
            workflow complexity still need scoping before a plan can be recommended. All plans
            include the full specialist workforce.
          </p>
          <div className="result-actions">
            <ButtonLink href={`/book-demo?problem=${encodeURIComponent(submitted)}`}>
              Map this to my business
            </ButtonLink>
            <button
              className="text-link"
              onClick={() => {
                setSubmitted('');
                input.current?.focus();
              }}
            >
              <RotateCcw size={15} />
              Refine my problem
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
