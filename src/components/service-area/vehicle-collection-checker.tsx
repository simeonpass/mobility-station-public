"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CarFront,
  CheckCircle2,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { lookupCoverage, type CoverageResult } from "@/lib/service-area";

export function VehicleCollectionChecker({ compact = false }: { compact?: boolean }) {
  const [postcode, setPostcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoverageResult | null>(null);

  const check = async () => {
    if (!postcode.trim()) return;
    setLoading(true);
    setResult(null);
    const nextResult = await lookupCoverage(postcode);
    setResult(nextResult);
    setLoading(false);
  };

  return (
    <div className={compact ? "rounded-[2rem] border border-border bg-white p-5 md:p-7" : "rounded-[2rem] border border-border bg-white p-6 shadow-sm md:p-8"}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <CarFront className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-primary md:text-2xl">
            Check your vehicle collection cost
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            Enter the collection postcode to see the estimated charge for
            collecting the car, taking it to our workshop and returning it after
            the adaptation is fitted.
          </p>
        </div>
      </div>

      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          void check();
        }}
      >
        <Label htmlFor="vehicle-collection-postcode">Collection postcode</Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="vehicle-collection-postcode"
            value={postcode}
            onChange={(event) => setPostcode(event.target.value.toUpperCase())}
            placeholder="e.g. BH22 9AA"
            className="h-12 uppercase sm:max-w-xs"
            autoComplete="postal-code"
            inputMode="text"
            required
          />
          <Button type="submit" className="h-12 rounded-full px-6" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Search className="h-4 w-4" aria-hidden />
            )}
            {loading ? "Checking…" : "Check collection cost"}
          </Button>
        </div>
      </form>

      <div className="mt-5" aria-live="polite">
        {result?.kind === "covered" ? (
          <div className="rounded-2xl border border-success/30 bg-success/10 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary">
                  {result.postcode} is in our {result.workshop.name} collection area
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-primary">
                  {result.fee === 0 ? "Free" : `£${result.fee}`}
                </p>
                <p className="mt-1 text-sm font-semibold text-primary">
                  Estimated collection and return charge
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {result.miles.toFixed(1)} miles from our {result.workshop.name} workshop · {result.label}
                </p>
                {result.isCentralLondon ? (
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    The Central London minimum includes the extra time and charges involved in collection.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {result?.kind === "out-of-range" ? (
          <div className="rounded-2xl border border-warning/35 bg-warning/10 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-bold text-primary">Outside our standard collection area</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {result.postcode} is about {result.miles.toFixed(0)} miles from our nearest
                  workshop at {result.workshop.name}. You can bring the vehicle to us, or ask
                  the team whether a tailored collection quote is possible.
                </p>
                <Link
                  href="/contact?interest=adaptation"
                  className="mt-4 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
                >
                  Ask about this postcode
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {result?.kind === "not-found" ? (
          <p className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
            We could not find that postcode. Please check it and try again.
          </p>
        ) : null}

        {result?.kind === "error" ? (
          <p className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
            We could not check the postcode just now. Please try again or contact the team.
          </p>
        ) : null}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted">
        Prices cover one collection and one return journey for a vehicle booked for
        adaptation work. We confirm the final charge when arranging the booking.
      </p>
    </div>
  );
}
