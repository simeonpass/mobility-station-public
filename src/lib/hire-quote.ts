import {
  FLEX_SETUP_FEE_GBP,
  HIRE_PRICING_CATEGORIES,
  LOCAL_DELIVERY_FEE_GBP,
  LOCAL_DELIVERY_MILES,
  WIDER_DELIVERY_FROM_GBP,
  hireCategoryById,
  type HirePricingCategory,
  type HirePricingCategoryId,
} from "@/lib/hire-pricing";
import { SHORT_TERM_MAX_DAYS, SHORT_TERM_MIN_DAYS } from "@/lib/hire";

export type HireDeliveryMode =
  | "collect_heathrow"
  | "collect_ferndown"
  | "deliver";

export type HireQuoteInput = {
  hireType: "short" | "flex";
  categoryId: HirePricingCategoryId;
  startDate: string;
  endDate?: string;
  delivery: HireDeliveryMode;
  /** One-way miles from nearest branch when delivering (from coverage lookup). */
  deliveryMiles?: number | null;
  vatRelief: boolean;
};

export type HireQuote = {
  hireType: "short" | "flex";
  category: HirePricingCategory;
  days: number;
  startDate: string;
  endDate: string;
  hireChargeExVat: number;
  deliveryOrSetupExVat: number;
  deliveryOrSetupLabel: string;
  deposit: number;
  depositLabel: string;
  vatAmount: number;
  vatRate: number;
  total: number;
  lineItems: { label: string; amount: number }[];
};

function parseIso(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function hireDaysBetween(startIso: string, endIso: string) {
  const start = parseIso(startIso);
  const end = parseIso(endIso);
  if (!start || !end) return 0;
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / 86400000) + 1;
}

/** Package-aware short-term hire charge from the published 9-category card. */
export function calcPublishedShortTermHire(
  days: number,
  cat: HirePricingCategory,
): number {
  const d = Math.max(1, Math.floor(days));
  if (d <= 3) return cat.threeDay;
  if (d === 7) return cat.week;
  if (d === 14) return cat.twoWeeks;
  if (d >= 28) return cat.fourWeeks;

  if (d < 7) {
    return Math.min(cat.threeDay + (d - 3) * cat.extraDay, cat.week);
  }
  if (d < 14) {
    return Math.min(cat.week + (d - 7) * cat.extraDay, cat.twoWeeks);
  }
  return Math.min(cat.twoWeeks + (d - 14) * cat.extraDay, cat.fourWeeks);
}

function deliveryFee(
  hireType: "short" | "flex",
  delivery: HireDeliveryMode,
  miles?: number | null,
): { amount: number; label: string } {
  if (hireType === "flex") {
    return {
      amount: FLEX_SETUP_FEE_GBP,
      label: `Flex set-up (delivery, set-up & handover)`,
    };
  }
  if (delivery !== "deliver") {
    return { amount: 0, label: "Branch collection — free" };
  }
  if (miles == null || Number.isNaN(miles)) {
    return {
      amount: LOCAL_DELIVERY_FEE_GBP,
      label: `Local delivery (within ${LOCAL_DELIVERY_MILES} miles) — confirmed on postcode`,
    };
  }
  if (miles <= LOCAL_DELIVERY_MILES) {
    return {
      amount: LOCAL_DELIVERY_FEE_GBP,
      label: `Local delivery (${miles.toFixed(1)} mi round-trip band)`,
    };
  }
  if (miles <= 40) {
    // Linear step from £95 at 15mi toward a soft ceiling — London still quoted.
    const t = (miles - LOCAL_DELIVERY_MILES) / (40 - LOCAL_DELIVERY_MILES);
    const amount = Math.round(
      WIDER_DELIVERY_FROM_GBP + t * (150 - WIDER_DELIVERY_FROM_GBP),
    );
    return {
      amount,
      label: `Wider delivery (~${miles.toFixed(0)} mi) — confirmed before dispatch`,
    };
  }
  throw new Error(
    "That address is outside our standard hire delivery range. Please choose branch collection or call us.",
  );
}

export function buildHireQuote(input: HireQuoteInput): HireQuote {
  const category = hireCategoryById(input.categoryId);
  if (!category) throw new Error("Please choose a hire category");

  const start = parseIso(input.startDate);
  if (!start) throw new Error("Please choose a valid start date");

  let endDate = input.endDate || "";
  let days = 0;

  if (input.hireType === "flex") {
    const end = new Date(start);
    end.setMonth(end.getMonth() + 3);
    endDate = end.toISOString().slice(0, 10);
    days = hireDaysBetween(input.startDate, endDate);
  } else {
    if (!input.endDate) throw new Error("Please choose an end date");
    days = hireDaysBetween(input.startDate, input.endDate);
    if (days < SHORT_TERM_MIN_DAYS) {
      throw new Error(`Short-term hire is at least ${SHORT_TERM_MIN_DAYS} days`);
    }
    if (days > SHORT_TERM_MAX_DAYS) {
      throw new Error(
        `Short-term hire stops at ${SHORT_TERM_MAX_DAYS} days — please choose Flex for longer hires`,
      );
    }
    endDate = input.endDate;
  }

  const hireChargeExVat =
    input.hireType === "flex"
      ? category.flexMonthly
      : calcPublishedShortTermHire(days, category);

  const del = deliveryFee(
    input.hireType,
    input.delivery,
    input.deliveryMiles,
  );

  const deposit =
    input.hireType === "flex" ? category.flexMonthly : category.deposit;
  const depositLabel =
    input.hireType === "flex"
      ? "First month (held as rolling deposit — always a month ahead)"
      : "Refundable damage deposit";

  // Flex: first month is the deposit (month ahead). Due today = month + setup.
  // Short-term: hire charge + deposit + delivery.
  const taxable =
    input.hireType === "flex"
      ? hireChargeExVat + del.amount
      : hireChargeExVat + del.amount;
  const vatRate = input.vatRelief ? 0 : 20;
  const vatAmount = Number(((taxable * vatRate) / 100).toFixed(2));

  const lineItems: { label: string; amount: number }[] =
    input.hireType === "flex"
      ? [
          {
            label: `Flex — first month (${category.label})`,
            amount: hireChargeExVat,
          },
          { label: del.label, amount: del.amount },
        ]
      : [
          {
            label: `Short-term hire — ${days} day${days === 1 ? "" : "s"} (${category.label})`,
            amount: hireChargeExVat,
          },
          { label: del.label, amount: del.amount },
          { label: depositLabel, amount: deposit },
        ];

  if (vatAmount > 0) {
    lineItems.push({ label: "VAT (20%)", amount: vatAmount });
  } else {
    lineItems.push({ label: "VAT relief applied", amount: 0 });
  }

  const total =
    input.hireType === "flex"
      ? Number((hireChargeExVat + del.amount + vatAmount).toFixed(2))
      : Number(
          (hireChargeExVat + del.amount + deposit + vatAmount).toFixed(2),
        );

  return {
    hireType: input.hireType,
    category,
    days,
    startDate: input.startDate,
    endDate,
    hireChargeExVat,
    deliveryOrSetupExVat: del.amount,
    deliveryOrSetupLabel: del.label,
    deposit: input.hireType === "flex" ? hireChargeExVat : deposit,
    depositLabel,
    vatAmount,
    vatRate,
    total,
    lineItems,
  };
}

export function categoryOptions() {
  return HIRE_PRICING_CATEGORIES.map((c) => ({ id: c.id, label: c.label }));
}
