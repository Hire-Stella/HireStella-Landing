import type { MetadataRoute } from 'next';
import { editorialPages } from '@/lib/pages';
import { industries, specialists } from '@/lib/data';
import { industryGroups } from '@/lib/industry-content';
import { blogPosts } from '@/lib/blog-content';
import { segmentDetails } from '@/lib/segment-content';
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) return [];
  return [
    '',
    ...Object.keys(editorialPages),
    'stella',
    'sales-coach',
    /* `about` and `team` moved out of `editorialPages` into their own route
       files and were never added back here, so two footer-linked, indexable
       pages had been missing from the sitemap. `/login` is deliberately still
       absent: it is workspace access, not content. */
    'about',
    'team',
    'industries',
    'industries/healthcare/dental',
    'use-cases',
    'blogs',
    ...industryGroups.map((group) => `industries/${group.id}`),
    ...Object.entries(segmentDetails).map(([id, d]) => `industries/${d.group}/${id}`),
    ...blogPosts.map((post) => `blogs/${post.slug}`),
    'roi',
    'contact',
    'book-demo',
    'become-a-partner',
    ...industries.filter((i) => i.id === 'salons').map((i) => `solutions/${i.id}`),
  ].map((path) => ({
    url: `${origin}/${path}`,
    changeFrequency: 'monthly',
    priority: path ? 0.7 : 1,
  }));
}
