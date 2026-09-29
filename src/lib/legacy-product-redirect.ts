import { redirect } from "next/navigation";

/**
 * Old product addresses from the WordPress and Shopify sites are still in
 * search results. When the product no longer exists, send the visitor to the
 * closest matching section instead of a dead end — and keep adaptation
 * customers out of the scooter & wheelchair shop.
 *
 * Order matters: the first matching rule wins (e.g. "scooter-hoist" is a
 * hoist, "mobility-scooter-service" is servicing).
 */
const LEGACY_PRODUCT_RULES: ReadonlyArray<readonly [RegExp, string]> = [
  [/(^|-)(service|servicing|repair)(-|$)/, "/servicing"],
  [
    /hoist|lifter|carolift|winch|docking|stowage|rooftop|boot-opener|boot-strap/,
    "/vehicle-adaptations/hoists-stowage",
  ],
  [
    /swivel|turny|turnout|carony|s-tran|rotating-car-seat|transfer-plate|side-step|grab-handle|seat-runner|protective-screen/,
    "/vehicle-adaptations/vehicle-access",
  ],
  [
    /hand-control|push-pull|accelerator|steering|spinner|pedal|handbrake|secondary-control|easy-release|slider-control|clutch|kivi/,
    "/vehicle-adaptations/driving-controls",
  ],
  [/scooter/, "/shop?sub=scooters"],
  [/wheelchair|powerchair|power-chair|chair/, "/shop?sub=wheelchairs"],
];

export function legacyProductDestination(slug: string): string | null {
  const s = slug.toLowerCase();
  for (const [pattern, destination] of LEGACY_PRODUCT_RULES) {
    if (pattern.test(s)) return destination;
  }
  return null;
}

/**
 * Call when a product slug is not found. Redirects (temporary, so a product
 * that comes back under the same address still works) when there is a
 * sensible destination; otherwise returns and the caller shows the 404 page.
 */
export function redirectLegacyProduct(slug: string): void {
  const destination = legacyProductDestination(slug);
  if (destination) redirect(destination);
}
