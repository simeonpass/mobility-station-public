import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CatalogCta = {
  href: string;
  label: string;
};

export function CatalogIntro({
  title,
  subtitle,
  primary,
  secondary,
  primaryAction,
}: {
  title: string;
  subtitle: string;
  primary: CatalogCta;
  secondary: CatalogCta;
  primaryAction?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-white">
      <div className="container-site py-14 md:py-20 lg:py-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Mobility Station · Shop
            </p>
            <h1 className="text-balance text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-primary md:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              {subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {primaryAction ?? (
              <Link
                href={primary.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 min-h-12 rounded-full px-7 text-base",
                )}
              >
                {primary.label}
              </Link>
            )}
            <Link
              href={secondary.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 min-h-12 rounded-full bg-white px-7 text-base",
              )}
            >
              {secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
