"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

export function CartButton() {
  const { itemCount, setIsOpen } = useCart();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative rounded-full text-primary hover:bg-soft"
      aria-label={`Open cart${itemCount ? `, ${itemCount} items` : ""}`}
      onClick={() => setIsOpen(true)}
    >
      <ShoppingBag className="h-5 w-5" aria-hidden />
      {itemCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-accent-foreground">
          {itemCount}
        </span>
      ) : null}
    </Button>
  );
}
