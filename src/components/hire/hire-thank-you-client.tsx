"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

const HIRE_RETRY_KEY = "ms-hire-booking-retry";

export function HireThankYouClient() {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");
  const ref =
    searchParams.get("ref") ||
    searchParams.get("bookingId") ||
    searchParams.get("bookingRef");
  const paid =
    payment === "success" || searchParams.get("paid") === "1";
  const failed = payment === "failed" || payment === "cancel";
  const enquiry = !paid && !failed;

  useEffect(() => {
    if (paid || enquiry) {
      try {
        sessionStorage.removeItem(HIRE_RETRY_KEY);
      } catch {
        /* ignore */
      }
    }
  }, [paid, enquiry]);

  if (failed) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
          Payment pending
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-[var(--color-ink)] sm:text-4xl">
          Payment not completed
        </h1>
        <p className="mt-4 text-[var(--color-muted)]">
          No card payment was taken. Your details are saved on this device — go
          back to the hire form and pay securely to confirm the booking.
        </p>
        {ref ? (
          <p className="mt-4 rounded-xl bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-ink)]">
            Reference: <span className="font-mono font-semibold">{ref}</span>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/hire#book"
            className={buttonVariants({ size: "lg" })}
          >
            Retry payment
          </Link>
          <Link
            href="/hire#enquiry-fallback"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Send an enquiry instead
          </Link>
          <a
            href="tel:01202875552"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            01202 875552
          </a>
        </div>
      </div>
    );
  }

  if (paid) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
          Payment received
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-[var(--color-ink)] sm:text-4xl">
          You&apos;re booked — we&apos;ll deliver or prepare collection
        </h1>
        <p className="mt-4 text-[var(--color-muted)]">
          Your hire is paid and confirmed. We&apos;ll email you shortly with
          delivery or collection details. From here we just need to get the
          scooter or wheelchair to you — you don&apos;t need to chase us.
        </p>
        {ref ? (
          <p className="mt-4 rounded-xl bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-ink)]">
            Reference: <span className="font-mono font-semibold">{ref}</span>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/hire" className={buttonVariants()}>
            Back to hire
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
        Enquiry received
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold text-[var(--color-ink)] sm:text-4xl">
        Thanks — we&apos;ll confirm availability and next steps
      </h1>
      <p className="mt-4 text-[var(--color-muted)]">
        We&apos;ve received your hire enquiry. A team member will reply with
        availability and a clear quote — usually the same day during office
        hours. Prefer to book and pay now?{" "}
        <Link
          href="/hire#book"
          className="font-semibold text-[var(--color-brand)] underline underline-offset-2"
        >
          Go to online booking
        </Link>
        .
      </p>
      {ref ? (
        <p className="mt-4 rounded-xl bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-ink)]">
          Reference: <span className="font-mono font-semibold">{ref}</span>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/hire#book" className={buttonVariants()}>
          Book and pay online
        </Link>
        <Link href="/hire" className={buttonVariants({ variant: "outline" })}>
          Back to hire
        </Link>
        <a
          href="tel:01202875552"
          className={buttonVariants({ variant: "outline" })}
        >
          01202 875552
        </a>
      </div>
    </div>
  );
}
