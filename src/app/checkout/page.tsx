import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return <div className="container-site py-10 md:py-14"><div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-border pb-7"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted"><LockKeyhole className="h-3.5 w-3.5" aria-hidden />Secure checkout</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">Checkout</h1><p className="mt-2 text-sm text-muted">Review your order, VAT relief where applicable, delivery and payment.</p></div><Link href="/shop" className="text-sm font-semibold text-primary underline underline-offset-4">Continue shopping</Link></div><CheckoutForm /></div>;
}
