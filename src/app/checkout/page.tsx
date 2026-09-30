import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutHeading } from "@/components/checkout/checkout-heading";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };
export default function CheckoutPage() {
  return <div className="container-site py-8 md:py-10">
    <nav className="ms-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/shop">Scooters &amp; wheelchairs</Link><span aria-hidden="true">/</span><span aria-current="page">Checkout</span></nav>
    <CheckoutHeading />
    <CheckoutForm />
  </div>;
}
