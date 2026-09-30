import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };
export default function CheckoutPage() {
  return <div className="container-site py-8 md:py-10">
    <nav className="ms-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/shop">Scooters &amp; wheelchairs</Link><span aria-hidden="true">/</span><span aria-current="page">Checkout</span></nav>
    <div className="msx-checkout-heading"><div><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted"><LockKeyhole size={15} aria-hidden="true" />Secure checkout</span><h1>Checkout</h1><p>Review your order, VAT relief where applicable, delivery and payment.</p></div><Link href="/shop">Continue shopping</Link></div>
    <CheckoutForm />
  </div>;
}
