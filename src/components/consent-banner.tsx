'use client';

import { useEffect, useState } from 'react';
import { readConsent, setConsent } from '@/lib/consent';

/**
 * The analytics consent bar.
 *
 * Shown only while the visitor is undecided. Accept and Reject carry equal
 * weight, which is what makes the choice a real one — nothing is pre-selected
 * and rejecting takes exactly as many clicks as accepting.
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
    setConsent(value);
    setShow(false);
  }

  return (
    <div className="cb" role="dialog" aria-label="Analytics consent">
      <div className="cb-inner">
        {/* No privacy-policy link: the site has no /privacy route yet. Add one
            here once it exists — consent notices are expected to carry it. */}
        <p className="cb-copy">
          We use analytics to understand how this site is used. Nothing loads until you choose.
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
