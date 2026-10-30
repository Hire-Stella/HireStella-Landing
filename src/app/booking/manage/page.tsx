import type { Metadata } from 'next';
import { ManageBooking } from '@/components/manage-booking';

/* Reached only from the link in a booking email. Never indexed. */
export const metadata: Metadata = {
  title: 'Your demo booking',
  description: 'Reschedule or cancel your HireStella demo.',
  robots: { index: false, follow: false },
  alternates: undefined,
};

export default async function ManageBookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.t === 'string' ? params.t : '';
  return (
    <main id="main" className="sec">
      <div className="wrap" style={{ maxWidth: 640 }}>
        <ManageBooking token={token} />
      </div>
    </main>
  );
}
