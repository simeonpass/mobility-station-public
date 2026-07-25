import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/seo";
import { BRANCHES } from "@/data/content";

const columns = [
  {
    title: "Vehicle adaptations",
    links: [
      { href: "/vehicle-adaptations", label: "All Adaptations" },
      { href: "/our-work", label: "Our Work" },
      { href: "/motability", label: "Motability" },
      { href: "/book-a-demo", label: "Book a Home Visit" },
      { href: "/service-area", label: "Service Area" },
    ],
  },
  {
    title: "Scooters & wheelchairs",
    links: [
      { href: "/shop", label: "Shop" },
      { href: "/find-my-scooter", label: "Find My Scooter" },
      { href: "/clearance", label: "Clearance" },
      { href: "/lightweight-folding-mobility", label: "Lightweight Mobility" },
      { href: "/trade-in", label: "Trade-In" },
      { href: "/delivery", label: "Delivery" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about-us", label: "About Us" },
      { href: "/locations", label: "Locations" },
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
      { href: "/vat-relief", label: "VAT Relief" },
      { href: "/contact", label: "Contact" },
      { href: "/book-a-service", label: "Book a Service" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/brand/logo-lime.png"
            alt="Mobility Station"
            width={240}
            height={98}
            className="h-11 w-auto"
          />
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Vehicle adaptations and mobility scooters &amp; wheelchairs. Free
            home visits from Heathrow and Ferndown. Motability accredited.
          </p>
          <a
            href={SITE.phoneHref}
            className="mt-4 inline-block text-lg font-bold text-accent hover:text-accent-hover"
          >
            {SITE.phone}
          </a>
          <p className="mt-6 text-sm leading-relaxed text-white/75">
            Looking for ultra-lightweight folding wheelchairs and scooters? Visit
            our dedicated lightweight mobility store.{" "}
            <a
              href={SITE.lightweightUrl}
              className="font-semibold text-accent hover:text-accent-hover"
              rel="noopener noreferrer"
              target="_blank"
            >
              lightweightmobility.co.uk
            </a>
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/85 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-2 lg:col-span-1">
          <p className="text-sm font-bold uppercase tracking-wide text-accent">
            Branches
          </p>
          <ul className="mt-4 space-y-4 text-sm text-white/85">
            {BRANCHES.map((branch) => (
              <li key={branch.id}>
                <p className="font-semibold text-white">{branch.name}</p>
                <p>
                  {branch.addressLine1}, {branch.addressLocality},{" "}
                  {branch.postalCode}
                </p>
                <a
                  href={`tel:${branch.phone.replace(/\s/g, "")}`}
                  className="hover:text-accent"
                >
                  {branch.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="hover:text-white">
              Cookie Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
