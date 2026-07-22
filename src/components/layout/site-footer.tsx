import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/seo";
import { BRANCHES } from "@/data/content";

const columns = [
  {
    title: "Solutions",
    links: [
      { href: "/vehicle-adaptations", label: "Vehicle Adaptations" },
      { href: "/shop", label: "Scooters & Wheelchairs" },
      { href: "/lightweight-folding-mobility", label: "Lightweight Mobility" },
      { href: "/mobility-scooter-hire", label: "Scooter Hire" },
      { href: "/trade-in", label: "Trade-In" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about-us", label: "About Us" },
      { href: "/motability", label: "Motability" },
      { href: "/locations", label: "Locations" },
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Book",
    links: [
      { href: "/book-a-demo", label: "Book a Demo" },
      { href: "/book-a-service", label: "Book a Service" },
      { href: "/contact", label: "General Enquiry" },
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
            height={46}
            className="h-10 w-auto"
          />
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Free home demonstrations from our Heathrow and Ferndown branches.
            Motability accredited. We come to you.
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
                <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="hover:text-accent">
                  {branch.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
          <p>UK English · Heathrow &amp; Ferndown</p>
        </div>
      </div>
    </footer>
  );
}
