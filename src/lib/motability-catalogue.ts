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
  "drive-medical-manual-fold-plus": { category: "Folding Mobility Scooters" },
  "motion-health-care-lithilite-air": { category: "Mobility Scooters" },
  "pride-revo-20-1": { category: "Mobility Scooters" },
  "motion-health-care-mlite": { category: "Folding Mobility Scooters" },
  "whill-r-3-wheel": { category: "Mobility Scooters" },
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
