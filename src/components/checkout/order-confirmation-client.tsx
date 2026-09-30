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
    if (status === "success" && order && provider !== "paypal") clearCart();
  }, [status, order, provider, clearCart]);

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
        if (!res.ok || data.success !== true || !["paid", "already_paid"].includes(data.status || "")) {
          setCaptureState("failed");
          setMessage(data.error || "PayPal capture did not complete");
          return;
        }
        setCaptureState("paid");
        clearCart();
      } catch (err) {
        if (cancelled) return;
        setCaptureState("failed");
        setMessage(err instanceof Error ? err.message : "Capture failed");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, provider, order, clearCart]);

  const success = status === "success" && Boolean(order) && (provider !== "paypal" || captureState === "paid");
  const paypalPending = status === "success" && provider === "paypal" && Boolean(order) && captureState !== "paid";
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
            <p className="mt-4 text-sm text-muted">
              We’ll email you a confirmation shortly. If you need anything,{" "}
              <Link
                href="/contact?interest=callback#callback"
                className="font-semibold text-primary underline"
              >
                request a callback
              </Link>
              .
            </p>
          </>
        ) : paypalPending ? (
          <>
            <h1 className="text-3xl font-extrabold text-primary">
              {captureState === "failed" ? "Payment needs checking" : "Confirming PayPal payment"}
            </h1>
            <p className="mt-3 text-muted">Order number: <strong>{order}</strong></p>
            <p className="mt-4 text-sm text-muted" role="status">
              {captureState === "failed"
                ? "We could not confirm your payment. Your basket has been kept. Please contact us with your order number before trying another payment."
                : "Please wait while we confirm your payment. Your basket will be kept until payment is confirmed."}
            </p>
            {message ? <p className="mt-3 text-sm text-error">{message}</p> : null}
            <Link href="/contact" className="mt-4 inline-block font-semibold underline">Contact our team</Link>
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
              Payment was not confirmed. If your account shows a charge, contact us with your reference before trying again.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold text-primary">
              Order confirmation
            </h1>
            <p className="mt-4 text-sm text-muted">
              Open this page from a completed DNA Payments or PayPal checkout to
              see your order status.
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
