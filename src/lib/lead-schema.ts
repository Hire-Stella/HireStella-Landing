import { z } from 'zod';

/* The site's CSP has no 'unsafe-eval'. Zod 4 otherwise probes `new Function`
   to decide whether it can compile validators, and even though the probe's
   throw is caught, Chrome logs the blocked eval as a CSP issue on every page
   that loads a form, which Lighthouse scores against Best Practices. */
z.config({ jitless: true });

/** §9.1 — the attribution question the framework asks every commercial form to carry. */
export const HEARD_FROM = [
  'Google search',
  'Referral',
  'LinkedIn',
  'Instagram',
  'Event or conference',
  'Other',
] as const;

export const PARTNER_TYPES = [
  'Individual consultant',
  'Agency',
  'Reseller or distributor',
  'Technology partner',
  'Other',
] as const;

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  company: z.string().trim().min(2).max(160),
  problem: z.string().trim().min(10).max(2000),
  consent: z.literal(true),
  website: z.string().max(0),
});
export type LeadInput = z.infer<typeof leadSchema>;

/** The demo modal. Attribution is captured; the referrer name stays optional. */
export const demoSchema = z.object({
  kind: z.literal('demo').default('demo'),
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  company: z.string().trim().min(2).max(160),
  problem: z.string().trim().min(10).max(2000),
  heardFrom: z.enum(['', ...HEARD_FROM]).optional().default(''),
  referral: z.string().trim().max(160).optional().default(''),
  consent: z.literal(true),
  website: z.string().max(0),
});
export type DemoInput = z.infer<typeof demoSchema>;

/** Partner applications. A different conversation, so a different shape. */
/** Free text produced unusable answers; these are the markets we operate in. */
export const PARTNER_MARKETS = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Kuwait, Oman or Bahrain',
  'Wider Middle East',
  'South Asia',
  'Southeast Asia',
  'Europe',
  'North America',
  'Africa',
  'Elsewhere',
] as const;

/** "Roughly how many, and what size" asked two things and got neither. */
export const CLIENT_BANDS = [
  'Under 10',
  '10 to 25',
  '25 to 50',
  '50 to 100',
  'More than 100',
] as const;

export const partnerSchema = z.object({
  kind: z.literal('partner').default('partner'),
  partnerType: z.enum(PARTNER_TYPES),
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  company: z.string().trim().min(2).max(160),
  site: z.string().trim().max(200).optional().default(''),
  country: z.string().trim().min(2).max(80),
  clients: z.string().trim().max(200).optional().default(''),
  sectors: z.string().trim().max(300).optional().default(''),
  why: z.string().trim().min(10).max(2000),
  consent: z.literal(true),
  website: z.string().max(0),
});
export type PartnerInput = z.infer<typeof partnerSchema>;
