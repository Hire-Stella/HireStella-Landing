'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, Pause, RotateCcw } from 'lucide-react';
import { Icon, Logo, SignalMark } from './ui';
import { specialists } from '@/lib/data';
import { EditorialArt } from './visual-art';

export type HeroScene = 'manager' | 'workforce' | 'voice' | 'booking' | 'website' | 'records' | 'growth' | 'conversation' | 'journey' | 'industry' | 'integrations' | 'human' | 'security' | 'capacity' | 'dashboard' | 'company' | 'contact';

export function useSequence(length: number, delay = 3200) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) setPlaying(false);
    const reduced = () => { if (media.matches) setPlaying(false); };
    media.addEventListener('change', reduced);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    if (ref.current) observer.observe(ref.current);
    const visibility = () => { if (document.hidden) setVisible(false); else if (ref.current) { const rect = ref.current.getBoundingClientRect(); setVisible(rect.top < innerHeight && rect.bottom > 0); } };
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); media.removeEventListener('change', reduced); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    if (!playing || !visible) return;
    if (active === length - 1) return;
    const timer = setTimeout(() => setActive(a => Math.min(a + 1, length - 1)), delay);
    return () => clearTimeout(timer);
  }, [active, playing, visible, length, delay]);
  const select = (value: number) => { setActive(value); setPlaying(false); };
  const replay = () => { setActive(0); setPlaying(true); };
  const complete = active === length - 1;
  return { ref, active, select, replay, playing: playing && !complete, toggle: () => complete ? replay() : setPlaying(p => !p), visible };
}

const sceneConfig: Record<HeroScene, { title: string; stages: string[]; icon: string; note: string }> = {
  manager: { title: 'YOUR BUSINESS, UNDERSTOOD', stages: ['Understand', 'Connect', 'Move forward'], icon: 'network', note: 'A workforce shaped around the work.' },
  workforce: { title: 'ONE CONNECTED WORKFORCE', stages: ['A clear role', 'Shared context', 'Connected action'], icon: 'users', note: 'Eight specialists. One shared direction.' },
  voice: { title: 'A CONVERSATION THAT CONTINUES', stages: ['Answer', 'Understand', 'Coordinate'], icon: 'phone', note: 'A voice enquiry becomes a clear next step.' },
  booking: { title: 'FROM ENQUIRY TO APPOINTMENT', stages: ['Check', 'Coordinate', 'Confirm'], icon: 'calendar', note: 'Availability and confirmation, connected.' },
  website: { title: 'YOUR CONNECTED FRONT DOOR', stages: ['Discover', 'Enquire', 'Connect'], icon: 'browser', note: 'A website that leads somewhere useful.' },
  records: { title: 'THE DETAILS, IN THE RIGHT PLACE', stages: ['Capture', 'Structure', 'Update'], icon: 'records', note: 'Information moves with the work.' },
  growth: { title: 'CONSISTENCY BUILDS MOMENTUM', stages: ['Prepare', 'Approve', 'Follow through'], icon: 'chart', note: 'Approved actions. A connected next step.' },
  conversation: { title: 'EVERY CONVERSATION HAS A NEXT STEP', stages: ['Listen', 'Understand', 'Route'], icon: 'message', note: 'Context stays with the conversation.' },
  journey: { title: 'FOLLOW THE WORK', stages: ['Enquiry', 'Coordination', 'Action'], icon: 'send', note: 'The right specialist, at the right moment.' },
  industry: { title: 'YOUR OPERATION, CONNECTED', stages: ['Your problem', 'Your workforce', 'Your next move'], icon: 'building', note: 'Built around the way your business works.' },
  integrations: { title: 'CONTEXT MOVES BETWEEN SYSTEMS', stages: ['Connect', 'Carry context', 'Coordinate'], icon: 'network', note: 'Compatibility is confirmed during scoping.' },
  human: { title: 'YOUR PEOPLE KEEP THE JUDGEMENT', stages: ['Routine work', 'Human handoff', 'Informed action'], icon: 'shield', note: 'A handoff is part of the plan.' },
  security: { title: 'CLEAR BOUNDARIES. VISIBLE CONTROL.', stages: ['Define access', 'Agree scope', 'Keep oversight'], icon: 'shield', note: 'Controls are confirmed for your deployment.' },
  capacity: { title: 'MORE ROOM FOR MEANINGFUL WORK', stages: ['Understand time', 'Adjust assumptions', 'See capacity'], icon: 'chart', note: 'An illustration, not a promised outcome.' },
  dashboard: { title: 'THE WHOLE PICTURE', stages: ['Work arrives', 'Context moves', 'Action is visible'], icon: 'dashboard', note: 'Illustrative workspace · Demo clinic' },
  company: { title: 'CAPACITY, COORDINATED.', stages: ['Clarity', 'Coordination', 'Human judgement'], icon: 'users', note: 'Good people. More room to do good work.' },
  contact: { title: 'YOUR NEXT CHAPTER STARTS HERE', stages: ['Your business', 'Your challenge', 'A clear next step'], icon: 'calendar', note: 'A useful conversation starts with context.' },
};

export function HeroVisual({ scene = 'manager', subject, context, icon }: { scene?: HeroScene; subject?: string; context?: string; icon?: string }) {
  const config = sceneConfig[scene];
  const sequence = useSequence(3);
  const active = sequence.active;
  const protective = scene === 'human' || scene === 'security';
  return <div ref={sequence.ref} className={`hero-scene scene-${scene} ${sequence.visible ? 'is-in-view' : ''}`} data-motion data-stage={active} data-playing={sequence.playing}>
    <div className="scene-halo halo-warm" aria-hidden="true" /><div className="scene-halo halo-mist" aria-hidden="true" />
    <div className="scene-orbit" aria-hidden="true" /><div className="scene-orbit orbit-inner" aria-hidden="true" />
    <div className="scene-panel">
      <EditorialArt kind={scene === 'company' ? 'dubai' : 'coordination'} className="scene-editorial-art" />
      <div className="scene-brand"><Logo /><span className="demo-label">ILLUSTRATIVE PREVIEW</span></div>
      <div className="scene-kicker"><SignalMark />{config.title}</div>
      {scene === 'manager' && <div className="manager-scene"><div className="scene-request"><Icon name="message" /><p>“Our team can’t get to every enquiry.”</p></div><div className="scene-manager"><div className="scene-symbol"><Logo symbol /></div><div><strong>Stella understands.</strong><span>First response. Booking. Follow-up.</span></div></div><div className="scene-mini-workforce">{['message', 'calendar', 'send'].map((name, i) => <div className={active >= i ? 'activated' : ''} key={name}><Icon name={name} /><span>{['Front Desk', 'Booking', 'Follow-up'][i]}</span></div>)}</div></div>}
      {(scene === 'workforce' || scene === 'integrations') && <div className="constellation-scene"><div className="constellation-core"><Logo symbol /><span>Stella</span></div><svg viewBox="0 0 400 240" aria-hidden="true"><path d="M200 120 C150 120 130 45 70 45 M200 120 C245 120 275 45 330 45 M200 120 H48 M200 120 H352 M200 120 C150 120 130 200 70 200 M200 120 C245 120 275 200 330 200" /></svg>{(scene === 'workforce' ? specialists.map(s => [s.icon, s.short]) : [['records','CRM'],['calendar','Calendar'],['message','Messages'],['phone','Voice'],['browser','Website'],['network','Custom APIs']]).map(([name, label], i) => <div className={`constellation-node node-${i} ${i % 3 <= active ? 'activated' : ''}`} key={label}><Icon name={name} size={21} /><span>{label}</span></div>)}</div>}
      {scene === 'voice' && <div className="voice-scene"><div className="scene-round-icon"><Icon name="phone" size={28} /></div><h3>A voice. A clear next step.</h3><div className="waveform" role="img" aria-label="Illustrative voice waveform">{Array.from({ length: 29 }, (_, i) => <span key={i} style={{ height: `${18 + Math.abs(Math.sin(i * 1.8)) * 56}px`, animationDelay: `${i * 55}ms` }} />)}</div><div className="transcript-line"><Icon name="message" size={16} /><p>{['“Can I arrange an appointment?”', '“Let me help with the next step.”', 'Appointment request routed to Booking.'][active]}</p></div></div>}
      {(scene === 'booking' || scene === 'contact') && <div className="calendar-scene"><div className="calendar-heading"><Icon name="calendar" /><strong>{scene === 'contact' ? 'A conversation with a purpose' : 'A little room in the calendar'}</strong></div><div className="calendar-week">{['M','T','W','T','F'].map((d,i) => <div key={i}><span>{d}</span><strong className={i === active + 1 ? 'chosen-day' : ''}>{14+i}</strong></div>)}</div><div className="calendar-appointment"><span className="appointment-rule" /><div><strong>{scene === 'contact' ? 'Your workforce, explored' : 'Appointment request'}</strong><span>{['Context captured', 'Next step prepared', 'Ready for confirmation'][active]}</span></div><Icon name={active === 2 ? 'check' : 'calendar'} size={18} /></div><p className="scene-fineprint">{scene === 'contact' ? 'Illustrative calendar. Choose Book a demo to continue.' : 'Illustrative availability, subject to your configured system.'}</p></div>}
      {scene === 'website' && <div className="website-scene"><div className="browser-toolbar"><span /><span /><span /><small>YOUR CONNECTED WEBSITE</small></div><div className="mini-website"><span className="micro">YOUR BUSINESS</span><h3>A first impression.<br />A connected next step.</h3><div className="mini-button">Start a conversation <ArrowRight size={13} /></div><div className="mini-chat"><Icon name="message" /><span>{['A visitor arrives', 'An enquiry is captured', 'The workforce takes it forward'][active]}</span></div></div></div>}
      {(scene === 'records' || scene === 'growth') && <div className="records-scene"><div className="scene-round-icon"><Icon name={icon || config.icon} size={28} /></div><h3>{subject || (scene === 'growth' ? 'Keep the next step moving.' : 'The right detail. The right place.')}</h3>{(scene === 'growth' ? ['Content prepared', 'Human approval', 'Follow-up coordinated'] : ['Enquiry details captured', 'Information structured', 'Supported record updated']).map((label,i) => <div className={`record-line ${active >= i ? 'activated' : ''}`} key={label}><Icon name={active >= i ? 'check' : 'records'} size={16} /><span>{label}</span><span className="record-indicator" /></div>)}</div>}
      {(scene === 'conversation' || scene === 'industry' || scene === 'journey') && <div className="conversation-scene"><div className="scene-request"><Icon name={icon || 'message'} /><p>{context || '“We need a clearer next step.”'}</p></div><div className="scene-answer"><Logo symbol /><div><strong>{subject || 'Let’s connect the work.'}</strong><p>{['Understand what matters first.', 'Bring the right specialist into the journey.', 'Keep people involved where judgement is needed.'][active]}</p></div></div><div className="route-ribbon"><Icon name="message" size={19} /><span className={active > 0 ? 'activated' : ''} /><Icon name="network" size={22} /><span className={active > 1 ? 'activated' : ''} /><Icon name="users" size={19} /></div><div className="scene-outcome">{config.stages[active]}<span>Context carried forward</span></div></div>}
      {protective && <div className="protection-scene"><div className="protection-orbit" /><div className="protection-core"><Icon name="shield" size={56} /></div><h3>{scene === 'human' ? 'Judgement stays human.' : 'Responsibility stays visible.'}</h3><div className="protection-handoff"><div><Icon name="network" /><span>{scene === 'human' ? 'Structured work' : 'Agreed scope'}</span></div><div className="handoff-light" /><div><Icon name="users" /><span>{scene === 'human' ? 'Your people' : 'Human oversight'}</span></div></div></div>}
      {(scene === 'capacity' || scene === 'dashboard') && <div className="metrics-scene"><h3>{scene === 'capacity' ? 'Make room for what matters.' : 'Your workforce, in view.'}</h3><div className="hero-metrics">{(scene === 'capacity' ? [['20','hours / week'],['40%','assumed share'],['35','hours / month*']] : [['1','enquiry'],['1','human handoff'],['1','confirmed booking']]).map(([value,label],i) => <div className={active >= i ? 'activated' : ''} key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><div className="capacity-bars">{[35,58,46,72,60,85,76,100].map((height,i) => <span key={i} style={{ height: `${height}%`, animationDelay: `${i*100}ms` }} />)}</div><div className="scene-outcome"><Icon name={scene === 'capacity' ? 'chart' : 'check'} size={16} />{scene === 'capacity' ? '*Illustrative hours returned, rounded.' : 'Human handoff resolved before confirmation.'}</div></div>}
      {scene === 'company' && <div className="company-scene"><div className="company-mark"><Logo symbol /></div><h3>Clarity.<br /><span>Coordination.</span><br />Room to grow.</h3><div className="company-values"><Icon name="users" size={18} /><span>People at the centre of the system.</span></div></div>}
      <div className="scene-controls"><div aria-label="Preview stages">{config.stages.map((label,i) => <button key={label} className={active === i ? 'active' : ''} aria-label={label} aria-pressed={active === i} onClick={() => sequence.select(i)}><span className="scene-step-mark" />{label}</button>)}</div><button className="scene-play" aria-label={active === 2 ? 'Replay hero preview' : sequence.playing ? 'Pause hero preview' : 'Play hero preview'} onClick={sequence.toggle}>{active === 2 ? <RotateCcw size={15} /> : sequence.playing ? <Pause size={15} /> : <Play size={15} />}</button></div>
    </div>
    <div className="scene-caption"><SignalMark /><span>{config.note}</span></div>
  </div>;
}
