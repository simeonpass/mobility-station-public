import {
  ADAPTATION_SECTIONS,
  adaptationHref,
  sectionHref,
} from "@/lib/adaptations";
import { manufacturerToSlug } from "@/lib/shop-catalogue";

export type NavLink = {
  href: string;
  label: string;
};

export type NavItem =
  | {
      type: "link";
      href: string;
      label: string;
    }
  | {
      type: "menu";
      id: string;
      href: string;
      label: string;
      links: NavLink[];
    };

/** Slim primary nav — compact dropdowns, no mega panels. */
export const SITE_NAV: NavItem[] = [
  {
    type: "menu",
    id: "adaptations",
    href: "/vehicle-adaptations",
    label: "Vehicle Adaptations",
    links: [
      { href: "/vehicle-adaptations", label: "All adaptations" },
      {
        href: "/vehicle-adaptations/collection-cost",
        label: "Vehicle collection cost",
      },
      {
        href: "/vehicle-adaptations/multimac-fitting",
        label: "Multimac fitting",
      },
      ...ADAPTATION_SECTIONS.map((section) => ({
        href: sectionHref(section.id),
        label: section.title,
      })),
      {
        href: adaptationHref("Mechanical Hand Controls"),
        label: "Hand controls",
      },
      { href: adaptationHref("Boot Hoists"), label: "Boot hoists" },
      { href: adaptationHref("Swivel Seats"), label: "Swivel seats" },
      { href: "/vehicle-adaptations/useful-links", label: "Useful links & support" },
      { href: "/book-a-demo", label: "Book a demo" },
    ],
  },
  {
    type: "menu",
    id: "shop",
    href: "/shop",
    label: "Scooters & Wheelchairs",
    links: [
      { href: "/shop", label: "Shop all" },
      { href: "/shop?sub=scooters", label: "Mobility scooters" },
      { href: "/shop?sub=wheelchairs", label: "Wheelchairs & powerchairs" },
      { href: `/shop/brand/${manufacturerToSlug("Pride")}`, label: "Pride" },
      { href: `/shop/brand/${manufacturerToSlug("TGA")}`, label: "TGA" },
      { href: `/shop/brand/${manufacturerToSlug("Kymco")}`, label: "Kymco" },
      { href: "/clearance", label: "Clearance" },
      { href: "/lightweight-folding-mobility", label: "Lightweight & folding" },
      { href: "/book-a-demo", label: "Book a demo" },
      { href: "/vat-relief", label: "VAT relief" },
    ],
  },
  {
    type: "menu",
    id: "hire",
    href: "/hire",
    label: "Hire",
    links: [
      { href: "/hire", label: "Hire overview" },
      { href: "/hire/short-term", label: "Short-term hire" },
      { href: "/hire/flex", label: "Monthly hire" },
      { href: "/hire/terms", label: "Hire terms" },
    ],
  },
  {
    type: "menu",
    id: "motability",
    href: "/motability",
    label: "Motability",
    links: [
      { href: "/motability", label: "Scooters & wheelchairs" },
      {
        href: "/motability/vehicle-adaptations",
        label: "Vehicle adaptations",
      },
      { href: "/book-a-demo", label: "Book a demo" },
    ],
  },
  {
    type: "menu",
    id: "support",
    href: "/servicing",
    label: "Support",
    links: [
      { href: "/servicing", label: "Servicing & repairs" },
      { href: "/book-a-service", label: "Book a service" },
      { href: "/locations", label: "Locations" },
      { href: "/our-work", label: "Recent work" },
      { href: "/faq", label: "FAQs" },
      { href: "/contact", label: "Contact" },
      { href: "/about-us", label: "About us" },
    ],
  },
];

export function navItemIsActive(pathname: string, item: NavItem): boolean {
  if (item.type === "link") {
    return (
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(`${item.href}/`))
    );
  }

  if (
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(`${item.href}/`))
  ) {
    return true;
  }

  return item.links.some((link) => {
    const base = link.href.split("?")[0].split("#")[0];
    return pathname === base || pathname.startsWith(`${base}/`);
  });
}
