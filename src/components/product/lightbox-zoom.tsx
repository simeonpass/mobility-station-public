"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import { CatalogImage } from "@/components/product/catalog-image";
import { EASE_OUT, MOTION_MS, prefersReducedMotion } from "@/lib/motion";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_MS = 280;

function touchDistance(
  a: { clientX: number; clientY: number },
  b: { clientX: number; clientY: number },
) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

export function LightboxZoom({
  src,
  alt,
  onSwipe,
}: {
  src: string;
  alt: string;
  onSwipe?: (direction: 1 | -1) => void;
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const lastTap = useRef(0);
  const pinch = useRef<{ distance: number; scale: number } | null>(null);
  const pan = useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);
  const swipe = useRef<number | null>(null);
  const didPinch = useRef(false);

  useEffect(() => {
    scaleRef.current = 1;
    offsetRef.current = { x: 0, y: 0 };
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setSwipeX(0);
    setSwiping(false);
  }, [src]);

  function commit(nextScale: number, nextOffset: { x: number; y: number }) {
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
    const offsetValue = clamped === 1 ? { x: 0, y: 0 } : nextOffset;
    scaleRef.current = clamped;
    offsetRef.current = offsetValue;
    setScale(clamped);
    setOffset(offsetValue);
  }

  function onTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      didPinch.current = true;
      pinch.current = {
        distance: touchDistance(e.touches[0], e.touches[1]),
        scale: scaleRef.current,
      };
      pan.current = null;
      swipe.current = null;
      return;
    }
    if (e.touches.length === 1) {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      if (scaleRef.current > 1) {
        pan.current = {
          x,
          y,
          ox: offsetRef.current.x,
          oy: offsetRef.current.y,
        };
      } else {
        swipe.current = x;
      }
    }
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length === 2 && pinch.current) {
      const distance = touchDistance(e.touches[0], e.touches[1]);
      commit((pinch.current.scale * distance) / pinch.current.distance, offsetRef.current);
      return;
    }
    if (e.touches.length === 1 && pan.current && scaleRef.current > 1) {
      commit(scaleRef.current, {
        x: pan.current.ox + (e.touches[0].clientX - pan.current.x),
        y: pan.current.oy + (e.touches[0].clientY - pan.current.y),
      });
      return;
    }
    if (
      e.touches.length === 1 &&
      swipe.current != null &&
      scaleRef.current === 1
    ) {
      setSwiping(true);
      setSwipeX(e.touches[0].clientX - swipe.current);
    }
  }

  function onTouchEnd(e: TouchEvent) {
    if (e.touches.length === 0) {
      pinch.current = null;
      pan.current = null;

      if (!didPinch.current && scaleRef.current === 1 && swipe.current != null && onSwipe) {
        const end = e.changedTouches[0]?.clientX ?? swipe.current;
        const delta = end - swipe.current;
        if (Math.abs(delta) > 40) onSwipe(delta < 0 ? 1 : -1);
        else setSwipeX(0);
      } else {
        setSwipeX(0);
      }
      setSwiping(false);

      if (!didPinch.current && e.changedTouches.length === 1) {
        const now = Date.now();
        if (now - lastTap.current < DOUBLE_TAP_MS) {
          if (scaleRef.current > 1) {
            commit(1, { x: 0, y: 0 });
          } else {
            commit(2.4, { x: 0, y: 0 });
          }
          lastTap.current = 0;
        } else {
          lastTap.current = now;
        }
      }

      didPinch.current = false;
      swipe.current = null;
    }
  }

  return (
    <div
      className="relative h-full w-full touch-none overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="relative h-full w-full will-change-transform"
        style={{
          transform: `translate3d(${offset.x + swipeX}px, ${offset.y}px, 0) scale(${scale})`,
          transition:
            swiping || scale > 1 || prefersReducedMotion()
              ? "none"
              : `transform ${MOTION_MS}ms ${EASE_OUT}`,
        }}
      >
        <CatalogImage
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="100vw"
        />
      </div>
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs font-medium text-white/70 md:hidden">
        {scale > 1 ? "Pinch or double-tap to reset" : "Pinch or double-tap to zoom"}
      </p>
    </div>
  );
}
