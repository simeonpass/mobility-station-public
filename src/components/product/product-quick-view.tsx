"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { CatalogImage } from "@/components/product/catalog-image";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { SwipeSheet } from "@/components/ui/swipe-sheet";
import { cartProductFromListItem } from "@/lib/cart";
import { QUICK_VIEW_ATTR } from "@/lib/quick-view";
import {
  formatGBP,
  primaryImage,
  stockStatus,
  type ProductListItem,
} from "@/lib/products";
import { getVatPriceDisplay } from "@/lib/vat";
import { cn } from "@/lib/utils";

function parseProduct(raw: string | null): ProductListItem | null {
  if (!raw) return null;
  try {
    const product = JSON.parse(raw) as ProductListItem;
    if (!product?.slug || !product?.name) return null;
    return product;
  } catch {
    return null;
  }
}

/** One sheet for the whole site — cards stay server HTML. */
export function QuickViewHost() {
  const [product, setProduct] = useState<ProductListItem | null>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest(`[${QUICK_VIEW_ATTR}]`);
      if (!trigger) return;
      event.preventDefault();
      event.stopPropagation();
      setProduct(parseProduct(trigger.getAttribute(QUICK_VIEW_ATTR)));
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <QuickViewSheet product={product} onClose={() => setProduct(null)} />
  );
}

function QuickViewSheet({
  product,
  onClose,
}: {
  product: ProductListItem | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const { addItem } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const last = useRef<ProductListItem | null>(null);
  if (product) last.current = product;
  const shown = product ?? last.current;

  useEffect(() => {
    setMessage(null);
  }, [product]);

  if (!shown) return null;

  const vat = getVatPriceDisplay(shown);
  const headline = vat.mode === "always-inc" ? vat.gross : vat.net;
  const wasHeadline = vat.mode === "always-inc" ? vat.wasGross : vat.wasNet;
  const stock = stockStatus(shown);
  const cartProduct = cartProductFromListItem(shown);
  const canAdd = Boolean(cartProduct && stock.available && headline != null);

  function handleAdd() {
    if (!cartProduct) return;
    const result = addItem(cartProduct, 1);
    if (!result.ok) {
      setMessage(result.message || "Could not add to cart");
      return;
    }
    onClose();
  }

  return (
    <SwipeSheet
      open={Boolean(product)}
      onClose={onClose}
      side="bottom"
      label="Quick view"
      zClass="z-[200]"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
          Quick view
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-muted hover:bg-soft hover:text-primary"
          aria-label="Close quick view"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="grid gap-4 p-4 sm:grid-cols-[10rem_1fr] sm:p-5">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f8f8f8]">
            <CatalogImage
              src={primaryImage(shown)}
              alt={shown.name}
              fill
              sizes="200px"
              className="object-contain p-3"
            />
          </div>
          <div className="min-w-0">
                {shown.category ? (
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                {shown.category}
              </p>
            ) : null}
            <h2
              id={titleId}
              className="mt-1 text-lg font-extrabold leading-snug tracking-tight text-primary"
            >
              {shown.name}
            </h2>
            {headline != null ? (
              <p className="mt-2 text-2xl font-extrabold tabular-nums text-primary">
                {formatGBP(headline)}
                {wasHeadline ? (
                  <span className="ml-2 text-sm font-semibold text-muted line-through">
                    {formatGBP(wasHeadline)}
                  </span>
                ) : null}
              </p>
            ) : (
              <p className="mt-2 text-2xl font-extrabold text-primary">POA</p>
            )}
            {shown.motability_weekly_price != null &&
            shown.motability_weekly_price > 0 ? (
              <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span>
                  or {formatGBP(shown.motability_weekly_price)}/week on
                </span>
                <MotabilityLogo height={20} className="shrink-0" />
              </p>
            ) : null}
            <p className="mt-2 text-xs font-semibold text-muted">{stock.label}</p>
          </div>
        </div>

        <div className="grid gap-2 border-t border-border px-4 py-4 sm:px-5">
          <Link
            href={`/products/${shown.slug}`}
            className={cn(buttonVariants(), "w-full rounded-full")}
            onClick={onClose}
          >
            View product
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/book-a-demo?product=${encodeURIComponent(shown.slug)}`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full rounded-full",
              )}
              onClick={onClose}
            >
              Book a demo
            </Link>
            {canAdd ? (
              <Button
                type="button"
                variant="buy"
                className="w-full rounded-full"
                onClick={handleAdd}
              >
                Add to cart
              </Button>
            ) : (
              <Link
                href={`/contact?interest=callback&product=${encodeURIComponent(shown.slug)}#callback`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full rounded-full",
                )}
                onClick={onClose}
              >
                Callback
              </Link>
            )}
          </div>
          {message ? (
            <p className="text-center text-sm text-muted" role="alert">
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </SwipeSheet>
  );
}
