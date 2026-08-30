"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { EASE_OUT, MOTION_MS, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const LOCK_PX = 8;
const SNAP_RATIO = 0.2;
const SNAP_VELOCITY = 0.4;

export function GallerySwipe({
  count,
  active,
  onChange,
  onTap,
  children,
}: {
  count: number;
  active: number;
  onChange: (index: number) => void;
  onTap?: () => void;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [width, setWidth] = useState(0);
  const drag = useRef({
    id: -1,
    x: 0,
    y: 0,
    lastX: 0,
    lastT: 0,
    vx: 0,
    mode: "pending" as "pending" | "drag" | "scroll",
  });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(el.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function rubber(next: number) {
    if (active === 0 && next > 0) return next * 0.32;
    if (active === count - 1 && next < 0) return next * 0.32;
    return next;
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      lastX: e.clientX,
      lastT: performance.now(),
      vx: 0,
      mode: "pending",
    };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    const mx = e.clientX - d.x;
    const my = e.clientY - d.y;
    const now = performance.now();
    d.vx = (e.clientX - d.lastX) / Math.max(1, now - d.lastT);
    d.lastX = e.clientX;
    d.lastT = now;

    if (d.mode === "pending") {
      if (Math.abs(mx) < LOCK_PX && Math.abs(my) < LOCK_PX) return;
      if (count < 2 || prefersReducedMotion()) {
        d.mode = "scroll";
        return;
      }
      d.mode = Math.abs(mx) > Math.abs(my) ? "drag" : "scroll";
      if (d.mode === "drag") {
        wrapRef.current?.setPointerCapture(e.pointerId);
        setDragging(true);
      }
    }
    if (d.mode === "drag") {
      e.preventDefault();
      setDx(rubber(mx));
    }
  }

  function endPointer(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    const mode = d.mode;
    const moved = e.clientX - d.x;
    d.id = -1;
    d.mode = "pending";
    setDragging(false);

    if (mode === "pending" || (mode === "scroll" && Math.abs(moved) < LOCK_PX)) {
      setDx(0);
      onTap?.();
      return;
    }
    if (mode !== "drag") {
      setDx(0);
      return;
    }

    const slide = width || wrapRef.current?.offsetWidth || 1;
    if (moved < -slide * SNAP_RATIO || d.vx < -SNAP_VELOCITY) {
      onChange(active + 1);
    } else if (moved > slide * SNAP_RATIO || d.vx > SNAP_VELOCITY) {
      onChange(active - 1);
    }
    setDx(0);
  }

  const x = -active * (width || 0) + dx;

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative aspect-square w-full overflow-hidden",
        dragging ? "touch-none" : "touch-pan-y",
      )}
      style={{ ["--slide-width" as string]: width ? `${width}px` : "100%" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      <div
        className="flex h-full"
        style={{
          width: width ? width * Math.max(count, 1) : "100%",
          transform: `translate3d(${x}px,0,0)`,
          transition: dragging || prefersReducedMotion() ? "none" : `transform ${MOTION_MS}ms ${EASE_OUT}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
