/** Normalize admin preset values for display (en-dash). */
export function formatDeliveryEstimate(raw: string | null | undefined) {
  const value = raw?.trim();
  if (!value) return null;
  const presets: Record<string, string> = {
    "1-3 days": "1–3 days",
    "4-7 days": "4–7 days",
    "1-2 weeks": "1–2 weeks",
    "2-4 weeks": "2–4 weeks",
  };
  return presets[value.toLowerCase()] ?? value;
}

/** Brands that typically ship quickly from supplier stock. */
const FAST_DELIVERY_BRANDS = ["karma", "eezychair", "xsto", "ergofold"];

export type DeliveryTimingKind =
  | "estimate"
  | "dispatch"
  | "weekend"
  | "manufacturer"
  | "fast-supplier";

export type DeliveryTiming = {
  kind: DeliveryTimingKind;
  /** Short headline shown bold, e.g. "1–3 working days" */
  highlight: string;
  /** Leading sentence before the highlight */
  prefix: string;
  /** Optional trailing note */
  suffix?: string;
};

/**
 * Resolve a customer-facing delivery timing message for shop PDPs.
 * Prefers the admin `delivery_estimate` when set; otherwise falls back to
 * stock tracking + brand heuristics (mirrors the Lovable site).
 */
export function resolveDeliveryTiming(opts: {
  deliveryEstimate?: string | null;
  trackStock?: boolean;
  manufacturer?: string | null;
  /** Precomputed countdown — when null and trackStock, past cutoff / skip. */
  dispatchCountdown?: { hours: number; minutes: number } | null;
  isWeekend?: boolean;
}): DeliveryTiming | null {
  const estimate = formatDeliveryEstimate(opts.deliveryEstimate);
  if (estimate) {
    const longLead =
      /week/i.test(estimate) ||
      estimate.startsWith("4–7") ||
      estimate.startsWith("4-7");
    if (longLead) {
      return {
        kind: "manufacturer",
        prefix: "Ordered from the manufacturer — typically",
        highlight: estimate,
      };
    }
    return {
      kind: "estimate",
      prefix: "Usually delivered in",
      highlight: workingDaysLabel(estimate),
    };
  }

  if (!opts.trackStock) {
    const fast =
      opts.manufacturer &&
      FAST_DELIVERY_BRANDS.includes(opts.manufacturer.toLowerCase());
    return {
      kind: fast ? "fast-supplier" : "manufacturer",
      prefix: fast
        ? "Ships from supplier stock — typically"
        : "Ordered from the manufacturer — typically",
      highlight: fast ? "1–2 working days" : "3–5 working days",
    };
  }

  if (opts.isWeekend) {
    return {
      kind: "weekend",
      prefix: "Orders placed over the weekend dispatch on",
      highlight: "Monday",
    };
  }

  if (opts.dispatchCountdown) {
    const { hours, minutes } = opts.dispatchCountdown;
    const countdown = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    return {
      kind: "dispatch",
      prefix: "Order within",
      highlight: countdown,
      suffix: "for next-day dispatch",
    };
  }

  return {
    kind: "estimate",
    prefix: "Usually dispatched within",
    highlight: "1–2 working days",
  };
}

function workingDaysLabel(estimate: string) {
  if (/working day/i.test(estimate)) return estimate;
  if (/^\d+[–-]\d+\s*days?$/i.test(estimate)) {
    return estimate.replace(/days?/i, "working days");
  }
  return estimate;
}
