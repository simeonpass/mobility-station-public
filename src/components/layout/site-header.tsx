"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, PhoneCall, X } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-border bg-soft/95 backdrop-blur">
      {/* Utility bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-site flex h-8 items-center justify-between gap-3 text-xs font-medium">
          <p className="min-w-0 truncate">
            <span className="sm:hidden">Heathrow &amp; Ferndown</span>
            <span className="hidden sm:inline">
              Heathrow &amp; Ferndown Branches
              <span className="mx-1.5 text-primary-foreground/40" aria-hidden>
                |
              </span>
              <Link
                href="/book-a-demo#demo-terms"
                className="hover:text-accent-on-dark"
              >
                Free home demonstrations*
              </Link>
            </span>
          </p>
          <a
            href={SITE.phoneHref}
            className="shrink-0 tabular-nums hover:text-accent-on-dark"
          >
            {SITE.phone}
          </a>
        </div>
      </div>

      {/* Brand row: logo · search · actions */}
      <div className="container-site flex h-16 items-center gap-3 md:h-[4.25rem] md:gap-5">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image
            src="/brand/logo-header-v6.png"
            alt="Mobility Station"
            width={800}
            height={300}
            priority
            className="h-10 w-auto md:h-11"
          />
        </Link>

        <HeaderSearch className="mx-auto hidden min-w-0 max-w-xl flex-1 md:block" />

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/contact?interest=callback#callback"
              className={cn(
                buttonVariants({ variant: "phone", size: "sm" }),
                "rounded-full",
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
                "hidden rounded-full sm:inline-flex",
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

      {/* Desktop category nav — own row so it never collides with search */}
      <nav
        className="hidden border-t border-border/70 lg:block"
        aria-label="Primary"
      >
        <div className="container-site flex items-stretch justify-between gap-1">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex-1 whitespace-nowrap px-2 py-3 text-center text-sm font-semibold transition-colors",
                  active
                    ? "text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-accent"
                    : "text-primary/80 hover:bg-white/50 hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
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
            <nav className="flex flex-col" aria-label="Mobile">
              {nav.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-3 text-sm font-semibold",
                      active
                        ? "bg-primary-soft text-primary"
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
                className={cn(buttonVariants({ variant: "phone" }), "w-full")}
                onClick={() => setOpen(false)}
              >
                <PhoneCall className="h-4 w-4" aria-hidden />
                Request a callback
              </Link>
              <Link
                href="/book-a-demo"
                className={cn(buttonVariants(), "w-full")}
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
