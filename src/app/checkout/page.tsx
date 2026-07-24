import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-site py-8 md:py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Secure checkout
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-primary">Checkout</h1>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-primary underline">
          Continue shopping
        </Link>
      </div>
      <CheckoutForm />
    </div>
  );
}
