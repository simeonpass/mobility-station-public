"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

export function HireThankYouClient() {
  const params = useSearchParams();
  const ref = params.get("ref");

  return (
    <div className="container-site py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-success">
        Enquiry received
      </p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Thank you</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/80">
        Your hire enquiry is with our team. We&apos;ll confirm availability,
        price and delivery or collection — no payment has been taken on the
        website.
      </p>
      {ref ? (
        <p className="mt-3 text-muted">
          Reference: <strong className="text-foreground">{ref}</strong>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/hire" className={buttonVariants()}>
          Back to hire
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
          Browse the shop
        </Link>
      </div>
    </div>
  );
}
