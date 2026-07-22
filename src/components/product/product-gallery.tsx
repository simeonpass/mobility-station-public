"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const current = images[active] ?? images[0];

  return (
    <div>
      <button
        type="button"
        className="relative aspect-square w-full overflow-hidden bg-soft"
        onClick={() => setOpen(true)}
        aria-label={`View larger image of ${name}`}
      >
        <Image
          src={current}
          alt={`${name} mobility product`}
          fill
          priority
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </button>
      {images.length > 1 ? (
        <ul className="mt-3 flex gap-2">
          {images.map((src, index) => (
            <li key={src + index}>
              <button
                type="button"
                className={cn(
                  "relative h-16 w-16 overflow-hidden border bg-soft",
                  index === active ? "border-primary" : "border-border",
                )}
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1}`}
              >
                <Image
                  src={src}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} image lightbox`}
          onClick={() => setOpen(false)}
        >
          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={current}
              alt={`${name} enlarged view`}
              fill
              className="object-contain"
              sizes="100vw"
            />
            <button
              type="button"
              className="absolute right-0 top-0 rounded-md bg-white px-3 py-2 text-sm font-semibold text-primary"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
