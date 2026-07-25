"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

export function OrderConfirmationClient() {
  const params = useSearchParams();
  const { clearCart } = useCart();
  const status = params.get("payment");
  const order = params.get("order");
  const provider = params.get("provider");
  const [captureState, setCaptureState] = useState<
    "idle" | "capturing" | "paid" | "failed"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "success") clearCart();
  }, [status, clearCart]);

  useEffect(() => {
    if (status !== "success" || provider !== "paypal" || !order) return;

    let cancelled = false;
    (async () => {
      setCaptureState("capturing");
      try {
        const res = await fetch("/api/checkout/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderNumber: order }),
        });
        const data = (await res.json()) as {
          success?: boolean;
          status?: string;
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok || data.success === false) {
          setCaptureState("failed");
          setMessage(data.error || "PayPal capture did not complete");
          return;
        }
        setCaptureState("paid");
      } catch (err) {
        if (cancelled) return;
        setCaptureState("failed");
        setMessage(err instanceof Error ? err.message : "Capture failed");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, provider, order]);

  const success = status === "success";
  const failed = status === "failed" || status === "cancel";

  return (
    <div className="container-site py-16 md:py-24">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-8 text-center">
        {success ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-wide text-success">
              Payment received
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-primary">
              Thank you for your order
            </h1>
            {order ? (
              <p className="mt-3 text-muted">
                Order number: <strong className="text-foreground">{order}</strong>
              </p>
            ) : null}
            {provider === "paypal" && captureState === "capturing" ? (
              <p className="mt-4 text-sm text-muted">
                Confirming PayPal payment…
              </p>
            ) : null}
            {provider === "paypal" && captureState === "failed" ? (
              <p className="mt-4 text-sm text-error">
                {message ||
                  "Payment may still be processing. Contact us with your order number if needed."}
              </p>
            ) : null}
            <p className="mt-4 text-sm text-muted">
              We’ll email you a confirmation shortly. If you need anything, call{" "}
              <a href="tel:08007723870" className="font-semibold text-primary">
                0800 772 3870
              </a>
              .
            </p>
          </>
        ) : failed ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-wide text-error">
              Payment not completed
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-primary">
              Checkout cancelled
            </h1>
            {order ? (
              <p className="mt-3 text-muted">
                Reference: <strong className="text-foreground">{order}</strong>
              </p>
            ) : null}
            <p className="mt-4 text-sm text-muted">
              No payment was taken. You can return to checkout and try again.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold text-primary">
              Order confirmation
            </h1>
            <p className="mt-4 text-sm text-muted">
              Open this page from a completed Revolut or PayPal checkout to see
              your order status.
            </p>
          </>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/shop">
            <Button type="button" className="w-full sm:w-auto">
              Continue shopping
            </Button>
          </Link>
          {!success ? (
            <Link href="/checkout">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Back to checkout
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
