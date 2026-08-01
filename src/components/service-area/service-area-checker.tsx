"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lookupCoverage, type CoverageResult } from "@/lib/service-area";

export function ServiceAreaChecker() {
  const [postcode, setPostcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoverageResult | null>(null);

  const check = async () => {
    if (!postcode.trim()) return;
    setLoading(true);
    const r = await lookupCoverage(postcode);
    setResult(r);
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <h2 className="mb-2 text-lg font-bold text-primary">
        Check your postcode
      </h2>
      <p className="mb-4 text-sm text-muted">
        See which branch covers you and the local collection / delivery call-out
        band.
      </p>
      <div className="flex gap-2">
        <Input
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          placeholder="e.g. BH22 9AA"
          className="uppercase"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void check();
            }
          }}
        />
        <Button type="button" onClick={() => void check()} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {result?.kind === "covered" ? (
        <p className="mt-3 rounded-xl bg-success/10 px-4 py-3 text-sm text-primary">
          Covered by <strong>{result.workshop.name}</strong> (
          {result.miles.toFixed(1)} mi) —{" "}
          {result.fee === 0
            ? "free local band"
            : `£${result.fee} (${result.label})`}
          .
        </p>
      ) : null}
      {result?.kind === "out-of-range" ? (
        <p className="mt-3 rounded-xl bg-warning/10 px-4 py-3 text-sm text-primary">
          Outside our local service area ({result.miles.toFixed(0)} mi from{" "}
          {result.workshop.name}). Equipment over 30 kg stays local — lightweight
          items under 30 kg can still ship UK-wide. See{" "}
          <Link href="/delivery" className="font-semibold underline">
            delivery
          </Link>
          , or{" "}
          <Link
            href="/contact?interest=callback#callback"
            className="font-semibold underline"
          >
            request a callback
          </Link>{" "}
          if you&apos;re near the boundary.
        </p>
      ) : null}
      {result?.kind === "not-found" ? (
        <p className="mt-3 text-sm text-error">Postcode not found.</p>
      ) : null}
    </div>
  );
}
