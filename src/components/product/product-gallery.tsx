"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { CatalogImage } from "@/components/product/catalog-image";
import { FittedMechanicCorner } from "@/components/product/fitted-badge";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  showFittedMechanic = false,
}: {
  images: string[];
  name: string;
  /** Adaptation products — larger mechanic in the image corner. */
  showFittedMechanic?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const count = images.length;
  const current = images[active] ?? images[0];

  const goTo = useCallback(
    (index: number) => {
      const next = ((index % count) + count) % count;
      setActive(next);
      const scroller = scrollerRef.current;
      if (scroller) {
        const width = scroller.clientWidth;
        scroller.scrollTo({ left: width * next, behavior: "smooth" });
      }
      const thumbs = thumbsRef.current;
      const thumb = thumbs?.children[next] as HTMLElement | undefined;
      thumb?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [count],
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => {
      const width = scroller.clientWidth || 1;
      const index = Math.round(scroller.scrollLeft / width);
      setActive((prev) => (prev === index ? prev : index));
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") goTo(active + 1);
      if (e.key === "ArrowLeft") goTo(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, active, goTo]);

  return (
    <div className="min-w-0">
      <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-white">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, index) => {
            // Only decode nearby slides on mobile — a 10-image gallery at
            // full origin size was routinely 0.5–1MB+ before optimisation.
            const shouldLoad = index === 0 || Math.abs(index - active) <= 1;
            return (
              <button
                key={src + index}
                type="button"
                className="relative aspect-square w-full shrink-0 snap-center"
                onClick={() => setLightbox(true)}
                aria-label={`View larger image ${index + 1} of ${name}`}
              >
                {shouldLoad ? (
                  <CatalogImage
                    src={src}
                    alt={`${name} mobility product ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="object-contain p-3 sm:p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <span
                    className="absolute inset-0 bg-soft"
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>

        {showFittedMechanic ? <FittedMechanicCorner size="gallery" /> : null}

        <button
          type="button"
          className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-primary shadow-sm"
          onClick={() => setLightbox(true)}
          aria-label="Enlarge image"
        >
          <Expand className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Enlarge</span>
        </button>

        {count > 1 ? (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-primary shadow"
              aria-label="Previous image"
              onClick={() => goTo(active - 1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-primary shadow"
              aria-label="Next image"
              onClick={() => goTo(active + 1)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-3 right-16 flex justify-start gap-1.5 md:hidden">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to image ${index + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === active
                      ? "w-5 bg-primary"
                      : "w-1.5 bg-primary/30",
                  )}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
          </>
        ) : null}

        {count > 1 ? (
          <p className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">
            {active + 1} / {count}
          </p>
        ) : null}
      </div>

      {count > 1 ? (
        <div
          ref={thumbsRef}
          className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, index) => (
            <button
              key={src + index}
              type="button"
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white",
                index === active
                  ? "border-primary ring-1 ring-primary"
                  : "border-border",
              )}
              onClick={() => goTo(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === active}
            >
              <CatalogImage
                src={src}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      ) : null}

      {lightbox ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} image lightbox`}
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-primary"
            onClick={() => setLightbox(false)}
          >
            <span className="inline-flex items-center gap-1">
              <X className="h-4 w-4" /> Close
            </span>
          </button>

          {count > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(active - 1);
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(active + 1);
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}

          <div
            className="relative h-[75vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CatalogImage
              src={current}
              alt={`${name} enlarged view`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
