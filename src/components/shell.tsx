'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X, Mail, MapPin } from 'lucide-react';
import { navigation } from '@/lib/data';
import { industryGroups } from '@/lib/industry-content';
import { Icon, Logo } from './ui';
import { SocialLinks } from './social';
import { ThemeToggle } from './site-behavior';

const CONTACT = {
  email: 'sales@hirestella.ai',
  address: ['Lake Central Towers 1903,', 'Business Bay, Dubai, UAE'],
  entity: 'HireStella AI for Software Solutions Co LLC',
};

/** §7A.3 — the triangle marks an action or a direction. It never decorates. */
function Tri() {
  return <span className="tri" aria-hidden="true" />;
}

/**
 * The industries menu.
 *
 * Ten sectors in two columns of five, nothing else. It used to be two panes
 * with every segment laid out and a "4 workflows" count under each name; at
 * ten sectors that is a wall, and the counts were noise. Clicking a sector
 * goes to its page, which is where its business types and workflows live and
 * where there is room to explain them.
 */
function IndustryMenu({ onPick }: { onPick: () => void }) {
  return (
    <div className="menu menu--ind pan pan--solid blur" id="menu-Industries">
      <span className="micro">Choose an industry</span>
      {industryGroups.map((g) => (
        <Link key={g.id} href={`/industries/${g.id}`} onClick={onPick} className="mm-row">
          <span className="mm-ico" aria-hidden="true">
            <Icon name={g.icon} size={17} />
          </span>
          <b>{g.name}</b>
          <Tri />
        </Link>
      ))}
      <div className="mm-foot">
        <p className="note">From the first enquiry to a workforce built for your business alone.</p>
        <Link href="/use-cases" className="btn-3" onClick={onPick}>
          See every use case <Tri />
        </Link>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    function close(event: Event) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(null);
        setMobile(false);
      }
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(null);
        setMobile(false);
      }
    }
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);

  function dismiss() {
    setOpen(null);
    setMobile(false);
  }

  const [product, coach, , platform, company] = navigation;

  return (
    <header className="hdr pan blur" ref={ref}>
      <Link href="/" className="hdr-logo" aria-label="HireStella home" onClick={dismiss}>
        <Logo />
      </Link>

      <nav
        id="main-navigation"
        className={`nav ${mobile ? 'is-open' : ''}`}
        aria-label="Main navigation"
      >
        <Link href="/stella" className="nav-trigger" onClick={dismiss}>
          {product.label}
        </Link>

        <Link href="/sales-coach" className="nav-trigger" onClick={dismiss}>
          {coach.label}
        </Link>

        <div className="nav-group">
          <button
            className="nav-trigger"
            aria-expanded={open === 'Industries'}
            aria-controls="menu-Industries"
            onClick={() => setOpen(open === 'Industries' ? null : 'Industries')}
          >
            Industries
            <ChevronDown size={13} aria-hidden="true" />
          </button>
          {open === 'Industries' && <IndustryMenu onPick={dismiss} />}
        </div>

        <div className="nav-group">
          <button
            className="nav-trigger"
            aria-expanded={open === platform.label}
            aria-controls={`menu-${platform.label}`}
            onClick={() => setOpen(open === platform.label ? null : platform.label)}
          >
            {platform.label}
            <ChevronDown size={13} aria-hidden="true" />
          </button>
          {open === platform.label && (
            <div className="menu pan pan--solid blur" id={`menu-${platform.label}`}>
              <span className="micro">Explore {platform.label}</span>
              {platform.links.map(([label, href]) => (
                <Link key={href} href={href} onClick={dismiss}>
                  {label}
                  <Tri />
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/blogs" className="nav-trigger" onClick={dismiss}>
          Blogs
        </Link>

        <div className="nav-group">
          <button
            className="nav-trigger"
            aria-expanded={open === 'about'}
            aria-controls="menu-about"
            onClick={() => setOpen(open === 'about' ? null : 'about')}
          >
            {company.label}
            <ChevronDown size={13} aria-hidden="true" />
          </button>
          {open === 'about' && (
            <div className="menu pan pan--solid blur" id="menu-about">
              <span className="micro">Who we are</span>
              {company.links
                .filter(([, href]) => href !== '/blogs')
                .map(([label, href]) => (
                  <Link key={href} href={href} onClick={dismiss}>
                    {label}
                    <Tri />
                  </Link>
                ))}
            </div>
          )}
        </div>
      </nav>

      <div className="hdr-act">
        <ThemeToggle />
        <Link className="btn btn-2" href="/#ask-stella" onClick={dismiss}>
          Ask Stella
        </Link>
        <button className="btn btn-1" type="button" data-demo onClick={dismiss}>
          <span>Book<span className="btn-long"> a demo</span></span>
          <Tri />
        </button>
        <button
          className="ico burger"
          aria-label={mobile ? 'Close menu' : 'Open menu'}
          aria-expanded={mobile}
          aria-controls="main-navigation"
          onClick={() => {
            setMobile(!mobile);
            setOpen(null);
          }}
        >
          {mobile ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  /* The Meet Stella group is a single page with no child links, so as a footer
     column it was a heading above nothing. It keeps its place in the header;
     here the space goes to the ten sectors, five to a column. */
  const [, , industries, platform, company] = navigation;
  const sectors = industries.links.filter(([, href]) => href.startsWith('/industries/'));
  const half = Math.ceil(sectors.length / 2);
  /* 'Use cases' is not a sector. It belongs with the platform links, and so
     does Sales Coach — it has no column of its own for the same reason Meet
     Stella does not, but it still needs a link outside the header. */
  const platformLinks = [
    ['Stella Sales Coach', '/sales-coach'],
    ...platform.links,
    ...industries.links.filter(([, href]) => !href.startsWith('/industries/')),
  ];
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Logo />
            <p>
              One AI General Manager. Eight connected AI Specialists. Capacity, coordinated.
            </p>
            <div className="foot-contact">
              <a href={`mailto:${CONTACT.email}`}>
                <Mail size={15} strokeWidth={1.6} aria-hidden="true" />
                {CONTACT.email}
              </a>
              <span>
                <MapPin size={15} strokeWidth={1.6} aria-hidden="true" />
                <span>
                  {CONTACT.address[0]}
                  <br />
                  {CONTACT.address[1]}
                </span>
              </span>
            </div>
            <SocialLinks />
          </div>

          <div className="foot-col foot-col--wide">
            <h5>{industries.label}</h5>
            <div className="foot-split">
              {[sectors.slice(0, half), sectors.slice(half)].map((column, i) => (
                <div key={i}>
                  {column.map(([label, href]) => (
                    <Link key={href} href={href}>
                      {label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="foot-col">
            <h5>{platform.label}</h5>
            {platformLinks.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="foot-bar">
          <div className="lg">
            <p className="note">
              © {new Date().getFullYear()} {CONTACT.entity}
            </p>
            <p className="note">Capacity, coordinated.</p>
          </div>
          <div className="lg">
            {company.links.map(([label, href]) => (
              <Link key={href} href={href} className="note">
                {label}
              </Link>
            ))}
            <Link href="/security" className="note">
              Security &amp; trust
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** The page carries one invitation to Stella. The floating widget competed with it. */
export function ConversationWidget() {
  return null;
}
