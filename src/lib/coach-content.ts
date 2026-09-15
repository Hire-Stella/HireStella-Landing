/**
 * The illustrative coaching workspace for Stella Sales Coach.
 *
 * Same contract as `workspace-content.ts`: nothing here is a claim, every
 * figure reconciles with every other, and the component never prints a number
 * that was typed rather than derived. The tiles are sums of the series being
 * plotted, the average competency is the mean of the bars beneath it, and
 * "below target" is a count of the sellers listed, so no view can drift away
 * from another as the copy changes.
 *
 * Why this is a second dataset and not a second entry in `workspaces`: the
 * operations workspace measures enquiries becoming bookings. Coaching measures
 * sessions becoming competence. They share no series, no records and no
 * vocabulary — only the CSS. Forcing one shape over both would have meant
 * calling a role-play an "enquiry".
 *
 * The team is deliberately anonymous. Sellers are named by cohort and role,
 * never by person: an invented seller with a real-sounding name on a HireStella
 * page implies a customer who does not exist, which is the same rule the
 * photography follows.
 */

export type CoachPoint = { label: string; sessions: number; passed: number };

export type Scenario = {
  id: string;
  length: string;
  kind: string;
  title: string;
  status: 'Passed' | 'Coaching needed' | 'Not attempted';
  icon: string;
  detail: string;
};

export type CoachWorkspaceData = {
  workspace: string;
  initials: string;
  day: string;
  headline: string;
  /** A competency counts as met at or above this score. Drives the orange tile. */
  target: number;
  week: CoachPoint[];
  quarter: CoachPoint[];
  competencies: { name: string; role: string; icon: string; score: number }[];
  sellers: { name: string; role: string; icon: string; score: number }[];
  scenarios: Scenario[];
  transcript: { time: string; label: string; flag?: boolean }[];
};

export const demoCoachWorkspace: CoachWorkspaceData = {
  workspace: 'Demo sales team',
  initials: 'DS',
  day: 'Week 24 · sample data',
  headline: 'Where the team is actually strong.',
  target: 70,

  /* Sessions and the scenarios passed out of them. The week runs a little
     ahead of the quarter average, which is the whole point of plotting both. */
  week: [
    { label: 'Mon', sessions: 18, passed: 11 },
    { label: 'Tue', sessions: 24, passed: 15 },
    { label: 'Wed', sessions: 21, passed: 13 },
    { label: 'Thu', sessions: 27, passed: 18 },
    { label: 'Fri', sessions: 22, passed: 14 },
  ],
  quarter: [
    { label: 'Wk 1', sessions: 68, passed: 34 },
    { label: 'Wk 2', sessions: 84, passed: 46 },
    { label: 'Wk 3', sessions: 96, passed: 56 },
    { label: 'Wk 4', sessions: 103, passed: 64 },
    { label: 'Wk 5', sessions: 112, passed: 72 },
    { label: 'Wk 6', sessions: 121, passed: 81 },
  ],

  /* Scored separately, because "good at sales" is not a measurement. The mean
     of these five is the average competency tile. */
  competencies: [
    { name: 'Discovery', role: 'Questions before pitch', icon: 'help', score: 78 },
    { name: 'Objection handling', role: 'Pushback without retreat', icon: 'shield', score: 61 },
    { name: 'Value articulation', role: 'Outcome, not feature list', icon: 'star', score: 72 },
    { name: 'Qualification', role: 'Budget, authority, timing', icon: 'check', score: 80 },
    { name: 'Closing', role: 'Asking for the next step', icon: 'send', score: 66 },
  ],

  sellers: [
    { name: 'New hire · week 2', role: 'Onboarding cohort', icon: 'graduation', score: 54 },
    { name: 'New hire · week 6', role: 'Onboarding cohort', icon: 'graduation', score: 68 },
    { name: 'SDR · cohort 4', role: 'Outbound', icon: 'phone', score: 62 },
    { name: 'Mid-market AE', role: 'Full cycle', icon: 'briefcase', score: 77 },
    { name: 'Enterprise AE', role: 'Full cycle', icon: 'building', score: 83 },
  ],

  /* Exactly two need coaching, so the sidebar pip and the filtered view agree. */
  scenarios: [
    {
      id: 'SC-11',
      length: '6 min',
      kind: 'Discovery call',
      title: 'Incumbent vendor objection',
      status: 'Coaching needed',
      icon: 'message',
      detail:
        'The buyer opens with "we already have something that does this". The seller defended the product for ninety seconds before asking what the incumbent does not cover. Flagged: discovery skipped under pressure.',
    },
    {
      id: 'SC-12',
      length: '9 min',
      kind: 'Demo call',
      title: 'Pricing pushback before value',
      status: 'Coaching needed',
      icon: 'chart',
      detail:
        'Price was quoted at 1:06, before any business outcome had been agreed. Flagged: value not yet articulated. Suggested practice — the same scenario with the number withheld until the cost of the problem is named.',
    },
    {
      id: 'SC-13',
      length: '5 min',
      kind: 'Cold call',
      title: 'Gatekeeper to decision maker',
      status: 'Passed',
      icon: 'phone',
      detail:
        'Reached the named decision maker without misrepresenting the reason for the call, and booked a follow-up. Strengths: tone, brevity, a clear ask.',
    },
    {
      id: 'SC-14',
      length: '11 min',
      kind: 'Renewal',
      title: 'Multi-threaded renewal risk',
      status: 'Passed',
      icon: 'users',
      detail:
        'Surfaced a second stakeholder the account had never spoken to, and proposed a joint session rather than escalating. Strengths: qualification, patience.',
    },
    {
      id: 'SC-15',
      length: '7 min',
      kind: 'Discovery call',
      title: 'Budget holder joins late',
      status: 'Not attempted',
      icon: 'calendar',
      detail:
        'Assigned to the onboarding cohort this week. Not yet attempted, so it carries no score and is excluded from the averages above.',
    },
  ],

  /* One role-play, as it actually reads back. The flagged line is the one the
     coach stopped on — the only orange in this view. */
  transcript: [
    { time: '00:12', label: 'Buyer: “We already have something that does this.”' },
    { time: '00:20', label: 'Seller asks what the incumbent does not cover. Good opening move.' },
    { time: '00:41', label: 'Buyer raises budget before any outcome has been agreed.' },
    { time: '01:06', label: 'Seller quotes a price. Coach flags: value not yet articulated.', flag: true },
    { time: '01:38', label: 'Seller returns to the business problem. Buyer re-engages.' },
    { time: '02:15', label: 'Session ends · three strengths, two gaps, one missed opportunity.' },
  ],
};
