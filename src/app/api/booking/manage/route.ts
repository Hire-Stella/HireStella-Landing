/* The guest's "manage your booking" link: see it, move it, cancel it. The
   signed token in the link is the only key; it opens that one booking. */
import { originAllowed } from '@/lib/request-origin';
import { bookingDetails, cancel, reschedule, slotsForMove } from '@/lib/booking/service';
import { failure, readJson, reply, siteOrigin } from '@/lib/booking/http';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('t');
  try {
    const details = await bookingDetails(token);
    const slots = details.past ? [] : await slotsForMove(token);
    return reply(200, { ...details, slots });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  if (!originAllowed(request)) return reply(403, { error: 'Origin not allowed.' });
  const body = await readJson(request, 2000);
  if (!body) return reply(400, { error: 'Invalid request.' });
  try {
    if (body.action === 'cancel') return reply(200, await cancel(body.token));
    if (body.action === 'reschedule' && typeof body.start === 'string')
      return reply(200, await reschedule(body.token, body.start, siteOrigin(request)));
    return reply(400, { error: 'Invalid request.' });
  } catch (error) {
    return failure(error);
  }
}
