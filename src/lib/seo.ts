/**
 * Structured data and canonical helpers.
 * Master SEO Framework §7.4 (technical metadata), §13.1 (AI discoverability):
 * "Organization and other eligible structured data are implemented accurately"
 * and "Brand/entity facts are consistent across the website".
 *
 * Every value here must match what is visible on the page. Nothing is claimed
 * in markup that a reader cannot also see.
 */

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

export const origin = () => process.env.NEXT_PUBLIC_SITE_URL || '';

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
