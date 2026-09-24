import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCapacity, defaultCapacity, workforcePreview } from '../src/lib/logic';
import { plans } from '../src/lib/data';
import { leadSchema } from '../src/lib/lead-schema';
import { originAllowed } from '../src/lib/request-origin';

test('commercial reference remains exact across all commitments', () => {
  assert.deepEqual(
    plans.map((p) => Object.values(p.prices)),
    [
      [1499, 999, 799],
      [1799, 1399, 1099],
      [1999, 1599, 1299],
    ],
  );
  assert.deepEqual(
    plans.map((p) => p.minutes),
    [150, 250, 500],
  );
});
test('capacity estimates use monthly hours and explicitly assumed automation', () => {
  const result = calculateCapacity(defaultCapacity);
  assert.ok(Math.abs(result.monthlyHours - 86.6) < 0.0001);
  assert.ok(Math.abs(result.hoursReturned - 34.64) < 0.0001);
  assert.ok(Math.abs(result.capacityValue - 2078.4) < 0.0001);
  assert.equal(result.cost, 799);
  assert.equal(result.contribution, 180);
  assert.ok(Math.abs(result.benefit - 1459.4) < 0.0001);
});
test('overage charges only minutes above the selected plan allowance', () => {
  assert.equal(calculateCapacity({ ...defaultCapacity, voiceMinutes: 149 }).overage, 0);
  assert.equal(calculateCapacity({ ...defaultCapacity, voiceMinutes: 150 }).overage, 0);
  assert.equal(calculateCapacity({ ...defaultCapacity, voiceMinutes: 200 }).overage, 25);
  assert.equal(calculateCapacity({ ...defaultCapacity, voiceMinutes: 200, plan: 1 }).overage, 0);
  assert.equal(calculateCapacity({ ...defaultCapacity, voiceMinutes: 550, plan: 2 }).overage, 25);
});
test('zero activity returns no capacity and can show a negative benefit', () => {
  const result = calculateCapacity({ ...defaultCapacity, weeklyHours: 0, enquiries: 0 });
  assert.equal(result.hoursReturned, 0);
  assert.equal(result.benefit, -799);
  assert.equal(result.roi, -100);
});
test('monthly cost includes user-entered fees and the chosen commitment', () => {
  const result = calculateCapacity({
    ...defaultCapacity,
    plan: 1,
    term: 'six',
    providerFees: 70,
    setupCost: 100,
    voiceMinutes: 270,
  });
  assert.equal(result.cost, 1579);
});
test('scenario preview preserves clinical human boundaries', () => {
  const result = workforcePreview('Our dental clinic misses calls while we are with patients.');
  assert.ok(result.ids.includes('voice'));
  assert.ok(result.ids.includes('booking'));
  assert.match(result.boundary, /clinical team/);
  assert.equal(new Set(result.ids).size, result.ids.length);
});
test('unknown business input uses a clearly bounded starting configuration', () => {
  const result = workforcePreview('We need help with marketing campaigns and a new website.');
  assert.ok(result.ids.includes('marketing'));
  assert.ok(result.ids.includes('website'));
  assert.equal(result.industry, 'Your business');
});
test('consultation validation requires consent and rejects honeypot submissions', () => {
  const valid = {
    name: 'Demo User',
    email: 'demo@example.com',
    company: 'Demo Business',
    problem: 'Our clinic misses incoming calls.',
    plan: 'Starter',
    term: 'annual',
    consent: true,
    website: '',
  };
  assert.equal(leadSchema.safeParse(valid).success, true);
  assert.equal(leadSchema.safeParse({ ...valid, consent: false }).success, false);
  assert.equal(leadSchema.safeParse({ ...valid, website: 'spam' }).success, false);
  assert.equal(leadSchema.safeParse({ ...valid, problem: 'short' }).success, false);
  assert.equal(leadSchema.safeParse({ ...valid, email: 'invalid' }).success, false);
});

/* The origin check on /api/leads. It had been comparing the browser's Origin
   against `new URL(request.url).origin`, which is not the same value behind a
   proxy or under `next dev --hostname 127.0.0.1`, so the site was refusing its
   own submissions. Every case below is a way to lose leads silently. */
const asRequest = (url: string, headers: Record<string, string>) => ({
  url,
  headers: { get: (name: string) => headers[name.toLowerCase()] ?? null },
});

test('lead submissions are accepted from the host the browser actually requested', () => {
  /* The dev case: Next reports localhost in request.url, the browser is on 127.0.0.1. */
  assert.equal(
    originAllowed(
      asRequest('http://localhost:3000/api/leads', {
        origin: 'http://127.0.0.1:3000',
        host: '127.0.0.1:3000',
      }),
    ),
    true,
  );
  /* The proxied production case: the handler sees an internal URL. */
  assert.equal(
    originAllowed(
      asRequest('http://internal.vercel/api/leads', {
        origin: 'https://hirestella.ai',
        'x-forwarded-host': 'hirestella.ai',
        'x-forwarded-proto': 'https',
      }),
    ),
    true,
  );
  /* A request with no Origin at all is not a cross-site post. */
  assert.equal(originAllowed(asRequest('https://hirestella.ai/api/leads', {})), true);
});

test('lead submissions are refused from any other origin', () => {
  assert.equal(
    originAllowed(
      asRequest('https://hirestella.ai/api/leads', {
        origin: 'https://evil.example.com',
        'x-forwarded-host': 'hirestella.ai',
        'x-forwarded-proto': 'https',
      }),
    ),
    false,
  );
  /* A forwarded host must not be readable as permission for a different one. */
  assert.equal(
    originAllowed(
      asRequest('https://hirestella.ai/api/leads', {
        origin: 'https://hirestella.ai.evil.example.com',
        'x-forwarded-host': 'hirestella.ai',
        'x-forwarded-proto': 'https',
      }),
    ),
    false,
  );
});
