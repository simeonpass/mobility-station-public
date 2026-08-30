"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  EASE_OUT,
  FADE_TRANSITION,
  MOTION_MS,
  MOTION_TRANSITION,
  prefersReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const LOCK_PX = 10;
const CLOSE_RATIO = 0.28;
const CLOSE_VELOCITY = 0.5;

type Side = "left" | "right" | "bottom";

export function SwipeSheet({
  open,
  onClose,
  side,
  label,
  children,
  className,
  zClass = "z-[80]",
}: {
  open: boolean;
  onClose: () => void;
  side: Side;
  label: string;
  children: ReactNode;
  className?: string;
  zClass?: string;
}) {
  const [ready, setReady] = useState(false);
  const [present, setPresent] = useState(open);
  const [entered, setEntered] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const dragRef = useRef({
    id: -1,
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    mode: "pending" as "pending" | "drag" | "scroll",
    vx: 0,
    vy: 0,
  });

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (open) {
      setPresent(true);
      setDrag(0);
      return;
    }
    setEntered(false);
    if (!present) return;
    const wait = prefersReducedMotion() ? 0 : MOTION_MS;
    const timer = window.setTimeout(() => setPresent(false), wait);
    return () => window.clearTimeout(timer);
  }, [open, present]);

  useEffect(() => {
    if (!present || !open) return;
    if (prefersReducedMotion()) {
      setEntered(true);
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [present, open]);

  useEffect(() => {
    if (!present) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [present]);

  useEffect(() => {
    if (!present) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [present, onClose]);

  function panelSize() {
    const el = panelRef.current;
    if (!el) return side === "bottom" ? 480 : 360;
    return side === "bottom" ? el.offsetHeight : el.offsetWidth;
  }

  function dismissDelta(dx: number, dy: number) {
    if (side === "left") return Math.max(0, -dx);
    if (side === "right") return Math.max(0, dx);
    return Math.max(0, dy);
  }

  function closedTransform() {
    if (side === "left") return "translate3d(-102%,0,0)";
    if (side === "right") return "translate3d(102%,0,0)";
    return "translate3d(0,102%,0)";
  }

  function openTransform(offset: number) {
    if (side === "left") return `translate3d(${-offset}px,0,0)`;
    if (side === "right") return `translate3d(${offset}px,0,0)`;
    return `translate3d(0,${offset}px,0)`;
  }

  function onPointerDown(e: PointerEvent<HTMLElement>) {
    if (prefersReducedMotion()) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("input, textarea, select")) return;
    dragRef.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      lastT: performance.now(),
      mode: "pending",
      vx: 0,
      vy: 0,
    };
  }

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const d = dragRef.current;
    if (d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.vx = (e.clientX - d.lastX) / dt;
    d.vy = (e.clientY - d.lastY) / dt;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.lastT = now;

    if (d.mode === "pending") {
      if (Math.abs(dx) < LOCK_PX && Math.abs(dy) < LOCK_PX) return;
      const horizontal = Math.abs(dx) > Math.abs(dy);
      const towardClose =
        (side === "left" && dx < 0) ||
        (side === "right" && dx > 0) ||
        (side === "bottom" && dy > 0);
      if (side === "bottom") {
        d.mode = !horizontal && towardClose ? "drag" : "scroll";
      } else {
        d.mode = horizontal && towardClose ? "drag" : "scroll";
      }
      if (d.mode === "drag") {
        panelRef.current?.setPointerCapture(e.pointerId);
        setDragging(true);
      }
    }

    if (d.mode === "drag") {
      e.preventDefault();
      setDrag(dismissDelta(dx, dy));
    }
  }

  function endPointer(e: PointerEvent<HTMLElement>) {
    const d = dragRef.current;
    if (d.id !== e.pointerId) return;
    const wasDrag = d.mode === "drag";
    d.id = -1;
    d.mode = "pending";
    if (!wasDrag) return;
    setDragging(false);
    const size = panelSize();
    const velocity = side === "bottom" ? d.vy : side === "left" ? -d.vx : d.vx;
    if (drag / size > CLOSE_RATIO || velocity > CLOSE_VELOCITY) {
      onClose();
      return;
    }
    setDrag(0);
  }

  if (!ready || !present) return null;

  const reduced = prefersReducedMotion();
  const progress = Math.min(1, drag / Math.max(1, panelSize()));
  const overlay = open && entered ? 0.4 * (1 - progress) : 0;
  const transform = open && entered ? openTransform(drag) : closedTransform();

  return createPortal(
    <div className={cn("fixed inset-0", zClass)} role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black"
        style={{
          opacity: overlay,
          transition: dragging || reduced ? "none" : FADE_TRANSITION,
        }}
        aria-label={`Close ${label}`}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(
          "absolute flex flex-col bg-white shadow-2xl",
          dragging ? "touch-none" : "touch-pan-y",
          side === "left" && "inset-y-0 left-0 w-[min(22rem,88vw)]",
          side === "right" && "inset-y-0 right-0 w-full max-w-md",
          side === "bottom" &&
            "inset-x-0 bottom-0 mx-auto max-h-[min(92dvh,40rem)] w-full max-w-lg rounded-t-[1.5rem] border-t border-border",
          className,
        )}
        style={{
          transform,
          transition: dragging || reduced ? "none" : MOTION_TRANSITION,
          transitionTimingFunction: EASE_OUT,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        {side === "bottom" ? (
          <div className="flex justify-center pt-2 pb-1" aria-hidden>
            <span className="h-1 w-10 rounded-full bg-border" />
          </div>
        ) : null}
        {children}
      </aside>
    </div>,
    document.body,
  );
}
