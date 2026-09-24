'use client';

import { useEffect, useRef } from 'react';
import { leadConversion } from '@/lib/telemetry';

/**
 * Raises the lead conversion exactly once per arrival at `/thank-you`.
 *
 * React's development StrictMode mounts every effect twice, and a conversion
 * counted twice is worse than one counted late, so the ref guards it. A visitor
 * who bookmarks the page or reloads it does fire again — that is a property of
 * every destination-URL conversion, and the reason Google Ads should be set to
 * count one conversion per click rather than every conversion.
 */
export function LeadConversion({ source }: { source: string }) {
  const raised = useRef(false);
  useEffect(() => {
    if (raised.current) return;
    raised.current = true;
    leadConversion(source);
  }, [source]);
  return null;
}
