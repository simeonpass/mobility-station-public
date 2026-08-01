"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Search,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  checkDeliveryZone,
  isHeavyItem,
  type DeliveryCheckResult,
} from "@/lib/delivery-zone";

export function DeliveryChecker({
  compact = false,
  initialPostcode = "",
  onResult,
  weight,
}: {
  compact?: boolean;
  initialPostcode?: string;
  onResult?: (result: DeliveryCheckResult, postcode: string) => void;
  weight?: number | null;
}) {
  const [postcode, setPostcode] = useState(initialPostcode);
  const [result, setResult] = useState<DeliveryCheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  const heavy = isHeavyItem(weight);

  const check = async () => {
    if (!postcode.trim()) return;
    setLoading(true);
    setResult({ status: "loading" });
    const r = await checkDeliveryZone(postcode);
    setResult(r);
    setLoading(false);
    onResult?.(r, postcode.trim().toUpperCase());
  };

  return (
    <div
      className={
        compact ? "" : "rounded-2xl border border-border bg-white p-5"
      }
    >
      {!compact ? (
        <div className="mb-3 flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" aria-hidden />
          <h3 className="text-base font-semibold text-primary">
            Check delivery options
          </h3>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Input
          placeholder="Enter postcode e.g. UB7 8EB"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void check();
            }
          }}
          className="flex-1 uppercase"
          maxLength={8}
          aria-label="Postcode"
        />
        <Button
          type="button"
          onClick={() => void check()}
          disabled={loading || !postcode.trim()}
          className="shrink-0 px-4"
          aria-label="Check postcode"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {result && result.status !== "loading" ? (
        <div className="mt-3 space-y-2">
          {result.status === "error" ? (
            <p className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {result.message}
            </p>
          ) : null}

          {result.status === "local" ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/10 px-4 py-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <div>
                <p className="text-sm font-semibold text-primary">
                  You&apos;re in our service area
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  About <strong>{result.distanceMiles} miles</strong> from our{" "}
                  <strong>{result.branch}</strong> branch
                  {heavy
                    ? " — we can deliver and set up this equipment in person."
                    : " — local delivery available."}
                </p>
              </div>
            </div>
          ) : null}

          {result.status === "out_of_area" && heavy ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <div>
                <p className="text-sm font-semibold text-primary">
                  Too heavy for nationwide shipping
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  Equipment over 30 kg is only delivered within our Heathrow and
                  Ferndown service area — it&apos;s too heavy to ship UK-wide,
                  and too difficult to collect if there&apos;s a problem.{" "}
                  <Link
                    href="/service-area"
                    className="font-semibold underline"
                  >
                    See where we cover
                  </Link>
                  ,{" "}
                  <Link href="/locations" className="font-semibold underline">
                    collect from a branch
                  </Link>
                  , or{" "}
                  <Link
                    href="/contact?interest=callback#callback"
                    className="font-semibold underline"
                  >
                    request a callback
                  </Link>
                  .
                </p>
              </div>
            </div>
          ) : null}

          {result.status === "out_of_area" && !heavy ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/10 px-4 py-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <div>
                <p className="text-sm font-semibold text-primary">
                  Free tracked UK delivery
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  Lightweight items (under 30 kg) ship nationwide by tracked
                  courier — easy to return in a box if needed. Home demos and
                  heavy equipment stay local to Heathrow &amp; Ferndown.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted">
          {heavy
            ? "This item is over 30 kg — enter your postcode to check local delivery from Heathrow or Ferndown."
            : "Enter your postcode — lightweight items ship UK-wide; over 30 kg is local delivery only."}
        </p>
      )}
    </div>
  );
}
