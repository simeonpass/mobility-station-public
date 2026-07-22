"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/vehicle-adaptations", label: "Vehicle Adaptations" },
  { href: "/shop", label: "Scooters & Wheelchairs" },
  { href: "/mobility-scooter-hire", label: "Hire" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-soft/95 backdrop-blur">
      <div className="bg-primary text-primary-foreground">
        <div className="container-site flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-center text-xs font-medium sm:justify-between sm:text-left">
          <p>Heathrow &amp; Ferndown Branches | Free home demonstrations</p>
          <div className="flex items-center gap-3">
            <a href={SITE.phoneHref} className="hover:text-accent">
              {SITE.phone}
            </a>
            <Link href="/book-a-demo" className="font-semibold text-accent hover:text-accent-hover">
              Book a Demo
            </Link>
          </div>
        </div>
      </div>

      <div className="container-site flex h-[4.25rem] items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image
            src="/brand/logo-header.png"
            alt="Mobility Station"
            width={240}
            height={46}
            priority
            className="h-10 w-auto md:h-11"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-primary/90 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={SITE.phoneHref}
            className={cn(buttonVariants({ variant: "phone", size: "sm" }), "rounded-full")}
          >
            <Phone className="h-4 w-4" aria-hidden />
            {SITE.phone}
          </a>
          <Link href="/book-a-demo" className={buttonVariants({ size: "sm" })}>
            Book a Demo
          </Link>
        </div>

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

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-soft lg:hidden">
          <nav className="container-site flex flex-col gap-1 py-4" aria-label="Mobile">
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
            <a
              href={SITE.phoneHref}
              className="rounded-md px-3 py-3 text-sm font-semibold text-primary hover:bg-white/70"
            >
              Call {SITE.phone}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
