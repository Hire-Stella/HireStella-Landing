'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * The timed Book a demo invitation.
 *
 * Client review, 2026-10-09: five seconds after a visitor first scrolls, the
 * same Book a demo dialog the header button opens appears on its own. Waiting
 * for a scroll means it reaches people who are reading, not people who landed
 * and have not looked yet.
 *
 * It opens once per page load (a refresh shows it again, moving between pages
 * does not), never on the pages that already are the booking form, never after
 * the visitor has opened the demo themselves, and never again in a session
 * once they have booked.
 */
const DELAY = 5000;
export const BOOKED = 'hs-demo-booked';
const SKIP = ['/book-demo', '/thank-you', '/contact', '/get'];

/* Module scope: survives client-side navigation, resets on a full reload. */
let done = false;

export function DemoNudge() {
  const path = usePathname() ?? '/';

  useEffect(() => {
    if (done || SKIP.some((p) => path === p || path.startsWith(`${p}/`))) return;
    try {
      if (sessionStorage.getItem(BOOKED)) return;
    } catch {}
    /* The visitor found the demo on their own: the invitation is redundant. */
    function opened(e: MouseEvent) {
      if ((e.target as Element)?.closest?.('[data-demo]')) done = true;
    }
    document.addEventListener('click', opened);
    let t: ReturnType<typeof setTimeout>;
    function invite() {
      if (done) return;
      /* Never interrupt someone mid-sentence, e.g. typing to Ask Stella. */
      if (document.activeElement?.matches('input, textarea, select, [contenteditable]')) {
        t = setTimeout(invite, 3000);
        return;
      }
      done = true;
      if (document.querySelector('.dm-scrim')) return;
      window.dispatchEvent(new Event('hirestella:open-demo'));
    }
    /* The clock starts on the first real scroll, not on arrival. A refresh
       that restores a scrolled position counts as scrolled, since the browser
       fires no scroll event for it. */
    let started = false;
    function scrolled() {
      if (started || window.scrollY < 80) return;
      started = true;
      window.removeEventListener('scroll', scrolled);
      t = setTimeout(invite, DELAY);
    }
    window.addEventListener('scroll', scrolled, { passive: true });
    const restored = setTimeout(scrolled, 300);
    return () => {
      clearTimeout(t);
      clearTimeout(restored);
      window.removeEventListener('scroll', scrolled);
      document.removeEventListener('click', opened);
    };
  }, [path]);

  return null;
}
