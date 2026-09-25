import { industries, plans, type SpecialistId, type Term } from './data';

/** A transparent local demonstration, not a model-generated diagnosis. */
export function workforcePreview(problem: string) {
  const text = problem.toLowerCase();
  const industry = /dental|clinic|patient/.test(text)
    ? industries[0]
    : /property|estate|viewing|portal/.test(text)
      ? industries[1]
      : /bank|finance|regulated/.test(text)
        ? industries[2]
        : /salon|wellness|hair/.test(text)
          ? industries[3]
          : undefined;
  const ids = new Set<SpecialistId>(industry?.ids ?? ['front-desk', 'admin']);
  if (/call|phone|voice/.test(text)) ids.add('voice');
  if (/book|schedule|appointment/.test(text)) ids.add('booking');
  if (/lead|follow|sales|outreach/.test(text)) ids.add('outbound-followup');
  if (/social|instagram/.test(text)) ids.add('social');
  if (/market|campaign|content/.test(text)) ids.add('marketing');
  if (/website|landing/.test(text)) ids.add('website');
  return {
    ids: [...ids],
    industry: industry?.name ?? 'Your business',
    summary:
      industry?.description ??
      'Start with the repetitive first response and record updates, then connect the next steps around your actual operating needs.',
    boundary:
      industry?.boundary ??
      'Sensitive requests, exceptions and decisions requiring judgement stay with your team.',
    steps: industry?.steps ?? [
      'Enquiry received',
      'Intent understood',
      'Specialist activated',
      'Record updated',
      'Next step coordinated',
    ],
  };
}

export type CapacityInputs = {
  weeklyHours: number;
  hourlyCost: number;
  automatableShare: number;
  enquiries: number;
  missedPercent: number;
  conversionPercent: number;
  dealValue: number;
  recoveryPercent: number;
  marginPercent: number;
  voiceMinutes: number;
  providerFees: number;
  setupCost: number;
  plan: number;
  term: Term;
};
export const defaultCapacity: CapacityInputs = {
  weeklyHours: 20,
  hourlyCost: 60,
  automatableShare: 40,
  enquiries: 300,
  missedPercent: 15,
  conversionPercent: 10,
  dealValue: 500,
  recoveryPercent: 20,
  marginPercent: 40,
  voiceMinutes: 150,
  providerFees: 0,
  setupCost: 0,
  plan: 0,
  term: 'annual',
};
export function calculateCapacity(input: CapacityInputs) {
  const plan = plans[input.plan] ?? plans[0];
  const monthlyHours = input.weeklyHours * 4.33;
  const hoursReturned = (monthlyHours * input.automatableShare) / 100;
  const capacityValue = hoursReturned * input.hourlyCost;
  const opportunity =
    (((((input.enquiries * input.missedPercent) / 100) * input.conversionPercent) / 100) *
      input.dealValue *
      input.recoveryPercent) /
    100;
  const contribution = (opportunity * input.marginPercent) / 100;
  const overage = Math.max(0, input.voiceMinutes - plan.minutes) * 0.5;
  const cost = plan.prices[input.term] + overage + input.providerFees + input.setupCost;
  const benefit = capacityValue + contribution - cost;
  return {
    monthlyHours,
    hoursReturned,
    capacityValue,
    opportunity,
    contribution,
    overage,
    cost,
    benefit,
    roi: cost > 0 ? (benefit / cost) * 100 : 0,
  };
}
