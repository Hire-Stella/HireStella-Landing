'use client';

import { useEffect, useRef, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { ConsultationForm } from './consultation-form';
import { Icon, Logo } from './ui';
import { track } from '@/lib/telemetry';

type DemoContext = { problem?: string; plan?: string; term?: string };

export function DemoStory() {
  return <div className="demo-story">
    <Logo />
    <span className="eyebrow">A WORKFORCE BUILT AROUND YOU</span>
    <h2>Start with your business.<br /><span>See what connects.</span></h2>
    <p>Bring the work that takes too much of your team's time. Explore how Stella could help move it forward.</p>
    <div className="demo-story-flow" aria-label="What we will explore">
      {[
        ['message', 'Your challenge', 'Where work waits and opportunities slip.'],
        ['network', 'Your workforce', 'The specialists, systems and people involved.'],
        ['check', 'Your next step', 'A clear scope to discuss with your team.'],
      ].map(([icon, title, detail], i) => <div key={title}><span className="demo-story-node"><Icon name={icon} /></span><div><small>0{i + 1}</small><strong>{title}</strong><p>{detail}</p></div></div>)}
    </div>
    <div className="demo-story-foot">Your people stay in control.<ArrowRight size={18} /></div>
  </div>;
}

/** One native dialog handles every demo CTA and preserves the visitor's page context. */
export function DemoDialog({ configured }: { configured: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [context, setContext] = useState<DemoContext | null>(null);
  const [instance, setInstance] = useState(0);

  useEffect(() => {
    let eligible = false;
    let shown = false;
    const open = (values: DemoContext, automatic = false) => {
      if (dialog.current?.open) return;
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setContext(values);
      setInstance(value => value + 1);
      shown = true;
      track(automatic ? 'demo_invitation_shown' : 'demo_form_opened');
      try { sessionStorage.setItem('hirestella-demo-invitation', 'seen'); } catch { /* Optional storage. */ }
    };
    const click = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element)?.closest?.('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== '/book-demo') return;
      event.preventDefault();
      event.stopPropagation();
      open({ problem: url.searchParams.get('problem') || undefined, plan: url.searchParams.get('plan') || undefined, term: url.searchParams.get('term') || undefined });
    };
    const considerInvitation = () => {
      if (!eligible || shown || document.hidden || ['/book-demo', '/contact', '/login'].includes(location.pathname)) return;
      try { if (sessionStorage.getItem('hirestella-demo-invitation')) return; } catch { /* In-memory limit still applies. */ }
      const depth = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const busy = document.activeElement?.matches('input,textarea,select,[contenteditable="true"]') || document.querySelector('.conversation-panel,.main-nav.is-open,dialog[open]');
      if (depth >= .6 && !busy) open({}, true);
    };
    const timer = setTimeout(() => { eligible = true; considerInvitation(); }, 60000);
    document.addEventListener('click', click, true);
    window.addEventListener('scroll', considerInvitation, { passive: true });
    return () => { clearTimeout(timer); document.removeEventListener('click', click, true); window.removeEventListener('scroll', considerInvitation); };
  }, []);

  useEffect(() => {
    if (!context || !dialog.current) return;
    dialog.current.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [context]);

  function close() {
    dialog.current?.close();
    setContext(null);
    returnFocus.current?.focus({ preventScroll: true });
    track('demo_form_closed');
  }

  return <dialog ref={dialog} className="demo-dialog" aria-labelledby="demo-dialog-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    {context && <div className="demo-dialog-layout">
      <DemoStory />
      <div className="demo-dialog-form">
        <button autoFocus className="icon-button demo-close" aria-label="Close demo form" onClick={close}><X size={22} /></button>
        <span className="eyebrow">LET'S UNDERSTAND YOUR BUSINESS</span>
        <h2 id="demo-dialog-title">Book a demo.</h2>
        <p className="demo-form-intro">Tell us a little about your business. We will use it to shape the conversation.</p>
        <ConsultationForm key={instance} configured={configured} initialProblem={context.problem} compact id="demo-consultation" source="modal" />
      </div>
    </div>}
  </dialog>;
}
