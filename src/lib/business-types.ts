/**
 * The businesses each sector actually covers.
 *
 * This is the target taxonomy as the business defines it, not a route map.
 * Most of these are a line of copy on their sector page; the ones carrying a
 * `page` have a workflow page of their own and the card links to it. Adding a
 * business type here costs nothing; giving it a page is a content decision,
 * because a page with nothing specific to say is worse than a line that does.
 *
 * Each note says what is different about coordinating for that business, so
 * the list reads as knowledge rather than as a directory.
 */

export type BusinessType = {
  name: string;
  note: string;
  /** segment page id, where this type has a page of its own */
  page?: string;
};

export const businessTypes: Record<string, BusinessType[]> = {
  healthcare: [
    { name: 'Dental clinics', note: 'Missed calls, consultation bookings, reminders and recall follow-ups.', page: 'dental' },
    { name: 'Aesthetic clinics', note: 'High-consideration enquiries where the consultation is the commercial moment.', page: 'aesthetic' },
    { name: 'Dermatology clinics', note: 'Condition questions that must reach a clinician, separated from booking traffic.' },
    { name: 'Medical centres & polyclinics', note: 'One number fronting many departments and consultant schedules.', page: 'multispecialty' },
    { name: 'Physiotherapy & rehabilitation', note: 'Course-of-treatment bookings, where the value is in the visits after the first one.' },
    { name: 'Wellness clinics', note: 'Programme enquiries and package questions answered from approved content.' },
    { name: 'Ophthalmology & eye clinics', note: 'Routine testing and urgent symptoms arriving on the same line.', page: 'eye' },
    { name: 'Hospitals', note: 'A switchboard problem: most calls are not clinical but queue with the ones that are.', page: 'enterprise' },
    { name: 'Hospital groups', note: 'Several sites, several front desks, one patient who does not know which to call.', page: 'groups' },
  ],

  automotive: [
    { name: 'New car dealerships', note: 'Enquiries convert when they become a test drive, not a brochure.', page: 'dealerships' },
    { name: 'Used car dealerships', note: 'Stock moves fast, so an unanswered enquiry is usually a sold car.' },
    { name: 'Luxury & premium dealerships', note: 'Fewer enquiries, each worth answering properly and personally.' },
    { name: 'Automotive service centres', note: 'Advisors cannot be under a car and on the phone at once.', page: 'service' },
    { name: 'Car rental companies', note: 'Availability decides it: the first supplier to confirm dates takes the booking.', page: 'rental' },
  ],

  'real-estate': [
    { name: 'Residential agencies', note: 'Portal leads arrive after hours and go to whoever replies first.', page: 'companies' },
    { name: 'Luxury agencies', note: 'Low volume, high value, and no lead you can afford to answer late.' },
    { name: 'Property developers', note: 'Launch campaigns create a spike no sales office is staffed for.' },
    { name: 'Commercial agencies', note: 'Longer cycles, more stakeholders, and a qualifying call that never gets made.' },
    { name: 'Property management', note: 'Tenant requests and maintenance reports arriving on every channel at once.', page: 'consultancies' },
  ],

  hospitality: [
    { name: 'Hotels', note: 'Direct booking questions competing with the channel that already answered.' },
    { name: 'Resorts', note: 'Long-lead enquiries about dates, packages and transfers, mostly from other time zones.' },
    { name: 'Serviced apartments', note: 'Extended-stay enquiries that need availability and terms before anything else.' },
    { name: 'Restaurants & restaurant groups', note: 'Reservation and large-party requests at exactly the hour the floor is full.' },
    { name: 'Events & banquet venues', note: 'One enquiry, a dozen questions, and a site visit that decides it.' },
  ],

  education: [
    { name: 'Private schools', note: 'Admissions enquiries at night, tours in the day, a decision six weeks long.', page: 'schools' },
    { name: 'Universities', note: 'Programme and entry-requirement questions at volume, against an intake deadline.' },
    { name: 'Colleges', note: 'Course matching and enrolment paperwork that stalls without a chase.', page: 'training' },
  ],

  'financial-services': [
    { name: 'Insurance brokers', note: 'Quote requests that need qualifying before an adviser should touch them.' },
    { name: 'Insurance companies', note: 'Policy and claim status questions filling the queue a real claim sits in.', page: 'banks' },
    { name: 'Mortgage brokers', note: 'Document collection and the chasing that decides whether a case completes.', page: 'advisory' },
    { name: 'Wealth management firms', note: 'Adviser time is the scarce resource and should not be spent on scheduling.' },
    { name: 'Lending & finance companies', note: 'Application status, all day, on every channel.' },
    { name: 'Fintech companies', note: 'Support volume that scales with signups and never with headcount.' },
    { name: 'Payment service providers', note: 'Merchant questions where the answer is in a system nobody wants to open.' },
    { name: 'Credit & loan providers', note: 'Eligibility questions answered from published criteria, decisions left to people.' },
  ],

  'home-services': [
    { name: 'Home maintenance companies', note: 'The phone rings while every technician is already on a job.', page: 'maintenance' },
    { name: 'Cleaning companies', note: 'A recurring diary that only works if every change reaches it.', page: 'cleaning' },
    { name: 'Home renovation companies', note: 'Long enquiries that need qualifying before a surveyor is sent anywhere.' },
    { name: 'Interior design companies', note: 'Consultation enquiries where the brief matters more than the speed.' },
  ],

  travel: [
    { name: 'Travel agencies', note: 'Itinerary questions arriving at all hours from several time zones.' },
    { name: 'Visa & immigration services', note: 'The same eligibility and document questions, endlessly, before any real case.' },
  ],

  'professional-services': [
    { name: 'Recruitment agencies', note: 'Candidate and client enquiries competing for the same consultant hour.' },
    { name: 'Legal firms', note: 'Enquiries that must be qualified and conflict-checked before a lawyer sees them.' },
    { name: 'Accounting firms', note: 'Deadline-driven document chasing that repeats every quarter.' },
    { name: 'Business consultancies', note: 'Scoping calls that decide whether an enquiry was ever worth taking.' },
    { name: 'Marketing agencies', note: 'Inbound briefs that need qualifying before anyone builds a proposal.' },
    { name: 'Digital agencies', note: 'Project enquiries with no budget, timeline or decision-maker attached.' },
    { name: 'PR agencies', note: 'Media and client requests that are urgent by nature and arrive unscheduled.' },
    { name: 'B2B sales agencies', note: 'Speed to lead is the entire product, and it is measured in minutes.' },
  ],

  retail: [
    { name: 'Fashion retailers', note: 'Sizing and fit questions asked with a full basket open.', page: 'online' },
    { name: 'Beauty & cosmetics retailers', note: 'Ingredient, shade and suitability questions at high volume.' },
    { name: 'Electronics retailers', note: 'Specification and compatibility questions, then warranty questions after.' },
    { name: 'Furniture retailers', note: 'Lead times and delivery windows, asked before and after the order.' },
    { name: 'Luxury retailers', note: 'Availability enquiries that are worth an appointment, not a reply.', page: 'stores' },
    { name: 'E-commerce brands', note: 'Where-is-my-order, on five channels, all day.' },
    { name: 'D2C brands', note: 'Pre-purchase questions that decide the sale, in the same queue as the rest.' },
    { name: 'Jewellery retailers', note: 'Considered purchases where the store visit is the conversion.' },
    { name: 'Consumer service brands', note: 'Subscription and account questions that repeat at predictable volume.' },
  ],
};
