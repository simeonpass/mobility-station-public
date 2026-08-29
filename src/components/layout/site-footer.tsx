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
const PAYMENT_ICONS = [{ Icon: SiVisa, label: "Visa" }, { Icon: SiMastercard, label: "Mastercard" }, { Icon: SiApplepay, label: "Apple Pay" }, { Icon: SiGooglepay, label: "Google Pay" }, { Icon: SiPaypal, label: "PayPal" }];

export function SiteFooter() {
  return <footer className="mt-auto bg-footer text-footer-foreground">
    <div className="container-site py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-8">
        <div><img src="/brand/logo-footer-v6.png" alt="Mobility Station" width={800} height={300} className="h-9 w-auto" loading="lazy" decoding="async" /><p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">Mobility scooters, wheelchairs and specialist vehicle adaptations from Heathrow and Ferndown.</p><a href={SITE.phoneHref} className="mt-5 block text-xl font-bold text-white hover:text-accent-on-dark">{SITE.phone}</a><a href={`mailto:${SITE.email}`} className="mt-1 block text-sm text-white/75 hover:text-white">{SITE.email}</a><Link href="/motability" className="mt-6 inline-flex flex-col gap-2"><img src="/brand/motability-scheme-white.png" alt="Motability Scheme" width={220} height={75} className="h-6 w-auto object-contain" loading="lazy" decoding="async" /><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-on-dark">Accredited dealer</span></Link></div>
        {columns.map((col) => <div key={col.title}><p className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">{col.title}</p><ul className="mt-4 space-y-2.5">{col.links.map((link) => <li key={link.href}><Link href={link.href} className="text-sm text-white/80 transition-colors hover:text-accent-on-dark">{link.label}</Link></li>)}{col.title === "Adaptations" ? <li><EnquiryDialog mode="enquiry" enquiryType="contact" title="Get a quotation" defaultInterest="Vehicle adaptation quotation" triggerClassName="text-sm text-white/80 hover:text-accent-on-dark">Get a quotation</EnquiryDialog></li> : null}</ul></div>)}
      </div>
      <div className="mt-12 grid gap-5 border-t border-white/15 pt-7 md:grid-cols-2">{BRANCHES.map((branch) => <div key={branch.id}><p className="font-semibold text-white">{branch.name}</p><p className="mt-1 text-sm text-white/60">{branch.addressLine1}, {branch.postalCode} · <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="hover:text-white">{branch.phone}</a></p></div>)}</div>
    </div>
    <div className="border-t border-white/15"><div className="container-site flex flex-col gap-4 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between"><ul className="flex items-center gap-4" aria-label="Accepted payment methods">{PAYMENT_ICONS.map(({ Icon, label }) => <li key={label}><Icon className="h-5 w-auto text-white/80" role="img" aria-label={label} /></li>)}</ul><div className="flex flex-wrap gap-x-5 gap-y-2"><a href={SITE.lightweightUrl} className="hover:text-white" rel="noopener noreferrer" target="_blank">Lightweight store</a><Link href="/privacy-policy" className="hover:text-white">Privacy</Link><Link href="/cookie-policy" className="hover:text-white">Cookies</Link><Link href="/terms" className="hover:text-white">Terms</Link></div></div></div>
    <div className="border-t border-white/10"><p className="container-site py-4 text-xs leading-relaxed text-white/45">© {new Date().getFullYear()} {SITE.name}. {SITE.name} is a trading name of {SITE.legalName}. All rights reserved.</p></div>
  </footer>;
}
