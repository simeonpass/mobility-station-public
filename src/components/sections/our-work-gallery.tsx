"use client";

import { useState } from "react";
import type { PortfolioItem } from "@/lib/data";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Adaptations", value: "adaptations" },
  { label: "Scooters & Wheelchairs", value: "scooters-wheelchairs" },
  { label: "Servicing", value: "servicing" },
];

export function OurWorkGallery({ items }: { items: PortfolioItem[] }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<PortfolioItem | null>(null);

  const filtered =
    filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-white text-primary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!filtered.length ? (
        <p className="py-12 text-center text-muted">
          No items in this category yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              className="group relative aspect-square overflow-hidden rounded-xl bg-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={item.title || "Recent work photo"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- portfolio thumb; skip Vercel Image Optimization */}
              <img
                src={item.url}
                alt={item.title || item.description || "Mobility Station job"}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              {item.title ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                  <p className="line-clamp-2 text-left text-sm font-semibold text-white">
                    {item.title}
                  </p>
                </div>
              ) : null}
            </button>
          ))}
        </div>
      )}

      {active ? (
        <div
          className="fixed inset-0 z-[200] flex flex-col bg-black/85"
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <div className="relative z-20 flex shrink-0 justify-end px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <button
              type="button"
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-white px-3.5 text-sm font-semibold text-primary shadow-md"
              onClick={() => setActive(null)}
              aria-label="Close photo"
            >
              Close
            </button>
          </div>
          <div
            className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
            onClick={() => setActive(null)}
          >
            <div
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element -- lightbox; skip Vercel Image Optimization */}
                <img
                  src={active.url}
                  alt={active.title || "Recent work"}
                  className="absolute inset-0 h-full w-full object-contain"
                  decoding="async"
                />
              </div>
              {(active.title || active.description) && (
                <div className="mt-3 text-center text-white">
                  {active.title ? (
                    <p className="font-semibold">{active.title}</p>
                  ) : null}
                  {active.description ? (
                    <p className="mt-1 text-sm text-white/80">
                      {active.description}
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
