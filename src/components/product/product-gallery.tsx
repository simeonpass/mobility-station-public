"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { CatalogImage } from "@/components/product/catalog-image";
import { GallerySwipe } from "@/components/product/gallery-swipe";
import { LightboxZoom } from "@/components/product/lightbox-zoom";

export function ProductGallery({
  images,
  name,
  adaptation = false,
}: {
  images: string[];
  name: string;
  adaptation?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);


  const count = images.length;
  const current = images[active] ?? images[0];

  const goTo = useCallback(
    (index: number) => {
      if (!count) return;
      const next = ((index % count) + count) % count;
      setActive(next);
      const thumb = thumbsRef.current?.children[next] as HTMLElement | undefined;
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, active, goTo]);

  if (!current) {
    return (
      <div
        className="aspect-square w-full rounded-[2rem] border border-border bg-soft/30"
        aria-hidden
      />
    );
  }


  return (
    <div className="ms-product-gallery">
      <div className={`ms-gallery-image ${adaptation ? "ms-gallery-adaptation" : ""}`}>
        <GallerySwipe count={count} active={active} onChange={goTo} onTap={() => setLightbox(true)}>
          {images.map((src, index) => (
            <div key={src + index} className="relative h-full w-[var(--slide-width)] shrink-0">
              <CatalogImage src={src} alt={`${name} — image ${index + 1}`} fill priority={index === 0}
                className={adaptation ? "object-cover" : "object-contain"} sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          ))}
        </GallerySwipe>
        <button type="button" className="ms-gallery-enlarge" onClick={() => setLightbox(true)} aria-label="Enlarge image">
          <Expand size={18} aria-hidden />
        </button>
      </div>
      {count > 1 ? (
        <div className="ms-gallery-navigation">
          <div ref={thumbsRef} className="ms-gallery-thumbnails">
            {images.map((src, index) => (
              <button key={src + index} type="button" onClick={() => goTo(index)}
                aria-label={`Show image ${index + 1}`} aria-current={index === active}>
                <CatalogImage src={src} alt="" fill className={adaptation ? "object-cover" : "object-contain"} sizes="56px" />
              </button>
            ))}
          </div>
          <div className="ms-gallery-pagination">
            <button type="button" aria-label="Previous image" onClick={() => goTo(active - 1)}><ChevronLeft size={18} aria-hidden /></button>
            <span aria-live="polite">{active + 1} / {count}</span>
            <button type="button" aria-label="Next image" onClick={() => goTo(active + 1)}><ChevronRight size={18} aria-hidden /></button>
          </div>
        </div>
      ) : null}
      {lightbox
        ? createPortal(
            <div
              className="fixed inset-0 z-[300] flex flex-col bg-black/96"
              role="dialog"
              aria-modal="true"
              aria-label={`${name} image lightbox`}
            >
              <div className="relative z-20 flex shrink-0 items-center justify-between gap-3 px-3 pb-2 pt-[max(.75rem,env(safe-area-inset-top))]">
                <p className="min-w-0 truncate px-1 text-sm font-semibold text-white/80">
                  {count > 1 ? `${active + 1} / ${count}` : "Enlarged image"}
                </p>
                <button
                  type="button"
                  className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-white px-3.5 text-sm font-semibold text-primary"
                  onClick={() => setLightbox(false)}
                >
                  <X className="h-5 w-5" />
                  <span>Close</span>
                </button>
              </div>
              <div
                className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
                onClick={() => setLightbox(false)}
              >
                {count > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary sm:flex"
                      onClick={(e) => {
                        e.stopPropagation();
                        goTo(active - 1);
                      }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary sm:flex"
                      onClick={(e) => {
                        e.stopPropagation();
                        goTo(active + 1);
                      }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                ) : null}
                <div className="relative h-full w-full max-w-4xl">
                  <LightboxZoom
                    src={current}
                    alt={`${name} enlarged view`}
                    onSwipe={
                      count > 1
                        ? (direction) => goTo(active + direction)
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
