import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmationClient } from "@/components/checkout/order-confirmation-client";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="container-site py-16 text-center text-muted">
          Loading order status…
        </div>
      }
    >
      <OrderConfirmationClient />
    </Suspense>
  );
}
