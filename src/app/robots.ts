import type { MetadataRoute } from 'next';
import { origin as siteOrigin } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  return {
    rules: {
      userAgent: '*',
      ...(origin ? { allow: '/', disallow: ['/api/', '/login'] } : { disallow: '/' }),
    },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
