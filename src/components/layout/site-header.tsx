"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MapPin, Menu, Phone, PhoneCall, X } from "lucide-react";
import { CartButton } from "@/components/cart/cart-drawer";
import { HeaderSearch } from "@/components/layout/header-search";
import { Button, buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/vehicle-adaptations", label: "Vehicle Adaptations" },
  { href: "/shop", label: "Scooters & Wheelchairs" },
  { href: "/clearance", label: "Clearance" },
  { href: "/hire", label: "Hire" },
  { href: "/motability", label: "Motability" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "Recent Work" },
];

function isActivePath(pathname: string, href: string) {
  return (
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
                Free home demonstrations*
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

      {/* Brand row: logo · search · actions */}
      <div className="border-b border-border/60 bg-white">
        <div className="container-site flex h-[4.75rem] items-center gap-3 md:h-20 md:gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/brand/logo-header-v6.png"
              alt="Mobility Station"
              width={800}
              height={300}
              priority
              className="h-12 w-auto md:h-14"
            />
          </Link>

          <HeaderSearch className="mx-auto hidden min-w-0 max-w-xl flex-1 md:block" />

          <div className="ml-auto flex shrink-0 items-center gap-2.5">
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/contact?interest=callback#callback"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full border-primary/20 bg-white text-primary hover:border-primary hover:bg-primary-soft",
                )}
              >
                <PhoneCall className="h-4 w-4" aria-hidden />
                <span className="hidden lg:inline">Request a callback</span>
                <span className="lg:hidden">Callback</span>
              </Link>
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

      {/* Desktop category nav — deep teal strip */}
      <nav
        className="hidden bg-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:block"
        aria-label="Primary"
      >
        <div className="container-site flex h-11 items-center gap-1">
          {nav.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex h-full items-center px-3.5 text-[13px] font-semibold tracking-wide transition-colors",
                  active
                    ? "text-white"
                    : "text-white/75 hover:text-white",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-3.5 bottom-0 h-0.5 rounded-full bg-accent transition-opacity duration-200",
                    active
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-70",
                  )}
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
        <div
          className="h-0.5 bg-gradient-to-r from-accent/40 via-accent to-accent/40"
          aria-hidden
        />
      </nav>

      {/* Mobile / tablet drawer */}
      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-border bg-white shadow-lg lg:hidden"
        >
          <div className="container-site space-y-4 py-4">
            <HeaderSearch
              size="sm"
              className="w-full md:hidden"
              onSubmitExtra={() => setOpen(false)}
            />
            <nav className="flex flex-col gap-0.5" aria-label="Mobile">
              {nav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-primary hover:bg-soft",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="grid gap-2 border-t border-border pt-4 sm:hidden">
              <Link
                href="/contact?interest=callback#callback"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full rounded-full",
                )}
                onClick={() => setOpen(false)}
              >
                <PhoneCall className="h-4 w-4" aria-hidden />
                Request a callback
              </Link>
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
