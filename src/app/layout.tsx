import type { Metadata } from 'next';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import './reset.css';
import '../styles/system.css';
import '../styles/shell.css';
import '../styles/home.css';
import '../styles/widget.css';
import '../styles/modal.css';
import '../styles/workspace.css';
import { Header, Footer } from '@/components/shell';
import { StellaWidget } from '@/components/stella-widget';
import { DemoModal } from '@/components/demo-modal';
import { SiteBehavior, themeBootstrap } from '@/components/site-behavior';
import { Ld } from '@/components/system';
import { organizationLd, websiteLd, origin as siteOrigin } from '@/lib/seo';

export const metadata: Metadata = {
  title: { default: 'HireStella | Capacity, coordinated.', template: '%s | HireStella' },
  description:
    'One AI General Manager. Eight connected AI Specialists. Tell Stella what is slowing your business down and explore the workforce built to move it forward.',
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    siteName: 'HireStella',
    title: 'HireStella | Capacity, coordinated.',
    description:
      'One AI General Manager. A connected AI Specialist Workforce. Start with your business.',
  },
  icons: {
    /* The dark symbol is the mark. The light one is served only to browsers
       drawing dark chrome, where a dark mark would vanish. */
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/favicon-512.png', sizes: '512x512', type: 'image/png' },
      {
        url: '/icons/favicon-32-light.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icons/favicon-48-light.png',
        sizes: '48x48',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: [{ url: '/icons/favicon-180.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/icons/favicon-32.png'],
  },
  manifest: '/site.webmanifest',
  twitter: { card: 'summary_large_image' },
  alternates: siteOrigin() ? { canonical: '/' } : undefined,
  robots: { index: true, follow: true },
  ...(siteOrigin() ? { metadataBase: new URL(siteOrigin()) } : {}),
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#141B45" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <Ld data={[organizationLd(), websiteLd()]} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* One painted field behind the whole site. Static, so scrolling costs nothing. */}
        <div className="hs-field" aria-hidden="true" />
        <Header />
        {children}
        <Footer />
        <StellaWidget />
        <DemoModal configured={Boolean(process.env.LEAD_WEBHOOK_URL)} />
        <SiteBehavior />
      </body>
    </html>
  );
}
