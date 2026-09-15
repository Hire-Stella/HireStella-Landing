/**
 * The ROI calculator.
 *
 * Four inputs the visitor already knows, one they get from their proposal,
 * and a breakdown that shows its own arithmetic. The old capacity panel moved
 * a single slider and produced a number nobody could trace back to anything,
 * which is exactly the complaint it was rebuilt for.
 *
 * Nothing here is a HireStella price. The annual figure is typed in by the
 * visitor, so the calculator works without publishing a rate card.
 */

export type Country = {
  id: string;
  name: string;
  region: string;
  currency: string;
  locale: string;
  /** Starting assumption for the cost of handling one call, in local currency. */
  callCost: number;
  /** The monthly front-desk salary the starting assumption is derived from. */
  salary: number;
};

/**
 * The starting cost per call is salary ÷ CALLS_PER_AGENT, rounded for display.
 * It is an editable assumption shown with its own derivation, never a measured
 * benchmark, and the panel says so.
 */
export const CALLS_PER_AGENT = 1000;

export const countries: Country[] = [
  // ── Middle East ──
  { id: 'ae', name: 'United Arab Emirates', region: 'Middle East', currency: 'AED', locale: 'en-AE', callCost: 5, salary: 5000 },
  { id: 'sa', name: 'Saudi Arabia', region: 'Middle East', currency: 'SAR', locale: 'en-SA', callCost: 5, salary: 5000 },
  { id: 'qa', name: 'Qatar', region: 'Middle East', currency: 'QAR', locale: 'en-QA', callCost: 5, salary: 5200 },
  { id: 'kw', name: 'Kuwait', region: 'Middle East', currency: 'KWD', locale: 'en-KW', callCost: 0.4, salary: 400 },
  { id: 'om', name: 'Oman', region: 'Middle East', currency: 'OMR', locale: 'en-OM', callCost: 0.4, salary: 400 },
  { id: 'bh', name: 'Bahrain', region: 'Middle East', currency: 'BHD', locale: 'en-BH', callCost: 0.4, salary: 400 },

  // ── South Asia ──
  { id: 'in', name: 'India', region: 'South Asia', currency: 'INR', locale: 'en-IN', callCost: 25, salary: 25000 },
  { id: 'pk', name: 'Pakistan', region: 'South Asia', currency: 'PKR', locale: 'en-PK', callCost: 60, salary: 60000 },

  // ── Southeast Asia ──
  { id: 'sg', name: 'Singapore', region: 'Southeast Asia', currency: 'SGD', locale: 'en-SG', callCost: 3, salary: 3000 },
  { id: 'my', name: 'Malaysia', region: 'Southeast Asia', currency: 'MYR', locale: 'en-MY', callCost: 3, salary: 3000 },
  { id: 'ph', name: 'Philippines', region: 'Southeast Asia', currency: 'PHP', locale: 'en-PH', callCost: 25, salary: 25000 },
  { id: 'id', name: 'Indonesia', region: 'Southeast Asia', currency: 'IDR', locale: 'id-ID', callCost: 5000, salary: 5000000 },
  { id: 'th', name: 'Thailand', region: 'Southeast Asia', currency: 'THB', locale: 'th-TH', callCost: 20, salary: 20000 },
  { id: 'vn', name: 'Vietnam', region: 'Southeast Asia', currency: 'VND', locale: 'vi-VN', callCost: 10000, salary: 10000000 },

  // ── Europe ──
  { id: 'gb', name: 'United Kingdom', region: 'Europe', currency: 'GBP', locale: 'en-GB', callCost: 2.2, salary: 2200 },
  { id: 'eu', name: 'Eurozone', region: 'Europe', currency: 'EUR', locale: 'en-IE', callCost: 2.6, salary: 2600 },

  // ── North America ──
  { id: 'us', name: 'United States', region: 'North America', currency: 'USD', locale: 'en-US', callCost: 3.4, salary: 3400 },
  { id: 'ca', name: 'Canada', region: 'North America', currency: 'CAD', locale: 'en-CA', callCost: 3.8, salary: 3800 },

  // ── Africa & Oceania ──
  { id: 'za', name: 'South Africa', region: 'Africa & Oceania', currency: 'ZAR', locale: 'en-ZA', callCost: 15, salary: 15000 },
  { id: 'eg', name: 'Egypt', region: 'Africa & Oceania', currency: 'EGP', locale: 'en-EG', callCost: 10, salary: 10000 },
  { id: 'ng', name: 'Nigeria', region: 'Africa & Oceania', currency: 'NGN', locale: 'en-NG', callCost: 400, salary: 400000 },
  { id: 'au', name: 'Australia', region: 'Africa & Oceania', currency: 'AUD', locale: 'en-AU', callCost: 4.5, salary: 4500 },
];

/** The select groups by region, in this order. */
export const regions = [
  'Middle East',
  'South Asia',
  'Southeast Asia',
  'Europe',
  'North America',
  'Africa & Oceania',
] as const;

export type RoiInputs = {
  country: string;
  callsPerMonth: number;
  costPerCall: number;
  /** The share of monthly calls the configured workflows would answer. */
  sharePercent: number;
  /** The annual HireStella figure, taken from the visitor's own proposal. */
  stellaAnnual: number;
};

export const defaultInputs: RoiInputs = {
  country: 'ae',
  callsPerMonth: 1200,
  costPerCall: 5,
  sharePercent: 60,
  stellaAnnual: 0,
};

export type RoiResult = {
  handledMonthly: number;
  handledAnnual: number;
  remainingAnnual: number;
  /** Annual cost of handling every call the way it is handled today. */
  baseline: number;
  /** Annual cost of the calls still handled by people, plus the HireStella figure. */
  withStella: number;
  /** Cost of the calls the workforce answers. The gross side of the trade. */
  avoided: number;
  /** avoided − the HireStella figure. Negative means the trade does not pay. */
  netSaving: number;
  reductionPercent: number;
  /** Null until an annual figure is entered — a return on zero is not a number. */
  roiPercent: number | null;
  /** Months for the annual figure to be covered by the cost it removes. */
  paybackMonths: number | null;
};

export function calculateRoi(input: RoiInputs): RoiResult {
  const calls = Math.max(0, input.callsPerMonth);
  const cost = Math.max(0, input.costPerCall);
  const share = Math.min(100, Math.max(0, input.sharePercent));
  const fee = Math.max(0, input.stellaAnnual);

  const handledMonthly = Math.round((calls * share) / 100);
  const handledAnnual = handledMonthly * 12;
  const remainingAnnual = Math.max(0, calls * 12 - handledAnnual);

  const baseline = calls * 12 * cost;
  const avoided = handledAnnual * cost;
  const withStella = remainingAnnual * cost + fee;
  const netSaving = baseline - withStella;

  const monthlyAvoided = avoided / 12;

  return {
    handledMonthly,
    handledAnnual,
    remainingAnnual,
    baseline,
    withStella,
    avoided,
    netSaving,
    reductionPercent: baseline > 0 ? (netSaving / baseline) * 100 : 0,
    roiPercent: fee > 0 ? (netSaving / fee) * 100 : null,
    paybackMonths: fee > 0 && monthlyAvoided > 0 ? fee / monthlyAvoided : null,
  };
}

export function money(value: number, country: Country, decimals = 0) {
  return new Intl.NumberFormat(country.locale, {
    style: 'currency',
    currency: country.currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function count(value: number) {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}
