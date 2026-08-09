"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { DEMO_RETRY_STORAGE_KEY } from "@/lib/demo-booking";

export function DemoThankYouClient() {
  const params = useSearchParams();
  const payment = params.get("payment");
  const ref = params.get("ref");
  const failed = payment === "failed" || payment === "cancel";
  const success = payment === "success";
  const outOfArea = payment === "out-of-area";
  const waived = payment === "waived" || (!payment && !failed && !outOfArea);

  useEffect(() => {
    if (success || waived || outOfArea) {
      try {
        sessionStorage.removeItem(DEMO_RETRY_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }, [success, waived, outOfArea]);

  if (outOfArea) {
    return (
      <div className="container-site py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-success">
          Request received
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Thank you</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/80">
          Thanks for your out-of-area home demonstration request. No payment has
          been taken. Our team will review whether a visit is possible and get
          back to you shortly.
        </p>
        {ref ? (
          <p className="mt-3 text-muted">
            Reference: <strong className="text-foreground">{ref}</strong>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants()}>
            Back to homepage
          </Link>
          <Link
            href="/book-a-demo"
            className={buttonVariants({ variant: "outline" })}
          >
            Book a branch demo
          </Link>
        </div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="container-site py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-error">
          Payment pending
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
          Payment not completed
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/80">
          Your demonstration request is saved as{" "}
          <strong className="text-foreground">payment pending</strong>. No card
          payment was taken. You can retry the £195 home demonstration fee
          securely below.
        </p>
        {ref ? (
          <p className="mt-3 text-muted">
            Reference: <strong className="text-foreground">{ref}</strong>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/book-a-demo#form"
            className={buttonVariants({ size: "lg" })}
          >
            Retry payment
          </Link>
          <Link
            href="/contact?interest=callback#callback"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Request a callback
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-site py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-success">
        {success ? "Payment received" : "Booking received"}
      </p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Thank you</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/80">
        {success
          ? "Your home demonstration fee is paid and your request is with our team. We’ll email you a confirmation and be in touch to confirm timing."
          : "Your demonstration request is with our team. We’ll email you a confirmation and contact you shortly to confirm timing."}
      </p>
      {ref ? (
        <p className="mt-3 text-muted">
          Reference: <strong className="text-foreground">{ref}</strong>
        </p>
      ) : null}
      <p className="mt-3 text-muted">
        Need us sooner?{" "}
        <Link
          href="/contact?interest=callback#callback"
          className="font-semibold text-primary underline"
        >
          Request a callback
        </Link>
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Back to homepage
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
          Browse scooters &amp; wheelchairs
        </Link>
      </div>
    </div>
  );
}
