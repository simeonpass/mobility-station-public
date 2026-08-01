"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Menu, Phone, PhoneCall, X } from "lucide-react";
import { CartButton } from "@/components/cart/cart-drawer";
import { HeaderSearch } from "@/components/layout/header-search";
import { Button, buttonVariants } from "@/components/ui/button";
import { useBusinessLane } from "@/hooks/use-business-lane";
import { clearBusinessLane, writeBusinessLane } from "@/lib/business-lane";
import { SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; laneHint?: "adaptations" | "mobility" };

const NAV_ADAPTATIONS: NavItem[] = [
  { href: "/vehicle-adaptations", label: "Adaptations" },
  { href: "/quote?interest=adaptation", label: "Get a Quote" },
  { href: "/motability/vehicle-adaptations", label: "Motability" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "Recent Work" },
  { href: "/shop", label: "Scooters & Wheelchairs", laneHint: "mobility" },
];

const NAV_MOBILITY: NavItem[] = [
  { href: "/shop", label: "Shop" },
  { href: "/hire", label: "Hire" },
  { href: "/motability/scooters-wheelchairs", label: "Motability" },
  { href: "/delivery", label: "Delivery" },
  { href: "/locations", label: "Locations" },
  { href: "/vehicle-adaptations", label: "Vehicle Adaptations", laneHint: "adaptations" },
];

const NAV_DEFAULT: NavItem[] = [
  { href: "/vehicle-adaptations", label: "Vehicle Adaptations", laneHint: "adaptations" },
  { href: "/shop", label: "Scooters & Wheelchairs", laneHint: "mobility" },
  { href: "/hire", label: "Hire" },
  { href: "/motability", label: "Motability" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "Recent Work" },
];

function isActivePath(pathname: string, href: string) {
  const pathOnly = href.split("?")[0] || href;
  return (
    pathname === pathOnly ||
    (pathOnly !== "/" && pathname.startsWith(`${pathOnly}/`))
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lane = useBusinessLane();

  const nav = useMemo(() => {
    if (lane === "adaptations") return NAV_ADAPTATIONS;
    if (lane === "mobility") return NAV_MOBILITY;
    return NAV_DEFAULT;
  }, [lane]);

  const primaryCta =
    lane === "adaptations"
      ? { href: "/quote?interest=adaptation", label: "Get a Quote" }
      : { href: "/book-a-demo", label: "Book a Demo" };

  const showCart = lane !== "adaptations";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(0,63,67,0.06),0_10px_28px_-18px_rgba(0,63,67,0.28)]">
      <div className="bg-[#0d6b70] text-white">
        <div className="container-site flex h-8 items-center justify-between gap-3 text-[12px] font-medium">
          <div className="flex min-w-0 items-center gap-3 overflow-hidden">
            <a
              href={SITE.phoneHref}
              className="inline-flex shrink-0 items-center gap-1.5 tabular-nums transition-colors hover:text-accent-on-dark"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {SITE.phone}
            </a>
            <span className="hidden text-white/30 sm:inline" aria-hidden>
              |
            </span>
            <Link
              href="/locations"
              className="hidden items-center gap-1 transition-colors hover:text-accent-on-dark sm:inline-flex"
            >
              <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden />
              Heathrow &amp; Ferndown
            </Link>
            {lane === "adaptations" ? (
              <span className="hidden truncate text-white/80 md:inline">
                Vehicle adaptations · quote &amp; fitting
              </span>
            ) : lane === "mobility" ? (
              <span className="hidden truncate text-white/80 md:inline">
                Scooters &amp; wheelchairs · local demos
              </span>
            ) : (
              <Link
                href="/book-a-demo#demo-terms"
                className="hidden truncate transition-colors hover:text-accent-on-dark md:inline"
              >
                Free home demonstrations*
              </Link>
            )}
          </div>
          <Link
            href={primaryCta.href}
            className="inline-flex shrink-0 items-center rounded-full bg-accent px-3 py-1 text-[11px] font-bold leading-none text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            {primaryCta.label}
          </Link>
        </div>
      </div>

      <div className="bg-white">
        <div className="container-site flex h-14 items-center gap-3 md:h-16 md:gap-5">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            onClick={() => {
              clearBusinessLane();
              setOpen(false);
            }}
          >
            <Image
              src="/brand/logo-header-v6.png"
              alt="Mobility Station"
              width={800}
              height={300}
              priority
              className="h-9 w-auto md:h-10"
            />
          </Link>

          {showCart ? (
            <HeaderSearch className="mx-auto hidden min-w-0 max-w-lg flex-1 md:block" />
          ) : (
            <p className="mx-auto hidden min-w-0 flex-1 text-center text-sm text-muted md:block">
              Adaptations — quotation &amp; workshop fitting
            </p>
          )}

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <Link
              href="/contact?interest=callback#callback"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden rounded-full text-primary sm:inline-flex",
              )}
            >
              <PhoneCall className="h-4 w-4" aria-hidden />
              <span className="hidden lg:inline">Request a callback</span>
              <span className="lg:hidden">Callback</span>
            </Link>
            {showCart ? <CartButton /> : null}
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
        className="hidden border-y border-[#c5d9d4] bg-[#e7f2ef] lg:block"
        aria-label="Primary"
      >
        <div className="container-site flex items-center justify-center gap-0.5">
          {nav.map((item) => {
            const active = isActivePath(pathname, item.href);
            const isOtherLane = Boolean(item.laneHint && item.laneHint !== lane);
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => {
                  if (item.laneHint) writeBusinessLane(item.laneHint);
                }}
                className={cn(
                  "group relative px-3.5 py-2.5 text-[13px] font-semibold tracking-wide transition-colors xl:px-4",
                  isOtherLane
                    ? "text-primary/45 hover:text-primary"
                    : active
                      ? "text-primary"
                      : "text-primary/70 hover:text-primary",
                )}
              >
                {isOtherLane ? `Also: ${item.label}` : item.label}
                <span
                  className={cn(
                    "absolute inset-x-3.5 bottom-0 h-[2px] origin-center rounded-full bg-accent transition-transform duration-200 xl:inset-x-4",
                    active && !isOtherLane
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100",
                  )}
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-border bg-[#e7f2ef] shadow-lg lg:hidden"
        >
          <div className="container-site space-y-4 py-4">
            {showCart ? (
              <HeaderSearch
                size="sm"
                className="w-full md:hidden"
                onSubmitExtra={() => setOpen(false)}
              />
            ) : null}
            {lane ? (
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-primary/60">
                {lane === "adaptations"
                  ? "You’re in vehicle adaptations"
                  : "You’re in scooters & wheelchairs"}
              </p>
            ) : null}
            <nav className="flex flex-col gap-0.5" aria-label="Mobile">
              {nav.map((item) => {
                const active = isActivePath(pathname, item.href);
                const isOtherLane = Boolean(
                  item.laneHint && item.laneHint !== lane,
                );
                return (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors",
                      isOtherLane
                        ? "text-primary/55 hover:bg-white/70"
                        : active
                          ? "bg-primary text-primary-foreground"
                          : "text-primary hover:bg-white/70",
                    )}
                    onClick={() => {
                      if (item.laneHint) writeBusinessLane(item.laneHint);
                      setOpen(false);
                    }}
                  >
                    {isOtherLane ? `Also: ${item.label}` : item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="grid gap-2 border-t border-[#c5d9d4] pt-4 sm:hidden">
              <Link
                href={primaryCta.href}
                className={cn(buttonVariants(), "w-full rounded-full")}
                onClick={() => setOpen(false)}
              >
                {primaryCta.label}
              </Link>
              <Link
                href="/contact?interest=callback#callback"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full rounded-full bg-white",
                )}
                onClick={() => setOpen(false)}
              >
                <PhoneCall className="h-4 w-4" aria-hidden />
                Request a callback
              </Link>
              <Link
                href="/contact"
                className="block rounded-lg px-3 py-3 text-center text-sm font-semibold text-primary hover:bg-white/70"
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
