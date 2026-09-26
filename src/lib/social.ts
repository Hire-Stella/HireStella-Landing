/**
 * The company's social profiles.
 *
 * One list, used by the footer row and by the `sameAs` array in the
 * Organization markup. Keeping them in the same place is the point: `sameAs` is
 * how a search engine confirms that this domain and those accounts are the same
 * entity, and it only works if the URLs match the ones a visitor can click.
 *
 * A profile with an empty `url` is not rendered and is not claimed in markup,
 * so an account that does not exist yet costs nothing and links nowhere. Paste
 * the real profile URL in and it appears in both places at once.
 *
 * Order is the order they appear in the footer.
 */
export type SocialKey = 'instagram' | 'facebook' | 'linkedin' | 'x' | 'tiktok';

/* 2026-09-25: the old guessed handles did not exist, and facebook.com/hirestella
   is an unrelated person's profile, which `sameAs` was telling Google is this
   company. 2026-09-26: Instagram, LinkedIn and X set from the company's own
   accounts, each opened and checked; share-tracking parameters (?stkn=, ?s=21)
   removed. Facebook and TikTok stay empty until real accounts are confirmed.
   Only paste a URL here after opening it and seeing the real account. */
export const SOCIAL: { key: SocialKey; label: string; url: string }[] = [
  { key: 'instagram', label: 'HireStella on Instagram', url: 'https://www.instagram.com/hirestella_ai/' },
  { key: 'facebook', label: 'HireStella on Facebook', url: '' },
  { key: 'linkedin', label: 'HireStella on LinkedIn', url: 'https://www.linkedin.com/company/hirestellaai/' },
  { key: 'x', label: 'HireStella on X', url: 'https://x.com/hirestellaai' },
  { key: 'tiktok', label: 'HireStella on TikTok', url: '' },
];

/** The URLs actually set, for schema.org `sameAs`. */
export const socialUrls = () => SOCIAL.map((s) => s.url).filter(Boolean);
