"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-site py-20 text-center">
      <h1 className="text-3xl font-extrabold">Something went wrong</h1>
      <p className="mt-3 text-muted">
        Please try again, or call 0800 772 3870 for immediate help.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className={buttonVariants()}>
          Try again
        </button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Go home
        </Link>
      </div>
    </div>
  );
}
