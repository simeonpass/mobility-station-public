import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RecentWorkProject } from "@/lib/recent-work";

export function HomeRecentWork({ items }: { items: RecentWorkProject[] }) {
  if (!items.length) return null;
  return (
    <section className="py-10 md:py-14" aria-labelledby="home-work-title">
      <div className="container-site">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="home-work-title" className="text-3xl font-extrabold md:text-4xl">Expertise you can see.</h2>
            <p className="mt-3 text-base text-muted">Discover recent work from our workshops.</p>
          </div>
          <Link href="/our-work" className="inline-flex items-center gap-2 py-2 font-semibold text-accent-ink hover:underline">View our work <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <Link key={item.slug} href={`/our-work/${item.slug}`} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-soft">
                {item.hero_image ? <Image src={item.hero_image} alt={item.images?.[0]?.alt || item.title} fill sizes="(min-width: 1024px) 360px, (min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" /> : null}
              </div>
              <h3 className="mt-4 text-base font-bold leading-snug group-hover:underline">{item.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
