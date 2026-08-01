"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, MapPin, Package, PackageCheck, Search, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  checkDeliveryZone,
  isHeavyItem,
  isSmallItem,
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

  const small = isSmallItem(weight);
  const heavy = isHeavyItem(weight);
  const mid = !small && !heavy;

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
          placeholder="Enter postcode e.g. SW1A 1AA"
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

          {(small || mid) && result.status === "local" ? (
            <>
              <ResultOk
                title="Free local delivery available"
                body={
                  <>
                    You&apos;re just <strong>{result.distanceMiles} miles</strong>{" "}
                    from our <strong>{result.branch}</strong> branch — we&apos;ll
                    bring your order to your door.
                  </>
                }
              />
              <ResultInfo
                icon={<PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
                title="Free tracked UK delivery also available"
                body="Free UK-wide tracked courier if you'd prefer."
              />
            </>
          ) : null}

          {(small || mid) && result.status === "pallet" ? (
            <ResultInfo
              icon={<PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
              title="Free tracked UK delivery"
              body={
                <>
                  We deliver <strong>anywhere in mainland UK</strong> completely
                  free of charge.
                </>
              }
            />
          ) : null}

          {heavy && result.status === "local" ? (
            <>
              <ResultOk
                title="Free local delivery available"
                body={
                  <>
                    You&apos;re just <strong>{result.distanceMiles} miles</strong>{" "}
                    from our <strong>{result.branch}</strong> branch — we&apos;ll
                    deliver and set it up.
                  </>
                }
              />
              <ResultInfo
                icon={<Package className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
                title="Free UK pallet delivery also available"
                body="Kerbside pallet delivery, signature required. Returns at your own cost."
              />
            </>
          ) : null}

          {heavy && result.status === "pallet" ? (
            <>
              <ResultInfo
                icon={<Package className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
                title="Free UK pallet delivery"
                body={
                  <>
                    We deliver <strong>anywhere in mainland UK</strong> via
                    specialist pallet courier — free of charge. Kerbside,
                    signature required.
                  </>
                }
              />
              <div className="flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <div>
                  <p className="text-sm font-medium text-primary">
                    Outside our local home-delivery rings
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    See the{" "}
                    <Link href="/service-area" className="font-semibold underline">
                      service area page
                    </Link>
                    . Free pallet delivery still applies.
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted">
          Enter your postcode to see your free delivery options.
        </p>
      )}
    </div>
  );
}

function ResultOk({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/10 px-4 py-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
      <div>
        <p className="text-sm font-semibold text-primary">{title}</p>
        <p className="mt-0.5 text-sm text-muted">{body}</p>
      </div>
    </div>
  );
}

function ResultInfo({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary-soft/60 px-4 py-3">
      {icon}
      <div>
        <p className="text-sm font-semibold text-primary">{title}</p>
        <p className="mt-0.5 text-sm text-muted">{body}</p>
      </div>
    </div>
  );
}
