import { NextResponse } from 'next/server';
import { leadSchema, demoSchema, partnerSchema } from '@/lib/lead-schema';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json({ error: 'Origin not allowed.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json'))
    return NextResponse.json({ error: 'JSON required.' }, { status: 415 });
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook || !webhook.startsWith('https://'))
    return NextResponse.json(
      { error: 'Consultation delivery is not configured.' },
      { status: 503 },
    );
  try {
    // Bound the body while reading it, including requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: 'Details required.' }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 16000) {
        await reader.cancel();
        return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
      }
      chunks.push(chunk.value);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
    // one endpoint, three shapes: consultation, demo request, partner application
    const parsed =
      body?.kind === 'partner'
        ? partnerSchema.safeParse(body)
        : body?.kind === 'demo' || 'heardFrom' in (body ?? {})
          ? demoSchema.safeParse(body)
          : leadSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: 'Please check the request details.' }, { status: 400 });
    const { website: _honeypot, ...details } = parsed.data;
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.LEAD_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        ...details,
        source: 'hirestella-website',
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
      redirect: 'error',
    });
    if (!response.ok)
      return NextResponse.json(
        { error: 'Delivery unavailable. Please try again.' },
        { status: 502 },
      );
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'The request could not be delivered.' }, { status: 400 });
  }
}
