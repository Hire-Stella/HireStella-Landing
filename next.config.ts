import type { NextConfig } from 'next';

const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/solutions', destination: '/industries', permanent: true },
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
       of the X-Frame-Options header kept below for older browsers. */
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://maps.google.com",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src https://www.google.com https://maps.google.com",
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
          /* Nothing on this site needs a camera, a microphone or a location,
             so every page says so rather than leaving it to the browser. */
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};
export default config;
