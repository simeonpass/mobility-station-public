"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  MapPin,
  Menu,
  Phone,
  PhoneCall,
  Truck,
  X,
} from "lucide-react";
import { CartButton } from "@/components/cart/cart-drawer";
import { HeaderSearch } from "@/components/layout/header-search";
import { Button, buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/vehicle-adaptations", label: "Vehicle Adaptations" },
  { href: "/shop", label: "Scooters & Wheelchairs" },
  { href: "/hire", label: "Hire" },
  { href: "/motability", label: "Motability" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "Recent Work" },
];

const trustItems = [
  { icon: BadgeCheck, label: "Motability accredited" },
  { icon: Truck, label: "Home delivery & demos" },
  { icon: MapPin, label: "Heathrow & Ferndown" },
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
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(0,63,67,0.06),0_10px_30px_-18px_rgba(0,63,67,0.35)]">
      {/* Thin utility strip — dark only once */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-site flex h-9 items-center justify-between gap-3 text-[12px] font-medium">
          <div className="flex min-w-0 items-center gap-x-4 gap-y-1 overflow-hidden">
            <a
              href={SITE.phoneHref}
              className="inline-flex shrink-0 items-center gap-1.5 tabular-nums transition-colors hover:text-accent-on-dark"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {SITE.phone}
            </a>
            <span
              className="hidden h-3 w-px bg-white/20 sm:block"
              aria-hidden
            />
            <Link
              href="/locations"
              className="hidden items-center gap-1.5 transition-colors hover:text-accent-on-dark sm:inline-flex"
            >
              <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden />
              Visit showroom
            </Link>
            <Link
              href="/book-a-demo#demo-terms"
              className="hidden transition-colors hover:text-accent-on-dark md:inline"
            >
              Free home demonstrations*
            </Link>
            <Link
              href="/contact?interest=callback#callback"
              className="hidden items-center gap-1.5 transition-colors hover:text-accent-on-dark lg:inline-flex"
            >
              <PhoneCall className="h-3.5 w-3.5" aria-hidden />
              Request a callback
            </Link>
          </div>

          <Link
            href="/book-a-demo"
            className="inline-flex shrink-0 items-center rounded-full bg-accent px-3.5 py-1 text-[12px] font-bold text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Book a Demo
          </Link>
        </div>
      </div>

      {/* Brand + search — one continuous white surface into the soft nav */}
      <div className="bg-white">
        <div className="container-site flex h-[4.25rem] items-center gap-4 md:h-[4.75rem] md:gap-8">
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
              className="h-10 w-auto md:h-11"
            />
          </Link>

          <HeaderSearch className="mx-auto hidden min-w-0 max-w-2xl flex-1 md:block" />

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              href="/contact?interest=callback#callback"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden rounded-full text-primary sm:inline-flex lg:hidden",
              )}
            >
              <PhoneCall className="h-4 w-4" aria-hidden />
              Callback
            </Link>
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

      {/* Soft integrated nav + trust — one continuous light band */}
      <div className="hidden border-t border-border/60 bg-[#f3f6f5] lg:block">
        <nav aria-label="Primary">
          <div className="container-site flex items-stretch justify-center">
            {nav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative px-4 py-3 text-[13px] font-semibold tracking-wide transition-colors xl:px-5",
                    active
                      ? "text-primary"
                      : "text-primary/70 hover:text-primary",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-accent transition-transform duration-200 xl:inset-x-5",
                      active
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
        <div className="border-t border-border/50">
          <div className="container-site flex h-9 items-center justify-center gap-8 text-[12px] font-medium text-muted xl:gap-12">
            {trustItems.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-accent" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

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
            <div className="grid gap-2 border-t border-border pt-4">
              <Link
                href="/book-a-demo"
                className={cn(buttonVariants(), "w-full rounded-full")}
                onClick={() => setOpen(false)}
              >
                Book a Demo
              </Link>
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
                href="/contact"
                className="block rounded-lg px-3 py-3 text-center text-sm font-semibold text-primary hover:bg-soft"
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
