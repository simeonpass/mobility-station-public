"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import {
  readCheckoutHandoff,
  rememberCheckoutConfirmed,
} from "@/lib/cart";

export function OrderConfirmationClient() {
  const params = useSearchParams();
  const { clearCart } = useCart();
  const status = params.get("payment");
  const order = params.get("order");
  const provider = params.get("provider");
  const multimac = params.get("service") === "multimac";
  const [handoffReady, setHandoffReady] = useState(false);
  const [handoff, setHandoff] = useState({ started: false, confirmed: false });
  const [captureState, setCaptureState] = useState<
    "idle" | "capturing" | "paid" | "failed"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [dnaSettled, setDnaSettled] = useState(false);

  useEffect(() => {
    setHandoff(readCheckoutHandoff(order));
    setHandoffReady(true);
  }, [order]);

  const returnedSuccess = status === "success";
  const failed = status === "failed" || status === "cancel";
  const ownsReturn = handoff.started || handoff.confirmed;
  const paypalReturn = returnedSuccess && provider === "paypal" && ownsReturn;
  const dnaPaid =
    returnedSuccess && provider === "dna" && Boolean(order) && ownsReturn;

  useEffect(() => {
    if (!paypalReturn || !order) return;
    if (handoff.confirmed) {
      setCaptureState("paid");
      return;
    }

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
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok || data.success === false) {
          setCaptureState("failed");
          setMessage(data.error || "PayPal capture did not complete");
          return;
        }
        rememberCheckoutConfirmed(order);
        clearCart();
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
  }, [paypalReturn, order, handoff.confirmed, clearCart]);

  useEffect(() => {
    if (!dnaPaid || !order || handoff.confirmed || dnaSettled) return;
    rememberCheckoutConfirmed(order);
    clearCart();
    setDnaSettled(true);
  }, [dnaPaid, order, handoff.confirmed, dnaSettled, clearCart]);

  const paypalPaid = paypalReturn && captureState === "paid";
  const paypalPending =
    paypalReturn && (captureState === "idle" || captureState === "capturing");
  const paypalFailed = paypalReturn && captureState === "failed";
  const paid = paypalPaid || dnaPaid;

  if (!handoffReady) {
    return (
      <div className="container-site py-16 text-center text-muted">
        Loading order status…
      </div>
    );
  }

  return (
    <div className="container-site py-16 md:py-24">
      <div className="mx-auto max-w-xl rounded-lg border border-border bg-white p-8 text-center">
        {paid ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-wide text-success">
              {multimac ? "Request received" : "Payment received"}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-primary">
              {multimac ? "Thank you" : "Thank you for your order"}
            </h1>
            {order ? (
              <p className="mt-3 text-muted">
                {multimac ? "Reference" : "Order number"}:{" "}
                <strong className="text-foreground">{order}</strong>
              </p>
            ) : null}
            <p className="mt-4 text-sm text-muted">
              {multimac
                ? "We’ll email you to confirm the fitting date at Heathrow or Ferndown. The date is not booked until that email. If you need anything, "
                : "We’ll email you a confirmation shortly. If you need anything, "}
              <a
                href="/contact?interest=callback#callback"
                className="font-semibold text-primary underline"
              >
                request a callback
              </a>
              .
            </p>
          </>
        ) : paypalPending ? (
          <>
            <h1 className="text-3xl font-extrabold text-primary">
              Confirming your PayPal payment
            </h1>
            <p className="mt-4 text-sm text-muted">
              Please keep this page open. Your basket stays in place until
              PayPal confirms the payment.
            </p>
          </>
        ) : paypalFailed || failed ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-wide text-error">
              Payment not completed
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-primary">
              {failed ? "Checkout cancelled" : "Payment not confirmed"}
            </h1>
            {order ? (
              <p className="mt-3 text-muted">
                Reference: <strong className="text-foreground">{order}</strong>
              </p>
            ) : null}
            <p className="mt-4 text-sm text-muted">
              {message ||
                "No payment was taken. You can return to checkout and try again."}
            </p>
          </>
        ) : returnedSuccess && order ? (
          <>
            <h1 className="text-3xl font-extrabold text-primary">Thank you</h1>
            {order ? (
              <p className="mt-3 text-muted">
                Reference: <strong className="text-foreground">{order}</strong>
              </p>
            ) : null}
            <p className="mt-4 text-sm text-muted">
              If you have just paid, we’ll email a confirmation. This page does
              not treat the link itself as proof of payment, and your basket is
              left as it is.
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
          <Link href={multimac ? "/vehicle-adaptations/multimac-fitting" : "/shop"}>
            <Button type="button" className="w-full sm:w-auto">
              {multimac ? "Back to Multimac fitting" : "Continue shopping"}
            </Button>
          </Link>
          {!paid ? (
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
