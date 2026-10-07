/* The ads landing page's form (hirestella.ai/get). Separate from /api/leads
   because it asks for a WhatsApp number instead of an email, and its team
   email carries the ad click parameters. Same Resend variables as the site. */
export { POST } from '@/lib/ads-lead/lead.js';
