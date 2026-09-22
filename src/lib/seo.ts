/**
 * Structured data and canonical helpers.
 * Master SEO Framework §7.4 (technical metadata), §13.1 (AI discoverability):
 * "Organization and other eligible structured data are implemented accurately"
 * and "Brand/entity facts are consistent across the website".
 *
 * Every value here must match what is visible on the page. Nothing is claimed
 * in markup that a reader cannot also see.
 */

import { socialUrls } from './social';

export const SITE = {
  name: 'HireStella',
  legalName: 'HireStella AI for Software Solutions Co LLC',
  tagline: 'Capacity, coordinated.',
  description:
    'One AI General Manager and eight connected AI Specialists that coordinate enquiries, bookings and follow-ups across your channels.',
  email: 'sales@hirestella.ai',
  street: 'Lake Central Towers 1903, Business Bay',
  city: 'Dubai',
  country: 'AE',
  category: 'AI Workforce Orchestration Platform',
} as const;

/**
 * The Google Business Profile link, and the details only it can supply.
 *
 * A map embed does not connect this website to a Business Profile. The match is
 * made on three things being consistent: the name, address and phone on the
 * page; the same values in LocalBusiness markup; and `sameAs` pointing at the
 * profile itself, with the profile pointing back at this domain.
 *
 * Fill these in and the markup completes itself. They are deliberately left
 * empty rather than guessed at, because a wrong coordinate or an invented phone
 * number in structured data is worse for a Business Profile than no value: it
 * gives Google a conflicting signal to reconcile.
 *
 *   profileUrl  the share link from the Business Profile, or its Maps listing
 *   phone       international format, e.g. '+971 4 000 0000'
 *   geo         exact latitude and longitude of the entrance
 */
export const BUSINESS: {
  profileUrl: string;
  phone: string;
  geo: { lat: number; lng: number } | null;
} = {
  profileUrl: '',
  phone: '',
  geo: null,
};

/**
 * The address as a maps query, used by the embed and the directions link.
 *
 * Deliberately the building, not the company. Querying the legal name while no
 * Business Profile exists made Maps fall back to a fuzzy search and drop pins
 * on unrelated Dubai IT firms, which is a worse contact page than no map at
 * all. The street address resolves to the right tower every time.
 *
 * Once BUSINESS.profileUrl is set, that listing is what the embed should show,
 * and this query stops being the fallback.
 */
export const mapsQuery = () =>
  encodeURIComponent(`${SITE.street}, ${SITE.city}, United Arab Emirates`);

/** Where "Open in Google Maps" goes: the real profile when known, else a search. */
export const mapsUrl = () =>
  BUSINESS.profileUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery()}`;

/**
 * The site's public origin.
 *
 * Everything that makes the site findable reads this: canonicals, the sitemap,
 * robots.txt and every JSON-LD `@id`. When it resolves to '' the site correctly
 * hides itself, which is what a preview deployment should do.
 *
 * 2026-09-22: production had been serving `Disallow: /` with an empty sitemap
 * and no canonical on any page, because `NEXT_PUBLIC_SITE_URL` was never set on
 * the Vercel project. A missing variable should not be able to take the whole
 * site out of Google, so production now falls back to the real domain.
 * `VERCEL_ENV` is 'production' only for the production deployment, so previews
 * and branch deploys still resolve to '' and stay unindexed.
 *
 * Setting NEXT_PUBLIC_SITE_URL still wins, and is still the right thing to do.
 */
const PRODUCTION_ORIGIN = 'https://hirestella.ai';

export const origin = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === 'production' ? PRODUCTION_ORIGIN : '');

/** §7.1 — canonical tags point to the intended preferred URL. */
export function canonical(path: string) {
  const base = origin();
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return base ? { alternates: { canonical: `${base}${clean || '/'}` } } : {};
}

type Json = Record<string, unknown>;

export function organizationLd(): Json {
  const base = origin();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    ...(base ? { url: base, logo: `${base}/brand/logo-dark-v2.png` } : {}),
    email: SITE.email,
    slogan: SITE.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.street,
      addressLocality: SITE.city,
      addressCountry: SITE.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: SITE.email,
      areaServed: 'AE',
      availableLanguage: ['English'],
    },
    /* `sameAs` is how a search engine confirms that this domain and those
       accounts are one entity. It reads from the same list the footer links
       from, so a profile can never be claimed here without being clickable
       there, which is the consistency the claim depends on. */
    ...(socialUrls().length ? { sameAs: socialUrls() } : {}),
  };
}

export function websiteLd(): Json {
  const base = origin();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: SITE.name,
    description: SITE.description,
    ...(base ? { url: base } : {}),
    publisher: { '@id': `${base}/#organization` },
    inLanguage: 'en-AE',
  };
}

/** §8 — breadcrumbs make the topic graph explicit to crawlers and to readers. */
export function breadcrumbLd(trail: [string, string?][]): Json {
  const base = origin();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, href], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      ...(href && base ? { item: `${base}${href === '/' ? '' : href}` } : {}),
    })),
  };
}

export function serviceLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}): Json {
  const base = origin();
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: { '@id': `${base}/#organization` },
    ...(base ? { url: `${base}${path}` } : {}),
    areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
    serviceType: SITE.category,
  };
}

export function articleLd({
  headline,
  description,
  datePublished,
  path,
}: {
  headline: string;
  description: string;
  datePublished: string;
  path: string;
}): Json {
  const base = origin();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    datePublished,
    dateModified: datePublished,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@id': `${base}/#organization` },
    ...(base ? { mainEntityOfPage: `${base}${path}` } : {}),
    inLanguage: 'en-AE',
  };
}

/**
 * LocalBusiness, for the Business Profile and the map pack.
 *
 * Organization already describes the company. This describes the *place*, which
 * is a different entity to Google and the one Maps and local results read. It
 * ships only on /contact, because that is the page carrying the visible address
 * it has to agree with.
 *
 * Optional values are omitted when unknown rather than guessed. See BUSINESS.
 */
export function localBusinessLd(): Json {
  const base = origin();
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${base}/#localbusiness`,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    ...(base ? { url: base, image: `${base}/brand/logo-dark-v2.png` } : {}),
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.street,
      addressLocality: SITE.city,
      addressRegion: 'Dubai',
      addressCountry: SITE.country,
    },
    areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
    parentOrganization: { '@id': `${base}/#organization` },
    hasMap: mapsUrl(),
    ...(BUSINESS.phone ? { telephone: BUSINESS.phone } : {}),
    ...(BUSINESS.profileUrl || socialUrls().length
      ? { sameAs: [BUSINESS.profileUrl, ...socialUrls()].filter(Boolean) }
      : {}),
    ...(BUSINESS.geo
      ? { geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.geo.lat, longitude: BUSINESS.geo.lng } }
      : {}),
  };
}

/** §9.2 — FAQ markup must mirror questions that are visible on the page. */
export function faqLd(items: { q: string; a: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
