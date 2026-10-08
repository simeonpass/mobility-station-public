"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type KeyboardEvent } from "react";
import { ArrowUpRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { CartButton } from "@/components/cart/cart-button";
import { HeaderSearch } from "@/components/layout/header-search";
import { SITE_NAV, navItemIsActive } from "@/lib/site-nav";
import { SITE } from "@/lib/seo";

export function MobilityHeader() {
  const pathname = usePathname();
  return <HeaderContents key={pathname} pathname={pathname} />;
}

function HeaderContents({ pathname }: { pathname: string }) {
  const headerRef = useRef<HTMLElement>(null);

  function closeMenus() {
    headerRef.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((menu) => {
      menu.open = false;
    });
  }

  function handleEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape") return;
    const menu = (event.target as HTMLElement).closest("details[open]");
    if (menu instanceof HTMLDetailsElement) {
      menu.open = false;
      menu.querySelector("summary")?.focus();
    }
  }

  return (
    <header className="ms-header" ref={headerRef} onKeyDown={handleEscape}>
      <div className="ms-topline">
        <div className="ms-wrap">
          <span>Vehicle adaptations. Everyday mobility.</span>
          <Link href="/locations" onClick={closeMenus}>Heathrow / West Drayton &amp; Ferndown / Dorset</Link>
        </div>
      </div>
      <div className="ms-wrap ms-header-main">
        <Link className="ms-brand" href="/" aria-label="Mobility Station home" onClick={closeMenus}>
          <Image src="/images/autoros/ms-logo.svg" alt="Mobility Station" width={800} height={300} unoptimized />
        </Link>
        <div className="ms-header-help">
          <span>Friendly advice from our team</span>
          <a href={SITE.phoneHref}>{SITE.phone}</a>
        </div>
        <Link className="ms-button ms-header-cta" href="/#ms-enquiry" onClick={closeMenus}>
          Talk to a specialist <ArrowUpRight size={21} aria-hidden />
        </Link>
        <div className="ms-mobile-cart"><CartButton /></div>
        <details className="ms-mobile-menu">
          <summary><span>Menu</span><Menu className="ms-menu-open" size={21} aria-hidden /><X className="ms-menu-close" size={21} aria-hidden /></summary>
          <nav className="ms-mobile-panel" aria-label="Mobile navigation">
            <HeaderSearch />
            {SITE_NAV.map((item) => (
              <div className="ms-mobile-nav-item" key={item.href}>
                <Link href={item.href} onClick={closeMenus} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>
                {item.type === "menu" ? (
                  <details>
                    <summary><span className="sr-only">More {item.label.toLowerCase()} options</span><ChevronDown size={19} aria-hidden /></summary>
                    <div>{item.links.map((link) => <Link key={link.href} href={link.href} onClick={closeMenus}>{link.label}</Link>)}</div>
                  </details>
                ) : null}
              </div>
            ))}
            <Link href="/book-a-demo" onClick={closeMenus}>Book a demonstration</Link>
            <Link href="/contact" onClick={closeMenus}>Contact our team</Link>
            <a href={SITE.phoneHref} className="ms-mobile-phone">{SITE.phone}</a>
          </nav>
        </details>
      </div>
      <div className="ms-nav-bar">
        <div className="ms-wrap ms-nav-inner">
          <nav className="ms-desktop-nav" aria-label="Primary navigation">
            {SITE_NAV.map((item) => (
              <div className="ms-nav-item" key={item.href} data-active={navItemIsActive(pathname, item) || undefined}>
                <Link href={item.href} onClick={closeMenus} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>
                {item.type === "menu" ? (
                  <details onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) event.currentTarget.open = false;
                  }}>
                    <summary><span className="sr-only">Open {item.label.toLowerCase()} submenu</span><ChevronDown size={15} aria-hidden /></summary>
                    <div className="ms-submenu">{item.links.map((link) => <Link key={link.href} href={link.href} onClick={closeMenus}>{link.label}</Link>)}</div>
                  </details>
                ) : null}
              </div>
            ))}
            <Link className="ms-nav-contact" href="/contact">Contact</Link>
          </nav>
          <div className="ms-header-tools">
            <Link href="/search"><Search size={17} aria-hidden /><span>Search</span></Link>
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}
