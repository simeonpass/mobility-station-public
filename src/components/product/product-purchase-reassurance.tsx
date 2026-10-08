"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck, Truck } from "lucide-react";
import {
  SiApplepay,
  SiGooglepay,
  SiMastercard,
  SiPaypal,
  SiVisa,
} from "react-icons/si";
import { DeliveryChecker } from "@/components/product/delivery-checker";
import { resolveDeliveryTiming } from "@/lib/delivery-timing";

const PAYMENT_ICONS = [
  { Icon: SiVisa, label: "Visa" },
  { Icon: SiMastercard, label: "Mastercard" },
  { Icon: SiApplepay, label: "Apple Pay" },
  { Icon: SiGooglepay, label: "Google Pay" },
  { Icon: SiPaypal, label: "PayPal" },
] as const;

/** Cutoff hour (24h) for next-day dispatch — e.g. 14 = 2 PM */
const CUTOFF_HOUR = 14;

function getNextDispatchInfo(): {
  hours: number;
  minutes: number;
  isWeekend: boolean;
  pastCutoff: boolean;
} {
  const now = new Date();
  const day = now.getDay();
  if (day === 0 || day === 6) {
    return { hours: 0, minutes: 0, isWeekend: true, pastCutoff: false };
  }

  const cutoff = new Date(now);
  cutoff.setHours(CUTOFF_HOUR, 0, 0, 0);

  if (now >= cutoff) {
    return { hours: 0, minutes: 0, isWeekend: false, pastCutoff: true };
  }

  const diff = cutoff.getTime() - now.getTime();
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    isWeekend: false,
    pastCutoff: false,
  };
}

/**
 * Delivery and payment reassurance for shop product pages.
 */
export function ProductPurchaseReassurance({
  deliveryEstimate,
  trackStock = true,
  manufacturer,
  weight,
}: {
  deliveryEstimate?: string | null;
  trackStock?: boolean;
  manufacturer?: string | null;
  weight?: number | null;
}) {
  const [dispatch, setDispatch] = useState(getNextDispatchInfo);

  useEffect(() => {
    const id = window.setInterval(() => setDispatch(getNextDispatchInfo()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const timing = resolveDeliveryTiming({
    deliveryEstimate,
    trackStock,
    manufacturer,
    isWeekend: dispatch.isWeekend,
    dispatchCountdown:
      trackStock &&
      !deliveryEstimate &&
      !dispatch.isWeekend &&
      !dispatch.pastCutoff
        ? { hours: dispatch.hours, minutes: dispatch.minutes }
        : null,
  });

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-border bg-white shadow-[0_16px_48px_-34px_rgba(0,0,0,0.32)]">
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="flex items-start gap-3 px-5 py-5 sm:border-r sm:border-border sm:px-6">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-buy-foreground">
            <Truck className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-primary">Free UK delivery</p>
              <Link
                href="/delivery"
                className="shrink-0 text-xs font-semibold text-muted underline-offset-3 hover:text-primary hover:underline"
              >
                Delivery info
              </Link>
            </div>
            {timing ? (
              <p className="mt-1.5 text-sm leading-snug text-muted">
                {timing.prefix}{" "}
                <span className="font-semibold text-primary">{timing.highlight}</span>
                {timing.suffix ? ` ${timing.suffix}` : ""}
              </p>
            ) : (
              <p className="mt-1.5 text-sm leading-snug text-muted">
                Nationwide delivery available on this product.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 border-t border-border px-5 py-5 sm:border-t-0 sm:px-6">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-soft text-primary">
            <ShieldCheck className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-bold text-primary">Buy with confidence</p>
            <p className="mt-1.5 text-sm leading-snug text-muted">
              UK support, secure checkout and manufacturer-backed warranty where applicable.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Check delivery to you
            </p>
            <p className="mt-1 text-sm text-muted">
              Enter your postcode for local delivery, courier or collection options.
            </p>
          </div>
        </div>
        <div className="mt-3">
          <DeliveryChecker weight={weight} compact />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-soft/55 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Secure payment
        </p>
        <ul className="flex items-center gap-4 text-primary" aria-label="Accepted payment methods">
          {PAYMENT_ICONS.map(({ Icon, label }) => (
            <li key={label} title={label} className="flex items-center">
              <Icon className="h-6 w-auto" role="img" aria-label={label} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
