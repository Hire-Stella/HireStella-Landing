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

export const SOCIAL: { key: SocialKey; label: string; url: string }[] = [
  { key: 'instagram', label: 'HireStella on Instagram', url: 'https://www.instagram.com/hirestella' },
  { key: 'facebook', label: 'HireStella on Facebook', url: 'https://www.facebook.com/hirestella' },
  { key: 'linkedin', label: 'HireStella on LinkedIn', url: 'https://www.linkedin.com/company/hirestella' },
  { key: 'x', label: 'HireStella on X', url: 'https://x.com/hirestella' },
  { key: 'tiktok', label: 'HireStella on TikTok', url: 'https://www.tiktok.com/@hirestella' },
];

/** The URLs actually set, for schema.org `sameAs`. */
export const socialUrls = () => SOCIAL.map((s) => s.url).filter(Boolean);
