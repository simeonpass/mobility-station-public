"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
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
  const sessionId = params.get("session_id");
  const multimac = params.get("service") === "multimac";
  const [handoffReady, setHandoffReady] = useState(false);
  const [handoff, setHandoff] = useState({ started: false, confirmed: false });
  const [captureState, setCaptureState] = useState<
    "idle" | "capturing" | "paid" | "failed"
  >("idle");
  const [stripeState, setStripeState] = useState<
    "idle" | "checking" | "paid" | "pending" | "failed"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setHandoff(readCheckoutHandoff(order));
    setHandoffReady(true);
  }, [order]);

  const returnedSuccess = status === "success";
  const requested = status === "requested";
  const failed = status === "failed" || status === "cancel";
  const ownsReturn = handoff.started || handoff.confirmed;
  const paypalReturn = returnedSuccess && provider === "paypal" && ownsReturn;
  const stripeReturn =
    returnedSuccess &&
    provider === "stripe" &&
    Boolean(order) &&
    Boolean(sessionId) &&
    ownsReturn;

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

  // Stripe: confirm the session with Stripe before treating the order as paid.
  // The webhook normally lands within seconds; the server check also records
  // the payment itself if the webhook is late, so this page never lies.
  useEffect(() => {
    if (!stripeReturn || !order || !sessionId) return;
    if (handoff.confirmed) {
      startTransition(() => setStripeState("paid"));
      return;
    }

    let cancelled = false;
    (async () => {
      startTransition(() => setStripeState("checking"));
      for (let attempt = 0; attempt < 6 && !cancelled; attempt++) {
        try {
          const res = await fetch("/api/checkout/stripe/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNumber: order, sessionId }),
          });
          const data = (await res.json()) as {
            paid?: boolean;
            status?: string;
            error?: string;
          };
          if (cancelled) return;
          if (data.paid) {
            rememberCheckoutConfirmed(order);
            clearCart();
            setStripeState("paid");
            return;
          }
          if (data.status === "expired" || data.status === "unpaid") {
            setStripeState("failed");
            setMessage(
              "No payment was taken. Your basket is still here, so you can try again or call us.",
            );
            return;
          }
        } catch {
          // network blip: try again below
        }
        await new Promise((resolve) => setTimeout(resolve, 2500));
      }
      if (!cancelled) setStripeState("pending");
    })();

    return () => {
      cancelled = true;
    };
  }, [stripeReturn, order, sessionId, handoff.confirmed, clearCart]);

  const paypalPaid = paypalReturn && captureState === "paid";
  const paypalPending =
    paypalReturn && (captureState === "idle" || captureState === "capturing");
  const paypalFailed = paypalReturn && captureState === "failed";
  const stripePaid = stripeReturn && stripeState === "paid";
  const stripeChecking =
    stripeReturn && (stripeState === "idle" || stripeState === "checking");
  const stripePending = stripeReturn && stripeState === "pending";
  const stripeFailed = stripeReturn && stripeState === "failed";
  const paid = paypalPaid || stripePaid;

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
              Payment received
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-primary">
              Thank you for your order
            </h1>
            {order ? (
              <p className="mt-3 text-muted">
                Order number:{" "}
                <strong className="text-foreground">{order}</strong>
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
        ) : requested && multimac ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-wide text-success">
              Request received
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-primary">
              Thank you
            </h1>
            {order ? (
              <p className="mt-3 text-muted">
                Reference: <strong className="text-foreground">{order}</strong>
              </p>
            ) : null}
            <p className="mt-4 text-sm text-muted">
              We’ll call or email to confirm the fitting date at Heathrow or
              Ferndown and take payment then. The date is not booked until we
              confirm it. If you need anything,{" "}
              <Link
                href="/contact?interest=callback#callback"
                className="font-semibold text-primary underline"
              >
                request a callback
              </Link>
              .
            </p>
          </>
        ) : paypalPending || stripeChecking ? (
          <>
            <h1 className="text-3xl font-extrabold text-primary">
              {stripeChecking
                ? "Confirming your card payment"
                : "Confirming your PayPal payment"}
            </h1>
            <p className="mt-4 text-sm text-muted">
              Please keep this page open. Your basket stays in place until the
              payment is confirmed.
            </p>
          </>
        ) : stripePending ? (
          <>
            <h1 className="text-3xl font-extrabold text-primary">
              Payment is being confirmed
            </h1>
            {order ? (
              <p className="mt-3 text-muted">
                Order number:{" "}
                <strong className="text-foreground">{order}</strong>
              </p>
            ) : null}
            <p className="mt-4 text-sm text-muted">
              Stripe has your payment but has not finished confirming it. We’ll
              email you as soon as it is recorded. Your basket is left as it is
              for now; please don’t pay again. If you’d like to check, call{" "}
              <a href="tel:08007723870" className="font-semibold text-primary underline">
                0800 772 3870
              </a>
              .
            </p>
          </>
        ) : paypalFailed || stripeFailed || failed ? (
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
              Open this page from a completed card or PayPal checkout to see
              your order status.
            </p>
          </>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={multimac ? "/vehicle-adaptations/multimac-fitting" : "/shop"}>
            <Button type="button" className="w-full sm:w-auto">
              {multimac ? "Back to Multimac fitting" : "Continue shopping"}
            </Button>
          </Link>
          {!paid && !requested && !stripePending ? (
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
