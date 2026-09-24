import { origin as siteOrigin } from './seo';

/**
 * The origins a form submission may legitimately come from.
 *
 * The check this feeds exists to refuse a cross-site post, and it still does.
 * What it was also refusing was the site itself: `new URL(request.url).origin`
 * is not what the visitor's browser asked for. Under `next dev --hostname
 * 127.0.0.1` Next reports `localhost` there, so a form opened on
 * `http://127.0.0.1:3000` posted an `Origin` the route rejected as foreign and
 * every local submission returned 403. Behind a proxy the same mismatch appears
 * whenever the request URL is rewritten before the handler sees it.
 *
 * The forwarded host is what the browser actually requested, so it is the first
 * accepted answer; the request URL and the configured public origin are the
 * other two. The protocol comes from the forwarded header, falling back to the
 * request's own rather than assuming https, which is what keeps plain http
 * development working. Anything outside this set is still refused.
 *
 * It lives in `lib` rather than in the route because `route.ts` may only export
 * its HTTP methods, and this is logic worth a test of its own: when it is
 * wrong, every lead is silently lost.
 */
export function allowedOrigins(request: {
  url: string;
  headers: { get(name: string): string | null };
}): Set<string> {
  const allowed = new Set<string>();
  const requestUrl = new URL(request.url);
  allowed.add(requestUrl.origin);

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (host) {
    const proto =
      request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ||
      requestUrl.protocol.replace(':', '');
    allowed.add(`${proto}://${host}`);
  }

  const site = siteOrigin();
  if (site) allowed.add(site);

  return allowed;
}

/** True when a request carries no `Origin`, or one this deployment serves. */
export function originAllowed(request: {
  url: string;
  headers: { get(name: string): string | null };
}): boolean {
  const origin = request.headers.get('origin');
  return !origin || allowedOrigins(request).has(origin);
}
