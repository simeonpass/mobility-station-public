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

export type NavTile = {
  href: string;
  label: string;
  image: string;
  imageAlt: string;
};

export type NavFeatured = {
  title: string;
  body: string;
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
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
      /** Small photo shortcuts shown above / beside the links */
      tiles?: NavTile[];
      featured?: NavFeatured;
    };

/** Primary site navigation — dropdown menus for quick finding. */
export const SITE_NAV: NavItem[] = [
  {
    type: "menu",
    id: "adaptations",
    href: "/vehicle-adaptations",
    label: "Vehicle Adaptations",
    description: "Hand controls, hoists, access and Motability fittings",
    tiles: [
      {
        href: adaptationHref("Mechanical Hand Controls"),
        label: "Hand controls",
        image: "/images/hero-options/05-hand-controls.png",
        imageAlt: "Hand controls fitted in a car",
      },
      {
        href: adaptationHref("Boot Hoists"),
        label: "Boot hoists",
        image: "/images/hero-options/02-wav-powerchair.png",
        imageAlt: "Powerchair and vehicle adaptation work",
      },
      {
        href: adaptationHref("Swivel Seats"),
        label: "Swivel seats",
        image: "/images/hero-options/07-swivel-seat.png",
        imageAlt: "Swivel seat vehicle access adaptation",
      },
    ],
    columns: [
      {
        title: "Browse by type",
        links: ADAPTATION_SECTIONS.map((section) => ({
          href: sectionHref(section.id),
          label: section.title,
        })),
      },
      {
        title: "More fittings",
        links: [
          {
            href: adaptationHref("Left Foot Accelerators"),
            label: "Left foot accelerators",
          },
          {
            href: adaptationHref("Secondary Controls"),
            label: "Secondary controls",
          },
          {
            href: adaptationHref("Person Hoists"),
            label: "Person hoists",
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
      image: "/images/hero-options/06-customer-handover.png",
      imageAlt: "Customer handover at a Mobility Station demo",
    },
  },
  {
    type: "menu",
    id: "shop",
    href: "/shop",
    label: "Scooters & Wheelchairs",
    description: "Buy new, Motability or clearance",
    tiles: [
      {
        href: "/shop?sub=scooters",
        label: "Scooters",
        image: "/images/hero-options/03-scooter-handover.png",
        imageAlt: "Mobility scooter demonstration",
      },
      {
        href: "/shop?sub=wheelchairs",
        label: "Wheelchairs",
        image: "/images/hero-options/02-wav-powerchair.png",
        imageAlt: "Powerchair",
      },
      {
        href: "/clearance",
        label: "Clearance",
        image: "/images/hero-options/06-customer-handover.png",
        imageAlt: "Clearance mobility deals",
      },
    ],
    columns: [
      {
        title: "Shop",
        links: [
          { href: "/shop", label: "All scooters & wheelchairs" },
          { href: "/shop?sub=scooters", label: "Mobility scooters" },
          { href: "/shop?sub=wheelchairs", label: "Wheelchairs & powerchairs" },
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
        ],
      },
    ],
    featured: {
      title: "Try before you buy",
      body: "Free branch demos. Home demos in our service area.",
      href: "/book-a-demo",
      cta: "Book a demo",
      image: "/images/hero-options/03-scooter-handover.png",
      imageAlt: "Scooter home demonstration",
    },
  },
  {
    type: "menu",
    id: "hire",
    href: "/hire",
    label: "Hire",
    description: "Short-term or Flex monthly hire",
    tiles: [
      {
        href: "/hire/short-term",
        label: "Short-term",
        image: "/images/hero-options/03-scooter-handover.png",
        imageAlt: "Short-term mobility scooter hire",
      },
      {
        href: "/hire/flex",
        label: "Flex monthly",
        image: "/images/hero-options/02-wav-powerchair.png",
        imageAlt: "Flex hire powerchair",
      },
    ],
    columns: [
      {
        title: "Hire options",
        links: [
          { href: "/hire", label: "Choose short-term or Flex" },
          { href: "/hire/short-term", label: "Short-term hire (3–28 days)" },
          { href: "/hire/flex", label: "Flex monthly hire" },
          { href: "/hire/terms", label: "Hire terms" },
        ],
      },
    ],
    featured: {
      title: "Book & pay online",
      body: "Pick your machine, pay by card — we deliver or you collect free.",
      href: "/hire/short-term#book",
      cta: "Book short-term",
      image: "/images/hero-options/06-customer-handover.png",
      imageAlt: "Customer collecting hire equipment",
    },
  },
  {
    type: "menu",
    id: "motability",
    href: "/motability",
    label: "Motability",
    description: "Accredited dealer for scooters, chairs and adaptations",
    tiles: [
      {
        href: "/motability",
        label: "Scooters & chairs",
        image: "/images/hero-options/03-scooter-handover.png",
        imageAlt: "Motability scooter",
      },
      {
        href: "/motability/vehicle-adaptations",
        label: "Adaptations",
        image: "/images/hero-options/05-hand-controls.png",
        imageAlt: "Motability vehicle adaptations",
      },
    ],
    columns: [
      {
        title: "Motability",
        links: [
          { href: "/motability", label: "Scooters & wheelchairs" },
          {
            href: "/motability/vehicle-adaptations",
            label: "Vehicle adaptations",
          },
          { href: "/book-a-demo", label: "Book a Motability demo" },
          { href: "/vat-relief", label: "VAT relief explained" },
        ],
      },
    ],
    featured: {
      title: "Accredited dealer",
      body: "Weekly allowance options for scooters, wheelchairs and adaptations.",
      href: "/motability",
      cta: "See Motability",
      image: "/images/hero-options/02-wav-powerchair.png",
      imageAlt: "Motability powerchair and vehicle",
    },
  },
  {
    type: "menu",
    id: "support",
    href: "/servicing",
    label: "Support",
    description: "Servicing, branches and advice",
    tiles: [
      {
        href: "/servicing#care-plans",
        label: "Care Plans",
        image: "/images/hero-options/06-customer-handover.png",
        imageAlt: "Workshop care and support",
      },
      {
        href: "/locations",
        label: "Branches",
        image: "/images/hero-options/03-scooter-handover.png",
        imageAlt: "Visit Heathrow or Ferndown",
      },
      {
        href: "/our-work",
        label: "Recent work",
        image: "/images/hero-options/05-hand-controls.png",
        imageAlt: "Recent adaptation work",
      },
    ],
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
      image: "/images/hero-options/06-customer-handover.png",
      imageAlt: "Speaking with the Mobility Station team",
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
