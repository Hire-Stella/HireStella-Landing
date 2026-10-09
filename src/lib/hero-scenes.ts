import type { LiveScene } from '@/components/hero-live';

/**
 * The scenes the hero live panel plays on each page (client review,
 * 2026-10-09). Each industry shows its own customers asking its own
 * questions, so the panel on a clinic page looks like a clinic's evening and
 * the one on a dealership page looks like a dealership's.
 *
 * Scenes describe what the product does. They carry no performance figures,
 * no named people and no prices.
 */

type Scene = LiveScene;

const scene = (
  channel: string,
  clock: string,
  toast: [string, string],
  items: Scene['items'],
): Scene => ({ channel, clock, toast, items });

export const INDUSTRY_SCENES: Record<string, Scene[]> = {
  healthcare: [
    scene('WhatsApp', '10:48 pm', ['Appointment booked', 'Thursday, 4:30 pm'], [
      { k: 'in', text: 'Can I book a cleaning for Thursday?', time: '10:48 pm' },
      { k: 'route', to: 'Booking', text: 'Checking the hygienist’s diary' },
      { k: 'out', who: 'Booking', text: 'Thursday at 4:30 pm is free. Shall I hold it for you?', time: '10:48 pm' },
      { k: 'in', text: 'Yes please', time: '10:49 pm' },
      { k: 'done', text: 'Booked for Thursday, 4:30 pm' },
      { k: 'route', to: 'Follow-up', text: 'Reminder the day before' },
    ]),
    scene('Phone', '1:15 pm', ['Handed to your team', 'Duty nurse notified'], [
      { k: 'in', text: 'Missed call during a busy clinic', time: '1:15 pm' },
      { k: 'route', to: 'Voice', text: 'Returning the call' },
      { k: 'out', who: 'Voice', text: 'Hello, you called the clinic. How can I help?', time: '1:16 pm' },
      { k: 'in', text: 'My son has toothache. Is it urgent?', time: '1:16 pm' },
      { k: 'hand', text: 'Clinical question passed to the duty nurse' },
      { k: 'route', to: 'Admin', text: 'Patient record updated' },
    ]),
  ],
  automotive: [
    scene('Website', '9:20 pm', ['Test drive booked', 'Saturday, 10:00 am'], [
      { k: 'in', text: 'Is the SUV in your listing still available for a test drive?', time: '9:20 pm' },
      { k: 'route', to: 'Front Desk', text: 'Checking stock' },
      { k: 'out', who: 'Front Desk', text: 'It is. Would Saturday at 10am or 12pm suit you?', time: '9:20 pm' },
      { k: 'in', text: '10am works', time: '9:21 pm' },
      { k: 'done', text: 'Test drive booked for Saturday, 10:00 am' },
      { k: 'route', to: 'Follow-up', text: 'Reminder on Friday' },
    ]),
    scene('Phone', '7:30 am', ['Service booked', 'Tuesday, 8:30 am'], [
      { k: 'in', text: 'When is my car due for its service?', time: '7:30 am' },
      { k: 'route', to: 'Voice', text: 'Looking up the service history' },
      { k: 'out', who: 'Voice', text: 'Your next service is due this month. Shall I book it?', time: '7:31 am' },
      { k: 'in', text: 'Yes, Tuesday morning', time: '7:31 am' },
      { k: 'done', text: 'Service booked for Tuesday, 8:30 am' },
      { k: 'route', to: 'Admin', text: 'Service record updated' },
    ]),
  ],
  'real-estate': [
    scene('Instagram', '11:12 pm', ['Viewing booked', 'Wednesday, 6:00 pm'], [
      { k: 'in', text: 'Is the two-bedroom in Dubai Hills still available?', time: '11:12 pm' },
      { k: 'route', to: 'Social', text: 'Checking the listing' },
      { k: 'out', who: 'Social', text: 'It is. Would you like a viewing this week?', time: '11:12 pm' },
      { k: 'in', text: 'Wednesday evening', time: '11:13 pm' },
      { k: 'done', text: 'Viewing booked for Wednesday, 6:00 pm' },
      { k: 'route', to: 'Follow-up', text: 'Brochure and location sent' },
    ]),
    scene('Website', '8:05 am', ['Lead qualified', 'Listing agent notified'], [
      { k: 'in', text: 'What is the service charge on the townhouse?', time: '8:05 am' },
      { k: 'route', to: 'Front Desk', text: 'Capturing the details' },
      { k: 'out', who: 'Front Desk', text: 'Happy to find out. Is this to live in or to invest?', time: '8:05 am' },
      { k: 'in', text: 'To invest', time: '8:06 am' },
      { k: 'hand', text: 'Qualified lead handed to the listing agent' },
      { k: 'route', to: 'Admin', text: 'Lead added to your CRM' },
    ]),
  ],
  hospitality: [
    scene('WhatsApp', '11:40 pm', ['Reservation confirmed', 'Table for 6, 8:00 pm'], [
      { k: 'in', text: 'Do you have a table for six tomorrow at 8?', time: '11:40 pm' },
      { k: 'route', to: 'Booking', text: 'Checking the floor plan' },
      { k: 'out', who: 'Booking', text: 'Yes, 8pm on the terrace. Shall I book it?', time: '11:40 pm' },
      { k: 'in', text: 'Perfect', time: '11:41 pm' },
      { k: 'done', text: 'Table for six booked, tomorrow 8:00 pm' },
      { k: 'route', to: 'Follow-up', text: 'Confirmation sent' },
    ]),
    scene('Phone', '2:10 am', ['Request handled', 'Front office notified'], [
      { k: 'in', text: 'Can I check in early tomorrow?', time: '2:10 am' },
      { k: 'route', to: 'Voice', text: 'Checking room readiness' },
      { k: 'out', who: 'Voice', text: 'Early check-in from 11am is possible. Shall I add it?', time: '2:10 am' },
      { k: 'in', text: 'Yes please', time: '2:11 am' },
      { k: 'done', text: 'Early check-in added to the booking' },
      { k: 'route', to: 'Admin', text: 'Front office notified' },
    ]),
  ],
  education: [
    scene('Website', '9:45 pm', ['Trial class booked', 'Saturday, 11:00 am'], [
      { k: 'in', text: 'When does the next coding course start?', time: '9:45 pm' },
      { k: 'route', to: 'Front Desk', text: 'Checking the intake calendar' },
      { k: 'out', who: 'Front Desk', text: 'The next intake starts on the 3rd. Would you like a trial class first?', time: '9:45 pm' },
      { k: 'in', text: 'Yes, on Saturday', time: '9:46 pm' },
      { k: 'done', text: 'Trial class booked for Saturday, 11:00 am' },
      { k: 'route', to: 'Follow-up', text: 'Parent reminder on Friday' },
    ]),
    scene('WhatsApp', '7:15 am', ['Absence recorded', 'Class teacher informed'], [
      { k: 'in', text: 'My daughter will be absent today', time: '7:15 am' },
      { k: 'route', to: 'Admin', text: 'Logging the absence' },
      { k: 'out', who: 'Admin', text: 'Thank you, noted. We hope she feels better soon.', time: '7:15 am' },
      { k: 'in', text: 'Thanks', time: '7:16 am' },
      { k: 'hand', text: 'Class teacher informed' },
      { k: 'route', to: 'Follow-up', text: 'Today’s work sent home' },
    ]),
  ],
  'financial-services': [
    scene('Website', '10:30 pm', ['Lead qualified', 'Call booked, 10:00 am'], [
      { k: 'in', text: 'I would like to open a business account', time: '10:30 pm' },
      { k: 'route', to: 'Front Desk', text: 'Collecting the basics' },
      { k: 'out', who: 'Front Desk', text: 'Happy to help. What kind of business is it?', time: '10:30 pm' },
      { k: 'in', text: 'A trading company', time: '10:31 pm' },
      { k: 'hand', text: 'Handed to a relationship manager' },
      { k: 'route', to: 'Booking', text: 'Call booked for 10:00 am' },
    ]),
    scene('Phone', '8:20 am', ['Checklist sent', 'Follow-up in three days'], [
      { k: 'in', text: 'Which documents do I need for a loan?', time: '8:20 am' },
      { k: 'route', to: 'Voice', text: 'Answering from your product notes' },
      { k: 'out', who: 'Voice', text: 'I will email you the checklist now.', time: '8:21 am' },
      { k: 'in', text: 'Great, thanks', time: '8:21 am' },
      { k: 'done', text: 'Document checklist sent' },
      { k: 'route', to: 'Follow-up', text: 'Check-in booked for Thursday' },
    ]),
  ],
  'home-services': [
    scene('WhatsApp', '9:05 pm', ['Visit booked', 'Tomorrow, 9:00 am'], [
      { k: 'in', text: 'My AC has stopped working', time: '9:05 pm' },
      { k: 'route', to: 'Booking', text: 'Finding the next technician slot' },
      { k: 'out', who: 'Booking', text: 'A technician can come tomorrow at 9am. Does that work?', time: '9:05 pm' },
      { k: 'in', text: 'Yes please', time: '9:06 pm' },
      { k: 'done', text: 'Technician booked, tomorrow 9:00 am' },
      { k: 'route', to: 'Follow-up', text: 'Arrival message at 8:30 am' },
    ]),
    scene('Website', '6:40 am', ['Survey booked', 'Today, 3:00 pm'], [
      { k: 'in', text: 'How much is a deep clean for a three-bedroom villa?', time: '6:40 am' },
      { k: 'route', to: 'Front Desk', text: 'Capturing the job details' },
      { k: 'out', who: 'Front Desk', text: 'It depends on size and condition. Can we book a quick survey?', time: '6:40 am' },
      { k: 'in', text: 'Sure, this afternoon', time: '6:41 am' },
      { k: 'done', text: 'Survey booked for today, 3:00 pm' },
      { k: 'route', to: 'Admin', text: 'Job created for the team' },
    ]),
  ],
  travel: [
    scene('WhatsApp', '11:55 pm', ['Handed to your team', 'Agent has the details'], [
      { k: 'in', text: 'Can you move my flight to Friday?', time: '11:55 pm' },
      { k: 'route', to: 'Front Desk', text: 'Checking the booking' },
      { k: 'out', who: 'Front Desk', text: 'Friday has seats. There may be a fare difference, so I will pass this to an agent.', time: '11:55 pm' },
      { k: 'in', text: 'Okay, thank you', time: '11:56 pm' },
      { k: 'hand', text: 'Change request handed to a travel agent' },
      { k: 'route', to: 'Follow-up', text: 'Customer updated by 9am' },
    ]),
    scene('Instagram', '4:20 pm', ['Enquiry captured', 'Quote on its way'], [
      { k: 'in', text: 'Do you have Maldives packages in December?', time: '4:20 pm' },
      { k: 'route', to: 'Social', text: 'Answering from your packages' },
      { k: 'out', who: 'Social', text: 'We do. How many travellers, and which dates?', time: '4:20 pm' },
      { k: 'in', text: 'Two of us, 18 to 23 December', time: '4:21 pm' },
      { k: 'done', text: 'Quote request created' },
      { k: 'route', to: 'Marketing', text: 'Added to December offers' },
    ]),
  ],
  'professional-services': [
    scene('Website', '8:50 pm', ['Consultation booked', 'Monday, 10:00 am'], [
      { k: 'in', text: 'I need help setting up a company in the UAE', time: '8:50 pm' },
      { k: 'route', to: 'Front Desk', text: 'Understanding the request' },
      { k: 'out', who: 'Front Desk', text: 'Happy to help. Mainland or free zone?', time: '8:50 pm' },
      { k: 'in', text: 'Free zone', time: '8:51 pm' },
      { k: 'done', text: 'Consultation booked for Monday, 10:00 am' },
      { k: 'route', to: 'Admin', text: 'Intake form sent' },
    ]),
    scene('Email', '7:30 am', ['Request handled', 'Account manager copied'], [
      { k: 'in', text: 'Could you resend last month’s invoice?', time: '7:30 am' },
      { k: 'route', to: 'Admin', text: 'Finding the invoice' },
      { k: 'out', who: 'Admin', text: 'Of course, here it is attached.', time: '7:30 am' },
      { k: 'in', text: 'Thank you', time: '7:31 am' },
      { k: 'done', text: 'Invoice resent' },
      { k: 'route', to: 'Follow-up', text: 'Account manager copied' },
    ]),
  ],
  retail: [
    scene('Instagram', '10:15 pm', ['Item reserved', 'Collection tomorrow'], [
      { k: 'in', text: 'Do you have this dress in a medium?', time: '10:15 pm' },
      { k: 'route', to: 'Social', text: 'Checking stock' },
      { k: 'out', who: 'Social', text: 'Yes, in medium. Shall I reserve it for you?', time: '10:15 pm' },
      { k: 'in', text: 'Yes, I will collect tomorrow', time: '10:16 pm' },
      { k: 'done', text: 'Reserved for collection tomorrow' },
      { k: 'route', to: 'Follow-up', text: 'Pickup reminder at 10am' },
    ]),
    scene('WhatsApp', '9:00 am', ['Order update sent', 'Arriving by 2pm'], [
      { k: 'in', text: 'Where is my order?', time: '9:00 am' },
      { k: 'route', to: 'Front Desk', text: 'Checking delivery status' },
      { k: 'out', who: 'Front Desk', text: 'It is out for delivery and arrives by 2pm today.', time: '9:00 am' },
      { k: 'in', text: 'Great, thanks', time: '9:01 am' },
      { k: 'done', text: 'Customer updated' },
      { k: 'route', to: 'Follow-up', text: 'Review request after delivery' },
    ]),
  ],
};

/** The industries overview plays one evening from several sectors in turn. */
export const MIXED_SCENES: Scene[] = [
  INDUSTRY_SCENES.healthcare[0],
  INDUSTRY_SCENES['real-estate'][0],
  INDUSTRY_SCENES.automotive[1],
  INDUSTRY_SCENES.hospitality[0],
];

/** Pages about the human boundary show the moments Stella hands work to a person. */
export const HANDOFF_SCENES: Scene[] = [
  INDUSTRY_SCENES.healthcare[1],
  INDUSTRY_SCENES['real-estate'][1],
  INDUSTRY_SCENES.travel[0],
  INDUSTRY_SCENES['financial-services'][0],
];

/** The live scenes each editorial page plays in its hero. */
export const EDITORIAL_SCENES: Record<string, Scene[]> = {
  integrations: MIXED_SCENES,
  'human-boundary': HANDOFF_SCENES,
  security: HANDOFF_SCENES,
};

export const COACH_STAGES = ['Opening', 'Discovery', 'Objection', 'Close'];

export const COACH_SCENES: Scene[] = [
  {
    channel: 'Practice call',
    status: 'is running a practice call',
    clock: 'Round 3',
    toast: ['Round scored', 'Price objection handled'],
    items: [
      { k: 'in', text: 'Honestly, your price is higher than the last quote we had.', time: 'Buyer, 0:42' },
      { k: 'route', to: 'Objection', text: 'Price objection' },
      { k: 'out', who: 'You', text: 'That is fair. What did the other quote include?', time: '0:48' },
      { k: 'in', text: 'Just the basic package.', time: 'Buyer, 0:53' },
      { k: 'done', text: 'Handled: you moved the talk to value' },
      { k: 'route', to: 'Close', text: 'Next: ask for the meeting' },
    ],
  },
  {
    channel: 'Practice call',
    status: 'is running a practice call',
    clock: 'Round 1',
    toast: ['Round scored', 'Opening landed'],
    items: [
      { k: 'in', text: 'I am busy. What is this about?', time: 'Buyer, 0:04' },
      { k: 'route', to: 'Opening', text: 'Cold open' },
      { k: 'out', who: 'You', text: 'I will be quick. We help clinics stop missing after-hours calls.', time: '0:09' },
      { k: 'in', text: 'Okay, go on.', time: 'Buyer, 0:15' },
      { k: 'done', text: 'Strong opening: you earned more time' },
      { k: 'route', to: 'Discovery', text: 'Next: ask about their week' },
    ],
  },
];
