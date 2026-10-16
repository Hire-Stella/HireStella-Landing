import { NextResponse } from 'next/server';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { originAllowed } from '@/lib/request-origin';
import {
  BRIEF_SYSTEM,
  briefAnswerSchema,
  briefJsonSchema,
  briefRequestSchema,
} from '@/lib/stella-brief';

/**
 * The hero's live answer: one visitor brief in, one workforce draft out.
 *
 * Every failure answers with an error status and nothing else, because the
 * hero already has a local answer for any brief (the keyword router). The
 * visitor never sees this route fail — they see the preset example instead.
 */

export const maxDuration = 15;

const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const TIMEOUT_MS = 9000;

/* Per-instance limiter. Not shared across serverless instances, so it is a
   brake on one visitor hammering the button, not a billing guarantee. */
const WINDOW_MS = 60_000;
const PER_WINDOW = 8;
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > PER_WINDOW;
}

let client: GoogleGenAI | null = null;

export async function POST(request: Request) {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  if (!originAllowed(request))
    return NextResponse.json({ error: 'Origin not allowed.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json'))
    return NextResponse.json({ error: 'JSON required.' }, { status: 415 });

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  if (limited(ip)) return NextResponse.json({ error: 'Slow down.' }, { status: 429 });

  const raw = await request.text();
  if (raw.length > 4000) return NextResponse.json({ error: 'Too large.' }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  const parsed = briefRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Brief required.' }, { status: 400 });

  client ??= new GoogleGenAI({ apiKey: key });
  try {
    const res = await client.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [{ text: parsed.data.brief }] }],
      config: {
        systemInstruction: BRIEF_SYSTEM,
        responseMimeType: 'application/json',
        responseJsonSchema: briefJsonSchema,
        temperature: 0.4,
        /* Low thinking: with the default, a reply spent 600+ tokens and ~5s
           thinking, and Arabic briefs ran out of room mid-JSON. */
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        maxOutputTokens: 1500,
        abortSignal: AbortSignal.timeout(TIMEOUT_MS),
      },
    });
    const answer = briefAnswerSchema.safeParse(JSON.parse(res.text ?? ''));
    if (!answer.success) {
      console.warn('stella-brief: reply failed validation', answer.error.issues[0]);
      return NextResponse.json({ error: 'Unusable reply.' }, { status: 502 });
    }
    /* De-duplicate in case the model repeats a specialist. */
    const out =
      answer.data.understood ? { ...answer.data, specialists: [...new Set(answer.data.specialists)] } : answer.data;
    return NextResponse.json(out, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.warn('stella-brief: model call failed', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Model unavailable.' }, { status: 502 });
  }
}
