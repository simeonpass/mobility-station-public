"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import type { CartProduct } from "@/lib/cart";

export function AddToCartButton({ product }: { product: CartProduct }) {
  const { addItem } = useCart();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          className="flex-1 rounded-xl"
          onClick={() => {
            const result = addItem(product, 1);
            if (!result.ok) {
              setMessage(result.message || "Could not add to cart");
              return;
            }
            setMessage("Added to cart");
          }}
        >
          Add to cart
        </Button>
        <Link
          href={`/book-a-demo?product=${encodeURIComponent(product.slug)}`}
          className="flex-1 rounded-xl border border-primary px-6 py-3 text-center font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Book a free home demo
        </Link>
      </div>
      {message ? (
        <p className="text-sm text-muted">
          {message}
          {message === "Added to cart" ? (
            <>
              {" "}
              ·{" "}
              <Link href="/checkout" className="font-semibold text-primary underline">
                Checkout
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
