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
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};
export default config;
