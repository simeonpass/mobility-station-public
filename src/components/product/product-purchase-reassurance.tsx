"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
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
  { Icon: SiVisa, label: "Visa", className: "text-[#1A1F71]" },
  { Icon: SiMastercard, label: "Mastercard", className: "text-[#EB001B]" },
  { Icon: SiApplepay, label: "Apple Pay", className: "text-[#111111]" },
  { Icon: SiGooglepay, label: "Google Pay", className: "text-[#4285F4]" },
  { Icon: SiPaypal, label: "PayPal", className: "text-[#003087]" },
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
 * One delivery card for shop PDPs: timing, postcode check, and payment icons.
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
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-[0_4px_20px_-12px_rgba(0,63,67,0.12)]">
      <div className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Truck className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-primary">Free UK delivery</p>
            <Link
              href="/delivery"
              className="shrink-0 text-xs font-semibold text-primary underline-offset-2 hover:underline"
            >
              Info
            </Link>
          </div>
          {timing ? (
            <p className="mt-1 text-sm leading-snug text-foreground/85">
              <span className="text-muted">{timing.prefix} </span>
              <span className="font-semibold text-primary">
                {timing.highlight}
              </span>
              {timing.suffix ? (
                <>
                  {" "}
                  <span className="text-muted">{timing.suffix}</span>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-border px-4 py-3.5 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Check your postcode
        </p>
        <p className="mt-0.5 text-xs text-muted">
          See if we deliver locally — or choose courier / collection at
          checkout.
        </p>
        <div className="mt-3">
          <DeliveryChecker weight={weight} compact />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border bg-soft/60 px-4 py-3 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Pay with
        </p>
        <ul
          className="flex items-center gap-3.5"
          aria-label="Accepted payment methods"
        >
          {PAYMENT_ICONS.map(({ Icon, label, className }) => (
            <li key={label} title={label} className="flex items-center">
              <Icon
                className={`h-7 w-auto ${className}`}
                role="img"
                aria-label={label}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
