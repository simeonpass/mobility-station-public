import Image from "next/image";
import Link from "next/link";
import {
  SiApplepay,
  SiGooglepay,
  SiMastercard,
  SiPaypal,
  SiVisa,
} from "react-icons/si";
import { SITE } from "@/lib/seo";
import { BRANCHES } from "@/data/content";

const columns = [
  {
    title: "Vehicle adaptations",
    links: [
      { href: "/vehicle-adaptations", label: "All Adaptations" },
      { href: "/contact?interest=adaptation", label: "Get a Quotation" },
      { href: "/book-a-demo", label: "Book a Home Visit" },
    ],
  },
  {
    title: "Scooters & wheelchairs",
    links: [
      { href: "/shop", label: "Shop All" },
      { href: "/hire", label: "Hire & Flex Hire" },
      { href: "/motability", label: "Motability" },
      { href: "/clearance", label: "Clearance" },
      { href: "/trade-in", label: "Old scooter takeaway" },
    ],
  },
  {
    title: "Visit & help",
    links: [
      { href: "/locations", label: "Locations" },
      { href: "/delivery", label: "Delivery" },
      { href: "/vat-relief", label: "VAT Relief" },
      { href: "/book-a-service", label: "Book a Service" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about-us", label: "About Us" },
      { href: "/blog", label: "Recent Work & Stories" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

const PAYMENT_ICONS = [
  { Icon: SiVisa, label: "Visa" },
  { Icon: SiMastercard, label: "Mastercard" },
  { Icon: SiApplepay, label: "Apple Pay" },
  { Icon: SiGooglepay, label: "Google Pay" },
  { Icon: SiPaypal, label: "PayPal" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-footer text-footer-foreground">
      <div className="container-site grid gap-x-8 gap-y-6 py-7 sm:grid-cols-2 lg:grid-cols-6">
        <div className="sm:col-span-2">
          <Image
            src="/brand/logo-footer-v6.png"
            alt="Mobility Station"
            width={800}
            height={300}
            className="h-8 w-auto"
          />
          <a
            href={SITE.phoneHref}
            className="mt-3 inline-block text-base font-bold text-white hover:text-accent-on-dark"
          >
            {SITE.phone}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-1 block text-sm text-white hover:text-accent-on-dark"
          >
            {SITE.email}
          </a>

          <ul className="mt-4 space-y-1.5 text-sm text-white">
            {BRANCHES.map((branch) => (
              <li key={branch.id} className="leading-snug">
                <span className="font-semibold">{branch.name}:</span>{" "}
                {branch.addressLine1}, {branch.postalCode} ·{" "}
                <a
                  href={`tel:${branch.phone.replace(/\s/g, "")}`}
                  className="hover:text-accent-on-dark"
                >
                  {branch.phone}
                </a>
              </li>
            ))}
          </ul>

          <Link
            href="/motability"
            className="mt-4 inline-flex flex-col gap-1 transition-opacity hover:opacity-80"
          >
            <Image
              src="/brand/motability-scheme-white.png"
              alt="Motability Scheme"
              width={220}
              height={75}
              className="h-6 w-auto object-contain"
              style={{ width: "auto", height: "1.5rem" }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-accent-on-dark">
              Accredited dealer
            </span>
          </Link>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-bold uppercase tracking-wide text-accent-on-dark">
              {col.title}
            </p>
            <ul className="mt-2 space-y-1">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white transition-colors hover:text-accent-on-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/15">
        <div className="container-site flex flex-col gap-2.5 py-3 text-xs text-white sm:flex-row sm:items-center sm:justify-between">
          <ul
            className="flex flex-wrap items-center gap-3"
            aria-label="Accepted payment methods"
          >
            {PAYMENT_ICONS.map(({ Icon, label }) => (
              <li key={label}>
                <Icon
                  className="h-5 w-auto text-white/85"
                  role="img"
                  aria-label={label}
                />
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a
              href={SITE.lightweightUrl}
              className="hover:text-accent-on-dark"
              rel="noopener noreferrer"
              target="_blank"
            >
              Lightweight store
            </a>
            <Link href="/privacy-policy" className="hover:text-accent-on-dark">
              Privacy
            </Link>
            <Link href="/cookie-policy" className="hover:text-accent-on-dark">
              Cookies
            </Link>
            <Link href="/terms" className="hover:text-accent-on-dark">
              Terms
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <p className="container-site py-2.5 text-center text-xs leading-snug text-white/80 sm:text-left">
          © {new Date().getFullYear()} {SITE.name}. {SITE.name} is a trading
          name of {SITE.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
