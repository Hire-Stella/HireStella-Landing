/**
 * The operations workspace.
 *
 * Every figure here reconciles with every other: the period totals are the sum
 * of their own series, and the conversion ring is bookings over enquiries for
 * whichever period is showing. §34 requires demo surfaces to be labelled, so
 * the component carries a "demo data" tag on every view.
 *
 * The shape is deliberately generic. Clinics is the first configuration; a
 * second industry means another entry here, not another component.
 */

export type Point = { label: string; enquiries: number; bookings: number };

export type Record_ = {
  id: string;
  time: string;
  channel: string;
  title: string;
  status: 'Confirmed' | 'Staff review' | 'Awaiting reply';
  icon: string;
  detail: string;
};

export type Workspace = {
  workspace: string;
  /** The words this sector uses. A dealership does not take appointments. */
  bookingsLabel: string;
  bookingWord: string;
  /** The section eyebrow. "Your automotive, in view" is not English. */
  inView: string;
  initials: string;
  day: string;
  headline: string;
  subject: string;
  today: Point[];
  week: Point[];
  followUps: { today: number; week: number };
  handoffs: { open: number; todayTotal: number; weekTotal: number };
  records: Record_[];
  feed: { time: string; label: string; live?: boolean }[];
  roster: { name: string; role: string; icon: string; load: number }[];
};

export const clinicWorkspace: Workspace = {
  workspace: 'Demo clinic',
  bookingsLabel: 'Appointments',
  bookingWord: 'appointment',
  inView: 'Your clinic, in view',
  initials: 'DC',
  day: 'Thursday',
  headline: 'A clearer day at the front desk.',
  subject: 'patient',

  today: [
    { label: '08:00', enquiries: 4, bookings: 2 },
    { label: '10:00', enquiries: 8, bookings: 5 },
    { label: '12:00', enquiries: 7, bookings: 4 },
    { label: '14:00', enquiries: 6, bookings: 4 },
    { label: '16:00', enquiries: 9, bookings: 6 },
  ],
  week: [
    { label: 'Fri', enquiries: 24, bookings: 14 },
    { label: 'Sat', enquiries: 30, bookings: 18 },
    { label: 'Sun', enquiries: 28, bookings: 16 },
    { label: 'Mon', enquiries: 36, bookings: 23 },
    { label: 'Tue', enquiries: 32, bookings: 20 },
    { label: 'Wed', enquiries: 40, bookings: 25 },
    { label: 'Thu', enquiries: 34, bookings: 21 },
  ],

  followUps: { today: 9, week: 58 },
  handoffs: { open: 2, todayTotal: 4, weekTotal: 18 },

  records: [
    {
      id: 'D-024',
      time: '10:30',
      channel: 'Voice',
      title: 'Dental consultation',
      status: 'Confirmed',
      icon: 'phone',
      detail:
        'Preferred slot checked against the demo calendar. Appointment confirmed and a reminder scheduled.',
    },
    {
      id: 'D-025',
      time: '11:00',
      channel: 'Website',
      title: 'New patient enquiry',
      status: 'Staff review',
      icon: 'browser',
      detail:
        'A treatment question needs a clinician. The booking stays pending and the conversation is attached.',
    },
    {
      id: 'D-026',
      time: '11:30',
      channel: 'Chat',
      title: 'Appointment change',
      status: 'Confirmed',
      icon: 'message',
      detail: 'The appointment moved to the requested available slot. The reminder was updated.',
    },
    {
      id: 'D-027',
      time: '12:00',
      channel: 'Social',
      title: 'Consultation follow-up',
      status: 'Awaiting reply',
      icon: 'network',
      detail: 'An approved follow-up was sent. The next contact pauses the moment the patient replies.',
    },
    {
      id: 'D-028',
      time: '12:30',
      channel: 'Voice',
      title: 'Clinic callback',
      status: 'Staff review',
      icon: 'phone',
      detail:
        'A request outside the configured workflow is queued for reception with the call summary.',
    },
  ],

  feed: [
    { time: '10:28', label: 'Enquiry received · Voice' },
    { time: '10:29', label: 'Front Desk captured the details' },
    { time: '10:30', label: 'Stella routed to Booking', live: true },
    { time: '10:30', label: 'Appointment confirmed · 10:30' },
    { time: '11:00', label: 'Human handoff opened · clinical question' },
    { time: '11:04', label: 'Follow-up scheduled · day before' },
  ],

  roster: [
    { name: 'Front Desk', role: 'Answers · qualifies · routes', icon: 'message', load: 82 },
    { name: 'Voice', role: 'Responds · qualifies · transfers', icon: 'phone', load: 64 },
    { name: 'Booking', role: 'Checks · confirms · updates', icon: 'calendar', load: 71 },
    { name: 'Follow-up', role: 'Schedules · sends · tracks', icon: 'send', load: 46 },
  ],
};

/* ── hospitals ─────────────────────────────────────────────────────────
   Higher volume than a clinic and the work is routing, not booking: the
   question is which department owns the request, and whether anyone did. */
export const hospitalWorkspace: Workspace = {
  workspace: 'Demo hospital',
  initials: 'DH',
  bookingsLabel: 'Appointments',
  bookingWord: 'appointment',
  inView: 'Your hospital, in view',
  day: 'Tuesday',
  headline: 'One front door, department by department.',
  subject: 'patient',

  today: [
    { label: '08:00', enquiries: 12, bookings: 6 },
    { label: '10:00', enquiries: 22, bookings: 12 },
    { label: '12:00', enquiries: 19, bookings: 10 },
    { label: '14:00', enquiries: 17, bookings: 9 },
    { label: '16:00', enquiries: 20, bookings: 11 },
  ],
  week: [
    { label: 'Fri', enquiries: 64, bookings: 34 },
    { label: 'Sat', enquiries: 78, bookings: 41 },
    { label: 'Sun', enquiries: 82, bookings: 44 },
    { label: 'Mon', enquiries: 96, bookings: 52 },
    { label: 'Tue', enquiries: 90, bookings: 48 },
    { label: 'Wed', enquiries: 99, bookings: 54 },
    { label: 'Thu', enquiries: 90, bookings: 48 },
  ],

  followUps: { today: 21, week: 142 },
  handoffs: { open: 2, todayTotal: 9, weekTotal: 47 },

  records: [
    {
      id: 'H-118',
      time: '09:15',
      channel: 'Voice',
      title: 'Outpatient appointment',
      status: 'Confirmed',
      icon: 'phone',
      detail:
        'The requested service was matched to the department that provides it and an outpatient slot was confirmed from the demo calendar.',
    },
    {
      id: 'H-119',
      time: '09:40',
      channel: 'Website',
      title: 'Department enquiry',
      status: 'Staff review',
      icon: 'browser',
      detail:
        'A clinical question about suitability for a procedure. The request is held for the named department with the full conversation attached.',
    },
    {
      id: 'H-120',
      time: '10:05',
      channel: 'Chat',
      title: 'Appointment change',
      status: 'Confirmed',
      icon: 'message',
      detail:
        'The visit moved to another available slot in the same department and the reminder was updated.',
    },
    {
      id: 'H-121',
      time: '10:30',
      channel: 'Voice',
      title: 'Records request',
      status: 'Staff review',
      icon: 'records',
      detail:
        'Anything touching patient records is queued for authorised staff. Nothing is read out or sent by the workforce.',
    },
    {
      id: 'H-122',
      time: '11:10',
      channel: 'Social',
      title: 'Visiting hours question',
      status: 'Awaiting reply',
      icon: 'network',
      detail:
        'Approved visiting information was sent. The follow-up pauses the moment the family replies.',
    },
  ],

  feed: [
    { time: '09:12', label: 'Enquiry received · Voice' },
    { time: '09:13', label: 'Front Desk captured the request' },
    { time: '09:14', label: 'Stella identified the department', live: true },
    { time: '09:15', label: 'Outpatient appointment confirmed' },
    { time: '09:40', label: 'Human handoff opened · clinical question' },
    { time: '10:30', label: 'Records request queued for authorised staff' },
  ],

  roster: [
    { name: 'Front Desk', role: 'Answers · identifies · routes', icon: 'message', load: 88 },
    { name: 'Voice', role: 'Responds · qualifies · transfers', icon: 'phone', load: 76 },
    { name: 'Booking', role: 'Checks · confirms · updates', icon: 'calendar', load: 63 },
    { name: 'Admin', role: 'Logs · files · tracks', icon: 'records', load: 52 },
  ],
};

/* ── real estate ───────────────────────────────────────────────────────
   Leads arrive at night and go cold by morning, so the evening bar is the
   tallest one in the day and the follow-up is the number that matters. */
export const realEstateWorkspace: Workspace = {
  workspace: 'Demo agency',
  initials: 'DA',
  bookingsLabel: 'Viewings',
  bookingWord: 'viewing',
  inView: 'Your agency, in view',
  day: 'Thursday',
  headline: 'Every lead answered while it is still warm.',
  subject: 'buyer',

  today: [
    { label: '09:00', enquiries: 5, bookings: 2 },
    { label: '11:00', enquiries: 9, bookings: 4 },
    { label: '13:00', enquiries: 7, bookings: 3 },
    { label: '15:00', enquiries: 8, bookings: 4 },
    { label: '19:00', enquiries: 11, bookings: 5 },
  ],
  week: [
    { label: 'Mon', enquiries: 34, bookings: 15 },
    { label: 'Tue', enquiries: 31, bookings: 14 },
    { label: 'Wed', enquiries: 36, bookings: 16 },
    { label: 'Thu', enquiries: 40, bookings: 18 },
    { label: 'Fri', enquiries: 26, bookings: 11 },
    { label: 'Sat', enquiries: 44, bookings: 20 },
    { label: 'Sun', enquiries: 39, bookings: 17 },
  ],

  followUps: { today: 12, week: 74 },
  handoffs: { open: 2, todayTotal: 5, weekTotal: 22 },

  records: [
    {
      id: 'R-206',
      time: '19:24',
      channel: 'Portal',
      title: 'Overnight portal lead',
      status: 'Confirmed',
      icon: 'browser',
      detail:
        'The enquiry was answered on arrival, the requirement captured, and a viewing slot held against the demo diary.',
    },
    {
      id: 'R-207',
      time: '19:51',
      channel: 'Website',
      title: 'Price negotiation',
      status: 'Staff review',
      icon: 'message',
      detail:
        'Anything touching price or terms goes to the agent. The conversation so far is attached, so they open it already briefed.',
    },
    {
      id: 'R-208',
      time: '20:10',
      channel: 'Voice',
      title: 'Viewing request',
      status: 'Confirmed',
      icon: 'phone',
      detail:
        'Availability was checked against the agent diary and the viewing was coordinated for the requested day.',
    },
    {
      id: 'R-209',
      time: '20:35',
      channel: 'Chat',
      title: 'Mortgage question',
      status: 'Staff review',
      icon: 'records',
      detail:
        'Financial advice is not given by the workforce. The request is queued for a person with the context already written down.',
    },
    {
      id: 'R-210',
      time: '21:02',
      channel: 'Social',
      title: 'Second follow-up',
      status: 'Awaiting reply',
      icon: 'network',
      detail:
        'An approved follow-up on a viewing from last week was sent. The sequence stops the moment the buyer replies.',
    },
  ],

  feed: [
    { time: '19:24', label: 'Portal lead received · after hours' },
    { time: '19:25', label: 'Front Desk captured the requirement' },
    { time: '19:26', label: 'Stella routed to Booking', live: true },
    { time: '19:28', label: 'Viewing held · Saturday 11:00' },
    { time: '19:51', label: 'Human handoff opened · price question' },
    { time: '21:02', label: 'Follow-up sent · previous viewing' },
  ],

  roster: [
    { name: 'Front Desk', role: 'Answers · qualifies · routes', icon: 'message', load: 84 },
    { name: 'Voice', role: 'Responds · captures · transfers', icon: 'phone', load: 58 },
    { name: 'Booking', role: 'Checks diaries · coordinates', icon: 'calendar', load: 69 },
    { name: 'Follow-up', role: 'Schedules · sends · stops', icon: 'send', load: 61 },
  ],
};

/* ── banking & finance ────────────────────────────────────────────────
   Routine status questions are the volume. Clearing them is what lets the
   complex cases reach a person sooner, so that is what the day shows. */
export const bankingWorkspace: Workspace = {
  workspace: 'Demo service desk',
  initials: 'DS',
  bookingsLabel: 'Appointments',
  bookingWord: 'appointment',
  inView: 'Your service desk, in view',
  day: 'Wednesday',
  headline: 'Routine questions cleared off the desk.',
  subject: 'customer',

  today: [
    { label: '09:00', enquiries: 14, bookings: 7 },
    { label: '11:00', enquiries: 26, bookings: 13 },
    { label: '13:00', enquiries: 21, bookings: 10 },
    { label: '15:00', enquiries: 18, bookings: 9 },
    { label: '17:00', enquiries: 16, bookings: 8 },
  ],
  week: [
    { label: 'Mon', enquiries: 88, bookings: 44 },
    { label: 'Tue', enquiries: 82, bookings: 41 },
    { label: 'Wed', enquiries: 95, bookings: 47 },
    { label: 'Thu', enquiries: 90, bookings: 45 },
    { label: 'Fri', enquiries: 54, bookings: 26 },
    { label: 'Sat', enquiries: 40, bookings: 19 },
    { label: 'Sun', enquiries: 31, bookings: 15 },
  ],

  followUps: { today: 18, week: 96 },
  handoffs: { open: 2, todayTotal: 8, weekTotal: 39 },

  records: [
    {
      id: 'B-412',
      time: '09:28',
      channel: 'Voice',
      title: 'Application status',
      status: 'Confirmed',
      icon: 'phone',
      detail:
        'A routine status question answered from the approved script. No account data is read out and nothing is changed.',
    },
    {
      id: 'B-413',
      time: '10:02',
      channel: 'Website',
      title: 'Product advice request',
      status: 'Staff review',
      icon: 'browser',
      detail:
        'Anything advisory or regulated transfers to authorised staff. The workforce captures the question, never the answer.',
    },
    {
      id: 'B-414',
      time: '10:45',
      channel: 'Chat',
      title: 'Branch appointment',
      status: 'Confirmed',
      icon: 'calendar',
      detail:
        'An appointment with the service team was booked into the demo diary and a reminder was scheduled.',
    },
    {
      id: 'B-415',
      time: '11:20',
      channel: 'Voice',
      title: 'Account access issue',
      status: 'Staff review',
      icon: 'shield',
      detail:
        'Anything account-sensitive is queued for a verified agent. The workforce does not authenticate a customer.',
    },
    {
      id: 'B-416',
      time: '12:05',
      channel: 'Email',
      title: 'Document checklist',
      status: 'Awaiting reply',
      icon: 'records',
      detail:
        'The approved checklist of required documents was sent. The follow-up pauses once the customer responds.',
    },
  ],

  feed: [
    { time: '09:26', label: 'Enquiry received · Voice' },
    { time: '09:27', label: 'Front Desk matched an approved answer' },
    { time: '09:28', label: 'Status question resolved', live: true },
    { time: '10:02', label: 'Human handoff opened · advisory request' },
    { time: '10:45', label: 'Branch appointment booked' },
    { time: '11:20', label: 'Account issue queued for a verified agent' },
  ],

  roster: [
    { name: 'Front Desk', role: 'Answers · qualifies · routes', icon: 'message', load: 91 },
    { name: 'Voice', role: 'Responds · captures · transfers', icon: 'phone', load: 72 },
    { name: 'Admin', role: 'Logs · files · tracks', icon: 'records', load: 57 },
    { name: 'Booking', role: 'Checks · confirms · reminds', icon: 'calendar', load: 44 },
  ],
};

/* ── automotive ────────────────────────────────────────────────────────
   Rental, workshop and sales arrive on the same numbers. The workspace is
   one customer view across all three rather than three systems. */
export const automotiveWorkspace: Workspace = {
  workspace: 'Demo dealership',
  initials: 'DD',
  bookingsLabel: 'Bookings',
  bookingWord: 'booking',
  inView: 'Your dealership, in view',
  day: 'Saturday',
  headline: 'Rental, workshop and sales on one view.',
  subject: 'customer',

  today: [
    { label: '08:00', enquiries: 6, bookings: 3 },
    { label: '10:00', enquiries: 13, bookings: 7 },
    { label: '12:00', enquiries: 11, bookings: 6 },
    { label: '14:00', enquiries: 9, bookings: 5 },
    { label: '16:00', enquiries: 12, bookings: 7 },
  ],
  week: [
    { label: 'Mon', enquiries: 44, bookings: 24 },
    { label: 'Tue', enquiries: 40, bookings: 22 },
    { label: 'Wed', enquiries: 47, bookings: 26 },
    { label: 'Thu', enquiries: 51, bookings: 28 },
    { label: 'Fri', enquiries: 33, bookings: 17 },
    { label: 'Sat', enquiries: 58, bookings: 32 },
    { label: 'Sun', enquiries: 29, bookings: 15 },
  ],

  followUps: { today: 11, week: 68 },
  handoffs: { open: 2, todayTotal: 6, weekTotal: 27 },

  records: [
    {
      id: 'A-331',
      time: '09:05',
      channel: 'Voice',
      title: 'Rental enquiry',
      status: 'Confirmed',
      icon: 'phone',
      detail:
        'Dates and vehicle class were captured and the booking was held against the demo fleet calendar.',
    },
    {
      id: 'A-332',
      time: '09:40',
      channel: 'Website',
      title: 'Repair quote',
      status: 'Staff review',
      icon: 'browser',
      detail:
        'A quote needs a vehicle assessment, so it goes to the service advisor with the photographs and the description attached.',
    },
    {
      id: 'A-333',
      time: '10:15',
      channel: 'Chat',
      title: 'Service booking',
      status: 'Confirmed',
      icon: 'calendar',
      detail:
        'The workshop slot was confirmed from the demo diary and a collection reminder was scheduled for the day before.',
    },
    {
      id: 'A-334',
      time: '11:00',
      channel: 'Voice',
      title: 'Damage dispute',
      status: 'Staff review',
      icon: 'shield',
      detail:
        'Disputes are never handled by the workforce. The call summary and the rental agreement reference go to your manager.',
    },
    {
      id: 'A-335',
      time: '11:35',
      channel: 'Social',
      title: 'Test drive follow-up',
      status: 'Awaiting reply',
      icon: 'network',
      detail:
        'An approved follow-up after a test drive last week was sent. The sequence stops the moment the customer replies.',
    },
  ],

  feed: [
    { time: '09:02', label: 'Enquiry received · Voice' },
    { time: '09:03', label: 'Front Desk recognised a returning customer' },
    { time: '09:04', label: 'Stella routed to Booking', live: true },
    { time: '09:05', label: 'Rental held · Saturday to Tuesday' },
    { time: '09:40', label: 'Human handoff opened · repair quote' },
    { time: '10:15', label: 'Workshop slot confirmed' },
  ],

  roster: [
    { name: 'Front Desk', role: 'Answers · recognises · routes', icon: 'message', load: 79 },
    { name: 'Booking', role: 'Checks fleet · confirms · reminds', icon: 'calendar', load: 74 },
    { name: 'Admin', role: 'Logs · files · tracks', icon: 'records', load: 55 },
    { name: 'Follow-up', role: 'Schedules · sends · stops', icon: 'send', load: 48 },
  ],
};


/* ── education & training ──────────────────────────────────────────────
   Admissions peaks in the evening, once parents have finished their own
   working day, which is exactly when the office is shut. */
export const educationWorkspace: Workspace = {
  workspace: 'Demo school',
  initials: 'DS',
  bookingsLabel: 'Tours',
  bookingWord: 'tour',
  inView: 'Your admissions desk, in view',
  day: 'Tuesday',
  headline: 'Every enquiry answered the same evening.',
  subject: 'family',

  today: [
    { label: '09:00', enquiries: 6, bookings: 3 },
    { label: '11:00', enquiries: 9, bookings: 4 },
    { label: '13:00', enquiries: 7, bookings: 3 },
    { label: '15:00', enquiries: 8, bookings: 4 },
    { label: '20:00', enquiries: 12, bookings: 5 },
  ],
  week: [
    { label: 'Mon', enquiries: 38, bookings: 17 },
    { label: 'Tue', enquiries: 35, bookings: 16 },
    { label: 'Wed', enquiries: 40, bookings: 18 },
    { label: 'Thu', enquiries: 42, bookings: 19 },
    { label: 'Fri', enquiries: 24, bookings: 11 },
    { label: 'Sat', enquiries: 30, bookings: 13 },
    { label: 'Sun', enquiries: 33, bookings: 15 },
  ],

  followUps: { today: 14, week: 88 },
  handoffs: { open: 2, todayTotal: 5, weekTotal: 24 },

  records: [
    {
      id: 'E-214',
      time: '20:12',
      channel: 'Website',
      title: 'Year 4 admissions enquiry',
      status: 'Confirmed',
      icon: 'browser',
      detail:
        'Answered the evening it arrived from the published fee and curriculum content, and a tour was offered from the demo calendar.',
    },
    {
      id: 'E-215',
      time: '20:40',
      channel: 'Voice',
      title: 'Scholarship question',
      status: 'Staff review',
      icon: 'phone',
      detail:
        'Anything about a discount, a bursary or a rate for a particular family goes to admissions. The published schedule is all that is quoted.',
    },
    {
      id: 'E-216',
      time: '21:05',
      channel: 'Chat',
      title: 'School tour booked',
      status: 'Confirmed',
      icon: 'calendar',
      detail:
        'A tour slot was held from the demo calendar and a reminder scheduled for the morning before the visit.',
    },
    {
      id: 'E-217',
      time: '21:30',
      channel: 'Website',
      title: 'Learning support question',
      status: 'Staff review',
      icon: 'users',
      detail:
        'A question about a specific child stops here. It is queued for a named member of staff with the conversation attached.',
    },
    {
      id: 'E-218',
      time: '22:02',
      channel: 'Social',
      title: 'Open day follow-up',
      status: 'Awaiting reply',
      icon: 'network',
      detail:
        'An approved follow-up after last week open day was sent. The sequence stops the moment the family replies.',
    },
  ],

  feed: [
    { time: '20:10', label: 'Enquiry received · Website' },
    { time: '20:11', label: 'Front Desk captured the year group' },
    { time: '20:12', label: 'Answered from approved content', live: true },
    { time: '20:14', label: 'Tour offered from the calendar' },
    { time: '20:40', label: 'Human handoff opened · scholarship' },
    { time: '21:05', label: 'Tour confirmed · Thursday 09:30' },
  ],

  roster: [
    { name: 'Front Desk', role: 'Answers · captures · routes', icon: 'message', load: 86 },
    { name: 'Voice', role: 'Responds · qualifies · transfers', icon: 'phone', load: 54 },
    { name: 'Booking', role: 'Offers tours · confirms · reminds', icon: 'calendar', load: 67 },
    { name: 'Follow-up', role: 'Schedules · sends · stops', icon: 'send', load: 72 },
  ],
};

/* ── home services ─────────────────────────────────────────────────────
   A field business: the calls come in the morning while the technicians
   are already out, and the diary is the product. */
export const homeServicesWorkspace: Workspace = {
  workspace: 'Demo service co.',
  initials: 'SC',
  bookingsLabel: 'Jobs',
  bookingWord: 'job',
  inView: 'Your dispatch desk, in view',
  day: 'Monday',
  headline: 'The diary fills while the vans are out.',
  subject: 'customer',

  today: [
    { label: '07:00', enquiries: 9, bookings: 5 },
    { label: '09:00', enquiries: 18, bookings: 10 },
    { label: '11:00', enquiries: 15, bookings: 8 },
    { label: '13:00', enquiries: 12, bookings: 7 },
    { label: '15:00', enquiries: 14, bookings: 8 },
  ],
  week: [
    { label: 'Mon', enquiries: 62, bookings: 34 },
    { label: 'Tue', enquiries: 58, bookings: 32 },
    { label: 'Wed', enquiries: 65, bookings: 36 },
    { label: 'Thu', enquiries: 68, bookings: 38 },
    { label: 'Fri', enquiries: 44, bookings: 24 },
    { label: 'Sat', enquiries: 71, bookings: 39 },
    { label: 'Sun', enquiries: 39, bookings: 21 },
  ],

  followUps: { today: 16, week: 96 },
  handoffs: { open: 2, todayTotal: 7, weekTotal: 31 },

  records: [
    {
      id: 'S-448',
      time: '07:20',
      channel: 'Voice',
      title: 'Air conditioning fault',
      status: 'Confirmed',
      icon: 'phone',
      detail:
        'Fault, address, access arrangement and callback number captured, and a technician window held in the demo schedule.',
    },
    {
      id: 'S-449',
      time: '08:05',
      channel: 'Website',
      title: 'Repair cost question',
      status: 'Staff review',
      icon: 'browser',
      detail:
        'What a repair will cost depends on what the technician finds, so the question goes to your supervisor with the photographs attached.',
    },
    {
      id: 'S-450',
      time: '09:14',
      channel: 'Chat',
      title: 'Reschedule to Thursday',
      status: 'Confirmed',
      icon: 'calendar',
      detail:
        'The visit moved to the requested window in the same schedule, and the reminder moved with it.',
    },
    {
      id: 'S-451',
      time: '10:02',
      channel: 'Voice',
      title: 'Water leak reported',
      status: 'Staff review',
      icon: 'shield',
      detail:
        'Matched an emergency rule your team wrote. It was flagged and put in front of dispatch immediately rather than joining the booking queue.',
    },
    {
      id: 'S-452',
      time: '11:30',
      channel: 'Social',
      title: 'Annual service reminder',
      status: 'Awaiting reply',
      icon: 'network',
      detail:
        'An approved reminder for a due service was sent. It pauses the moment the customer replies.',
    },
  ],

  feed: [
    { time: '07:18', label: 'Call received · Voice' },
    { time: '07:19', label: 'Front Desk captured fault and address' },
    { time: '07:20', label: 'Stella checked the urgency rules', live: true },
    { time: '07:22', label: 'Technician window held · 14:00' },
    { time: '08:05', label: 'Human handoff opened · pricing' },
    { time: '10:02', label: 'Emergency flagged · water leak' },
  ],

  roster: [
    { name: 'Voice', role: 'Answers · captures · flags', icon: 'phone', load: 93 },
    { name: 'Front Desk', role: 'Responds · qualifies · routes', icon: 'message', load: 70 },
    { name: 'Booking', role: 'Checks the diary · holds slots', icon: 'calendar', load: 81 },
    { name: 'Follow-up', role: 'Confirms · reminds · stops', icon: 'send', load: 58 },
  ],
};

/* ── retail & D2C ──────────────────────────────────────────────────────
   The highest volume of the eight, and the only one where the conversion
   that matters is a question resolved rather than a slot booked. */
export const retailWorkspace: Workspace = {
  workspace: 'Demo store',
  initials: 'DS',
  bookingsLabel: 'Resolved',
  bookingWord: 'resolution',
  inView: 'Your customer desk, in view',
  day: 'Saturday',
  headline: 'Before they buy, and after it ships.',
  subject: 'customer',

  today: [
    { label: '10:00', enquiries: 22, bookings: 14 },
    { label: '13:00', enquiries: 31, bookings: 20 },
    { label: '16:00', enquiries: 28, bookings: 18 },
    { label: '19:00', enquiries: 40, bookings: 26 },
    { label: '21:00', enquiries: 34, bookings: 22 },
  ],
  week: [
    { label: 'Mon', enquiries: 128, bookings: 82 },
    { label: 'Tue', enquiries: 120, bookings: 77 },
    { label: 'Wed', enquiries: 135, bookings: 87 },
    { label: 'Thu', enquiries: 142, bookings: 91 },
    { label: 'Fri', enquiries: 168, bookings: 108 },
    { label: 'Sat', enquiries: 190, bookings: 122 },
    { label: 'Sun', enquiries: 155, bookings: 100 },
  ],

  followUps: { today: 21, week: 142 },
  handoffs: { open: 2, todayTotal: 9, weekTotal: 44 },

  records: [
    {
      id: 'R-902',
      time: '19:06',
      channel: 'Chat',
      title: 'Sizing question, full basket',
      status: 'Confirmed',
      icon: 'message',
      detail:
        'Answered from the product information your team maintains, while the basket was still open.',
    },
    {
      id: 'R-903',
      time: '19:24',
      channel: 'Social',
      title: 'Refund request',
      status: 'Staff review',
      icon: 'shield',
      detail:
        'Anything touching money stops here. It goes to your team with the order and the full conversation attached.',
    },
    {
      id: 'R-904',
      time: '19:48',
      channel: 'Website',
      title: 'Where is my order',
      status: 'Confirmed',
      icon: 'records',
      detail:
        'Answered from the order record in the demo data rather than passed to a person to read the same screen.',
    },
    {
      id: 'R-905',
      time: '20:15',
      channel: 'Email',
      title: 'Damaged item complaint',
      status: 'Staff review',
      icon: 'users',
      detail:
        'A genuine complaint is not answered by the workforce. It is queued for your team with photographs and order history.',
    },
    {
      id: 'R-906',
      time: '20:51',
      channel: 'Social',
      title: 'Back in stock request',
      status: 'Awaiting reply',
      icon: 'network',
      detail:
        'The request was recorded against the variant, and an approved notification is scheduled for when it returns.',
    },
  ],

  feed: [
    { time: '19:05', label: 'Question received · Chat' },
    { time: '19:05', label: 'Front Desk matched the product' },
    { time: '19:06', label: 'Answered from approved content', live: true },
    { time: '19:24', label: 'Human handoff opened · refund' },
    { time: '19:48', label: 'Order status answered from the record' },
    { time: '20:51', label: 'Back-in-stock request recorded' },
  ],

  roster: [
    { name: 'Front Desk', role: 'Answers · matches · routes', icon: 'message', load: 96 },
    { name: 'Admin', role: 'Checks orders · logs · tracks', icon: 'records', load: 74 },
    { name: 'Social', role: 'Replies · captures · escalates', icon: 'network', load: 68 },
    { name: 'Follow-up', role: 'Notifies · sends · stops', icon: 'send', load: 49 },
  ],
};


/* ── hospitality ───────────────────────────────────────────────────────
   The busiest hour on the floor is the busiest hour on the phone, and the
   evening peak is the one the desk is least able to answer. */
export const hospitalityWorkspace: Workspace = {
  workspace: 'Demo hotel',
  initials: 'DH',
  bookingsLabel: 'Reservations',
  bookingWord: 'reservation',
  inView: 'Your front desk, in view',
  day: 'Friday',
  headline: 'The desk keeps the guests in front of it.',
  subject: 'guest',

  today: [
    { label: '08:00', enquiries: 11, bookings: 6 },
    { label: '12:00', enquiries: 19, bookings: 11 },
    { label: '16:00', enquiries: 16, bookings: 9 },
    { label: '19:00', enquiries: 24, bookings: 14 },
    { label: '22:00', enquiries: 20, bookings: 12 },
  ],
  week: [
    { label: 'Mon', enquiries: 74, bookings: 43 },
    { label: 'Tue', enquiries: 70, bookings: 40 },
    { label: 'Wed', enquiries: 78, bookings: 45 },
    { label: 'Thu', enquiries: 85, bookings: 49 },
    { label: 'Fri', enquiries: 96, bookings: 56 },
    { label: 'Sat', enquiries: 104, bookings: 60 },
    { label: 'Sun', enquiries: 90, bookings: 52 },
  ],

  followUps: { today: 17, week: 108 },
  handoffs: { open: 2, todayTotal: 8, weekTotal: 38 },

  records: [
    { id: 'H-612', time: '19:14', channel: 'Website', title: 'Direct booking enquiry', status: 'Confirmed', icon: 'browser',
      detail: 'Availability and the published rate were confirmed from the demo calendar while the guest was still comparing.' },
    { id: 'H-613', time: '19:38', channel: 'Voice', title: 'Rate negotiation', status: 'Staff review', icon: 'phone',
      detail: 'Anything below the published rate is a commercial decision. It goes to the duty manager with the enquiry attached.' },
    { id: 'H-614', time: '20:02', channel: 'Chat', title: 'Reservation change', status: 'Confirmed', icon: 'calendar',
      detail: 'The stay moved to the requested dates in the same system, and the confirmation was reissued.' },
    { id: 'H-615', time: '20:41', channel: 'Social', title: 'Service complaint', status: 'Staff review', icon: 'shield',
      detail: 'A complaint about a stay is never answered by the workforce. It reaches your duty manager immediately.' },
    { id: 'H-616', time: '21:15', channel: 'Email', title: 'Pre-arrival details', status: 'Awaiting reply', icon: 'network',
      detail: 'An approved pre-arrival message with transfer and check-in information was sent. It pauses on reply.' },
  ],

  feed: [
    { time: '19:12', label: 'Enquiry received · Website' },
    { time: '19:13', label: 'Front Desk captured dates and party' },
    { time: '19:14', label: 'Availability confirmed', live: true },
    { time: '19:16', label: 'Reservation held · 3 nights' },
    { time: '19:38', label: 'Human handoff opened · rate request' },
    { time: '20:41', label: 'Complaint escalated to duty manager' },
  ],

  roster: [
    { name: 'Front Desk', role: 'Answers · checks · confirms', icon: 'message', load: 90 },
    { name: 'Voice', role: 'Responds · captures · transfers', icon: 'phone', load: 77 },
    { name: 'Booking', role: 'Holds · amends · reissues', icon: 'calendar', load: 84 },
    { name: 'Follow-up', role: 'Pre-arrival · reminders · stops', icon: 'send', load: 52 },
  ],
};

/* ── travel & tourism ──────────────────────────────────────────────────
   Enquiries arrive from every time zone, and most of them are answerable
   from published requirements before a consultant is involved at all. */
export const travelWorkspace: Workspace = {
  workspace: 'Demo travel desk',
  initials: 'TD',
  bookingsLabel: 'Consultations',
  bookingWord: 'consultation',
  inView: 'Your travel desk, in view',
  day: 'Wednesday',
  headline: 'Answered while they were still awake.',
  subject: 'traveller',

  today: [
    { label: '07:00', enquiries: 8, bookings: 4 },
    { label: '10:00', enquiries: 15, bookings: 8 },
    { label: '13:00', enquiries: 13, bookings: 7 },
    { label: '16:00', enquiries: 11, bookings: 6 },
    { label: '21:00', enquiries: 17, bookings: 9 },
  ],
  week: [
    { label: 'Mon', enquiries: 58, bookings: 31 },
    { label: 'Tue', enquiries: 54, bookings: 29 },
    { label: 'Wed', enquiries: 61, bookings: 32 },
    { label: 'Thu', enquiries: 64, bookings: 34 },
    { label: 'Fri', enquiries: 49, bookings: 26 },
    { label: 'Sat', enquiries: 41, bookings: 22 },
    { label: 'Sun', enquiries: 37, bookings: 20 },
  ],

  followUps: { today: 13, week: 82 },
  handoffs: { open: 2, todayTotal: 6, weekTotal: 29 },

  records: [
    { id: 'T-330', time: '07:12', channel: 'Website', title: 'Visa requirements question', status: 'Confirmed', icon: 'browser',
      detail: 'Answered from the published requirements your team maintains, at an hour the desk was closed.' },
    { id: 'T-331', time: '09:45', channel: 'Voice', title: 'Eligibility for a specific case', status: 'Staff review', icon: 'phone',
      detail: 'Any judgement about whether a particular applicant qualifies goes to a licensed consultant. Nothing is ruled in or out here.' },
    { id: 'T-332', time: '11:20', channel: 'Chat', title: 'Consultation booked', status: 'Confirmed', icon: 'calendar',
      detail: 'A consultant slot was offered from the demo diary and confirmed, with the case notes attached.' },
    { id: 'T-333', time: '14:08', channel: 'Email', title: 'Refused application', status: 'Staff review', icon: 'shield',
      detail: 'A refusal is a case matter. It goes straight to your consultants with the history attached.' },
    { id: 'T-334', time: '16:30', channel: 'Social', title: 'Document checklist', status: 'Awaiting reply', icon: 'records',
      detail: 'The approved checklist was sent and a chase scheduled. It stops the moment the documents arrive.' },
  ],

  feed: [
    { time: '07:10', label: 'Enquiry received · Website' },
    { time: '07:11', label: 'Front Desk matched the destination' },
    { time: '07:12', label: 'Answered from published requirements', live: true },
    { time: '09:45', label: 'Human handoff opened · eligibility' },
    { time: '11:20', label: 'Consultation booked · Thursday' },
    { time: '16:30', label: 'Document checklist sent' },
  ],

  roster: [
    { name: 'Front Desk', role: 'Answers · matches · routes', icon: 'message', load: 88 },
    { name: 'Voice', role: 'Responds · captures · transfers', icon: 'phone', load: 61 },
    { name: 'Admin', role: 'Checklists · files · chases', icon: 'records', load: 73 },
    { name: 'Follow-up', role: 'Schedules · chases · stops', icon: 'send', load: 66 },
  ],
};

/* ── professional services ─────────────────────────────────────────────
   The lowest conversion of the ten, deliberately: most inbound was never
   going to convert, and finding that out is the job. */
export const professionalWorkspace: Workspace = {
  workspace: 'Demo practice',
  initials: 'DP',
  bookingsLabel: 'Meetings',
  bookingWord: 'meeting',
  inView: 'Your intake desk, in view',
  day: 'Thursday',
  headline: 'Qualified before anyone billable saw it.',
  subject: 'enquiry',

  today: [
    { label: '09:00', enquiries: 12, bookings: 5 },
    { label: '11:00', enquiries: 21, bookings: 9 },
    { label: '13:00', enquiries: 17, bookings: 7 },
    { label: '15:00', enquiries: 15, bookings: 6 },
    { label: '17:00', enquiries: 13, bookings: 6 },
  ],
  week: [
    { label: 'Mon', enquiries: 72, bookings: 30 },
    { label: 'Tue', enquiries: 68, bookings: 29 },
    { label: 'Wed', enquiries: 75, bookings: 32 },
    { label: 'Thu', enquiries: 78, bookings: 33 },
    { label: 'Fri', enquiries: 61, bookings: 26 },
    { label: 'Sat', enquiries: 24, bookings: 10 },
    { label: 'Sun', enquiries: 18, bookings: 8 },
  ],

  followUps: { today: 19, week: 104 },
  handoffs: { open: 2, todayTotal: 9, weekTotal: 41 },

  records: [
    { id: 'P-508', time: '09:24', channel: 'Website', title: 'Inbound brief qualified', status: 'Confirmed', icon: 'browser',
      detail: 'Scope, timeline and decision-maker were captured against your criteria before any consultant time was spent.' },
    { id: 'P-509', time: '10:11', channel: 'Email', title: 'Scope and fee question', status: 'Staff review', icon: 'records',
      detail: 'Scope and fees are never quoted by the workforce. The enquiry goes to your team with everything captured so far.' },
    { id: 'P-510', time: '11:38', channel: 'Voice', title: 'Discovery meeting booked', status: 'Confirmed', icon: 'calendar',
      detail: 'A slot was offered from the consultant diary and confirmed, with the qualified brief attached.' },
    { id: 'P-511', time: '13:02', channel: 'Website', title: 'Possible conflict', status: 'Staff review', icon: 'shield',
      detail: 'Anything that could be a conflict stops immediately and is put in front of a partner before a reply is sent.' },
    { id: 'P-512', time: '15:45', channel: 'Social', title: 'Proposal follow-up', status: 'Awaiting reply', icon: 'network',
      detail: 'An approved follow-up on an outstanding proposal was sent. The sequence stops on any reply.' },
  ],

  feed: [
    { time: '09:22', label: 'Enquiry received · Website' },
    { time: '09:23', label: 'Front Desk asked your qualifying questions' },
    { time: '09:24', label: 'Budget and timeline captured', live: true },
    { time: '10:11', label: 'Human handoff opened · scope and fees' },
    { time: '11:38', label: 'Discovery meeting booked' },
    { time: '13:02', label: 'Possible conflict escalated to a partner' },
  ],

  roster: [
    { name: 'Front Desk', role: 'Answers · qualifies · routes', icon: 'message', load: 92 },
    { name: 'Voice', role: 'Responds · captures · transfers', icon: 'phone', load: 64 },
    { name: 'Booking', role: 'Checks diaries · coordinates', icon: 'calendar', load: 58 },
    { name: 'Admin', role: 'Logs · files · tracks', icon: 'records', load: 47 },
  ],
};

/**
 * One workspace per industry group. A clinic record list on a dealership page
 * reads as somebody else's screenshot, so each page passes its own data in.
 */
export const workspaces: Record<string, Workspace> = {
  healthcare: clinicWorkspace,
  hospitals: hospitalWorkspace,
  'real-estate': realEstateWorkspace,
  'financial-services': bankingWorkspace,
  automotive: automotiveWorkspace,
  education: educationWorkspace,
  'home-services': homeServicesWorkspace,
  retail: retailWorkspace,
  hospitality: hospitalityWorkspace,
  travel: travelWorkspace,
  'professional-services': professionalWorkspace,
};
