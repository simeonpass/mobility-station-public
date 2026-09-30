import { sectionHref } from "@/lib/adaptations";

/**
 * The site is split into two divisions that share one brand:
 * vehicle adaptations and scooters & wheelchairs. Pages outside
 * either division (home, contact, support…) are neutral.
 */
export type Division = "adapt" | "shop";

export type DivisionLink = { label: string; href: string };

export type DivisionMeta = {
  id: Division;
  label: string;
  home: string;
  /** Shown in the utility bar, linking to the other division. */
  switchPrompt: string;
  cta: DivisionLink;
  nav: DivisionLink[];
  footer: DivisionLink[];
};

export const DIVISIONS: Record<Division, DivisionMeta> = {
  adapt: {
    id: "adapt",
    label: "Vehicle Adaptations",
    home: "/vehicle-adaptations",
    switchPrompt: "Looking for scooters & wheelchairs?",
    cta: { label: "Request a free quote", href: "/contact?interest=adaptation" },
    nav: [
      { label: "Driving controls", href: sectionHref("driving-controls") },
      { label: "Hoists & stowage", href: sectionHref("hoists-stowage") },
      { label: "Vehicle access", href: sectionHref("vehicle-access") },
      { label: "Motability", href: "/motability/vehicle-adaptations" },
      { label: "Our work", href: "/our-work" },
      { label: "How it works", href: "/vehicle-adaptations#how-it-works" },
    ],
    footer: [
      { label: "Driving controls", href: sectionHref("driving-controls") },
      { label: "Boot hoists & stowage", href: sectionHref("hoists-stowage") },
      { label: "Vehicle access", href: sectionHref("vehicle-access") },
      { label: "£0 on Motability", href: "/motability/vehicle-adaptations" },
      { label: "Our recent work", href: "/our-work" },
      { label: "Servicing & aftercare", href: "/servicing" },
    ],
  },
  shop: {
    id: "shop",
    label: "Scooters & Wheelchairs",
    home: "/shop",
    switchPrompt: "Need vehicle adaptations?",
    cta: { label: "Book a free demo", href: "/book-a-demo" },
    nav: [
      { label: "Scooters", href: "/shop?sub=scooters" },
      { label: "Wheelchairs", href: "/shop?sub=wheelchairs" },
      { label: "Lightweight & folding", href: "/lightweight-folding-mobility" },
      { label: "Hire", href: "/hire" },
      { label: "Clearance", href: "/clearance" },
      { label: "Motability", href: "/motability" },
    ],
    footer: [
      { label: "Mobility scooters", href: "/shop?sub=scooters" },
      { label: "Wheelchairs & powerchairs", href: "/shop?sub=wheelchairs" },
      { label: "Lightweight & folding", href: "/lightweight-folding-mobility" },
      { label: "Hire", href: "/hire" },
      { label: "Clearance", href: "/clearance" },
      { label: "Motability", href: "/motability" },
    ],
  },
};

/** Links shown in the header on neutral pages (home, contact, support…). */
export const NEUTRAL_NAV: (DivisionLink & { division?: Division })[] = [
  { label: "Vehicle adaptations", href: "/vehicle-adaptations", division: "adapt" },
  { label: "Scooters & wheelchairs", href: "/shop", division: "shop" },
  { label: "Motability", href: "/motability" },
  { label: "Hire", href: "/hire" },
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
];

const ADAPT_PREFIXES = ["/vehicle-adaptations", "/motability/vehicle-adaptations"];
const SHOP_PREFIXES = [
  "/shop",
  "/clearance",
  "/hire",
  "/compare",
  "/lightweight-folding-mobility",
  "/mobility-scooter-hire",
  "/trade-in",
];

function underPath(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * Which division a route belongs to. Product pages (/products/…) are
 * neutral here; the page itself marks its content with data-division.
 */
export function divisionForPath(pathname: string | null | undefined): Division | null {
  if (!pathname) return null;
  if (ADAPT_PREFIXES.some((prefix) => underPath(pathname, prefix))) return "adapt";
  if (pathname === "/motability") return "shop";
  if (SHOP_PREFIXES.some((prefix) => underPath(pathname, prefix))) return "shop";
  return null;
}

export function otherDivision(division: Division): Division {
  return division === "adapt" ? "shop" : "adapt";
}

/** True when a nav link points at the current page (ignores query and hash). */
export function linkIsCurrent(pathname: string, href: string) {
  if (href.includes("?") || href.includes("#")) return false;
  return pathname === href;
}
