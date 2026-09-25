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

/* 2026-09-25: all five were emptied after checking each in a browser. The
   Instagram, LinkedIn and X handles did not exist, TikTok could not be
   confirmed as the company's, and facebook.com/hirestella
   is an unrelated person's profile, which `sameAs` was telling Google is this
   company. Only paste a URL here after opening it and seeing the real account. */
export const SOCIAL: { key: SocialKey; label: string; url: string }[] = [
  { key: 'instagram', label: 'HireStella on Instagram', url: '' },
  { key: 'facebook', label: 'HireStella on Facebook', url: '' },
  { key: 'linkedin', label: 'HireStella on LinkedIn', url: '' },
  { key: 'x', label: 'HireStella on X', url: '' },
  { key: 'tiktok', label: 'HireStella on TikTok', url: '' },
];

/** The URLs actually set, for schema.org `sameAs`. */
export const socialUrls = () => SOCIAL.map((s) => s.url).filter(Boolean);
