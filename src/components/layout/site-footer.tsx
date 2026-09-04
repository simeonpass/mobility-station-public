import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SiApplepay, SiGooglepay, SiMastercard, SiPaypal, SiVisa } from "react-icons/si";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { SITE } from "@/lib/seo";
import { BRANCHES } from "@/data/content";

const FOOTER_GROUPS = [
  {
    title: "Explore",
    links: [
      { href: "/vehicle-adaptations", label: "Vehicle adaptations" },
      { href: "/shop", label: "Scooters & wheelchairs" },
      { href: "/motability", label: "Motability" },
      { href: "/hire", label: "Hire & Flex Hire" },
      { href: "/clearance", label: "Clearance" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/servicing", label: "Servicing & Care Plans" },
      { href: "/book-a-service", label: "Book a service" },
      { href: "/delivery", label: "Delivery" },
      { href: "/vat-relief", label: "VAT relief" },
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
] as const;

const PAYMENT_ICONS = [
  { Icon: SiVisa, label: "Visa" },
  { Icon: SiMastercard, label: "Mastercard" },
  { Icon: SiApplepay, label: "Apple Pay" },
  { Icon: SiGooglepay, label: "Google Pay" },
  { Icon: SiPaypal, label: "PayPal" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#0b0b0b] text-white">
      <div className="border-b border-white/10 bg-[#111111]">
        <div className="container-site flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:py-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
              Speak to a specialist
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.025em] text-white md:text-3xl">
              Not sure what you need? We’ll help you work it out.
            </h2>
          </div>

          <div className="flex flex-wrap gap-2.5 lg:shrink-0">
            <a
              href={SITE.phoneHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#111111] transition hover:bg-white/90"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {SITE.phone}
            </a>
            <EnquiryDialog
              mode="enquiry"
              enquiryType="contact"
              title="Get a quotation"
              defaultInterest="Vehicle adaptation quotation"
              triggerClassName="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/[0.06]"
            >
              Get a quote
            </EnquiryDialog>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-5 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/[0.06]"
            >
              Contact us <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      <div className="container-site py-11 md:py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1.95fr] lg:gap-20">
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

            <p className="mt-5 max-w-md text-sm leading-6 text-white/55">
              Specialist vehicle adaptations, mobility scooters and wheelchairs, supplied and supported by our Heathrow and Ferndown teams.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 text-sm">
              <a
                href={SITE.phoneHref}
                className="flex w-fit items-center gap-2 font-semibold text-white transition hover:text-white/75"
              >
                <Phone className="h-4 w-4 text-white/38" aria-hidden />
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex w-fit items-center gap-2 text-white/62 transition hover:text-white"
              >
                <Mail className="h-4 w-4 text-white/38" aria-hidden />
                {SITE.email}
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:gap-x-12">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/38">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/64 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 md:mt-14 md:pt-9">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/38">
                Visit us
              </p>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 sm:gap-10">
                {BRANCHES.map((branch) => (
                  <Link
                    key={branch.id}
                    href="/locations"
                    className="group flex items-start gap-3"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/35" aria-hidden />
                    <div>
                      <p className="text-sm font-bold text-white">{branch.name}</p>
                      <p className="mt-1 text-sm leading-5 text-white/52">
                        {branch.addressLine1}, {branch.postalCode}
                      </p>
                      <p className="mt-1.5 text-xs font-semibold text-white/62 transition group-hover:text-white">
                        View location
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/motability"
              className="inline-flex w-fit items-center gap-3 border-l border-white/10 pl-0 lg:pl-6"
            >
              <img
                src="/brand/motability-scheme-white.png"
                alt="Motability Scheme"
                width={220}
                height={75}
                className="h-5 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/48">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Accredited dealer
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-6 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/32">
              Secure payments
            </span>
            <ul className="flex items-center gap-3.5" aria-label="Accepted payment methods">
              {PAYMENT_ICONS.map(({ Icon, label }) => (
                <li key={label}>
                  <Icon className="h-4.5 w-auto text-white/58" role="img" aria-label={label} />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/45">
            <a
              href={SITE.lightweightUrl}
              className="transition hover:text-white"
              rel="noopener noreferrer"
              target="_blank"
            >
              Lightweight store
            </a>
            <Link href="/privacy-policy" className="transition hover:text-white">Privacy</Link>
            <Link href="/cookie-policy" className="transition hover:text-white">Cookies</Link>
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="container-site flex flex-col gap-1 py-4 text-[11px] leading-relaxed text-white/30 md:flex-row md:items-center md:justify-between md:text-xs">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>{SITE.name} is a trading name of {SITE.legalName}.</p>
        </div>
      </div>
    </footer>
  );
}
