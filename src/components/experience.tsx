'use client';

import { useState, type KeyboardEvent } from 'react';
import { OperationsDashboard } from './operations-dashboard';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { industries, specialists } from '@/lib/data';
import { Icon, Logo, ButtonLink, Eyebrow } from './ui';

/** Horizontal tab groups support arrow keys as well as pointer and touch input. */
function navigateTabs(
  event: KeyboardEvent<HTMLDivElement>,
  selected: number,
  select: (index: number) => void,
) {
  const tabs = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  let next = selected;
  if (event.key === 'ArrowRight') next = (selected + 1) % tabs.length;
  else if (event.key === 'ArrowLeft') next = (selected - 1 + tabs.length) % tabs.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = tabs.length - 1;
  else return;
  event.preventDefault();
  select(next);
  tabs[next]?.focus();
}

export { WorkforceNetwork } from './workforce-network';

const journey = [
  {
    time: '22:14',
    icon: 'message',
    title: 'A late-night enquiry arrives.',
    text: 'A demo clinic visitor asks about appointments. Front Desk answers routine questions and captures the request.',
    label: 'FRONT DESK',
    note: 'Enquiry received · Website',
  },
  {
    time: '22:15',
    icon: 'network',
    title: 'Stella connects the next step.',
    text: 'Stella identifies booking intent and routes the context to Booking & Scheduling.',
    label: 'STELLA → BOOKING',
    note: 'Booking intent identified',
  },
  {
    time: '22:16',
    icon: 'shield',
    title: 'A clinical question needs a person.',
    text: 'The visitor asks about treatment suitability. The clinical team receives a handoff with the conversation history.',
    label: 'HUMAN HANDOFF',
    note: 'Clinical judgement required',
  },
  {
    time: '09:10',
    icon: 'calendar',
    title: 'The appointment moves forward.',
    text: 'After the clinical team responds, the booking is confirmed, Admin updates supported records, and an approved reminder is scheduled.',
    label: 'BOOKING → ADMIN → FOLLOW-UP',
    note: 'Confirmed after human response',
  },
];
export function ConnectedJourney() {
  const [step, setStep] = useState(0);
  const item = journey[step];
  return (
    <div className="journey-demo">
      <div className="journey-control">
        <span className="micro">ONE CONNECTED CUSTOMER JOURNEY</span>
        <span className="demo-label">Dental clinic · illustrative</span>
      </div>
      <div
        className="journey-tabs"
        role="tablist"
        aria-label="Customer journey steps"
        onKeyDown={(event) => navigateTabs(event, step, setStep)}
      >
        {journey.map((j, i) => (
          <button
            key={j.title}
            role="tab"
            id={`journey-tab-${i}`}
            aria-selected={step === i}
            tabIndex={step === i ? 0 : -1}
            aria-controls="journey-panel"
            onClick={() => setStep(i)}
          >
            <span className="journey-index">0{i + 1}</span>
            <Icon name={j.icon} size={18} />
            <span>{['Enquiry', 'Coordination', 'Human judgement', 'Action'][i]}</span>
            {i < 3 && <ArrowRight size={14} className="journey-arrow" />}
          </button>
        ))}
      </div>
      <div
        className="journey-body"
        id="journey-panel"
        role="tabpanel"
        aria-labelledby={`journey-tab-${step}`}
      >
        <div className="journey-story">
          <Eyebrow>{item.label}</Eyebrow>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <div className="journey-pager">
            <span>
              0{step + 1}
              <span className="muted"> / 04</span>
            </span>
            <button className="text-link" onClick={() => setStep((step + 1) % 4)}>
              {step === 3 ? 'Replay the journey' : 'Follow the next step'}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
        <div className="event-card" key={step}>
          <div className="event-card-top">
            <span className="micro">WORKFORCE ACTIVITY</span>
            <span>{item.time}</span>
          </div>
          <div className="event-symbol">
            <Icon name={item.icon} size={28} />
          </div>
          <div className="event-line">
            <span className="status-light" />
            <span>{item.note}</span>
          </div>
          <div className="event-detail">
            <span>Demo clinic · Journey 001</span>
          </div>
          <div className="event-footer">
            <Logo symbol />
            <span>Context carried forward by Stella</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IndustrySwitcher() {
  const [active, setActive] = useState(0);
  const item = industries[active];
  return (
    <div className="industry-switcher">
      <div
        className="industry-tabs"
        role="tablist"
        aria-label="Industry examples"
        onKeyDown={(event) => navigateTabs(event, active, setActive)}
      >
        {industries.map((industry, i) => (
          <button
            key={industry.id}
            role="tab"
            id={`industry-tab-${i}`}
            aria-controls="industry-panel"
            aria-selected={active === i}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
          >
            <Icon name={industry.icon} size={18} />
            {industry.name}
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>
      <div
        className="industry-panel"
        role="tabpanel"
        id="industry-panel"
        aria-labelledby={`industry-tab-${active}`}
      >
        <div>
          <span className="micro">CONFIGURED AROUND YOUR BUSINESS</span>
          <h3>{item.headline}</h3>
          <p>{item.description}</p>
          <ButtonLink href={`/solutions/${item.id}`} secondary>
            Explore {item.label.toLowerCase()}
          </ButtonLink>
        </div>
        <div className="industry-workflow">
          <div className="industry-quote">
            <Icon name="message" />
            <p>“{item.problem}”</p>
          </div>
          {item.steps.slice(1, 4).map((step, i) => (
            <div key={step} className="industry-step">
              <span>0{i + 1}</span>
              {step}
            </div>
          ))}
          <div className="industry-boundary">
            <Icon name="shield" size={15} />
            <span>Human judgement stays human.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardPreview({ full = false }: { full?: boolean }) {
  return <OperationsDashboard full={full} />;
}
