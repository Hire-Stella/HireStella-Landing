/* Free demo slots for the next weeks, read live from the HireStella calendar. */
import { offeredSlots } from '@/lib/booking/service';
import { BOOKING } from '@/lib/booking/config';
import { failure, reply } from '@/lib/booking/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { configured, slots, booked } = await offeredSlots();
    return reply(200, { configured, slots, booked, lengthMinutes: BOOKING.lengthMinutes, timeZone: BOOKING.timeZone });
  } catch (error) {
    return failure(error);
  }
}
