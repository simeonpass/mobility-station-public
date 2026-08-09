/**
 * Hardcoded Mobility Care Plans — prices must match the Lovable
 * `care-plan-checkout` edge function exactly (server re-validates).
 *
 * planKey values confirmed against the live function:
 * essential | complete | total-care
 */

export type CarePlanKey = "essential" | "complete" | "total-care";

export type CarePlan = {
  key: CarePlanKey;
  name: string;
  /** Monthly price in GBP — must match Stripe / edge function. */
  priceMonthly: number;
  /** Display string e.g. "£12.99" */
  priceLabel: string;
  tagline: string;
  mostPopular?: boolean;
  features: string[];
  terms: string[];
};

export const CARE_PLANS: CarePlan[] = [
  {
    key: "essential",
    name: "Essential",
    priceMonthly: 12.99,
    priceLabel: "£12.99",
    tagline: "Stay on top of routine care without the hassle.",
    features: [
      "Priority booking for services and repairs",
      "10% off labour at Heathrow & Ferndown",
      "Annual service reminder for your equipment",
      "Direct phone support from our workshops",
    ],
    terms: [
      "Monthly subscription, cancel anytime",
      "Discount applies to Mobility Station workshop labour",
      "Subject to Care Plan terms at checkout",
    ],
  },
  {
    key: "complete",
    name: "Complete",
    priceMonthly: 19.99,
    priceLabel: "£19.99",
    tagline: "Our most popular plan for everyday peace of mind.",
    mostPopular: true,
    features: [
      "Everything in Essential",
      "15% off labour",
      "10% off parts",
      "Free local collection & return in our service area",
      "Loan scooter when available during workshop repairs",
    ],
    terms: [
      "Monthly subscription, cancel anytime",
      "Collection within our published service area",
      "Loan equipment subject to availability",
      "Subject to Care Plan terms at checkout",
    ],
  },
  {
    key: "total-care",
    name: "Total Care",
    priceMonthly: 29.99,
    priceLabel: "£29.99",
    tagline: "Maximum cover for scooters, wheelchairs and busy households.",
    features: [
      "Everything in Complete",
      "20% off labour",
      "15% off parts",
      "One annual service included each year",
      "Priority emergency call-out where available",
    ],
    terms: [
      "Monthly subscription, cancel anytime",
      "Annual service is for one registered machine",
      "Emergency call-out within our service area",
      "Subject to Care Plan terms at checkout",
    ],
  },
];

export function getCarePlan(key: string | null | undefined) {
  return CARE_PLANS.find((p) => p.key === key) ?? null;
}

export function formatCarePlanPrice(plan: CarePlan) {
  return `${plan.priceLabel}/month`;
}
