import Link from "next/link";
import { Truck } from "lucide-react";
import {
  SiApplepay,
  SiGooglepay,
  SiMastercard,
  SiPaypal,
  SiVisa,
} from "react-icons/si";

const PAYMENT_ICONS = [
  { Icon: SiVisa, label: "Visa", className: "text-[#1A1F71]" },
  { Icon: SiMastercard, label: "Mastercard", className: "text-[#EB001B]" },
  { Icon: SiApplepay, label: "Apple Pay", className: "text-[#111111]" },
  { Icon: SiGooglepay, label: "Google Pay", className: "text-[#4285F4]" },
  { Icon: SiPaypal, label: "PayPal", className: "text-[#003087]" },
] as const;

/** Normalize admin preset values for display (en-dash). */
export function formatDeliveryEstimate(raw: string | null | undefined) {
  const value = raw?.trim();
  if (!value) return null;
  const presets: Record<string, string> = {
    "1-3 days": "1–3 days",
    "4-7 days": "4–7 days",
    "1-2 weeks": "1–2 weeks",
    "2-4 weeks": "2–4 weeks",
  };
  return presets[value.toLowerCase()] ?? value;
}

export function ProductPurchaseReassurance({
  deliveryEstimate,
}: {
  deliveryEstimate?: string | null;
}) {
  const timing = formatDeliveryEstimate(deliveryEstimate);

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Truck className="h-3.5 w-3.5" aria-hidden />
        </span>
        <p className="min-w-0 flex-1 text-sm leading-snug text-primary">
          <span className="font-bold">Free UK delivery</span>
          {timing ? (
            <>
              <span className="mx-1.5 text-border" aria-hidden>
                ·
              </span>
              <span className="text-muted">{timing}</span>
            </>
          ) : null}
        </p>
        <Link
          href="/delivery"
          className="shrink-0 text-xs font-semibold text-primary underline-offset-2 hover:underline"
        >
          Info
        </Link>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border bg-soft/60 px-3.5 py-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          Pay with
        </p>
        <ul
          className="flex items-center gap-2.5"
          aria-label="Accepted payment methods"
        >
          {PAYMENT_ICONS.map(({ Icon, label, className }) => (
            <li key={label} title={label} className="flex items-center">
              <Icon
                className={`h-[1.05rem] w-auto ${className}`}
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
