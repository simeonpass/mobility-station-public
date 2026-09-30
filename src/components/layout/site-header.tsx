"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Bike, CircleGauge, MapPin, Menu, Phone, Search, ShieldCheck, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { CartButton } from "@/components/cart/cart-button";
import { HeaderSearch } from "@/components/layout/header-search";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { SwipeSheet } from "@/components/ui/swipe-sheet";
import { DIVISIONS, NEUTRAL_NAV, divisionForPath, linkIsCurrent, otherDivision, type Division } from "@/lib/division";
import { SITE_NAV } from "@/lib/site-nav";
import { SITE } from "@/lib/seo";

function DivisionIcon({ division, size = 18 }: { division: Division; size?: number }) {
  return division === "adapt" ? <CircleGauge size={size} aria-hidden /> : <Bike size={size} aria-hidden />;
}

export function SiteHeader() {
  const pathname = usePathname();
  return <HeaderNavigation key={pathname} pathname={pathname} />;
}

function HeaderNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const division = divisionForPath(pathname);
  const meta = division ? DIVISIONS[division] : null;
  const other = division ? DIVISIONS[otherDivision(division)] : null;
  const cta = meta ? meta.cta : { label: "Book a demo", href: "/book-a-demo" };

  return <>
    <div className="mss-utility"><div className="container-site mss-utility-inner">
      <span className="mss-utility-local"><MapPin size={14} aria-hidden />Your local experts in Heathrow &amp; Ferndown</span>
      <span className="mss-utility-divider" aria-hidden />
      <span className="mss-utility-accredited"><ShieldCheck size={14} aria-hidden />Motability accredited</span>
      <span className="mss-utility-spacer" />
      {meta && other
        ? <Link className="mss-utility-switch" href={other.home}>{meta.switchPrompt} <strong>Switch</strong><ArrowRight size={14} aria-hidden /></Link>
        : <Link className="mss-utility-switch" href="/contact#locations">Visit our branches<ArrowUpRight size={14} aria-hidden /></Link>}
      <span className="mss-utility-divider" aria-hidden />
      <a className="mss-utility-phone" href={SITE.phoneHref}><Phone size={14} aria-hidden />{SITE.phone}</a>
    </div></div>
    <header className="ms-header mss-header">
      <div className="container-site mss-header-inner">
        <div className="mss-brand">
          <BrandLogo />
          {meta && division ? <Link href={meta.home} className="mss-division-badge"><DivisionIcon division={division} />{meta.label}</Link> : null}
        </div>
        <nav className="mss-nav" aria-label="Primary">
          {meta
            ? meta.nav.map(link => <Link key={link.href} href={link.href} aria-current={linkIsCurrent(pathname, link.href) ? "page" : undefined}>{link.label}</Link>)
            : NEUTRAL_NAV.map(link => <Link key={link.href} href={link.href} aria-current={linkIsCurrent(pathname, link.href) ? "page" : undefined}>{link.division ? <span className={`mss-dot mss-dot-${link.division}`} aria-hidden /> : null}{link.label}</Link>)}
        </nav>
        <Link href={cta.href} className="ms-button mss-header-cta">{cta.label}</Link>
        <div className="ms-header-tools">
          <button className="ms-icon-button" type="button" aria-label={searchOpen ? "Close search" : "Open search"} aria-expanded={searchOpen} aria-controls="site-search" onClick={() => setSearchOpen(!searchOpen)}>{searchOpen ? <X size={20} /> : <Search size={20} />}</button>
          <CartButton />
          <button className="ms-icon-button ms-menu-button" type="button" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-nav" onClick={() => { setSearchOpen(false); setOpen(true); }}><Menu size={23} /></button>
        </div>
      </div>
      {searchOpen && <div id="site-search" className="ms-search-panel" onKeyDown={event => { if (event.key === "Escape") setSearchOpen(false); }}><div className="container-site"><HeaderSearch autoFocus className="w-full max-w-2xl" onSubmitExtra={() => setSearchOpen(false)} /></div></div>}
      <SwipeSheet open={open} onClose={() => setOpen(false)} side="right" label="Explore Mobility Station" zClass="z-[70]">
        <div className="mss-menu" data-division={division ?? undefined}>
          <div className="ms-menu-heading"><strong>Explore Mobility Station</strong><button className="ms-icon-button" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button></div>
          <nav id="mobile-nav" className="ms-mobile-nav" aria-label="Mobile">
            {meta && division && other ? <div className="mss-menu-division">
              <Link className="mss-menu-division-title" href={meta.home} onClick={() => setOpen(false)}><DivisionIcon division={division} />{meta.label}</Link>
              {meta.nav.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
              <Link className="mss-menu-switch" href={other.home} onClick={() => setOpen(false)}>Switch to {other.label.toLowerCase()} <ArrowRight size={16} aria-hidden /></Link>
            </div> : <div className="mss-menu-doors">
              <Link className="mss-menu-door mss-menu-door-adapt" href="/vehicle-adaptations" onClick={() => setOpen(false)}><DivisionIcon division="adapt" />Vehicle adaptations<ArrowRight size={16} aria-hidden /></Link>
              <Link className="mss-menu-door mss-menu-door-shop" href="/shop" onClick={() => setOpen(false)}><DivisionIcon division="shop" />Scooters &amp; wheelchairs<ArrowRight size={16} aria-hidden /></Link>
            </div>}
            {SITE_NAV.map(item => <div key={item.href}>
              <Link className="ms-mobile-main" href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
              {item.type === "menu" && <details><summary>More options</summary><div>{item.links.map(link => <Link key={link.href + link.label} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</div></details>}
            </div>)}
            <Link href="/contact#locations" onClick={() => setOpen(false)}>Contact &amp; locations</Link>
          </nav>
          <div className="ms-menu-contact"><a href={SITE.phoneHref}><Phone size={18} aria-hidden />{SITE.phone}</a><Link href={cta.href} className="ms-button" onClick={() => setOpen(false)}>{cta.label} <ArrowUpRight size={18} /></Link><EnquiryDialog mode="callback" title="Request a callback" triggerClassName="ms-text-link">Request a callback</EnquiryDialog></div>
        </div>
      </SwipeSheet>
    </header>
  </>;
}
