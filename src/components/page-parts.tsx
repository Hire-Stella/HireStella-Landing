import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Breadcrumb, ButtonLink, Eyebrow, Icon } from './ui';
import { specialists } from '@/lib/data';
import { HeroVisual, type HeroScene } from './hero-visual';
import { pageScenes } from '@/lib/hero-config';

export function PageHero({
  label,
  eyebrow,
  title,
  intro,
  parent,
  scene,
  visualContext,
  visualIcon,
}: {
  label: string;
  eyebrow: string;
  title: string;
  intro: string;
  parent?: { name: string; href: string };
  scene?: HeroScene;
  visualContext?: string;
  visualIcon?: string;
}) {
  const taskPage = ['Pricing', 'ROI calculator', 'Dashboard demo', 'Workspace access', 'Plan a consultation', 'Contact'].includes(label);
  return (
    <section className={`page-hero ${taskPage ? 'page-hero-task' : ''} page-hero-${scene || pageScenes[label] || 'industry'}`}>
      <div className="container">
        <Breadcrumb current={label} parent={parent} />
        <div className="page-hero-layout"><div className="page-hero-copy">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>
          {title.split('\n').map((line, i) => (
            <span key={line} className={i ? 'muted' : undefined}>
              {line}
              {i === 0 && title.includes('\n') && <br />}
            </span>
          ))}
        </h1>
        <p>{intro}</p>
        {!taskPage && <div className="hero-page-actions"><ButtonLink href="/book-demo">Book a demo</ButtonLink><a className="text-link" href="#page-story">{parent?.name === 'Workforce' ? 'See what it does' : 'See how it works'}<ArrowUpRight size={16} /></a></div>}
        <div className="hero-page-proof"><Icon name="shield" size={15} /><span>Configured around your business. People stay in control.</span></div>
        </div>{!taskPage && <HeroVisual scene={scene || pageScenes[label] || 'industry'} context={visualContext} icon={visualIcon} subject={parent?.name === 'Workforce' ? label : undefined} />}</div>
      </div>
      <div id="page-story" className="story-anchor" />
    </section>
  );
}
export function ClosingCTA({ title = 'Let’s map your next move.' }: { title?: string }) {
  return (
    <section className="closing-cta container">
      <div>
        <Eyebrow>YOUR NEXT STEP</Eyebrow>
        <h2>{title}</h2>
      </div>
      <ButtonLink href="/#ask-stella">Ask Stella</ButtonLink>
    </section>
  );
}
export function SpecialistCards({ ids }: { ids?: readonly string[] }) {
  return (
    <div className="specialist-grid">
      {specialists
        .filter((s) => !ids || ids.includes(s.id))
        .map((s, i) => (
          <Link href={`/workforce/${s.id}`} className="specialist-card" key={s.id}>
            <div className="specialist-top">
              <Icon name={s.icon} size={25} />
              <span className="specialist-number">0{i + 1}</span>
            </div>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <div className="specialist-card-bottom">
              <span>{s.actions}</span>
              <ArrowUpRight size={17} />
            </div>
          </Link>
        ))}
    </div>
  );
}
