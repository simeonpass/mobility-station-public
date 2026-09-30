"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

/** The existing empty-cart panel owns its H1; avoid announcing a second page heading. */
export function CheckoutHeading() {
  const { items } = useCart();
  if (!items.length) return null;
  return <div className="msx-checkout-heading"><div><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted"><LockKeyhole size={15} aria-hidden="true" />Secure checkout</span><h1>Checkout</h1><p>Review your order, VAT relief where applicable, delivery and payment.</p></div><Link href="/shop">Continue shopping</Link></div>;
}
