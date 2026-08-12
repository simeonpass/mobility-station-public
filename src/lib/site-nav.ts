import {
  ADAPTATION_SECTIONS,
  adaptationHref,
  sectionHref,
} from "@/lib/adaptations";

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
      { href: "/hire/flex", label: "Flex monthly hire" },
      { href: "/hire/short-term#book", label: "Book short-term" },
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
      { href: "/servicing#care-plans", label: "Care Plans" },
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
