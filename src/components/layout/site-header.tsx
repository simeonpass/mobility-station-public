"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ChevronDown, MapPin, Menu, Phone, PhoneCall, X } from "lucide-react";
import { CartButton } from "@/components/cart/cart-drawer";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { HeaderSearch } from "@/components/layout/header-search";
import { Button, buttonVariants } from "@/components/ui/button";
import { SITE_NAV, navItemIsActive, type NavItem } from "@/lib/site-nav";
import { SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string) {
  const base = href.split("?")[0].split("#")[0];
  return pathname === base || (base !== "/" && pathname.startsWith(`${base}/`));
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [desktopOpenId, setDesktopOpenId] = useState<string | null>(null);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setDesktopOpenId(null), 120);
  }, [clearCloseTimer]);

  const openMenu = useCallback(
    (id: string) => {
      clearCloseTimer();
      setDesktopOpenId(id);
    },
    [clearCloseTimer],
  );

  useEffect(() => {
    setOpen(false);
    setDesktopOpenId(null);
    setMobileOpenId(null);
  }, [pathname]);

  useEffect(() => {
    if (!open && !desktopOpenId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setDesktopOpenId(null);
        setMobileOpenId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, desktopOpenId]);

  useEffect(() => {
    if (!desktopOpenId) return;
    const onPointer = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        setDesktopOpenId(null);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [desktopOpenId]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="relative sticky top-0 z-50 bg-white shadow-[0_8px_28px_-12px_rgba(0,63,67,0.28)]">
      <div className="relative bg-primary text-primary-foreground">
        <div className="container-site flex h-8 items-center justify-between gap-3 text-xs font-medium">
          <p className="flex min-w-0 items-center gap-1.5 truncate">
            <MapPin
              className="hidden h-3.5 w-3.5 shrink-0 text-accent sm:block"
              aria-hidden
            />
            <span className="sm:hidden">Heathrow &amp; Ferndown</span>
            <span className="hidden sm:inline">
              Heathrow &amp; Ferndown Branches
              <span className="mx-1.5 text-primary-foreground/35" aria-hidden>
                ·
              </span>
              <Link
                href="/book-a-demo#demo-terms"
                className="text-accent-on-dark transition-colors hover:text-accent-on-dark-hover"
              >
                Free branch demos · Home demos £195*
              </Link>
            </span>
          </p>
          <a
            href={SITE.phoneHref}
            className="inline-flex shrink-0 items-center gap-1.5 tabular-nums transition-colors hover:text-accent-on-dark"
          >
            <Phone className="hidden h-3.5 w-3.5 sm:block" aria-hidden />
            {SITE.phone}
          </a>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent"
          aria-hidden
        />
      </div>

      <div className="border-b border-border/60 bg-white">
        <div className="container-site flex h-[4.75rem] items-center gap-3 md:h-20 md:gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            onClick={() => setOpen(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- logo; skip Vercel Image Optimization */}
            <img
              src="/brand/logo-header-v6.png"
              alt="Mobility Station"
              width={800}
              height={300}
              className="h-12 w-auto md:h-14"
              decoding="async"
              fetchPriority="high"
            />
          </Link>

          <HeaderSearch className="mx-auto hidden min-w-0 max-w-xl flex-1 md:block" />

          <div className="ml-auto flex shrink-0 items-center gap-2.5">
            <div className="hidden items-center gap-2 sm:flex">
              <EnquiryDialog
                mode="callback"
                title="Request a callback"
                triggerClassName={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full border-primary/20 bg-white text-primary hover:border-primary hover:bg-primary-soft",
                )}
              >
                <PhoneCall className="h-4 w-4" aria-hidden />
                <span className="hidden lg:inline">Request a callback</span>
                <span className="lg:hidden">Callback</span>
              </EnquiryDialog>
              <Link
                href="/book-a-demo"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "hidden rounded-full shadow-[0_6px_16px_-8px_rgba(140,214,63,0.9)] sm:inline-flex",
                )}
              >
                <span className="lg:hidden">Demo</span>
                <span className="hidden lg:inline">Book a Demo</span>
              </Link>
            </div>
            <CartButton />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <nav
        ref={navRef}
        className="relative hidden bg-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:block"
        aria-label="Primary"
        onMouseLeave={scheduleClose}
      >
        <div className="container-site flex h-11 items-stretch gap-0.5">
          {SITE_NAV.map((item) => (
            <DesktopNavItem
              key={item.type === "menu" ? item.id : item.href}
              item={item}
              pathname={pathname}
              openId={desktopOpenId}
              onOpen={openMenu}
              onScheduleClose={scheduleClose}
              onClearClose={clearCloseTimer}
              onClose={() => setDesktopOpenId(null)}
            />
          ))}
        </div>
        <div
          className="h-0.5 bg-gradient-to-r from-accent/40 via-accent to-accent/40"
          aria-hidden
        />
      </nav>

      {open ? (
        <div
          id="mobile-nav"
          className="max-h-[min(78vh,40rem)] overflow-y-auto border-t border-border bg-white shadow-lg lg:hidden"
        >
          <div className="container-site space-y-4 py-4">
            <HeaderSearch
              size="sm"
              className="w-full md:hidden"
              onSubmitExtra={() => setOpen(false)}
            />
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {SITE_NAV.map((item) => (
                <MobileNavItem
                  key={item.type === "menu" ? item.id : item.href}
                  item={item}
                  pathname={pathname}
                  openId={mobileOpenId}
                  setOpenId={setMobileOpenId}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </nav>
            <div className="grid gap-2 border-t border-border pt-4 sm:hidden">
              <EnquiryDialog
                mode="callback"
                title="Request a callback"
                triggerClassName={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full rounded-full",
                )}
              >
                <PhoneCall className="h-4 w-4" aria-hidden />
                Request a callback
              </EnquiryDialog>
              <Link
                href="/book-a-demo"
                className={cn(buttonVariants(), "w-full rounded-full")}
                onClick={() => setOpen(false)}
              >
                Book a Demo
              </Link>
              <Link
                href="/contact"
                className="block rounded-lg px-3 py-3 text-center text-sm font-semibold text-primary hover:bg-soft"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
            </div>
            <div className="hidden border-t border-border pt-3 sm:block lg:hidden">
              <Link
                href="/contact"
                className="block rounded-lg px-3 py-3 text-sm font-semibold text-primary hover:bg-soft"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function DesktopNavItem({
  item,
  pathname,
  openId,
  onOpen,
  onScheduleClose,
  onClearClose,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  openId: string | null;
  onOpen: (id: string) => void;
  onScheduleClose: () => void;
  onClearClose: () => void;
  onClose: () => void;
}) {
  const active = navItemIsActive(pathname, item);

  if (item.type === "link") {
    return (
      <Link
        href={item.href}
        className={cn(
          "relative flex items-center px-3.5 text-[13px] font-semibold tracking-wide transition-colors",
          active ? "text-white" : "text-white/75 hover:text-white",
        )}
      >
        {item.label}
        <span
          className={cn(
            "absolute inset-x-3.5 bottom-0 h-0.5 rounded-full bg-accent transition-opacity duration-200",
            active ? "opacity-100" : "opacity-0",
          )}
          aria-hidden
        />
      </Link>
    );
  }

  const isOpen = openId === item.id;
  const panelId = `nav-panel-${item.id}`;

  return (
    <div
      className="relative flex"
      onMouseEnter={() => onOpen(item.id)}
      onMouseLeave={onScheduleClose}
    >
      <div
        className={cn(
          "group relative inline-flex h-full items-center",
          active || isOpen ? "text-white" : "text-white/75 hover:text-white",
        )}
      >
        <Link
          href={item.href}
          className="flex h-full items-center pl-3.5 pr-1 text-[13px] font-semibold tracking-wide transition-colors hover:text-white"
          onFocus={() => onOpen(item.id)}
        >
          {item.label}
        </Link>
        <button
          type="button"
          className="flex h-full items-center pr-3 text-inherit transition-colors hover:text-white"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-haspopup="true"
          aria-label={`${item.label} menu`}
          onClick={() => (isOpen ? onScheduleClose() : onOpen(item.id))}
          onFocus={() => {
            onClearClose();
            onOpen(item.id);
          }}
          onKeyDown={(e: ReactKeyboardEvent) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              onOpen(item.id);
              onClearClose();
            }
          }}
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 opacity-80 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        <span
          className={cn(
            "pointer-events-none absolute inset-x-3.5 bottom-0 h-0.5 rounded-full bg-accent transition-opacity duration-200",
            active || isOpen
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-70",
          )}
          aria-hidden
        />
      </div>

      {isOpen ? (
        <div
          id={panelId}
          role="menu"
          className="absolute left-0 top-full z-50 pt-1"
          onMouseEnter={() => onOpen(item.id)}
        >
          <div className="min-w-[13.5rem] overflow-hidden rounded-lg border border-border bg-white py-1.5 shadow-[0_16px_40px_-18px_rgba(0,63,67,0.45)] animate-[fadeRise_140ms_ease-out]">
            <ul>
              {item.links.map((link) => {
                const linkActive = isActivePath(pathname, link.href);
                return (
                  <li key={link.href + link.label} role="none">
                    <Link
                      role="menuitem"
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "block px-3.5 py-2 text-[13px] font-semibold transition-colors",
                        linkActive
                          ? "bg-primary-soft text-primary"
                          : "text-primary hover:bg-soft",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobileNavItem({
  item,
  pathname,
  openId,
  setOpenId,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onNavigate: () => void;
}) {
  const active = navItemIsActive(pathname, item);

  if (item.type === "link") {
    return (
      <Link
        href={item.href}
        className={cn(
          "rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "text-primary hover:bg-soft",
        )}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );
  }

  const isOpen = openId === item.id;

  return (
    <div className="overflow-hidden rounded-lg border border-border/70">
      <div className="flex items-stretch">
        <Link
          href={item.href}
          className={cn(
            "flex-1 px-3.5 py-2.5 text-sm font-semibold transition-colors",
            active
              ? "bg-primary text-primary-foreground"
              : "bg-white text-primary hover:bg-soft",
          )}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
        <button
          type="button"
          className={cn(
            "flex w-11 items-center justify-center border-l border-border/70 transition-colors",
            active
              ? "bg-primary text-primary-foreground"
              : "bg-white text-primary hover:bg-soft",
          )}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
          onClick={() => setOpenId(isOpen ? null : item.id)}
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </div>
      {isOpen ? (
        <ul className="border-t border-border bg-soft/30 py-1">
          {item.links.map((link) => (
            <li key={link.href + link.label}>
              <Link
                href={link.href}
                className="block px-3.5 py-2 text-sm font-semibold text-primary hover:bg-white"
                onClick={onNavigate}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
