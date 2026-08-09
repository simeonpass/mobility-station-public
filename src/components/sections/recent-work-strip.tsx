import Image from "next/image";
import Link from "next/link";
import type { RecentWorkProject } from "@/lib/recent-work";

export function RecentWorkStrip({ items }: { items: RecentWorkProject[] }) {
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
              Recent work
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Real fittings from Heathrow and Ferndown — published when the job
              is done.
            </p>
          </div>
          <Link
            href="/our-work"
            className="font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
          >
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {items.slice(0, 6).map((item) => (
            <Link
              key={item.slug}
              href={`/our-work/${item.slug}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-soft"
            >
              {item.hero_image ? (
                <Image
                  src={item.hero_image}
                  alt={
                    item.images?.[0]?.alt ||
                    item.title ||
                    "Recent Mobility Station work"
                  }
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : null}
              {item.title ? (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2.5 opacity-0 transition group-hover:opacity-100">
                  <span className="line-clamp-2 text-left text-xs font-semibold text-white">
                    {item.title}
                  </span>
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
