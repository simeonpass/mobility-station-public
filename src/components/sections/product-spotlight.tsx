import Link from "next/link";
import type { ReactNode } from "react";

export function ProductSpotlight({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
  children,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-white">
      <div className="container-site py-12 md:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Recommended
            </p>
            <h2 className="text-3xl font-extrabold tracking-[-0.035em] text-primary md:text-4xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{subtitle}</p>
            ) : null}
          </div>
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-soft"
            >
              {viewAllLabel} →
            </Link>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-7">
          {children}
        </div>
      </div>
    </section>
  );
}
