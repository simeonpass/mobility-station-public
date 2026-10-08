"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { CatalogImage } from "@/components/product/catalog-image";
import { Button } from "@/components/ui/button";
import { SwipeSheet } from "@/components/ui/swipe-sheet";
import { formatGBP } from "@/lib/products";
import { linePrice } from "@/lib/cart";
import {
  MULTIMAC_FITTING_PATH,
  isFittingServiceProduct,
} from "@/lib/multimac-fitting";

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
  } = useCart();
  const fittingOnly =
    items.length > 0 && items.every((item) => isFittingServiceProduct(item.product));

  return (
    <SwipeSheet
      open={isOpen}
      onClose={() => setIsOpen(false)}
      side="right"
      label="Shopping cart"
      zClass="z-[80]"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
          <ShoppingBag className="h-5 w-5" aria-hidden />
          Cart ({itemCount})
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close cart"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-semibold text-primary">Your cart is empty</p>
            <Link
              href="/shop"
              className="mt-4 inline-block text-sm font-semibold text-primary underline"
              onClick={() => setIsOpen(false)}
            >
              Browse products
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.product.id}
                className="flex gap-3 border-b border-border pb-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-soft">
                  <CatalogImage
                    src={item.product.image_url || "/placeholder-product.svg"}
                    alt={item.product.name}
                    fill
                    className="object-contain p-1"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={
                      isFittingServiceProduct(item.product)
                        ? MULTIMAC_FITTING_PATH
                        : `/products/${item.product.slug}`
                    }
                    className="line-clamp-2 text-sm font-semibold text-primary hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.product.name}
                  </Link>
                  {item.product.optionSummary ? (
                    <p className="mt-0.5 text-xs text-muted">
                      {item.product.optionSummary}
                    </p>
                  ) : item.product.addonVariantId ? (
                    <p className="mt-0.5 text-xs text-muted">Optional extra</p>
                  ) : null}
                  <p className="mt-1 text-sm font-bold text-primary">
                    {formatGBP(linePrice(item.product))}
                    {item.product.priceIncludesVat ? (
                      <span className="ml-1 text-xs font-medium text-muted">
                        inc VAT
                      </span>
                    ) : null}
                  </p>
                  {isFittingServiceProduct(item.product) ? (
                    <div className="mt-2">
                      <button
                        type="button"
                        className="min-h-11 px-2 text-sm text-muted underline"
                        onClick={() => removeItem(item.product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded border border-border"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded border border-border"
                        aria-label="Increase quantity"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="min-h-11 px-2 text-sm text-muted underline"
                        onClick={() => removeItem(item.product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 ? (
        <div className="border-t border-border px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted">
              {fittingOnly ? "Total (inc VAT)" : "Subtotal (ex VAT)"}
            </span>
            <span className="font-bold text-primary">{formatGBP(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            className="flex w-full items-center justify-center rounded-xl bg-buy px-4 py-3 font-semibold text-buy-foreground hover:bg-buy-hover"
            onClick={() => setIsOpen(false)}
          >
            Checkout
          </Link>
        </div>
      ) : null}
    </SwipeSheet>
  );
}
