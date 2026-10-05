import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutHeading } from "@/components/checkout/checkout-heading";
import { CheckoutShell } from "@/components/checkout/checkout-shell";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };
export default function CheckoutPage() {
  return <CheckoutShell>
    <nav className="ms-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/shop">Scooters &amp; wheelchairs</Link><span aria-hidden="true">/</span><span aria-current="page">Checkout</span></nav>
    <CheckoutHeading />
    <CheckoutForm />
  </CheckoutShell>;
}
