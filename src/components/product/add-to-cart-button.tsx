"use client";

import { useEffect, useState, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import type { CartProduct } from "@/lib/cart";

/** Shared height/type so Buy and Book a demonstration match exactly. */
const ctaClass =
  "inline-flex h-13 min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-7 text-base font-semibold";

export function AddToCartButton({
  product,
  layout = "full",
}: {
  product: CartProduct;
  layout?: "full" | "stack" | "compact";
}) {
  const { addItem } = useCart();
  const [message, setMessage] = useState<string | null>(null);

  function handleAdd() {
    const result = addItem(product, 1);
    if (!result.ok) {
      setMessage(result.message || "Could not add to cart");
      return;
    }
    setMessage("Added to cart");
  }

  if (layout === "compact") {
    return (
      <Button
        type="button"
        className="h-12 rounded-full px-6"
        variant="buy"
        onClick={handleAdd}
      >
        Add to cart
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={
          layout === "stack"
            ? "flex flex-col gap-2.5"
            : "flex flex-col gap-2.5 sm:flex-row"
        }
      >
        <Button
          type="button"
          variant="buy"
          className={ctaClass}
          onClick={handleAdd}
        >
          Add to cart
        </Button>
        <Link
          href={`/book-a-demo?product=${encodeURIComponent(product.slug)}`}
          className={`${ctaClass} border border-primary/20 bg-white text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground`}
        >
          Book a demonstration
        </Link>
      </div>
      {message ? (
        <p className="text-center text-sm text-muted sm:text-left">
          {message}
          {message === "Added to cart" ? (
            <>
              {" "}
              ·{" "}
              <Link
                href="/checkout"
                className="font-semibold text-primary underline underline-offset-3"
              >
                Checkout
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}

export function StickyBuyBar({
  product,
  priceLabel,
  observeRef,
  onAdd,
}: {
  product: CartProduct;
  priceLabel: string;
  observeRef: RefObject<HTMLElement | null>;
  onAdd?: () => void;
}) {
  const visible = useStickyAfterScroll(observeRef);
  const { addItem } = useCart();

  if (!visible) return null;

  return (
    <div className="ms-sticky-product fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/96 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_36px_rgba(0,0,0,0.10)] backdrop-blur-xl md:hidden">
      <div className="container-site flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-medium text-muted">{product.name}</p>
          <p className="text-lg font-extrabold tracking-tight text-primary">{priceLabel}</p>
        </div>
        <Button
          type="button"
          variant="buy"
          className="h-11 shrink-0 rounded-full px-5"
          onClick={() => (onAdd ? onAdd() : addItem(product, 1))}
        >
          Add to cart
        </Button>
        <Link
          href="/contact?interest=callback#callback"
          className="shrink-0 rounded-full border border-primary/25 px-4 py-2.5 text-sm font-semibold text-primary"
        >
          Callback
        </Link>
      </div>
    </div>
  );
}

function useStickyAfterScroll(observeRef: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = observeRef.current;
    if (!target) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(target.getBoundingClientRect().bottom <= 80);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Anchor jumps can skip the purchase panel without an intersection change.
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(target);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [observeRef]);

  return visible;
}

export function StickyEnquiryBar({
  productName,
  priceLabel,
  observeRef,
  primary,
  secondary,
}: {
  productName: string;
  priceLabel: string;
  observeRef: RefObject<HTMLElement | null>;
  primary: ReactNode;
  secondary?: ReactNode;
}) {
  const visible = useStickyAfterScroll(observeRef);
  if (!visible) return null;

  return (
    <div className="ms-sticky-product fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/96 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_36px_rgba(0,0,0,0.10)] backdrop-blur-xl md:hidden">
      <div className="container-site flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-medium text-muted">{productName}</p>
          <p className="text-lg font-extrabold tracking-tight text-primary">{priceLabel}</p>
        </div>
        {primary}
        {secondary}
      </div>
    </div>
  );
}
