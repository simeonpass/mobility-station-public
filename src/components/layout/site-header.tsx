"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, MapPin, Menu, Phone, Search, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { CartButton } from "@/components/cart/cart-button";
import { HeaderSearch } from "@/components/layout/header-search";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { SwipeSheet } from "@/components/ui/swipe-sheet";
import { SITE_NAV } from "@/lib/site-nav";
import { SITE } from "@/lib/seo";

const navigation = [
  ["Vehicle adaptations", "/vehicle-adaptations"],
  ["Scooters & wheelchairs", "/shop"],
  ["Hire", "/hire"],
  ["Motability", "/motability"],
  ["Support", "/support"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  return <HeaderNavigation key={pathname} pathname={pathname} />;
}
function HeaderNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  return <>
    <div className="ms-utility"><div className="container-site">
      <span><MapPin size={14} aria-hidden />Your local experts in Heathrow &amp; Ferndown</span>
      <Link href="/contact#locations">Visit our branches <ArrowUpRight size={14} aria-hidden /></Link>
    </div></div>
    <header className="ms-header">
      <div className="container-site ms-header-inner">
        <BrandLogo />
        <nav className="ms-desktop-nav" aria-label="Primary">
          {navigation.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
        </nav>
        <a className="ms-header-phone" href={SITE.phoneHref}><Phone size={18} aria-hidden /><span>Let’s talk<strong>{SITE.phone}</strong></span></a>
        <div className="ms-header-tools">
          <button className="ms-icon-button" type="button" aria-label={searchOpen ? "Close search" : "Open search"} aria-expanded={searchOpen} aria-controls="site-search" onClick={() => setSearchOpen(!searchOpen)}>{searchOpen ? <X size={20} /> : <Search size={20} />}</button>
          <CartButton />
          <button className="ms-icon-button ms-menu-button" type="button" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-nav" onClick={() => { setSearchOpen(false); setOpen(true); }}><Menu size={23} /></button>
        </div>
      </div>
      {searchOpen && <div id="site-search" className="ms-search-panel" onKeyDown={event => { if (event.key === "Escape") setSearchOpen(false); }}><div className="container-site"><HeaderSearch autoFocus className="w-full max-w-2xl" onSubmitExtra={() => setSearchOpen(false)} /></div></div>}
      <SwipeSheet open={open} onClose={() => setOpen(false)} side="right" label="Explore Mobility Station" zClass="z-[70]">
        <div className="ms-menu-heading"><strong>Explore Mobility Station</strong><button className="ms-icon-button" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button></div>
        <nav id="mobile-nav" className="ms-mobile-nav" aria-label="Mobile">
          {SITE_NAV.map(item => <div key={item.href}>
            <Link className="ms-mobile-main" href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
            {item.type === "menu" && <details><summary>More options</summary><div>{item.links.map(link => <Link key={link.href + link.label} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</div></details>}
          </div>)}
          <Link href="/contact#locations" onClick={() => setOpen(false)}>Contact &amp; locations</Link>
        </nav>
        <div className="ms-menu-contact"><a href={SITE.phoneHref}><Phone size={18} aria-hidden />{SITE.phone}</a><Link href="/book-a-demo" className="ms-button" onClick={() => setOpen(false)}>Book a demonstration <ArrowUpRight size={18} /></Link><EnquiryDialog mode="callback" title="Request a callback" triggerClassName="ms-text-link">Request a callback</EnquiryDialog></div>
      </SwipeSheet>
    </header>
  </>;
}
