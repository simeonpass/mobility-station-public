import {
  ADAPTATION_SECTIONS,
  adaptationHref,
  sectionHref,
} from "@/lib/adaptations";

export type NavLink = {
  href: string;
  label: string;
  description?: string;
};

export type NavColumn = {
  title: string;
  links: NavLink[];
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
      description?: string;
      columns: NavColumn[];
      featured?: {
        title: string;
        body: string;
        href: string;
        cta: string;
      };
    };

/** Primary site navigation — dropdown menus for quick finding. */
export const SITE_NAV: NavItem[] = [
  {
    type: "menu",
    id: "adaptations",
    href: "/vehicle-adaptations",
    label: "Vehicle Adaptations",
    description: "Hand controls, hoists, access and Motability fittings",
    columns: [
      {
        title: "Browse by type",
        links: ADAPTATION_SECTIONS.map((section) => ({
          href: sectionHref(section.id),
          label: section.title,
          description: section.description,
        })),
      },
      {
        title: "Popular fittings",
        links: [
          {
            href: adaptationHref("Mechanical Hand Controls"),
            label: "Hand controls",
          },
          {
            href: adaptationHref("Boot Hoists"),
            label: "Boot hoists",
          },
          {
            href: adaptationHref("Swivel Seats"),
            label: "Swivel seats",
          },
          {
            href: adaptationHref("Left Foot Accelerators"),
            label: "Left foot accelerators",
          },
          {
            href: adaptationHref("Secondary Controls"),
            label: "Secondary controls",
          },
          {
            href: "/vehicle-adaptations",
            label: "All adaptations →",
          },
        ],
      },
    ],
    featured: {
      title: "Book a home visit",
      body: "We’ll bring options to you from Heathrow or Ferndown.",
      href: "/book-a-demo",
      cta: "Book a demo",
    },
  },
  {
    type: "menu",
    id: "shop",
    href: "/shop",
    label: "Scooters & Wheelchairs",
    description: "Buy new, Motability or clearance",
    columns: [
      {
        title: "Shop",
        links: [
          { href: "/shop", label: "All scooters & wheelchairs" },
          { href: "/shop?sub=scooters", label: "Mobility scooters" },
          { href: "/shop?sub=wheelchairs", label: "Wheelchairs & powerchairs" },
          { href: "/clearance", label: "Clearance deals" },
          { href: "/lightweight-folding-mobility", label: "Lightweight & folding" },
        ],
      },
      {
        title: "Buying help",
        links: [
          { href: "/book-a-demo", label: "Book a home demo" },
          { href: "/vat-relief", label: "VAT relief" },
          { href: "/trade-in", label: "Old scooter takeaway" },
          { href: "/delivery", label: "Delivery & setup" },
          { href: "/service-area", label: "Check your postcode" },
        ],
      },
    ],
    featured: {
      title: "Try before you buy",
      body: "Free branch demos. Home demos available in our service area.",
      href: "/book-a-demo",
      cta: "Book a demo",
    },
  },
  {
    type: "menu",
    id: "hire",
    href: "/hire",
    label: "Hire",
    description: "Short-term or Flex monthly hire",
    columns: [
      {
        title: "Hire options",
        links: [
          {
            href: "/hire",
            label: "Choose short-term or Flex",
            description: "Start here if you’re not sure",
          },
          {
            href: "/hire/short-term",
            label: "Short-term hire",
            description: "3–28 days, from holidays to hospital stays",
          },
          {
            href: "/hire/flex",
            label: "Flex monthly hire",
            description: "3 months minimum, cancel when ready",
          },
          { href: "/hire/terms", label: "Hire terms" },
        ],
      },
    ],
    featured: {
      title: "Book & pay online",
      body: "Pick your machine, pay by card, we deliver or you collect free.",
      href: "/hire/short-term#book",
      cta: "Book short-term",
    },
  },
  {
    type: "menu",
    id: "motability",
    href: "/motability",
    label: "Motability",
    description: "Accredited dealer for scooters, chairs and adaptations",
    columns: [
      {
        title: "Motability",
        links: [
          {
            href: "/motability",
            label: "Scooters & wheelchairs",
            description: "Weekly allowance options",
          },
          {
            href: "/motability/vehicle-adaptations",
            label: "Vehicle adaptations",
            description: "Often £0 advance payment on Motability",
          },
          { href: "/book-a-demo", label: "Book a Motability demo" },
          { href: "/vat-relief", label: "VAT relief explained" },
        ],
      },
    ],
  },
  {
    type: "menu",
    id: "support",
    href: "/servicing",
    label: "Support",
    description: "Servicing, branches and advice",
    columns: [
      {
        title: "Care & repairs",
        links: [
          { href: "/servicing#care-plans", label: "Care Plans" },
          { href: "/book-a-service", label: "Book a service" },
          { href: "/servicing", label: "Servicing overview" },
        ],
      },
      {
        title: "Visit & contact",
        links: [
          { href: "/locations", label: "Heathrow & Ferndown" },
          { href: "/our-work", label: "Recent work" },
          { href: "/faq", label: "FAQs" },
          { href: "/about-us", label: "About us" },
          { href: "/contact", label: "Contact" },
          { href: "/blog", label: "Stories & advice" },
        ],
      },
    ],
    featured: {
      title: "Need a callback?",
      body: "Leave your number and we’ll ring you back.",
      href: "/contact?interest=callback#callback",
      cta: "Request a callback",
    },
  },
];

export function navItemIsActive(
  pathname: string,
  item: NavItem,
): boolean {
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

  return item.columns.some((col) =>
    col.links.some(
      (link) =>
        pathname === link.href.split("?")[0] ||
        pathname.startsWith(`${link.href.split("?")[0]}/`),
    ),
  );
}
