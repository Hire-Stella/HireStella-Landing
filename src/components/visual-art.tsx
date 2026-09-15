import Image from 'next/image';
import { artwork, articleVisuals } from '@/lib/visual-content';
import { Icon } from './ui';

export function EditorialArt({
  kind = 'coordination',
  className = '',
  priority = false,
}: {
  kind?: keyof typeof artwork;
  className?: string;
  priority?: boolean;
}) {
  const art = artwork[kind];
  return (
    <div className={`editorial-art ${className}`}>
      <Image
        src={art.src}
        alt={art.alt}
        fill
        sizes="(max-width: 768px) 100vw, 55vw"
        preload={priority}
      />
      <span className="art-credit">HireStella · conceptual artwork</span>
    </div>
  );
}

export function IndustryHeroVisual({ label }: { label: string }) {
  const clinic = /clinic/i.test(label);
  const hospital = /hospital/i.test(label);
  const action = /real estate/i.test(label)
    ? 'Viewing coordinated'
    : /automotive/i.test(label)
      ? 'Service visit requested'
      : /banking/i.test(label)
        ? 'Adviser meeting requested'
        : clinic
          ? 'Consultation confirmed'
          : hospital
            ? 'Department request routed'
            : 'Your next step, connected';
  return (
    <div className="industry-hero-visual">
      <EditorialArt kind={clinic ? 'dental' : hospital ? 'dubai' : 'coordination'} priority />
      <div className="visual-float visual-float-call">
        <span className="visual-icon">
          <Icon name="phone" size={18} />
        </span>
        <div>
          <small>ENQUIRY RECEIVED</small>
          <strong>A conversation begins.</strong>
        </div>
        <div className="mini-wave" aria-hidden="true">
          {[12, 24, 18, 32, 14, 28, 20].map((h, i) => (
            <i key={i} style={{ height: h }} />
          ))}
        </div>
      </div>
      <div className="visual-float visual-float-booking">
        <span className="visual-icon">
          <Icon name="calendar" size={19} />
        </span>
        <div>
          <small>ILLUSTRATIVE WORKFLOW</small>
          <strong>{action}</strong>
          <span>Context carried into the next step</span>
        </div>
      </div>
      <div className="hero-visual-index">
        <b>01</b>
        <span>Listen</span>
        <i />
        <b>02</b>
        <span>Connect</span>
        <i />
        <b>03</b>
        <span>Act</span>
      </div>
    </div>
  );
}

export function ArticleCover({ slug, priority = false }: { slug: string; priority?: boolean }) {
  const visual = articleVisuals[slug];
  return (
    <EditorialArt
      kind={visual?.art ?? 'coordination'}
      className="article-cover"
      priority={priority}
    />
  );
}

export function WorkflowFigure({ steps }: { steps: readonly string[] }) {
  return (
    <figure className="workflow-figure">
      <figcaption>
        THE JOURNEY AT A GLANCE <span>Illustrative workflow</span>
      </figcaption>
      <ol>
        {steps.map((step, i) => (
          <li key={step}>
            <span>0{i + 1}</span>
            <Icon name={['message', 'network', 'calendar', 'send'][i % 4]} size={24} />
            <strong>{step}</strong>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function PremiumShield() {
  return (
    <div className="premium-shield" aria-hidden="true">
      <div className="shield-orbit" />
      <svg viewBox="0 0 180 210" fill="none">
        <defs>
          <linearGradient
            id="shield-metal"
            x1="20"
            y1="0"
            x2="150"
            y2="210"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#eef0ff" />
            <stop offset=".45" stopColor="#a8b0d1" />
            <stop offset="1" stopColor="#535f8a" />
          </linearGradient>
          <linearGradient
            id="shield-inner"
            x1="50"
            y1="30"
            x2="130"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#293765" />
            <stop offset="1" stopColor="#10182f" />
          </linearGradient>
        </defs>
        <path
          d="M90 10 162 38v64c0 45-37 76-72 98-35-22-72-53-72-98V38L90 10Z"
          fill="url(#shield-metal)"
        />
        <path
          d="m90 19 63 25v58c0 38-30 66-63 88-33-22-63-50-63-88V44l63-25Z"
          fill="url(#shield-inner)"
          stroke="#e3e6fc"
          strokeOpacity=".4"
        />
        <path
          d="m90 35 48 19v46c0 28-22 51-48 69-26-18-48-41-48-69V54l48-19Z"
          stroke="#c7c9e8"
          strokeOpacity=".3"
        />
        <path d="M66 94h48M90 70v48" stroke="#ff7b29" strokeWidth="3" strokeLinecap="round" />
        <circle cx="90" cy="94" r="34" stroke="#ff7b29" strokeOpacity=".4" />
      </svg>
      <span>HUMAN JUDGEMENT</span>
    </div>
  );
}
