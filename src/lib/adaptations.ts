/** Vehicle adaptation taxonomy — matches Lovable website sections. */

export const ADAPTATION_SECTIONS = [
  {
    id: "driving-controls",
    title: "Driving Controls",
    description:
      "Hand controls, accelerators, steering aids and secondary controls — assessed around your vehicle and ability.",
    categories: [
      "Mechanical Hand Controls",
      "Electronic Accelerators",
      "Hinged Accelerator",
      "Parking Sensors",
      "Left Foot Accelerators",
      "Pedal Extensions",
      "Pedal Guards",
      "Steering Aids",
      "Electric Handbrakes",
      "Secondary Controls",
      "Easy Release",
    ],
  },
  {
    id: "hoists-stowage",
    title: "Boot Hoists & Stowage",
    description:
      "Boot and person hoists, wheelchair stowage and winches — supplied and fitted for your car.",
    categories: [
      "Boot Hoists",
      "Pre-Owned Boot Hoists",
      "Person Hoists",
      "Wheelchair Docking Systems",
      "Wheelchair Stowage - Rooftop",
      "Wheelchair Winches",
      "Boot Straps",
      "Automatic Boot Openers",
    ],
  },
  {
    id: "vehicle-access",
    title: "Vehicle Access",
    description:
      "Swivel seats, transfer plates, steps and grab handles to make getting in and out safer and easier.",
    categories: [
      "Swivel Seats",
      "Transfer Plates",
      "Side Steps",
      "Grab Handles",
      "Seating Modifications",
      "Protective Screens",
    ],
  },
] as const;

export type AdaptationSectionId = (typeof ADAPTATION_SECTIONS)[number]["id"];

export const ALL_ADAPTATION_CATEGORIES = ADAPTATION_SECTIONS.flatMap(
  (s) => [...s.categories],
);

/**
 * Old static marketing slugs → live category or section.
 *
 * Do NOT list a slug whose current categoryToSlug() already matches it
 * (e.g. "left-foot-accelerators") — that creates a self-redirect loop
 * and Google Search Console reports "Redirect error" for sitemap URLs.
 */
export const LEGACY_ADAPTATION_REDIRECTS: Record<
  string,
  { type: "category" | "section" | "hub"; target: string }
> = {
  "hand-controls": { type: "category", target: "Mechanical Hand Controls" },
  "push-pull-brake-accelerator": {
    type: "category",
    target: "Mechanical Hand Controls",
  },
  "boot-openers": { type: "category", target: "Automatic Boot Openers" },
  "scooter-hoists": { type: "category", target: "Boot Hoists" },
  "wheelchair-lifts": { type: "category", target: "Person Hoists" },
  "car-ramps": { type: "section", target: "vehicle-access" },
  "wheelchair-accessible-vehicles": { type: "hub", target: "" },
};

export function categoryToSlug(category: string) {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findSectionById(id: string) {
  return ADAPTATION_SECTIONS.find((s) => s.id === id) ?? null;
}

export function findCategoryBySlug(slug: string) {
  const match = ALL_ADAPTATION_CATEGORIES.find(
    (c) => categoryToSlug(c) === slug,
  );
  return match ?? null;
}

export function findSectionForCategory(category: string | null) {
  if (!category) return null;
  return (
    ADAPTATION_SECTIONS.find((s) =>
      (s.categories as readonly string[]).includes(category),
    ) ?? null
  );
}

export function isAdaptationCategory(category: string | null | undefined) {
  if (!category) return false;
  return ALL_ADAPTATION_CATEGORIES.some(
    (c) => c.toLowerCase() === category.toLowerCase(),
  );
}

export function isAdaptationProduct(p: {
  product_type?: string | null;
  category?: string | null;
}) {
  if (p.product_type === "vehicle_adaptation") return true;
  return isAdaptationCategory(p.category);
}

export function adaptationHref(category: string) {
  return `/vehicle-adaptations/${categoryToSlug(category)}`;
}

export function sectionHref(sectionId: string) {
  return `/vehicle-adaptations/${sectionId}`;
}
