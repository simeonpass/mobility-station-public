"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import {
  FLEX_MIN_MONTHS,
  HIRE_BOOKING_NOTICE_DAYS,
  SHORT_TERM_MAX_DAYS,
  SHORT_TERM_MIN_DAYS,
  addMonths,
  calcFlexDueToday,
  calcShortTermHirePrice,
  rateCardForProduct,
  type HireMode,
} from "@/lib/hire";
import { formatGBP, type HireProduct } from "@/lib/products";
import {
  lookupCoverage,
  lookupFlexCoverage,
  type CoverageResult,
  type FlexCoverageResult,
} from "@/lib/service-area";

type Fulfilment = "branch" | "mobile";

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toInputDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function HireBookingForm({
  product,
  mode,
  preview = false,
}: {
  product: HireProduct;
  mode: HireMode;
  /** Sample fleet only — form is visible for layout, checkout is disabled. */
  preview?: boolean;
}) {
  const router = useRouter();
  const rates = useMemo(() => rateCardForProduct(product), [product]);
  const minStart = useMemo(
    () => addDays(new Date(), HIRE_BOOKING_NOTICE_DAYS),
    [],
  );

  const [fulfilment, setFulfilment] = useState<Fulfilment>("branch");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [flexCoverage, setFlexCoverage] = useState<FlexCoverageResult | null>(
    null,
  );
  const [coverageLoading, setCoverageLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    branch: "heathrow",
    postcode: "",
    notes: "",
  });

  // Short-term: banded call-out lookup for mobile delivery
  useEffect(() => {
    if (mode !== "short" || fulfilment !== "mobile") {
      setCoverage(null);
      return;
    }
    const cleaned = form.postcode.trim();
    if (cleaned.length < 5) {
      setCoverage(null);
      return;
    }
    setCoverageLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      const r = await lookupCoverage(cleaned, ctrl.signal);
      setCoverage(r);
      setCoverageLoading(false);
    }, 400);
    return () => {
      clearTimeout(t);
      ctrl.abort();
      setCoverageLoading(false);
    };
  }, [form.postcode, fulfilment, mode]);

  // Flex: zone check (always needs a postcode — free delivery only in zone)
  useEffect(() => {
    if (mode !== "flex") {
      setFlexCoverage(null);
      return;
    }
    const cleaned = form.postcode.trim();
    if (cleaned.length < 5) {
      setFlexCoverage(null);
      return;
    }
    setCoverageLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      const r = await lookupFlexCoverage(cleaned, ctrl.signal);
      setFlexCoverage(r);
      setCoverageLoading(false);
    }, 400);
    return () => {
      clearTimeout(t);
      ctrl.abort();
      setCoverageLoading(false);
    };
  }, [form.postcode, mode]);

  const days = useMemo(() => {
    if (mode === "flex") return FLEX_MIN_MONTHS * 30;
    if (!startDate || !endDate) return 0;
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    return Math.max(
      1,
      Math.round((end.getTime() - start.getTime()) / 86400000) + 1,
    );
  }, [startDate, endDate, mode]);

  const hireSubtotal =
    mode === "flex"
      ? rates.monthly
      : calcShortTermHirePrice(days, rates);

  // Short-term mobile: charge deliver + collect = 2 × band
  const oneWayCallout =
    mode === "short" &&
    fulfilment === "mobile" &&
    coverage?.kind === "covered"
      ? coverage.fee
      : 0;
  const calloutFee = oneWayCallout * 2;
  const deposit = rates.deposit;
  const total =
    mode === "flex"
      ? calcFlexDueToday(rates).total
      : Number((hireSubtotal + calloutFee + deposit).toFixed(2));

  const flexEndDate = startDate
    ? addMonths(startDate, FLEX_MIN_MONTHS)
    : "";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError("Please complete name, phone and email.");
      return;
    }
    if (!startDate) {
      setError("Please choose a start date.");
      return;
    }

    if (mode === "short") {
      if (!endDate) {
        setError("Please choose an end date.");
        return;
      }
      if (days < SHORT_TERM_MIN_DAYS) {
        setError(`Minimum short-term hire is ${SHORT_TERM_MIN_DAYS} days.`);
        return;
      }
      if (days > SHORT_TERM_MAX_DAYS) {
        setError(
          `Short-term hire is limited to ${SHORT_TERM_MAX_DAYS} days. For longer, choose Flex Hire.`,
        );
        return;
      }
      if (fulfilment === "branch" && !form.branch) {
        setError("Please choose a branch.");
        return;
      }
      if (fulfilment === "mobile" && coverage?.kind !== "covered") {
        setError("Please enter a postcode in our local delivery area.");
        return;
      }
    } else {
      if (!form.postcode.trim()) {
        setError("Please enter your postcode so we can check the Flex zone.");
        return;
      }
      if (flexCoverage?.kind !== "in-zone") {
        setError(
          "Flex Hire is only available inside our Flex zone (Heathrow 10 miles / Ferndown 20 miles). Try short-term hire or branch pickup.",
        );
        return;
      }
    }

    if (preview) {
      setError(
        "This is a layout preview with sample fleet items. Live booking will open once real stock is listed.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const resolvedEnd =
        mode === "flex" ? flexEndDate : endDate;
      const resolvedFulfilment =
        mode === "flex" ? "mobile" : fulfilment;
      const preferredBranch =
        mode === "flex"
          ? flexCoverage?.kind === "in-zone"
            ? flexCoverage.workshop.id
            : undefined
          : fulfilment === "branch"
            ? form.branch
            : coverage?.kind === "covered"
              ? coverage.workshop.id
              : undefined;

      const res = await fetch("/api/hire/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockItemId: product.id,
          hireType: mode,
          startDate,
          endDate: resolvedEnd,
          fulfilmentMode: resolvedFulfilment,
          preferredBranch,
          postcode:
            mode === "flex" || fulfilment === "mobile"
              ? form.postcode
              : undefined,
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
          },
          notes:
            mode === "flex"
              ? [
                  `FLEX:${FLEX_MIN_MONTHS}mo min. Month 1 + deposit due today; months 2+ billed monthly.`,
                  form.notes || "",
                ]
                  .filter(Boolean)
                  .join(" ")
              : form.notes || undefined,
          // Client-side expected totals so ops can spot mismatches
          expected: {
            hireSubtotal,
            calloutFee: mode === "flex" ? 0 : calloutFee,
            deposit,
            total,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.bookingId) {
        throw new Error(data.error || "Failed to start booking");
      }
      router.push(data.redirectUrl || `/hire/checkout/${data.bookingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start booking");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "short" ? (
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">
            How would you like to receive it?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["branch", "Branch pickup", "Free"],
                ["mobile", "Deliver & collect", "Call-out × 2"],
              ] as const
            ).map(([value, title, sub]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFulfilment(value)}
                className={`rounded-lg border p-3 text-left text-sm ${
                  fulfilment === value
                    ? "border-primary bg-primary-soft ring-1 ring-primary"
                    : "border-border bg-white"
                }`}
              >
                <p className="font-semibold text-primary">{title}</p>
                <p className="text-xs text-muted">{sub}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-lg bg-soft px-3 py-2 text-xs text-muted">
          Flex includes free delivery and collection inside the Flex zone, plus
          servicing and fault call-outs.
        </p>
      )}

      {mode === "short" && fulfilment === "branch" ? (
        <div>
          <Label htmlFor="branch">Branch</Label>
          <Select
            id="branch"
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          >
            <option value="heathrow">Heathrow</option>
            <option value="ferndown">Ferndown</option>
          </Select>
        </div>
      ) : (
        <div>
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            value={form.postcode}
            onChange={(e) =>
              setForm({ ...form, postcode: e.target.value.toUpperCase() })
            }
            placeholder="e.g. UB7 8EB"
            className="uppercase"
            required={mode === "flex" || fulfilment === "mobile"}
          />
          {coverageLoading ? (
            <p className="mt-1 text-xs text-muted">Checking coverage…</p>
          ) : null}
          {mode === "short" && coverage?.kind === "covered" ? (
            <p className="mt-1 text-xs text-success">
              {coverage.workshop.name} — deliver &amp; collect{" "}
              {coverage.fee === 0
                ? "free locally"
                : `${formatGBP(coverage.fee * 2)} (${formatGBP(coverage.fee)} each way)`}
            </p>
          ) : null}
          {mode === "short" && coverage?.kind === "out-of-range" ? (
            <p className="mt-1 text-xs text-error">
              Outside local delivery — choose branch pickup instead.
            </p>
          ) : null}
          {mode === "flex" && flexCoverage?.kind === "in-zone" ? (
            <p className="mt-1 text-xs text-success">
              In the {flexCoverage.workshop.name} Flex zone (
              {flexCoverage.miles.toFixed(1)} mi) — delivery included.
            </p>
          ) : null}
          {mode === "flex" && flexCoverage?.kind === "out-of-zone" ? (
            <p className="mt-1 text-xs text-error">
              Outside the Flex zone
              {flexCoverage.shortTermAvailable
                ? " — short-term hire with deliver & collect may still be available."
                : " — branch pickup on short-term may still be possible."}{" "}
              <Link
                href="/hire?mode=short"
                className="font-semibold underline"
              >
                Switch to short-term
              </Link>
              .
            </p>
          ) : null}
        </div>
      )}

      <div className={`grid gap-3 ${mode === "short" ? "sm:grid-cols-2" : ""}`}>
        <div>
          <Label htmlFor="start">Start date</Label>
          <Input
            id="start"
            type="date"
            min={toInputDate(minStart)}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        {mode === "short" ? (
          <div>
            <Label htmlFor="end">End date</Label>
            <Input
              id="end"
              type="date"
              min={startDate || toInputDate(minStart)}
              max={
                startDate
                  ? toInputDate(
                      addDays(
                        new Date(`${startDate}T00:00:00`),
                        SHORT_TERM_MAX_DAYS - 1,
                      ),
                    )
                  : undefined
              }
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted">
        {mode === "flex" ? (
          <>
            {FLEX_MIN_MONTHS}-month minimum from your start date, then rolling
            monthly. First payment today; we bill each month after that. Start
            date must be at least {HIRE_BOOKING_NOTICE_DAYS} days from today.
          </>
        ) : (
          <>
            {SHORT_TERM_MIN_DAYS}–{SHORT_TERM_MAX_DAYS} days. Start date must be
            at least {HIRE_BOOKING_NOTICE_DAYS} days from today.
          </>
        )}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      {(mode === "flex" && startDate) ||
      (mode === "short" && days >= SHORT_TERM_MIN_DAYS) ? (
        <div className="rounded-xl bg-soft px-4 py-3 text-sm">
          {mode === "flex" ? (
            <>
              <p>
                Month 1 Flex: <strong>{formatGBP(hireSubtotal)}</strong>
              </p>
              <p className="text-xs text-muted">
                Then {formatGBP(rates.monthly)} / month · {FLEX_MIN_MONTHS}
                -month minimum to {flexEndDate}
              </p>
              <p>Delivery &amp; collection: included</p>
            </>
          ) : (
            <>
              <p>
                {days} days hire: <strong>{formatGBP(hireSubtotal)}</strong>
              </p>
              {calloutFee > 0 ? (
                <p>Deliver &amp; collect: {formatGBP(calloutFee)}</p>
              ) : fulfilment === "branch" ? (
                <p>Branch pickup: free</p>
              ) : null}
            </>
          )}
          {deposit > 0 ? (
            <p>Refundable deposit: {formatGBP(deposit)}</p>
          ) : null}
          <p className="mt-1 text-base font-bold text-primary">
            Due today: {formatGBP(total)}
          </p>
        </div>
      ) : null}

      {preview ? (
        <p className="rounded-lg bg-soft px-3 py-2 text-xs text-muted">
          Sample listing — checkout is off so you can review the layout.
        </p>
      ) : null}

      {error ? <p className="text-sm text-error">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={submitting || preview}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting booking…
          </>
        ) : preview ? (
          "Preview only"
        ) : (
          "Continue to checkout"
        )}
      </Button>
    </form>
  );
}
