"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ChevronDown, MapPin, Menu, Phone, Search, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { CartButton } from "@/components/cart/cart-button";
import { HeaderSearch } from "@/components/layout/header-search";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { SwipeSheet } from "@/components/ui/swipe-sheet";
import { useSiteDivision } from "@/components/layout/division-scope";
import { DIVISIONS, linkIsCurrent } from "@/lib/division";
import { SITE } from "@/lib/seo";

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  return <HeaderNavigation key={pathname} pathname={pathname} />;
}
function HeaderNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const division = useSiteDivision();
  const meta = division ? DIVISIONS[division] : null;
  const common = [{ href: "/support", label: "Advice & support" }, { href: "/about-us", label: "About us" }, { href: "/contact", label: "Contact" }];
  const closeMenu = () => setOpen(false);
  return <header className="msx-header">
    <div className="msx-container msx-header-main">
      <div className="msx-brand"><BrandLogo /><span className="msx-brand-line">Keeping you moving<br /><strong>for a more independent life</strong></span></div>
      <div className="msx-header-locations"><Link href="/contact#branch-heathrow"><MapPin size={18} aria-hidden /><span><strong>Heathrow</strong>West Drayton</span></Link><Link href="/contact#branch-ferndown"><MapPin size={18} aria-hidden /><span><strong>Ferndown</strong>Dorset</span></Link></div>
      <a className="msx-header-phone" href={SITE.phoneHref} aria-label={`Call Mobility Station on ${SITE.phone}`}><Phone size={19} aria-hidden /><span>Talk to our team<strong>{SITE.phone}</strong></span></a>
      <div className="msx-header-cta">{meta ? <Link className={`msx-button ${division === "shop" ? "msx-button-teal" : ""}`} href={meta.cta.href}>{meta.cta.label}<ArrowRight size={17} aria-hidden /></Link> : <EnquiryDialog mode="callback" title="Request a callback" triggerClassName="msx-button">Request a callback<ArrowRight size={17} aria-hidden /></EnquiryDialog>}</div>
      <div className="msx-mobile-tools">{division !== "adapt" && <CartButton />}<button type="button" className="msx-icon-button" aria-label={searchOpen ? "Close search" : "Open search"} aria-expanded={searchOpen} aria-controls="msx-search" onClick={() => setSearchOpen(!searchOpen)}>{searchOpen ? <X size={22} /> : <Search size={22} />}</button><button type="button" className="msx-icon-button" aria-label="Open menu" aria-expanded={open} aria-controls="msx-mobile-nav" onClick={() => { setSearchOpen(false); setOpen(true); }}><Menu size={24} /></button></div>
    </div>
    <nav className="msx-mobile-paths" aria-label="Choose a section"><Link className="msx-mobile-path-adapt" href="/vehicle-adaptations" aria-current={division === "adapt" ? "true" : undefined}>Vehicle adaptations<ArrowRight size={14} aria-hidden /></Link><Link className="msx-mobile-path-shop" href="/shop" aria-current={division === "shop" ? "true" : undefined}>Scooters &amp; wheelchairs<ArrowRight size={14} aria-hidden /></Link></nav>
    <div className="msx-nav-border"><div className="msx-container msx-nav-row"><nav className="msx-desktop-nav" aria-label="Primary navigation">{meta ? <>
      <Link href={meta.home} className={`msx-section-label msx-section-${division}`}>Overview</Link>
      {meta.nav.map(link => <Link key={link.href} href={link.href} aria-current={linkIsCurrent(pathname, link.href) ? "page" : undefined}>{link.label}</Link>)}

    </> : <>
      <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>Home</Link>
      <details className="msx-nav-dropdown" onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}><summary>Motability<ChevronDown size={15} aria-hidden /></summary><div><Link href="/motability/vehicle-adaptations">Vehicle adaptations<ArrowRight size={16} aria-hidden /></Link><Link href="/motability">Scooters &amp; wheelchairs<ArrowRight size={16} aria-hidden /></Link></div></details>
      {common.map(link => <Link key={link.href} href={link.href} aria-current={linkIsCurrent(pathname, link.href) ? "page" : undefined}>{link.label}</Link>)}
    </>}</nav><div className="msx-desktop-tools"><button type="button" className="msx-icon-button" aria-label={searchOpen ? "Close search" : "Open search"} aria-expanded={searchOpen} aria-controls="msx-search" onClick={() => setSearchOpen(!searchOpen)}>{searchOpen ? <X size={20} /> : <Search size={20} />}</button>{division !== "adapt" && <CartButton />}</div></div></div>
    {searchOpen && <div id="msx-search" className="msx-search-panel" onKeyDown={event => { if (event.key === "Escape") setSearchOpen(false); }}><div className="msx-container"><HeaderSearch autoFocus className="w-full" onSubmitExtra={() => setSearchOpen(false)} /></div></div>}
    <SwipeSheet open={open} onClose={closeMenu} side="right" label="Explore Mobility Station" zClass="z-[70]"><div className="msx-mobile-menu"><div className="msx-menu-heading"><strong>Explore Mobility Station</strong><button className="msx-icon-button" aria-label="Close menu" onClick={closeMenu}><X /></button></div><nav id="msx-mobile-nav" aria-label="Mobile navigation"><Link href="/" onClick={closeMenu}>Home</Link>{meta ? <>
      <Link href={meta.home} className={`msx-menu-section msx-section-${division}`} onClick={closeMenu}>{meta.label}</Link>
      {meta.nav.map(link => <Link key={link.href} href={link.href} onClick={closeMenu}>{link.label}<ArrowRight size={16} aria-hidden /></Link>)}
      <Link className="msx-menu-other" href={division === "adapt" ? "/shop" : "/vehicle-adaptations"} onClick={closeMenu}>Switch to {division === "adapt" ? "scooters & wheelchairs" : "vehicle adaptations"}<ArrowRight size={16} aria-hidden /></Link>
    </> : <>
      <Link href="/vehicle-adaptations" className="msx-menu-section msx-section-adapt" onClick={closeMenu}>Vehicle adaptations<ArrowRight size={17} aria-hidden /></Link><Link href="/shop" className="msx-menu-section msx-section-shop" onClick={closeMenu}>Scooters &amp; wheelchairs<ArrowRight size={17} aria-hidden /></Link><Link href="/hire" onClick={closeMenu}>Mobility hire<ArrowRight size={16} aria-hidden /></Link>
      <details><summary>Motability<ChevronDown size={16} aria-hidden /></summary><Link href="/motability/vehicle-adaptations" onClick={closeMenu}>Vehicle adaptations</Link><Link href="/motability" onClick={closeMenu}>Scooters &amp; wheelchairs</Link></details>
    </>}{common.map(link => <Link key={link.href} href={link.href} onClick={closeMenu}>{link.label}</Link>)}<Link href="/locations" onClick={closeMenu}>Our branches</Link></nav><a href={SITE.phoneHref} className="msx-button"><Phone size={18} aria-hidden />{SITE.phone}</a></div></SwipeSheet>
  </header>;
}
