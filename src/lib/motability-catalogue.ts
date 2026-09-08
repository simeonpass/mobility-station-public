import type { ProductListItem } from "@/lib/products";

const WHEELCHAIR_CATEGORIES = new Set([
  "Manual Wheelchairs",
  "Powered Wheelchairs",
  "Folding Powered Wheelchairs",
  "Wheelchairs",
]);

// These models have incorrect categories in the imported catalogue. Keep the
// correction specific to each model: names such as WHILL cover both types.
const MODEL_CORRECTIONS: Record<string, { category: string; name?: string }> = {
  "drive-medical-jaunt": { category: "Small Scooters" },
  "pride-gogo-mg2": { category: "Folding Mobility Scooters" },
  "pride-gogo-mg-lite-folding-mobility-scooter": { category: "Folding Mobility Scooters" },
  "pride-gogo-super-portable": { category: "Folding Mobility Scooters" },
  "pride-gogo-compact-folding-car-portable-scooter-airline-compliant-lithium-battery": { category: "Folding Mobility Scooters" },
  "kymco-vivio-powerchair": { category: "Folding Powered Wheelchairs" },
  "drive-medical-manual-fold-plus": { category: "Folding Mobility Scooters" },
  "motion-health-care-lithilite-air": { category: "Small Scooters" },
  "pride-revo-20-1": { category: "Mid Size Scooters" },
  "motion-health-care-mlite": { category: "Folding Mobility Scooters" },
  "whill-r-3-wheel": { category: "Small Scooters" },
  "drive-medical-aerocarbon-powerchair": { category: "Folding Powered Wheelchairs" },
  "motion-health-care-photon": { category: "Folding Powered Wheelchairs" },
  "motion-health-care-photon-lite": { category: "Folding Powered Wheelchairs" },
  "karma-traveller": { category: "Folding Powered Wheelchairs" },
  "motion-healthcare-photon-hd-folding-mobility-scooter": {
    category: "Folding Powered Wheelchairs",
    name: "Motion Healthcare Photon HD Powered Wheelchair",
  },
};

export function normaliseMotabilityProduct(product: ProductListItem): ProductListItem {
  const correction = Object.hasOwn(MODEL_CORRECTIONS, product.slug)
    ? MODEL_CORRECTIONS[product.slug]
    : undefined;
  return correction ? { ...product, ...correction } : product;
}

export function isMotabilityWheelchair(product: ProductListItem): boolean {
  return WHEELCHAIR_CATEGORIES.has(product.category || "");
}

export function isManualWheelchair(product: Pick<ProductListItem, "slug" | "category">): boolean {
  const category = Object.hasOwn(MODEL_CORRECTIONS, product.slug)
    ? MODEL_CORRECTIONS[product.slug].category
    : product.category;
  return category?.trim().toLowerCase() === "manual wheelchairs";
}

export function isMotabilityProduct(product: ProductListItem): boolean {
  return !isManualWheelchair(product) && (
    (product.motability_weekly_price != null && product.motability_weekly_price > 0) ||
    product.motability_price != null
  );
}

export type MotabilityCategory = { id: string; label: string; categories: readonly string[] };

export const MOTABILITY_SCOOTER_CATEGORIES: readonly MotabilityCategory[] = [
  { id: "small", label: "Small & boot scooters", categories: ["Small Scooters"] },
  { id: "folding", label: "Folding scooters", categories: ["Folding Mobility Scooters"] },
  { id: "mid-size", label: "Mid-size scooters", categories: ["Mid Size Scooters"] },
  { id: "large", label: "Large scooters", categories: ["Large Mobility Scooters"] },
  { id: "other", label: "Other scooters", categories: ["Mobility Scooters"] },
];

export const MOTABILITY_WHEELCHAIR_CATEGORIES: readonly MotabilityCategory[] = [
  { id: "folding", label: "Folding powerchairs", categories: ["Folding Powered Wheelchairs"] },
  { id: "powered", label: "Other powered wheelchairs", categories: ["Powered Wheelchairs", "Wheelchairs"] },
];
