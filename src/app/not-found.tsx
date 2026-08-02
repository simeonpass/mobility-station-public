import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-site py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">
        404
      </p>
      <h1 className="mt-2 text-4xl font-extrabold text-primary">
        Page not found
      </h1>
      <p className="mt-3 text-muted">
        The page you requested is unavailable. Try the shop or book a demo
        instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Go home
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
          Scooters &amp; wheelchairs
        </Link>
        <Link
          href="/vehicle-adaptations"
          className={buttonVariants({ variant: "outline" })}
        >
          Vehicle adaptations
        </Link>
      </div>
    </div>
  );
}
