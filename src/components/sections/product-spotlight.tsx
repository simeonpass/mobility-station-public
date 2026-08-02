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
      <div className="container-site py-8 md:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-2 text-sm text-muted md:text-base">{subtitle}</p>
            ) : null}
          </div>
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              {viewAllLabel} →
            </Link>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {children}
        </div>
      </div>
    </section>
  );
}
