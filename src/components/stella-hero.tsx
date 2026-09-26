'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import { Logo } from './ui';

/* The eight specialists, in the order they sit on the hero rail. */
const RAIL = [
  'Front Desk',
  'Voice',
  'Website',
  'Booking',
  'Admin',
  'Marketing',
  'Social',
  'Follow-up',
] as const;

type Scenario = {
  id: string;
  chip: string;
  said: string;
  business: string;
  channels: string;
  bottleneck: string;
  specialists: string[];
  boundary: string;
  next: string;
};

/* Labelled local scenarios, not a live model. Every claim stays illustrative.
   One per sector in the Industries menu, in the same order, so the chip row
   and the header never disagree about how many industries we serve. */
const SCENARIOS: Scenario[] = [
  {
    id: 'dental',
    chip: 'Clinics',
    said: 'We miss calls after hours and patients book somewhere else.',
    business: 'Dental clinic · Dubai',
    channels: 'Phone · Website · WhatsApp · Instagram',
    bottleneck:
      'After-hours calls go unanswered, and the same patient arrives on three channels with no shared context. Reception is already with someone in the chair.',
    specialists: ['Voice', 'Front Desk', 'Booking', 'Follow-up'],
    boundary:
      'Clinical questions, treatment decisions and complaints transfer to your team with the full conversation attached.',
    next: 'Build this workforce exclusively for your clinic',
  },
  {
    id: 'automotive',
    chip: 'Automotive',
    said: 'Workshop bookings and rental enquiries never meet.',
    business: 'Automotive group · Dubai',
    channels: 'Phone · Website · WhatsApp · Walk-in',
    bottleneck:
      'Rental, service and sales enquiries sit in separate systems, so a returning customer starts from zero every time.',
    specialists: ['Front Desk', 'Booking', 'Admin', 'Follow-up'],
    boundary:
      'Quotes, disputes and anything involving a vehicle assessment go to your service advisor.',
    next: 'Build this workforce exclusively for your group',
  },
  {
    id: 'real-estate',
    chip: 'Real estate',
    said: 'Leads come in overnight and agents reach them a day late.',
    business: 'Real estate brokerage · Dubai',
    channels: 'Portals · Website · WhatsApp · Phone',
    bottleneck:
      'Portal leads arrive outside working hours and cool before an agent responds. Nobody owns the second follow-up.',
    specialists: ['Front Desk', 'Voice', 'Booking', 'Follow-up'],
    boundary:
      'Negotiation, pricing and anything contractual stays with your agent, briefed and ready.',
    next: 'Build this workforce exclusively for your agency',
  },
  {
    id: 'hospitality',
    chip: 'Hospitality',
    said: 'Booking questions arrive at midnight and the floor is busy.',
    business: 'Hotel & restaurant group · Dubai',
    channels: 'Phone · Website · WhatsApp · Instagram',
    bottleneck:
      'Availability and menu questions land while the team is looking after the guests already in the room, so the guest still deciding waits, and decides elsewhere.',
    specialists: ['Front Desk', 'Voice', 'Booking', 'Social'],
    boundary:
      'Complaints, special requests and anything affecting a guest already staying with you go to your duty manager.',
    next: 'Build this workforce exclusively for your property',
  },
  {
    id: 'education',
    chip: 'Education',
    said: 'Admissions enquiries arrive long after the office closes.',
    business: 'School & training institute · UAE',
    channels: 'Website · WhatsApp · Phone · Email',
    bottleneck:
      'Parents and learners enquire in the evening, and the decision runs over weeks with nobody owning the follow-up between the tour and the offer.',
    specialists: ['Front Desk', 'Booking', 'Follow-up', 'Admin'],
    boundary:
      'Eligibility, fees, placement decisions and anything about a specific child stay with your admissions team.',
    next: 'Build this workforce exclusively for your institution',
  },
  {
    id: 'banking',
    chip: 'Banking',
    said: 'Routine service questions block the team from real cases.',
    business: 'Financial services firm · UAE',
    channels: 'Phone · Web chat · Email',
    bottleneck:
      'High volumes of routine status and document questions absorb the service desk, so complex cases wait behind them.',
    specialists: ['Front Desk', 'Voice', 'Admin', 'Booking'],
    boundary: 'Anything advisory, regulated or account-sensitive transfers to authorised staff only.',
    next: 'Build this workforce exclusively for your service desk',
  },
  {
    id: 'home-services',
    chip: 'Home services',
    said: 'Calls come in while every technician is already on a job.',
    business: 'Maintenance company · Dubai',
    channels: 'Phone · WhatsApp · Website',
    bottleneck:
      'The phone rings while the vans are out, so the job goes to whoever answers first, and the callback nobody owned never happened.',
    specialists: ['Voice', 'Front Desk', 'Booking', 'Follow-up'],
    boundary:
      'Quotes, site assessments and anything carrying liability go to your supervisor before a commitment is made.',
    next: 'Build this workforce exclusively for your team',
  },
  {
    id: 'travel',
    chip: 'Travel',
    said: 'Itinerary questions arrive from every time zone, all night.',
    business: 'Travel agency · Dubai',
    channels: 'Website · WhatsApp · Email · Phone',
    bottleneck:
      'Itinerary and eligibility questions arrive around the clock from different time zones, so consultants start every morning already behind.',
    specialists: ['Front Desk', 'Website', 'Follow-up', 'Admin'],
    boundary:
      'Bookings, payments, visa advice and anything a supplier must confirm stay with your consultant.',
    next: 'Build this workforce exclusively for your agency',
  },
  {
    id: 'professional-services',
    chip: 'Professional',
    said: 'Fee earners spend the morning qualifying enquiries.',
    business: 'Consultancy · Dubai',
    channels: 'Website · Email · Phone · LinkedIn',
    bottleneck:
      'Every inbound enquiry reaches a fee earner unqualified, so billable hours go to conversations that were never going to convert.',
    specialists: ['Front Desk', 'Booking', 'Follow-up', 'Admin'],
    boundary:
      'Scope, fees, advice and anything that commits the firm stay with your partner or consultant.',
    next: 'Build this workforce exclusively for your firm',
  },
  {
    id: 'retail',
    chip: 'Retail',
    said: 'Where-is-my-order questions bury the ones ready to buy.',
    business: 'D2C brand & showroom · UAE',
    channels: 'Website · Instagram · WhatsApp · Email',
    bottleneck:
      'Order-status questions and pre-purchase questions land in the same inbox, so the customer holding a card waits behind one tracking a parcel.',
    specialists: ['Front Desk', 'Social', 'Admin', 'Follow-up'],
    boundary:
      'Refunds, complaints and any goodwill decision go to your team with the order history attached.',
    next: 'Build this workforce exclusively for your brand',
  },
];

/* Words that place a typed brief in a sector. First match by count wins. */
const SECTOR_WORDS: Record<string, string[]> = {
  dental: ['clinic', 'dental', 'dentist', 'patient', 'patients', 'treatment', 'doctor', 'medical', 'appointment', 'appointments', 'aesthetic', 'surgery'],
  'real-estate': ['property', 'properties', 'real estate', 'listing', 'listings', 'viewing', 'viewings', 'broker', 'brokerage', 'tenant', 'landlord', 'portal', 'portals', 'agent', 'agents'],
  banking: ['bank', 'banking', 'finance', 'financial', 'loan', 'loans', 'insurance', 'account', 'accounts', 'statement', 'compliance', 'claims'],
  automotive: ['car', 'cars', 'vehicle', 'vehicles', 'workshop', 'garage', 'rental', 'rentals', 'dealership', 'showroom', 'fleet', 'test drive'],
  hospitality: ['hotel', 'hotels', 'restaurant', 'restaurants', 'guest', 'guests', 'reservation', 'reservations', 'table', 'tables', 'rooms', 'hospitality', 'cafe', 'resort', 'check-in'],
  education: ['school', 'schools', 'nursery', 'student', 'students', 'admission', 'admissions', 'course', 'courses', 'training', 'parent', 'parents', 'tuition', 'academy', 'university', 'enrolment'],
  'home-services': ['plumber', 'plumbing', 'electrician', 'maintenance', 'repair', 'repairs', 'technician', 'technicians', 'handyman', 'cleaning', 'hvac', 'pest control', 'contractor', 'callout'],
  travel: ['travel', 'tour', 'tours', 'tourism', 'itinerary', 'flight', 'flights', 'visa', 'holiday', 'trip', 'destination', 'traveller', 'tour operator'],
  'professional-services': ['consultancy', 'consulting', 'consultant', 'law firm', 'lawyer', 'legal', 'accounting', 'accountant', 'audit', 'fee earner', 'advisory', 'architect', 'proposal'],
  retail: ['retail', 'store', 'stores', 'shop', 'shopify', 'ecommerce', 'e-commerce', 'order', 'orders', 'product', 'products', 'delivery', 'shipping', 'refund', 'stock'],
};

/* The honest fallback: a brief we cannot place stays unplaced. */
const GENERIC: Scenario = {
  id: 'generic',
  chip: 'Your brief',
  said: '',
  business: 'General example',
  channels: 'The channels your enquiries already arrive on',
  bottleneck:
    'Work arrives faster than anyone can own it, and it lands in more than one place. Nothing is lost on purpose, but nothing has a single owner either.',
  specialists: ['Front Desk', 'Voice', 'Booking', 'Follow-up'],
  boundary:
    'Decisions, complaints, negotiation and anything contractual transfer to your team with the full conversation attached.',
  next: 'Build this workforce exclusively for your business',
};

/* A chip names the business, so it earns "your group". A typed brief only
   tells us the sector, so the wording stays to what the visitor said. */
const TYPED_NEXT: Record<string, string> = {
  dental: 'Build this workforce exclusively for your clinic',
  'real-estate': 'Build this workforce exclusively for your agency',
  banking: 'Build this workforce exclusively for your service desk',
  automotive: 'Build this workforce exclusively for your workshop',
  hospitality: 'Build this workforce exclusively for your property',
  education: 'Build this workforce exclusively for your institution',
  'home-services': 'Build this workforce exclusively for your team',
  travel: 'Build this workforce exclusively for your agency',
  'professional-services': 'Build this workforce exclusively for your firm',
  retail: 'Build this workforce exclusively for your brand',
};

function routeBrief(text: string): Scenario {
  const t = text.toLowerCase();
  let best: { id: string; hits: number } | null = null;
  for (const [id, words] of Object.entries(SECTOR_WORDS)) {
    const hits = words.filter((w) => t.includes(w)).length;
    if (hits && (!best || hits > best.hits)) best = { id, hits };
  }
  const matched = best && SCENARIOS.find((s) => s.id === best!.id);
  /* A matched sector lends its specialists and boundary, not its business. */
  return matched
    ? {
        ...matched,
        business: GENERIC.business,
        channels: GENERIC.channels,
        next: TYPED_NEXT[matched.id] ?? GENERIC.next,
      }
    : GENERIC;
}

const IDLE_CAPTION = 'Eight specialists, waiting for a brief.';

export function StellaHero() {
  const [live, setLive] = useState<Scenario | null>(null);
  const [said, setSaid] = useState('');
  const [active, setActive] = useState<string | null>(null);
  const [lit, setLit] = useState<string[]>([]);
  const [state, setState] = useState({ label: 'Ready', busy: false });
  const [caption, setCaption] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const reset = useCallback(() => {
    clearTimers();
    setLive(null);
    setSaid('');
    setActive(null);
    setLit([]);
    setCaption(null);
    setState({ label: 'Ready', busy: false });
  }, []);

  /* §12.3 — the hero signal: the brief lands, the relevant specialists illuminate. */
  const run = useCallback((scenario: Scenario, spoken?: string) => {
    clearTimers();
    setSaid(spoken || scenario.said);
    setLive(scenario);
    setLit([]);
    setState({ label: 'Matching an example', busy: true });
    setCaption('Finding the closest example.');
    timers.current.push(setTimeout(() => setLit(scenario.specialists), 560));
    timers.current.push(
      setTimeout(() => {
        setState({ label: 'Example workflow', busy: true });
        setCaption(
          `This example uses ${scenario.specialists.length} specialists. Your own configuration is confirmed in discovery.`,
        );
      }, 1150),
    );
  }, []);

  /* "Ask Stella" goes to the field and focuses it. It is not a dead anchor. */
  const ask = useCallback(() => {
    reset();
    const target = panel.current;
    if (!target) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = target.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    timers.current.push(
      setTimeout(() => field.current?.focus({ preventScroll: true }), reduce ? 0 : 500),
    );
  }, [reset]);

  useEffect(() => {
    function onHash() {
      if (window.location.hash === '#ask-stella') ask();
    }
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [ask]);

  function send() {
    const typed = value.trim();
    if (typed) {
      setActive(null);
      run(routeBrief(typed), typed);
      return;
    }
    run(SCENARIOS.find((s) => s.id === active) ?? SCENARIOS[0]);
  }

  return (
    <section className="hero" id="ask-stella">
      <span className="hero-pool" aria-hidden="true" />
      <span className="hero-dots" aria-hidden="true" />

      <div className="wrap hero-in">
        <span className="badge">
          <i className="dot" aria-hidden="true" /> AI Workforce Orchestration
        </span>

        <h1 className="d-xl">
          Tell Stella what is slowing
          <br className="lb" /> your business <em>down.</em>
        </h1>

        <p className="lede">
          Stella, your AI General Manager, runs eight AI specialists that answer your calls and
          messages, book appointments and follow up. Anything sensitive goes to your team.
        </p>

        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <button className="btn btn-2" onClick={ask} type="button">
            Ask Stella
          </button>
          <button className="btn-3" type="button" data-demo style={{ color: 'var(--t2)', fontWeight: 500 }}>
              Book a demo <span className="tri" aria-hidden="true" />
            </button>
        </div>

        <div className="stage">
          <div
            ref={panel}
            className={`cmd pan blur ${live ? 'is-live' : ''} ${focused && !live ? 'is-focus' : ''}`}
          >
            <div className="cmd-top">
              <span className="stella">
                <span className="stella-mark">
                  <Logo symbol />
                </span>
                <span className="stella-id">
                  <b>Stella</b>
                  <em>Your AI General Manager</em>
                </span>
              </span>
              <span className={`state ${state.busy ? 'busy' : ''}`}>
                <i className="dot" aria-hidden="true" /> {state.label}
              </span>
            </div>

            {live && (
              <div className="cmd-said">
                <span className="qm" aria-hidden="true" />
                <q>{said}</q>
              </div>
            )}

            {!live && (
              <>
                <div className="cmd-field">
                  <label className="micro" htmlFor="stella-prompt">
                    What is slowing your business down?
                  </label>
                  <textarea
                    id="stella-prompt"
                    ref={field}
                    rows={3}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => {
                      setFocused(true);
                      setState({ label: 'Ready', busy: true });
                    }}
                    onBlur={() => {
                      setFocused(false);
                      setState({ label: 'Ready', busy: false });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="For example: we miss calls after hours, enquiries arrive on three channels, and follow-ups are not happening."
                  />
                </div>

                <div className="cmd-foot">
                  <span className="sm">
                    <Lock size={13} strokeWidth={1.8} aria-hidden="true" />
                    An interactive example using preset scenarios, not a live AI model. No sign-up needed. Please do not enter confidential customer data.
                  </span>
                  <button className="send" onClick={send} type="button">
                    Ask Stella <span className="tri" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}

            {live && (
              <div className="an" aria-live="polite">
                <div className="an-row">
                  <span className="micro an-k">Business</span>
                  <div className="an-v">{live.business}</div>
                </div>
                <div className="an-row">
                  <span className="micro an-k">Channels</span>
                  <div className="an-v">{live.channels}</div>
                </div>
                <div className="an-row wide">
                  <span className="micro an-k">Bottleneck</span>
                  <div className="an-v">{live.bottleneck}</div>
                </div>
                <div className="an-row wide">
                  <span className="micro an-k">Specialists</span>
                  <div className="an-v">
                    <div className="chipset">
                      {live.specialists.map((s) => (
                        <span className="chip-s" key={s}>
                          <i aria-hidden="true" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="an-row wide">
                  <span className="micro an-k">Human boundary</span>
                  <div className="an-v">{live.boundary}</div>
                </div>
              </div>
            )}
          </div>

          {live && (
            <div className="nextstep pan pan--solid">
              <span className="rail rail--sig" aria-hidden="true" />
              <div className="nextstep-body">
                <p className="eyebrow eyebrow--sig">Your next step</p>
                <b>
                  {/* §7A.4 — the Stella Star, once, at the moment of diagnosis */}
                  <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 2.4l2.1 5.9 5.9 2.1-5.9 2.1-2.1 5.9-2.1-5.9L4 10.4l5.9-2.1z"
                      fill="#FF6200"
                    />
                  </svg>
                  <span>{live.next}</span>
                </b>
                <p className="sm">
                  Configured around your channels, your systems and your rules. Nothing is shared
                  with another business.
                </p>
              </div>
              <div className="nextstep-act">
                <button className="btn btn-1" type="button" data-demo data-demo-problem={said}>
                  Book a demo <span className="tri" aria-hidden="true" />
                </button>
                <button
                  className="btn-3"
                  type="button"
                  onClick={() => {
                    reset();
                    setValue('');
                  }}
                  style={{ color: 'var(--t3)', fontWeight: 500, fontSize: 13 }}
                >
                  Start again
                </button>
              </div>
            </div>
          )}

          <div className="wforce">
            {RAIL.map((name) => (
              <span className={`wf-n ${lit.includes(name) ? 'on' : ''}`} key={name}>
                <i aria-hidden="true" />
                <span>{name}</span>
              </span>
            ))}
          </div>
          <div className="wf-cap">
            <span>{caption ?? IDLE_CAPTION}</span>
          </div>

          <div className="chips">
            <span className="micro">Try a scenario</span>
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="chip"
                aria-pressed={active === s.id}
                onClick={() => {
                  setActive(s.id);
                  run(s);
                }}
              >
                {s.chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
