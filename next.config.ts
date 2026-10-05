import type { NextConfig } from 'next';

const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/solutions', destination: '/industries', permanent: true },
      /* 2026-10-01: /use-cases was merged into the industries overview. */
      { source: '/use-cases', destination: '/industries#use-cases', permanent: true },
      /* 2026-09-13: Meet Stella replaced twelve pages. Each one is live and
         indexed, so each moves permanently into the section that replaced it. */
      { source: '/workforce', destination: '/stella#workforce', permanent: true },
      { source: '/workforce/:specialist', destination: '/stella#workforce', permanent: true },
      { source: '/how-it-works', destination: '/stella#how-it-works', permanent: true },
      { source: '/dashboard', destination: '/stella#dashboard', permanent: true },
      /* 2026-09-13: clinics and hospitals became one Healthcare sector, and
         banking & finance became Financial services. Every old URL is live and
         indexed, so each one moves permanently rather than 404ing. */
      { source: '/industries/clinics', destination: '/industries/healthcare', permanent: true },
      { source: '/industries/clinics/dental', destination: '/industries/healthcare/dental', permanent: true },
      { source: '/industries/clinics/:segment', destination: '/industries/healthcare/:segment', permanent: true },
      { source: '/industries/hospitals', destination: '/industries/healthcare', permanent: true },
      { source: '/industries/hospitals/:segment', destination: '/industries/healthcare/:segment', permanent: true },
      { source: '/industries/banking-finance', destination: '/industries/financial-services', permanent: true },
      { source: '/industries/banking-finance/financial-services', destination: '/industries/financial-services/advisory', permanent: true },
      { source: '/industries/banking-finance/:segment', destination: '/industries/financial-services/:segment', permanent: true },
      { source: '/solutions/dental', destination: '/industries/healthcare/dental', permanent: true },
      { source: '/solutions/real-estate', destination: '/industries/real-estate', permanent: true },
      { source: '/solutions/banking', destination: '/industries/financial-services', permanent: true },
    ];
  },
  async headers() {
    /* Content-Security-Policy, added 2026-09-22 alongside the contact map.
       The map is the first third-party origin this site embeds, so the policy
       is written once, here, rather than per page.

       `script-src` keeps 'unsafe-inline' because the theme bootstrap and the
       JSON-LD blocks are inline by design: the theme script has to run before
       first paint to avoid a flash, and nonces would make every page dynamic.
       The allowlist still blocks the case that matters, which is a script
       injected from an origin we do not name here.

       `frame-src` names Google Maps only, so the click-to-load embed works and
       nothing else can be framed. `frame-ancestors 'none'` is the modern form
       of the X-Frame-Options header kept below for older browsers.

       Two later features load third parties and are named here too, or the
       policy blocks them silently. Voice Stella loads the Dograh widget from
       its endpoint, then opens a WebSocket back to it for signaling. The
       analytics load GTM (which pulls in GA4 and Google Ads) and the Meta
       Pixel.

       2026-10-05: GA4's main collect endpoint is the bare analytics.google.com,
       which `*.analytics.google.com` does not match, and Ads conversions go to
       ad.doubleclick.net, outside `*.g.doubleclick.net`; both were blocked.
       Remarketing pings go to the visitor's regional Google domain, which a
       CSP cannot wildcard, so the markets that matter are listed. */
    const voice = new URL(process.env.NEXT_PUBLIC_DOGRAH_ENDPOINT || 'https://voice.hirestella.ai').origin;
    const voiceWs = voice.replace(/^http/, 'ws');
    const googleRegions = ['ae', 'co.in', 'com.sa', 'com.qa', 'com.kw', 'com.om', 'com.bh', 'co.uk']
      .map((tld) => `https://www.google.${tld}`)
      .join(' ');
    const google = `https://*.googletagmanager.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.doubleclick.net https://www.googleadservices.com https://www.google.com ${googleRegions}`;
    /* The two gateway hosts are the Pixel's Conversions API Gateway, named as
       its "openbridge" endpoint and fallback in Meta's own config for this
       Pixel (connect.facebook.net/signals/config/<id>). If the gateway is ever
       redeployed its hostname changes, and this list must follow. */
    const meta =
      'https://connect.facebook.net https://www.facebook.com https://xd-f1cf3d4fdb19408ea770fc6f80817dcb.ecs.us-east-1.on.aws https://bded8a3c6ae-1-1053047382554.us-central1.run.app';
    /* React's development build calls eval() to rebuild stack frames, so
       `next dev` breaks without this. Development only: the production bundle
       never evals, so the shipped policy stays strict. */
    const devOnly = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '';
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${devOnly} ${voice} ${google} ${meta}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://maps.google.com ${google} ${meta}`,
      "font-src 'self' data:",
      `connect-src 'self' ${voice} ${voiceWs} ${google} ${meta}`,
      "frame-src https://www.google.com https://maps.google.com https://*.googletagmanager.com https://td.doubleclick.net",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy', value: csp },
          /* Voice Stella needs the microphone, on this origin only. Nothing
             needs a camera or a location, so every page says so rather than
             leaving it to the browser. */
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};
export default config;
