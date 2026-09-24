'use client';

import { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { SITE, mapsQuery, mapsUrl } from '@/lib/seo';

/**
 * The office location, as a map the visitor chooses to load.
 *
 * A Google Maps iframe is roughly half a megabyte and sets third-party cookies
 * the moment it mounts. Every other page on this site transfers about 58KB, so
 * mounting it on load would make Contact the heaviest page by an order of
 * magnitude and would hand a tracker to every visitor who never looked at it.
 *
 * So the panel renders the address itself, which is the part people actually
 * need, and loads the embed only when asked. Nothing reaches Google until the
 * button is pressed. The "Open in Google Maps" link always works and needs no
 * embed at all, which is also the link that matters for directions on a phone.
 *
 * The address text here, the footer, and the LocalBusiness markup all read from
 * `SITE` in lib/seo.ts, so the name and address a search engine sees can never
 * drift from the ones on the page. That consistency is what a Business Profile
 * is matched on.
 */
export function ContactMap() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="cmap pan pan--solid">
      <div className="cmap-head">
        <span className="cmap-pin" aria-hidden="true">
          <MapPin size={17} strokeWidth={1.7} />
        </span>
        <div>
          <p className="eyebrow">Where we are</p>
          <address className="cmap-addr">
            {SITE.street}
            <br />
            {SITE.city}, United Arab Emirates
          </address>
        </div>
        <a
          className="btn-3 cmap-out"
          href={mapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Google Maps
          <ExternalLink size={14} strokeWidth={1.8} aria-hidden="true" />
        </a>
      </div>

      <div className="cmap-frame">
        {loaded ? (
          <iframe
            title={`Map showing ${SITE.name} at ${SITE.street}, ${SITE.city}`}
            src={`https://www.google.com/maps?q=${mapsQuery()}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <button type="button" className="cmap-load" onClick={() => setLoaded(true)}>
            <span className="cmap-grid" aria-hidden="true" />
            <span className="cmap-cta">
              <MapPin size={20} strokeWidth={1.6} aria-hidden="true" />
              <b>Show the map</b>
              <em>Loads Google Maps, which sets its own cookies.</em>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
