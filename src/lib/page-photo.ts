/**
 * One photograph per industry and per segment.
 *
 * Each frame was shot to the page it sits on: the clinics photograph is a
 * closed reception with one lit handset because the clinics page opens on
 * *the call reception cannot reach*; the multispecialty photograph is a
 * corridor of identical closed doors with one ajar because that page says
 * *one number, eleven departments behind it*. The band is placed directly
 * under the problem it illustrates, which is the only place it earns its
 * height.
 *
 * The alt text describes the photograph, never the claim. These are stock
 * environments, not HireStella customers, and nothing here is evidence.
 */

export type PagePhoto = { src: string; alt: string; caption: string };

const P = (file: string, alt: string, caption: string): PagePhoto => ({
  src: `/visuals/photo/${file}.webp`,
  alt,
  caption,
});

export const pagePhotos: Record<string, PagePhoto> = {
  /* ── industries ── */
  healthcare: P(
    'healthcare',
    'A clinic reception at dusk, the desk empty and a single telephone lit on the counter.',
    'The front desk after hours. The enquiry still arrives; there is nobody at the counter to take it.',
  ),
  /*
   * NOT hospitals.webp. That frame came back with legible wayfinding signage
   * and an invented 'Mercy Health' logo on the reception wall, plus a staff
   * member at the desk. An invented healthcare brand on a HireStella page
   * implies a customer that does not exist, so it is not shippable; the file
   * stays on disk unreferenced until it is regenerated. The enterprise
   * hospital frame stands in and is the same idea: one lit desk, empty floor.
   */
  'real-estate': P(
    'real-estate',
    'A residential tower at night with a single window lit high on the facade.',
    'One enquiry, late, from a building where everyone else has gone home.',
  ),
  'financial-services': P(
    'financial-services',
    'A private banking hall at blue hour with a long counter and one position still lit.',
    'The routine questions fill the counter. The complex case is waiting behind them.',
  ),
  automotive: P(
    'automotive',
    'An automotive campus at blue hour, the service bay dark and the showroom lit across a wet forecourt.',
    'Rental, workshop and showroom on one site, and a customer who is a new enquiry in all three.',
  ),

  /* ── clinics segments ── */
  'healthcare-dental': P(
    'healthcare-dental',
    'A dental surgery in shadow beyond an open door, with a lit telephone on the counter in front of it.',
    'Reception is with a patient. The phone is not being answered by anyone.',
  ),
  'healthcare-eye': P(
    'healthcare-eye',
    'An ophthalmic examination room at dusk with a phoropter in the foreground and a lit acuity chart behind.',
    'A routine sight test and a sudden change in vision arrive on the same telephone line.',
  ),
  'healthcare-aesthetic': P(
    'healthcare-aesthetic',
    'An aesthetic clinic consultation room at dusk, two chairs and one lit floor lamp.',
    'The consultation is where the decision is made. Getting someone into this room is the whole job.',
  ),
  'healthcare-multispecialty': P(
    'healthcare-multispecialty',
    'A clinic corridor of identical closed doors with one door open and lit.',
    'One number, and a row of departments behind it. The hard part is knowing which door.',
  ),

  /* ── hospitals segments ── */
  'healthcare-enterprise': P(
    'healthcare-enterprise',
    'A hospital outpatient floor at blue hour, the waiting zones empty and the reception desk lit.',
    'Most of what reaches this desk is not clinical. It queues with the part that is.',
  ),
  'healthcare-groups': P(
    'healthcare-groups',
    'An aerial view at blue hour of three separate hospital buildings, each with a lit entrance.',
    'Several sites, several front desks, and a patient who does not know which one to call.',
  ),

  /* ── real estate segments ── */
  'real-estate-companies': P(
    'real-estate-companies',
    'A property sales office at night, dark except for one desk lit beside a scale model of a tower.',
    'The lead arrives at eleven. Whoever answers it first books the viewing.',
  ),
  'real-estate-consultancies': P(
    'real-estate-consultancies',
    'An advisory meeting room at blue hour with site plans open on a long table under one pendant.',
    'Consultant time is the scarce resource. It should not be spent qualifying on the telephone.',
  ),

  /* ── banking segments ── */
  'financial-services-banks': P(
    'financial-services-banks',
    'A bank service floor at blue hour, the counter closed and one consultation room lit behind it.',
    'Most calls are status. The ones that need a person are the ones waiting longest.',
  ),
  'financial-services-advisory': P(
    'financial-services-advisory',
    'A desk at blue hour with stacks of document folios, one shorter stack lit by a lamp.',
    'The file that is still short is the one somebody has to chase.',
  ),

  /* ── automotive segments ── */
  'automotive-rental': P(
    'automotive-rental',
    'A covered rental deck at blue hour, every bay filled except one lit empty space.',
    'Availability decides it. The customer books whoever confirms a vehicle for their dates first.',
  ),
  'automotive-service': P(
    'automotive-service',
    'A workshop at dusk with vehicles on lifts and a lit telephone on the service counter.',
    'The advisor cannot be under a car and on the phone at the same time.',
  ),
  'automotive-dealerships': P(
    'automotive-dealerships',
    'A glazed showroom at night with one car lit inside and its reflection on a wet forecourt.',
    'The enquiry converts when it becomes a test drive. Everything before that can stall.',
  ),
};

/** Segment pages key on `group-segment`; the parent pages key on the group. */
export function photoFor(group: string, segment?: string) {
  return (segment ? pagePhotos[`${group}-${segment}`] : undefined) ?? pagePhotos[group];
}
