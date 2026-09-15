'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import { track } from '@/lib/telemetry';

export const themeBootstrap = `(function(){var t=null;try{t=localStorage.getItem('hirestella-theme')}catch(e){}document.documentElement.dataset.theme=t==='light'?'light':'dark'})()`;

export function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);
  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next; setTheme(next);
    try { localStorage.setItem('hirestella-theme', next); } catch { /* The toggle still works without storage. */ }
    track('theme_changed', { theme: next });
  }
  return <button className="ico theme-toggle" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
  </button>;
}

/** Signals are local and contain no prompts, form values, query strings, or email addresses. */
export function SiteBehavior() {
  const pathname = usePathname();
  useEffect(() => { track('page_view'); }, [pathname]);
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const link = (e.target as Element)?.closest?.('a');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (link.dataset.track) track(link.dataset.track);
      else if (href.startsWith('/book-demo')) track('demo_cta_clicked');
      else if (href.includes('#ask-stella')) track('stella_cta_clicked');
    };
    document.addEventListener('click', click);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.classList.toggle('is-in-view', entry.isIntersecting);
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-motion]').forEach(el => observer.observe(el));
    return () => { document.removeEventListener('click', click); observer.disconnect(); };
  }, [pathname]);
  return null;
}
