"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-soft/95 backdrop-blur">
      <div className="bg-primary text-primary-foreground">
        <div className="container-site flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-center text-xs font-medium sm:justify-between sm:text-left">
          <p>
            Heathrow &amp; Ferndown Branches |{" "}
            <Link
              href="/book-a-demo#demo-terms"
              className="hover:text-accent-on-dark"
            >
              Free home demonstrations*
            </Link>
          </p>
          <div className="flex items-center gap-3">
            <a href={SITE.phoneHref} className="hover:text-accent-on-dark">
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="container-site flex h-[4.25rem] items-center justify-between gap-3 md:gap-4">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image
            src="/brand/logo-header-v6.png"
            alt="Mobility Station"
            width={800}
            height={300}
            priority
            className="h-11 w-auto md:h-12"
          />
        </Link>

        <HeaderSearch className="mx-1 hidden max-w-xs flex-1 lg:mx-2 lg:block xl:max-w-sm" />

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-semibold text-primary/90 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <CartButton />
          <Link
            href="/contact?interest=callback#callback"
            className={cn(buttonVariants({ variant: "phone", size: "sm" }), "rounded-full")}
          >
            <PhoneCall className="h-4 w-4" aria-hidden />
            <span className="hidden lg:inline">Request a callback</span>
            <span className="lg:hidden">Callback</span>
          </Link>
          <Link href="/book-a-demo" className={buttonVariants({ size: "sm" })}>
            Book a Demo
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <CartButton />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-soft xl:hidden">
          <div className="container-site py-4">
            <HeaderSearch
              size="sm"
              className="mb-3 w-full"
              onSubmitExtra={() => setOpen(false)}
            />
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-sm font-semibold text-primary hover:bg-white/70"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/book-a-demo"
                className="rounded-md px-3 py-3 text-sm font-semibold text-primary hover:bg-white/70"
                onClick={() => setOpen(false)}
              >
                Book a Demo
              </Link>
              <Link
                href="/contact?interest=callback#callback"
                className="rounded-md px-3 py-3 text-sm font-semibold text-primary hover:bg-white/70"
                onClick={() => setOpen(false)}
              >
                Request a callback
              </Link>
              <Link
                href="/contact"
                className="rounded-md px-3 py-3 text-sm font-semibold text-primary hover:bg-white/70"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
