'use client';

import { useEffect, useState } from 'react';
import { CONSENT_OPEN_EVENT, readConsent, setConsent } from '@/lib/consent';

/* First-party cookies GA4, Google Ads and the Meta Pixel set on this domain. */
const TRACKING_COOKIE = /^(_ga|_gid|_gat|_gcl_|_fbp|_fbc)/;

function clearTrackingCookies() {
  const host = location.hostname;
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
  for (const pair of document.cookie.split(';')) {
    const name = pair.split('=')[0].trim();
    if (!TRACKING_COOKIE.test(name)) continue;
    for (const domain of domains)
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
  }
}

/**
 * The analytics consent bar, shown to every visitor worldwide.
 *
 * Shown only while the visitor is undecided, or when reopened from the
 * footer's "Cookie settings". Accept and Reject carry equal weight, which is
 * what makes the choice a real one — nothing is pre-selected and rejecting
 * takes exactly as many clicks as accepting.
 *
 * While it is open the root carries data-consent-open, which lifts the Stella
 * launcher clear of the bar.
 */
export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    /* Read after mount: the bootstrap has already applied any stored choice,
       and rendering nothing on the server avoids a hydration mismatch. */
    if (readConsent() === null) setShow(true);
    const reopen = () => setShow(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (!show) return;
    document.documentElement.dataset.consentOpen = 'true';
    return () => {
      delete document.documentElement.dataset.consentOpen;
    };
  }, [show]);

  if (!show) return null;

  function decide(value: 'granted' | 'denied') {
    const withdrawn = value === 'denied' && readConsent() === 'granted';
    setConsent(value);
    setShow(false);
    /* GTM and the Pixel cannot be unloaded once running, so withdrawing
       consent clears their cookies and reloads into a page without them. */
    if (withdrawn) {
      clearTrackingCookies();
      location.reload();
    }
  }

  return (
    <div className="cb" role="dialog" aria-label="Cookie consent">
      <div className="cb-inner">
        {/* No privacy-policy link: the site has no /privacy route yet. Add one
            here once it exists — consent notices are expected to carry it. */}
        <p className="cb-copy">
          We use cookies for analytics and advertising (Google and Meta) to understand how this site
          is used. Nothing loads until you choose, and you can change your mind any time under
          Cookie settings.
        </p>
        <div className="cb-act">
          <button className="btn btn-1" type="button" onClick={() => decide('granted')}>
            Accept
          </button>
          <button className="cb-reject" type="button" onClick={() => decide('denied')}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
