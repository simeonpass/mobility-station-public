import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SiApplepay, SiGooglepay, SiMastercard, SiPaypal, SiVisa } from "react-icons/si";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { SITE } from "@/lib/seo";
import { BRANCHES } from "@/data/content";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "Scooters & wheelchairs" },
      { href: "/clearance", label: "Clearance" },
      { href: "/hire", label: "Hire & Flex Hire" },
      { href: "/trade-in", label: "Old scooter takeaway" },
    ],
  },
  {
    title: "Adaptations",
    links: [
      { href: "/vehicle-adaptations", label: "Vehicle adaptations" },
      { href: "/motability", label: "Motability" },
      { href: "/book-a-demo", label: "Book a demonstration" },
    ],
  },
  {
    title: "Help & support",
    links: [
      { href: "/delivery", label: "Delivery" },
      { href: "/vat-relief", label: "VAT relief" },
      { href: "/servicing", label: "Servicing & Care Plans" },
      { href: "/book-a-service", label: "Book a service" },
      { href: "/faq", label: "FAQs" },
    ],
  },
  {
    title: "Mobility Station",
    links: [
      { href: "/about-us", label: "About us" },
      { href: "/locations", label: "Our locations" },
      { href: "/our-work", label: "Recent work" },
      { href: "/blog", label: "Stories & advice" },
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

function FooterLinks({ mobile = false }: { mobile?: boolean }) {
  return columns.map((col) => {
    const links = (
      <ul className={mobile ? "space-y-2.5 pb-4 pt-1" : "mt-4 space-y-2.5"}>
        {col.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/68 transition-colors hover:text-white"
            >
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
              triggerClassName="text-sm text-white/68 transition-colors hover:text-white"
            >
              Get a quotation
            </EnquiryDialog>
          </li>
        ) : null}
      </ul>
    );

    if (mobile) {
      return (
        <details key={col.title} className="group border-t border-white/10 first:border-t-0">
          <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-sm font-semibold text-white marker:hidden">
            <span>{col.title}</span>
            <span
              className="text-xl font-light text-white/40 transition-transform duration-200 group-open:rotate-45"
              aria-hidden
            >
              +
            </span>
          </summary>
          {links}
        </details>
      );
    }

    return (
      <div key={col.title}>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/38">
          {col.title}
        </p>
        {links}
      </div>
    );
  });
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#111111] text-white">
      <div className="border-b border-white/10 bg-[#161616]">
        <div className="container-site py-7 md:py-9">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-on-dark">
                Here when you need us
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                Need help choosing the right solution?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/58 md:text-base">
                Speak to our team for straightforward advice on mobility products, vehicle adaptations, demonstrations and servicing.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row md:shrink-0">
              <a
                href={SITE.phoneHref}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#111111] transition hover:bg-white/90"
              >
                <Phone className="h-4 w-4" />
                {SITE.phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-5 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Contact us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-site py-8 md:py-14">
        <div className="grid gap-9 lg:grid-cols-[1.35fr_2.65fr] lg:gap-16">
          <div>
            <img
              src="/brand/mobility-station-wordmark-on-dark.png?v=20260830f"
              alt="Mobility Station"
              width={800}
              height={300}
              className="h-9 w-auto md:h-10"
              loading="lazy"
              decoding="async"
            />

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/58">
              Mobility scooters, wheelchairs and specialist vehicle adaptations from our Heathrow and Ferndown teams.
            </p>

            <div className="mt-6 space-y-2.5 text-sm">
              <a
                href={SITE.phoneHref}
                className="flex w-fit items-center gap-2 font-semibold text-white transition hover:text-accent-on-dark"
              >
                <Phone className="h-4 w-4 text-white/45" />
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex w-fit items-center gap-2 text-white/68 transition hover:text-white"
              >
                <Mail className="h-4 w-4 text-white/45" />
                {SITE.email}
              </a>
            </div>

            <Link href="/motability" className="mt-7 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 transition hover:bg-white/[0.06]">
              <img
                src="/brand/motability-scheme-white.png"
                alt="Motability Scheme"
                width={220}
                height={75}
                className="h-5 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-on-dark">
                <ShieldCheck className="h-3.5 w-3.5" /> Accredited dealer
              </span>
            </Link>
          </div>

          <div>
            <div className="md:hidden">
              <div className="border-y border-white/10">
                <FooterLinks mobile />
              </div>
            </div>

            <div className="hidden grid-cols-4 gap-7 md:grid">
              <FooterLinks />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-3 border-t border-white/10 pt-7 md:mt-12 md:grid-cols-2 md:gap-5 md:pt-8">
          {BRANCHES.map((branch) => (
            <Link
              key={branch.id}
              href="/locations"
              className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-white/18 hover:bg-white/[0.055] md:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/7 text-accent-on-dark">
                  <MapPin className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-white">{branch.name}</p>
                  <p className="mt-1 text-sm leading-5 text-white/55">
                    {branch.addressLine1}, {branch.postalCode}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-white/72 transition group-hover:text-white">
                    View location <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">Secure payments</p>
            <ul className="mt-2 flex items-center gap-4" aria-label="Accepted payment methods">
              {PAYMENT_ICONS.map(({ Icon, label }) => (
                <li key={label}>
                  <Icon className="h-5 w-auto text-white/68" role="img" aria-label={label} />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50">
            <a href={SITE.lightweightUrl} className="transition hover:text-white" rel="noopener noreferrer" target="_blank">
              Lightweight store
            </a>
            <Link href="/privacy-policy" className="transition hover:text-white">Privacy</Link>
            <Link href="/cookie-policy" className="transition hover:text-white">Cookies</Link>
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="container-site py-4 text-[11px] leading-relaxed text-white/35 md:flex md:items-center md:justify-between md:text-xs">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="mt-1 md:mt-0">{SITE.name} is a trading name of {SITE.legalName}.</p>
        </div>
      </div>
    </footer>
  );
}
