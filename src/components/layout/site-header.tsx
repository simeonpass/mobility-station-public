"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ChevronDown, MapPin, Menu, Phone, PhoneCall, X } from "lucide-react";
import { CartButton } from "@/components/cart/cart-drawer";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { HeaderSearch } from "@/components/layout/header-search";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  SITE_NAV,
  navItemIsActive,
  type NavItem,
} from "@/lib/site-nav";
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
    closeTimer.current = setTimeout(() => setDesktopOpenId(null), 140);
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
      {/* Utility bar */}
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

      {/* Brand row */}
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

      {/* Desktop nav with dropdowns */}
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
            />
          ))}
        </div>
        <div
          className="h-0.5 bg-gradient-to-r from-accent/40 via-accent to-accent/40"
          aria-hidden
        />

        {SITE_NAV.map((item) => {
          if (item.type !== "menu") return null;
          if (desktopOpenId !== item.id) return null;
          return (
            <DesktopMegaPanel
              key={item.id}
              item={item}
              pathname={pathname}
              onMouseEnter={() => openMenu(item.id)}
              onClose={() => setDesktopOpenId(null)}
            />
          );
        })}
      </nav>

      {/* Mobile drawer */}
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
}: {
  item: NavItem;
  pathname: string;
  openId: string | null;
  onOpen: (id: string) => void;
  onScheduleClose: () => void;
  onClearClose: () => void;
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
            active ? "opacity-100" : "opacity-0 group-hover:opacity-70",
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
          className="flex h-full items-center px-3.5 text-[13px] font-semibold tracking-wide transition-colors hover:text-white"
          onFocus={() => onOpen(item.id)}
        >
          {item.label}
        </Link>
        <button
          type="button"
          className="-ml-2 flex h-full items-center pr-3.5 text-inherit transition-colors hover:text-white"
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
    </div>
  );
}

function DesktopMegaPanel({
  item,
  pathname,
  onMouseEnter,
  onClose,
}: {
  item: Extract<NavItem, { type: "menu" }>;
  pathname: string;
  onMouseEnter: () => void;
  onClose: () => void;
}) {
  const panelId = `nav-panel-${item.id}`;
  const titleId = useId();
  const tiles = item.tiles ?? [];
  const cols = item.columns.length;

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={titleId}
      className="absolute inset-x-0 top-full z-50 origin-top animate-[fadeRise_180ms_ease-out]"
      onMouseEnter={onMouseEnter}
    >
      <div className="border-b border-border bg-white shadow-[0_24px_48px_-20px_rgba(0,63,67,0.35)]">
        <div className="h-1 w-full bg-gradient-to-r from-accent/30 via-accent to-accent/30" />
        <div className="container-site max-w-5xl py-4 md:py-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p id={titleId} className="text-base font-extrabold text-primary">
                {item.label}
              </p>
              {item.description ? (
                <p className="mt-0.5 max-w-xl text-sm text-muted">
                  {item.description}
                </p>
              ) : null}
            </div>
            <Link
              href={item.href}
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
              onClick={onClose}
            >
              View all →
            </Link>
          </div>

          <div
            className={cn(
              "grid gap-4 md:gap-5",
              item.featured
                ? "md:grid-cols-[minmax(0,1fr)_15rem]"
                : "md:grid-cols-1",
            )}
          >
            <div className="min-w-0 space-y-4">
              {tiles.length ? (
                <ul
                  className={cn(
                    "grid gap-2.5",
                    tiles.length >= 3
                      ? "grid-cols-3"
                      : tiles.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-1",
                  )}
                >
                  {tiles.map((tile) => (
                    <li key={tile.href + tile.label}>
                      <Link
                        href={tile.href}
                        onClick={onClose}
                        className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-soft"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- nav tile; skip Vercel Image Optimization */}
                        <img
                          src={tile.image}
                          alt={tile.imageAlt}
                          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
                        <span className="absolute inset-x-0 bottom-0 p-2.5 text-sm font-bold text-white">
                          {tile.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div
                className={cn(
                  "grid gap-4",
                  cols >= 2 ? "sm:grid-cols-2" : "grid-cols-1",
                )}
              >
                {item.columns.map((column) => (
                  <div key={column.title}>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                      {column.title}
                    </p>
                    <ul className="mt-2 space-y-0.5">
                      {column.links.map((link) => {
                        const active = isActivePath(pathname, link.href);
                        return (
                          <li key={link.href + link.label}>
                            <Link
                              href={link.href}
                              onClick={onClose}
                              className={cn(
                                "block rounded-md px-2 py-1.5 text-sm font-semibold transition-colors",
                                active
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
                ))}
              </div>
            </div>

            {item.featured ? (
              <Link
                href={item.featured.href}
                onClick={onClose}
                className="group relative hidden min-h-[14rem] overflow-hidden rounded-2xl md:block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- featured nav card */}
                <img
                  src={item.featured.image}
                  alt={item.featured.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
                  <span className="block text-base font-extrabold">
                    {item.featured.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-primary-foreground/85">
                    {item.featured.body}
                  </span>
                  <span
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "mt-3 inline-flex rounded-full",
                    )}
                  >
                    {item.featured.cta}
                  </span>
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
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
          "rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors",
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
    <div className="overflow-hidden rounded-xl border border-border/80">
      <div className="flex items-stretch">
        <Link
          href={item.href}
          className={cn(
            "flex-1 px-3.5 py-3 text-sm font-semibold transition-colors",
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
            "flex w-12 items-center justify-center border-l border-border/80 transition-colors",
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
        <div className="space-y-3 border-t border-border bg-soft/40 px-3.5 py-3">
          {item.tiles?.length ? (
            <ul className="grid grid-cols-3 gap-2">
              {item.tiles.slice(0, 3).map((tile) => (
                <li key={tile.href + tile.label}>
                  <Link
                    href={tile.href}
                    onClick={onNavigate}
                    className="relative block aspect-square overflow-hidden rounded-lg bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- mobile nav tile */}
                    <img
                      src={tile.image}
                      alt={tile.imageAlt}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-1.5 text-[10px] font-bold leading-tight text-white">
                      {tile.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {item.columns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                {column.title}
              </p>
              <ul className="mt-1.5 space-y-0.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="block rounded-lg px-2 py-2 text-sm font-semibold text-primary hover:bg-white"
                      onClick={onNavigate}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {item.featured ? (
            <Link
              href={item.featured.href}
              className="block rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground"
              onClick={onNavigate}
            >
              {item.featured.cta} →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
