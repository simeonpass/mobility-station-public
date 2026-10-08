import Link from "next/link";
import { Truck } from "lucide-react";
import { formatGBP } from "@/lib/products";

/** Compact old-scooter takeaway promo for the product buy column. */
export function TakeawayCallout({ credit }: { credit: number }) {
  if (credit <= 0) return null;

  return (
    <div className="rounded-xl border border-accent/40 bg-accent/15 px-4 py-3.5">
      <div className="flex gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Truck className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-primary">
            Old scooter takeaway — {formatGBP(credit)} off
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            We’ll take your old scooter or wheelchair away and knock a fixed
            credit off this order when you{" "}
            <span className="font-medium text-primary">collect</span> or we
            deliver in our{" "}
            <span className="font-medium text-primary">local service area</span>
            . Add it at checkout.{" "}
            <Link
              href="/trade-in"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              See credit bands
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
