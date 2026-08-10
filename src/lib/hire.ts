/**
 * Hire commercial model — short-term + Flex.
 *
 * Short-term: day/week packages within full call-out coverage.
 * Flex: flat monthly, 3-month minimum, month 1 + deposit upfront,
 *        free delivery/collection/servicing inside the Flex zone only.
 */

export type HireMode = "short" | "flex";

export type HireTierId =
  | "travel"
  | "mid"
  | "large"
  | "manual"
  | "powered";

export type HireRateCard = {
  id: HireTierId;
  label: string;
  /** Inclusive package for 1–3 days */
  threeDay: number;
  weekly: number;
  twoWeek: number;
  monthly: number;
  deposit: number;
  /** Used only as a fallback for odd day counts between packages */
  daily: number;
};

/** Published rate card — one price per tier, no new/used split. */
export const HIRE_RATE_CARD: Record<HireTierId, HireRateCard> = {
  travel: {
    id: "travel",
    label: "Travel / compact scooter",
    threeDay: 75,
    weekly: 120,
    twoWeek: 200,
    monthly: 109,
    deposit: 100,
    daily: 35,
  },
  mid: {
    id: "mid",
    label: "Mid-size scooter",
    threeDay: 95,
    weekly: 150,
    twoWeek: 250,
    monthly: 140,
    deposit: 100,
    daily: 45,
  },
  large: {
    id: "large",
    label: "Large / road scooter",
    threeDay: 115,
    weekly: 180,
    twoWeek: 300,
    monthly: 169,
    deposit: 100,
    daily: 55,
  },
  manual: {
    id: "manual",
    label: "Manual wheelchair",
    threeDay: 60,
    weekly: 85,
    twoWeek: 140,
    monthly: 69,
    deposit: 100,
    daily: 25,
  },
  powered: {
    id: "powered",
    label: "Powered wheelchair",
    threeDay: 95,
    weekly: 120,
    twoWeek: 210,
    monthly: 149,
    deposit: 100,
    daily: 20,
  },
};

/** Short-term hire cannot exceed this — longer needs go to Flex. */
export const SHORT_TERM_MAX_DAYS = 28;

/** Short-term minimum hire length. */
export const SHORT_TERM_MIN_DAYS = 3;

/** Flex commitment before you can cancel with no tie-in. */
export const FLEX_MIN_MONTHS = 3;

/** Days of notice before a short-term start date. */
export const HIRE_BOOKING_NOTICE_DAYS = 7;

/** Flex zone radii (one-way miles) — tighter than sale call-out coverage. */
export const FLEX_ZONE_MILES = {
  heathrow: 10,
  ferndown: 20,
} as const;

const CATEGORY_TO_TIER: { match: RegExp; tier: HireTierId }[] = [
  { match: /folding.*scooter|small scooter|travel/i, tier: "travel" },
  { match: /large.*scooter|road/i, tier: "large" },
  { match: /mid.?size|mobility scooter/i, tier: "mid" },
  { match: /manual.*wheelchair/i, tier: "manual" },
  {
    match: /powered|power chair|folding.*wheelchair|wheelchair/i,
    tier: "powered",
  },
];

export function tierFromCategory(category: string | null | undefined): HireTierId {
  const c = category || "";
  for (const row of CATEGORY_TO_TIER) {
    if (row.match.test(c)) return row.tier;
  }
  // Default scooters to mid; unknown → mid is the safest commercial middle.
  return "mid";
}

export function rateCardForProduct(input: {
  category?: string | null;
  hire_daily_rate?: number | null;
  hire_weekly_rate?: number | null;
  hire_monthly_rate?: number | null;
  hire_deposit?: number | null;
}): HireRateCard {
  const tier = tierFromCategory(input.category);
  const base = HIRE_RATE_CARD[tier];

  // Prefer admin-set rates when present; otherwise use the published card.
  const daily = Number(input.hire_daily_rate || 0);
  const weekly = Number(input.hire_weekly_rate || 0);
  const monthly = Number(input.hire_monthly_rate || 0);
  const deposit = Number(input.hire_deposit || 0);

  if (daily > 0 || weekly > 0 || monthly > 0) {
    return {
      ...base,
      daily: daily > 0 ? daily : base.daily,
      weekly: weekly > 0 ? weekly : base.weekly,
      threeDay: daily > 0 ? Math.min(daily * 3, base.threeDay) : base.threeDay,
      twoWeek: weekly > 0 ? Math.round(weekly * 1.65) : base.twoWeek,
      monthly: monthly > 0 ? monthly : base.monthly,
      deposit: deposit > 0 ? deposit : base.deposit,
    };
  }

  return base;
}

/** Package-aware short-term hire subtotal (1–28 days). */
export function calcShortTermHirePrice(
  days: number,
  rates: HireRateCard,
): number {
  const d = Math.max(1, Math.floor(days));
  if (d <= 3) return rates.threeDay;
  if (d <= 7) return rates.weekly;
  if (d <= 14) return rates.twoWeek;

  // 15–28 days: weeks + remainder, or two-week + next package, or daily.
  const weeks = Math.floor(d / 7);
  const rem = d - weeks * 7;
  const weekPack =
    weeks * rates.weekly + (rem > 0 ? Math.min(rem * rates.daily, rates.threeDay) : 0);
  const remAfterTwo = d - 14;
  const afterTwo =
    rates.twoWeek +
    (remAfterTwo <= 3
      ? rates.threeDay
      : remAfterTwo <= 7
        ? rates.weekly
        : remAfterTwo * rates.daily);
  const dailyOnly = d * rates.daily;
  return Number(Math.min(weekPack, afterTwo, dailyOnly).toFixed(2));
}

/** Flex due today: first month + deposit. Delivery is free inside the Flex zone. */
export function calcFlexDueToday(rates: HireRateCard): {
  monthFee: number;
  deposit: number;
  total: number;
} {
  return {
    monthFee: rates.monthly,
    deposit: rates.deposit,
    total: Number((rates.monthly + rates.deposit).toFixed(2)),
  };
}

export function addMonths(isoDate: string, months: number): string {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function addDaysIso(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
