/* Book a demo: the details plus a chosen slot. Without a slot the form posts to
   /api/leads (main site) or /api/get-lead (/get) as a callback request instead. */
import { originAllowed } from '@/lib/request-origin';
import { book, bookingSchema } from '@/lib/booking/service';
import { failure, readJson, reply, siteOrigin } from '@/lib/booking/http';

export async function POST(request: Request) {
  if (!originAllowed(request)) return reply(403, { error: 'Origin not allowed.' });
  const body = await readJson(request);
  if (!body) return reply(400, { error: 'Please check the details.' });
  /* Honeypot: a person never fills the hidden field. Answer as if it worked. */
  if (typeof body.website === 'string' && body.website) return reply(200, { booked: true });
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return reply(400, { error: 'Please check the details.' });
  try {
    return reply(200, { booked: true, ...(await book(parsed.data, siteOrigin(request))) });
  } catch (error) {
    return failure(error);
  }
}
