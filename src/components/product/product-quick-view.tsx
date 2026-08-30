"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Eye, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { CatalogImage } from "@/components/product/catalog-image";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { SwipeSheet } from "@/components/ui/swipe-sheet";
import { cartProductFromListItem } from "@/lib/cart";
import {
  formatGBP,
  primaryImage,
  stockStatus,
  type ProductListItem,
} from "@/lib/products";
import { getVatPriceDisplay } from "@/lib/vat";
import { cn } from "@/lib/utils";

export function ProductQuickView({ product }: { product: ProductListItem }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const { addItem } = useCart();
  const [message, setMessage] = useState<string | null>(null);

  const vat = getVatPriceDisplay(product);
  const headline = vat.mode === "always-inc" ? vat.gross : vat.net;
  const wasHeadline = vat.mode === "always-inc" ? vat.wasGross : vat.wasNet;
  const stock = stockStatus(product);
  const cartProduct = cartProductFromListItem(product);
  const canAdd = Boolean(cartProduct && stock.available && headline != null);

  function handleAdd() {
    if (!cartProduct) return;
    const result = addItem(cartProduct, 1);
    if (!result.ok) {
      setMessage(result.message || "Could not add to cart");
      return;
    }
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="absolute bottom-3 right-3 z-10 inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-white/95 px-3 text-xs font-semibold text-primary shadow-sm md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
        aria-haspopup="dialog"
        aria-label={`Quick view ${product.name}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setMessage(null);
          setOpen(true);
        }}
      >
        <Eye className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">Quick view</span>
      </button>
      <SwipeSheet
        open={open}
        onClose={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
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
                src={primaryImage(product)}
                alt={product.name}
                fill
                sizes="200px"
                className="object-contain p-3"
              />
            </div>
            <div className="min-w-0">
              {product.category ? (
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                  {product.category}
                </p>
              ) : null}
              <h2
                id={titleId}
                className="mt-1 text-lg font-extrabold leading-snug tracking-tight text-primary"
              >
                {product.name}
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
              {product.motability_weekly_price != null &&
              product.motability_weekly_price > 0 ? (
                <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>
                    or {formatGBP(product.motability_weekly_price)}/week on
                  </span>
                  <MotabilityLogo height={20} className="shrink-0" />
                </p>
              ) : null}
              <p className="mt-2 text-xs font-semibold text-muted">{stock.label}</p>
            </div>
          </div>

          <div className="grid gap-2 border-t border-border px-4 py-4 sm:px-5">
            <Link
              href={`/products/${product.slug}`}
              className={cn(buttonVariants(), "w-full rounded-full")}
              onClick={() => setOpen(false)}
            >
              View product
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/book-a-demo?product=${encodeURIComponent(product.slug)}`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full rounded-full",
                )}
                onClick={() => setOpen(false)}
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
                  href={`/contact?interest=callback&product=${encodeURIComponent(product.slug)}#callback`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full rounded-full",
                  )}
                  onClick={() => setOpen(false)}
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
    </>
  );
}
