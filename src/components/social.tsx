import { SOCIAL, type SocialKey } from '@/lib/social';

/**
 * The brand glyphs, drawn here rather than imported.
 *
 * lucide-react removed every brand icon at v1 (trademark), and this project is
 * on 1.42.0, so Instagram, Facebook, LinkedIn, X and TikTok simply do not exist
 * in the icon set the rest of the site uses. Adding a second icon package for
 * five glyphs would ship a whole dependency for five paths, so the paths are
 * inline.
 *
 * They are solid marks on `currentColor`, which is why they sit on a filled
 * path rather than the 1.5px stroke the lucide icons use: a brand mark rendered
 * as an outline stops being the brand mark.
 */
const GLYPHS: Record<SocialKey, React.ReactNode> = {
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.6" cy="6.4" r="1.25" fill="currentColor" />
    </>
  ),
  facebook: (
    <path
      fill="currentColor"
      d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M20.45 2H3.55A1.53 1.53 0 0 0 2 3.51v16.98A1.53 1.53 0 0 0 3.55 22h16.9A1.53 1.53 0 0 0 22 20.49V3.51A1.53 1.53 0 0 0 20.45 2ZM8.05 18.75H5.1V9.5h2.95v9.25ZM6.58 8.2a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.37 10.55H16V14.2c0-1.07-.02-2.45-1.5-2.45s-1.73 1.17-1.73 2.37v4.63H9.82V9.5h2.83v1.27h.04a3.1 3.1 0 0 1 2.79-1.53c2.98 0 3.53 1.96 3.53 4.52v5Z"
    />
  ),
  x: (
    <path
      fill="currentColor"
      d="M17.53 3h3.06l-6.69 7.64L21.75 21h-6.16l-4.83-6.3L5.24 21H2.17l7.15-8.17L2.25 3h6.32l4.36 5.77L17.53 3Zm-1.07 16.17h1.7L7.6 4.74H5.78l10.68 14.43Z"
    />
  ),
  tiktok: (
    <path
      fill="currentColor"
      d="M16.6 2h-3.02v13.4a2.36 2.36 0 1 1-1.7-2.27V10.0a5.45 5.45 0 1 0 4.72 5.4V8.9a6.4 6.4 0 0 0 3.65 1.15V7.02A3.55 3.55 0 0 1 16.6 3.5V2Z"
    />
  ),
};

/**
 * The social row in the footer.
 *
 * Only renders a link for a profile that actually has a URL, so an account the
 * business has not opened yet is simply absent rather than a dead link. If none
 * are set the whole row disappears and the footer looks exactly as it did.
 */
export function SocialLinks() {
  const live = SOCIAL.filter((s) => s.url);
  if (!live.length) return null;
  return (
    <ul className="foot-social" aria-label="HireStella on social media">
      {live.map((s) => (
        <li key={s.key}>
          <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              {GLYPHS[s.key]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
