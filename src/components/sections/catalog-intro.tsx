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
  /** Optional popup/button instead of the primary link. */
  primaryAction?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-gradient-to-b from-primary-soft/80 to-white">
      <div className="container-site py-10 md:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-base text-muted md:text-lg">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {primaryAction ?? (
              <Link
                href={primary.href}
                className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
              >
                {primary.label}
              </Link>
            )}
            <Link
              href={secondary.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full bg-white",
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
