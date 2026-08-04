"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
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
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const count = images.length;
  const current = images[active] ?? images[0];

  const goTo = useCallback(
    (index: number) => {
      if (!count) return;
      const next = ((index % count) + count) % count;
      setActive(next);
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
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") goTo(active + 1);
      if (e.key === "ArrowLeft") goTo(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, active, goTo]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null || count < 2) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (Math.abs(delta) < 40) return;
    goTo(active + (delta < 0 ? 1 : -1));
  };

  if (!current) {
    return (
      <div
        className="aspect-square w-full rounded-2xl border border-border bg-white"
        aria-hidden
      />
    );
  }

  return (
    <div className="min-w-0">
      <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-white">
        {/*
          One slide at a time — a horizontal scroller let the next image
          bleed in after switching to plain <img> (R2), especially with scale.
        */}
        <button
          type="button"
          className="relative aspect-square w-full overflow-hidden"
          onClick={() => setLightbox(true)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-label={`View larger image ${active + 1} of ${name}`}
        >
          <CatalogImage
            src={current}
            alt={`${name} mobility product ${active + 1}`}
            fill
            priority
            className="object-contain p-2 sm:p-3"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </button>

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
