import Image from "next/image";
import Link from "next/link";
import type { PortfolioItem } from "@/lib/data";

export function RecentWorkStrip({ items }: { items: PortfolioItem[] }) {
  if (!items.length) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="container-site">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-foreground">
              From our workshop
            </p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              Recent adaptation work
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Real fittings from Heathrow and Ferndown.
            </p>
          </div>
          <Link
            href="/blog#gallery"
            className="font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
          >
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {items.slice(0, 6).map((item) => (
            <Link
              key={item.id}
              href="/blog#gallery"
              className="group relative aspect-square overflow-hidden rounded-xl bg-soft"
            >
              <Image
                src={item.url}
                alt={item.title || "Recent Mobility Station work"}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
