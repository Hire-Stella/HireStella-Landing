import type { HeroScene } from '@/components/hero-visual';

export const pageScenes: Record<string, HeroScene> = {
  'Meet Stella': 'manager', 'The specialist workforce': 'workforce', 'How it works': 'journey',
  Solutions: 'industry', Integrations: 'integrations', 'Human boundary': 'human', 'Security & trust': 'security',
  'About HireStella': 'company', 'Our approach': 'company', 'ROI calculator': 'capacity', 'Dashboard demo': 'dashboard',
  'Workspace access': 'dashboard', 'Plan a consultation': 'contact', Contact: 'contact',
};
export const specialistScenes: Record<string, HeroScene> = {
  'front-desk': 'conversation', voice: 'voice', website: 'website', booking: 'booking', admin: 'records', marketing: 'growth', social: 'conversation', 'outbound-followup': 'growth',
};
