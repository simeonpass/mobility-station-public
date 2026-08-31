import Link from "next/link";
import { SiApplepay, SiGooglepay, SiMastercard, SiPaypal, SiVisa } from "react-icons/si";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { SITE } from "@/lib/seo";
import { BRANCHES } from "@/data/content";

const columns = [
  { title: "Adaptations", links: [{ href: "/vehicle-adaptations", label: "Vehicle adaptations" }, { href: "/book-a-demo", label: "Book a demonstration" }] },
  { title: "Mobility", links: [{ href: "/shop", label: "Scooters & wheelchairs" }, { href: "/hire", label: "Hire & Flex Hire" }, { href: "/motability", label: "Motability" }, { href: "/clearance", label: "Clearance" }, { href: "/trade-in", label: "Old scooter takeaway" }] },
  { title: "Support", links: [{ href: "/locations", label: "Locations" }, { href: "/delivery", label: "Delivery" }, { href: "/vat-relief", label: "VAT relief" }, { href: "/servicing", label: "Servicing & Care Plans" }, { href: "/book-a-service", label: "Book a service" }, { href: "/faq", label: "FAQ" }] },
  { title: "Company", links: [{ href: "/about-us", label: "About us" }, { href: "/our-work", label: "Recent work" }, { href: "/blog", label: "Stories & advice" }, { href: "/contact", label: "Contact" }] },
];

const PAYMENT_ICONS = [
  { Icon: SiVisa, label: "Visa" },
  { Icon: SiMastercard, label: "Mastercard" },
  { Icon: SiApplepay, label: "Apple Pay" },
  { Icon: SiGooglepay, label: "Google Pay" },
  { Icon: SiPaypal, label: "PayPal" },
];

function FooterLinks({ mobile = false }: { mobile?: boolean }) {
  return columns.map((col) => {
    const links = (
      <ul className={mobile ? "space-y-2 pb-3 pt-1" : "mt-4 space-y-2.5"}>
        {col.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-white/80 transition-colors hover:text-accent-on-dark">
              {link.label}
            </Link>
          </li>
        ))}
        {col.title === "Adaptations" ? (
          <li>
            <EnquiryDialog
              mode="enquiry"
              enquiryType="contact"
              title="Get a quotation"
              defaultInterest="Vehicle adaptation quotation"
              triggerClassName="text-sm text-white/80 hover:text-accent-on-dark"
            >
              Get a quotation
            </EnquiryDialog>
          </li>
        ) : null}
      </ul>
    );

    if (mobile) {
      return (
        <details key={col.title} className="group border-t border-white/12 first:border-t-0">
          <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold text-white marker:hidden">
            <span>{col.title}</span>
            <span className="text-lg font-light text-white/45 transition-transform group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          {links}
        </details>
      );
    }

    return (
      <div key={col.title}>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">{col.title}</p>
        {links}
      </div>
    );
  });
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-footer text-footer-foreground">
      <div className="container-site py-7 md:py-16">
        <div className="md:hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <img
                src="/brand/mobility-station-wordmark-on-dark.png?v=20260830f"
                alt="Mobility Station"
                width={800}
                height={300}
                className="h-8 w-auto"
                loading="lazy"
                decoding="async"
              />
              <p className="mt-3 max-w-[20rem] text-xs leading-relaxed text-white/60">
                Mobility products and specialist vehicle adaptations from Heathrow and Ferndown.
              </p>
            </div>
            <Link href="/motability" className="shrink-0" aria-label="Motability Scheme accredited dealer">
              <img
                src="/brand/motability-scheme-white.png"
                alt="Motability Scheme"
                width={220}
                height={75}
                className="h-5 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <a href={SITE.phoneHref} className="font-bold text-white hover:text-accent-on-dark">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="text-white/70 hover:text-white">
              Email us
            </a>
          </div>

          <div className="mt-5 border-y border-white/12">
            <FooterLinks mobile />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 text-xs text-white/65">
            {BRANCHES.map((branch) => (
              <Link key={branch.id} href="/locations" className="font-medium text-white/80 hover:text-white">
                {branch.name.replace("Mobility Station ", "")}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-white/12 pt-4">
            <ul className="flex items-center gap-3" aria-label="Accepted payment methods">
              {PAYMENT_ICONS.map(({ Icon, label }) => (
                <li key={label}>
                  <Icon className="h-4 w-auto text-white/70" role="img" aria-label={label} />
                </li>
              ))}
            </ul>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">Motability accredited</span>
          </div>
        </div>

        <div className="hidden md:grid md:gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-8">
          <div>
            <img
              src="/brand/mobility-station-wordmark-on-dark.png?v=20260830f"
              alt="Mobility Station"
              width={800}
              height={300}
              className="h-9 w-auto"
              loading="lazy"
              decoding="async"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              Mobility scooters, wheelchairs and specialist vehicle adaptations from Heathrow and Ferndown.
            </p>
            <a href={SITE.phoneHref} className="mt-5 block text-xl font-bold text-white hover:text-accent-on-dark">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="mt-1 block text-sm text-white/75 hover:text-white">
              {SITE.email}
            </a>
            <Link href="/motability" className="mt-6 inline-flex flex-col gap-2">
              <img
                src="/brand/motability-scheme-white.png"
                alt="Motability Scheme"
                width={220}
                height={75}
                className="h-6 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-on-dark">Accredited dealer</span>
            </Link>
          </div>
          <FooterLinks />
        </div>

        <div className="mt-12 hidden gap-5 border-t border-white/15 pt-7 md:grid md:grid-cols-2">
          {BRANCHES.map((branch) => (
            <div key={branch.id}>
              <p className="font-semibold text-white">{branch.name}</p>
              <p className="mt-1 text-sm text-white/60">
                {branch.addressLine1}, {branch.postalCode} ·{" "}
                <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {branch.phone}
                </a>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-site flex flex-col gap-3 py-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between md:py-5">
          <ul className="hidden items-center gap-4 md:flex" aria-label="Accepted payment methods">
            {PAYMENT_ICONS.map(({ Icon, label }) => (
              <li key={label}>
                <Icon className="h-5 w-auto text-white/80" role="img" aria-label={label} />
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <a href={SITE.lightweightUrl} className="hover:text-white" rel="noopener noreferrer" target="_blank">
              Lightweight store
            </a>
            <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link href="/cookie-policy" className="hover:text-white">Cookies</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="container-site py-3 text-[11px] leading-relaxed text-white/45 md:py-4 md:text-xs">
          © {new Date().getFullYear()} {SITE.name}. {SITE.name} is a trading name of {SITE.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
