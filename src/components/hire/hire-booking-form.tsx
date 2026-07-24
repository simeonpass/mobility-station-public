"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { lookupCoverage, type CoverageResult } from "@/lib/service-area";
import { calcHirePrice, formatGBP, type HireProduct } from "@/lib/products";

type Mode = "branch" | "mobile" | "courier";

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toInputDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function HireBookingForm({ product }: { product: HireProduct }) {
  const router = useRouter();
  const minStart = useMemo(() => addDays(new Date(), 7), []);
  const [mode, setMode] = useState<Mode>(
    product.hire_nationwide ? "courier" : "branch",
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
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

  useEffect(() => {
    if (mode !== "mobile") {
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
  }, [form.postcode, mode]);

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    return Math.max(
      1,
      Math.round((end.getTime() - start.getTime()) / 86400000) + 1,
    );
  }, [startDate, endDate]);

  const hireSubtotal = calcHirePrice(
    days,
    Number(product.hire_daily_rate || 0),
    Number(product.hire_weekly_rate || 0),
    Number(product.hire_monthly_rate || 0),
  );
  const calloutFee =
    mode === "mobile" && coverage?.kind === "covered" ? coverage.fee : 0;
  const courierFee =
    mode === "courier" ? Number(product.hire_courier_fee || 40) : 0;
  const deposit = Number(product.hire_deposit || 0);
  const total = hireSubtotal + calloutFee + courierFee + deposit;
  const minDays = product.hire_min_days || 1;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError("Please complete name, phone and email.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please choose start and end dates.");
      return;
    }
    if (days < minDays) {
      setError(`Minimum hire is ${minDays} days.`);
      return;
    }
    if (mode === "branch" && !form.branch) {
      setError("Please choose a branch.");
      return;
    }
    if (mode === "mobile" && coverage?.kind !== "covered") {
      setError("Please enter a postcode in our home delivery area.");
      return;
    }
    if (mode === "courier" && !form.postcode.trim()) {
      setError("Please enter your postcode.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/hire/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockItemId: product.id,
          startDate,
          endDate,
          fulfilmentMode: mode,
          preferredBranch: mode === "branch" ? form.branch : undefined,
          postcode: mode !== "branch" ? form.postcode : undefined,
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
          },
          notes: form.notes || undefined,
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
      <div>
        <p className="mb-2 text-sm font-semibold text-primary">
          How would you like to receive it?
        </p>
        <div
          className={`grid gap-2 ${product.hire_nationwide ? "grid-cols-3" : "grid-cols-2"}`}
        >
          {(
            [
              ["branch", "Branch pickup", "Free"],
              ["mobile", "Local delivery", "Banded fee"],
              ...(product.hire_nationwide
                ? ([
                    [
                      "courier",
                      "Nationwide",
                      `+${formatGBP(Number(product.hire_courier_fee || 40))}`,
                    ],
                  ] as const)
                : []),
            ] as const
          ).map(([value, title, sub]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-lg border p-3 text-left text-sm ${
                mode === value
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

      {mode === "branch" ? (
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
          />
          {mode === "mobile" && coverageLoading ? (
            <p className="mt-1 text-xs text-muted">Checking coverage…</p>
          ) : null}
          {mode === "mobile" && coverage?.kind === "covered" ? (
            <p className="mt-1 text-xs text-success">
              {coverage.workshop.name} —{" "}
              {coverage.fee === 0
                ? "free local delivery"
                : `${formatGBP(coverage.fee)} call-out`}
            </p>
          ) : null}
          {mode === "mobile" && coverage?.kind === "out-of-range" ? (
            <p className="mt-1 text-xs text-error">
              Outside local delivery — choose courier or branch pickup.
            </p>
          ) : null}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
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
        <div>
          <Label htmlFor="end">End date</Label>
          <Input
            id="end"
            type="date"
            min={startDate || toInputDate(minStart)}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>
      <p className="text-xs text-muted">
        Minimum {minDays} day{minDays === 1 ? "" : "s"} hire. Start date must be
        at least 7 days from today.
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

      {days >= minDays ? (
        <div className="rounded-xl bg-soft px-4 py-3 text-sm">
          <p>
            {days} days hire: <strong>{formatGBP(hireSubtotal)}</strong>
          </p>
          {calloutFee > 0 ? (
            <p>Local delivery: {formatGBP(calloutFee)}</p>
          ) : null}
          {courierFee > 0 ? <p>Courier: {formatGBP(courierFee)}</p> : null}
          {deposit > 0 ? (
            <p>Refundable deposit: {formatGBP(deposit)}</p>
          ) : null}
          <p className="mt-1 text-base font-bold text-primary">
            Total: {formatGBP(total)}
          </p>
        </div>
      ) : null}

      {error ? <p className="text-sm text-error">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting booking…
          </>
        ) : (
          "Continue to checkout"
        )}
      </Button>
    </form>
  );
}
