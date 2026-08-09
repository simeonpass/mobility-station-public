"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useDnaPaymentsSdk } from "@/hooks/use-dna-payments-sdk";
import { openDnaPaymentPage } from "@/lib/dna-payments";
import {
  FLEX_SETUP_FEE_GBP,
  HIRE_PRICING_CATEGORIES,
  VAT_RELIEF_DECLARATION,
  type HirePricingCategoryId,
} from "@/lib/hire-pricing";
import {
  buildHireQuote,
  type HireDeliveryMode,
  type HireQuote,
} from "@/lib/hire-quote";
import { formatGBP } from "@/lib/products";
import { lookupCoverage } from "@/lib/service-area";

type HireType = "short" | "flex";

const HIRE_RETRY_KEY = "ms-hire-booking-retry";

type HireFormState = {
  hireType: HireType;
  categoryId: HirePricingCategoryId;
  startDate: string;
  endDate: string;
  delivery: HireDeliveryMode;
  userHeight: string;
  userWeight: string;
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  notes: string;
  vatRelief: boolean;
  termsAccepted: boolean;
  signedName: string;
  company_website: string;
  bookingRef: string;
};

function defaultHireForm(hireType: HireType): HireFormState {
  return {
    hireType,
    categoryId: "folding_scooter",
    startDate: "",
    endDate: "",
    delivery: "collect_heathrow",
    userHeight: "",
    userWeight: "",
    name: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    notes: "",
    vatRelief: false,
    termsAccepted: false,
    signedName: "",
    company_website: "",
    bookingRef: "",
  };
}

function readRetryForm(hireType: HireType): HireFormState {
  const defaults = defaultHireForm(hireType);
  if (typeof window === "undefined") return defaults;
  try {
    const raw = sessionStorage.getItem(HIRE_RETRY_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...(JSON.parse(raw) as Partial<HireFormState>) };
  } catch {
    return defaults;
  }
}

export function HireSelfServeForm({
  defaultHireType = "short",
}: {
  defaultHireType?: HireType;
}) {
  const router = useRouter();
  const { ready: dnaReady, failed: dnaFailed } = useDnaPaymentsSdk();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryMiles, setDeliveryMiles] = useState<number | null>(null);
  const [coverageNote, setCoverageNote] = useState<string | null>(null);
  const [form, setForm] = useState<HireFormState>(() =>
    readRetryForm(defaultHireType),
  );

  useEffect(() => {
    if (form.delivery !== "deliver" || form.postcode.trim().length < 5) {
      const t = window.setTimeout(() => {
        startTransition(() => {
          setDeliveryMiles(null);
          setCoverageNote(null);
        });
      }, 0);
      return () => window.clearTimeout(t);
    }
    const ctrl = new AbortController();
    const t = window.setTimeout(() => {
      void lookupCoverage(form.postcode, ctrl.signal).then((r) => {
        startTransition(() => {
          if (r.kind === "covered") {
            setDeliveryMiles(r.miles);
            setCoverageNote(
              `Covered from ${r.workshop.name} (${r.miles.toFixed(1)} mi).`,
            );
          } else if (r.kind === "out-of-range") {
            setDeliveryMiles(null);
            setCoverageNote(
              `Outside delivery range (~${r.miles.toFixed(0)} mi from ${r.workshop.name}). Choose free branch collection or call us.`,
            );
          } else {
            setDeliveryMiles(null);
            setCoverageNote(
              r.kind === "not-found" ? "Postcode not found." : null,
            );
          }
        });
      });
    }, 400);
    return () => {
      window.clearTimeout(t);
      ctrl.abort();
    };
  }, [form.delivery, form.postcode]);

  const quote: HireQuote | null = useMemo(() => {
    try {
      if (!form.startDate) return null;
      if (form.hireType === "short" && !form.endDate) return null;
      return buildHireQuote({
        hireType: form.hireType,
        categoryId: form.categoryId,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        delivery: form.delivery,
        deliveryMiles,
        vatRelief: form.vatRelief,
      });
    } catch {
      return null;
    }
  }, [form, deliveryMiles]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function persistRetry(ref?: string) {
    try {
      sessionStorage.setItem(
        HIRE_RETRY_KEY,
        JSON.stringify({ ...form, bookingRef: ref || form.bookingRef }),
      );
    } catch {
      /* ignore */
    }
  }

  async function pay() {
    setSubmitting(true);
    setError(null);
    try {
      if (!dnaReady) {
        throw new Error(
          dnaFailed
            ? "Card payments could not load. Please refresh the page."
            : "Card payments are still loading — try again in a moment.",
        );
      }
      if (form.delivery === "deliver" && coverageNote?.includes("Outside")) {
        throw new Error(coverageNote);
      }

      const res = await fetch("/api/hire/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          endDate: form.hireType === "flex" ? undefined : form.endDate,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        paymentData?: Record<string, unknown>;
        bookingRef?: string;
      };
      if (!res.ok || !data.paymentData) {
        throw new Error(data.error || "Could not start payment");
      }

      const ref = data.bookingRef || form.bookingRef;
      update("bookingRef", ref);
      persistRetry(ref);
      openDnaPaymentPage(data.paymentData);
      setSubmitting(false);
    } catch (err) {
      persistRetry();
      setError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="relative space-y-5">
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor="hire-pay-honeypot">Company website</label>
        <input
          id="hire-pay-honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={form.company_website}
          onChange={(e) => update("company_website", e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-primary">
          Book and pay online
        </h2>
        <p className="mt-2 text-sm text-muted">
          Choose your hire, pay securely by card, and we&apos;ll deliver or
          prepare branch collection. No back-and-forth quote needed for standard
          bookings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Hire type</Label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(
              [
                ["short", "Short-term"],
                ["flex", "Flex"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                  form.hireType === id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white text-primary"
                }`}
                onClick={() => update("hireType", id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="categoryId">Equipment</Label>
          <Select
            id="categoryId"
            value={form.categoryId}
            onChange={(e) =>
              update("categoryId", e.target.value as HirePricingCategoryId)
            }
          >
            {HIRE_PRICING_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate">Start date</Label>
          <Input
            id="startDate"
            type="date"
            required
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="endDate">
            {form.hireType === "flex" ? "Minimum term" : "End date"}
          </Label>
          {form.hireType === "flex" ? (
            <Input value="3 months, then rolling" readOnly className="bg-soft" />
          ) : (
            <Input
              id="endDate"
              type="date"
              required
              value={form.endDate}
              onChange={(e) => update("endDate", e.target.value)}
            />
          )}
        </div>
        <div>
          <Label htmlFor="userHeight">User height</Label>
          <Input
            id="userHeight"
            required
            placeholder="e.g. 5ft 6in"
            value={form.userHeight}
            onChange={(e) => update("userHeight", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="userWeight">User weight</Label>
          <Input
            id="userWeight"
            required
            placeholder="e.g. 15 st"
            value={form.userWeight}
            onChange={(e) => update("userWeight", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="delivery">Delivery or collection</Label>
          <Select
            id="delivery"
            value={form.delivery}
            onChange={(e) =>
              update("delivery", e.target.value as HireDeliveryMode)
            }
          >
            <option value="collect_heathrow">
              Collect from Heathrow — free
            </option>
            <option value="collect_ferndown">
              Collect from Ferndown — free
            </option>
            <option value="deliver">
              {form.hireType === "flex"
                ? `Deliver to me — included in ${formatGBP(FLEX_SETUP_FEE_GBP)} set-up`
                : "Deliver to me — from £45 local"}
            </option>
          </Select>
          {coverageNote ? (
            <p className="mt-2 text-sm text-muted">{coverageNote}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="addressLine1">Address line 1</Label>
          <Input
            id="addressLine1"
            required
            autoComplete="address-line1"
            value={form.addressLine1}
            onChange={(e) => update("addressLine1", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="addressLine2">Address line 2 (optional)</Label>
          <Input
            id="addressLine2"
            autoComplete="address-line2"
            value={form.addressLine2}
            onChange={(e) => update("addressLine2", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="city">Town / city</Label>
          <Input
            id="city"
            required
            autoComplete="address-level2"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            required
            className="uppercase"
            autoComplete="postal-code"
            value={form.postcode}
            onChange={(e) => update("postcode", e.target.value.toUpperCase())}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            rows={2}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 border-t border-border pt-4 text-sm leading-relaxed">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[var(--primary)]"
          checked={form.vatRelief}
          onChange={(e) => update("vatRelief", e.target.checked)}
        />
        <span>
          <strong className="text-primary">VAT relief</strong> — tick if this is
          for a disabled person&apos;s personal use.{" "}
          <span className="text-muted">{VAT_RELIEF_DECLARATION}</span>
        </span>
      </label>

      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[var(--primary)]"
          checked={form.termsAccepted}
          onChange={(e) => update("termsAccepted", e.target.checked)}
        />
        <span>
          I agree to the{" "}
          <Link
            href="/hire/terms"
            className="font-semibold text-primary underline underline-offset-2"
            target="_blank"
          >
            hire terms &amp; conditions
          </Link>
          .
        </span>
      </label>

      <div>
        <Label htmlFor="signedName">Type your name to sign</Label>
        <Input
          id="signedName"
          required
          value={form.signedName}
          onChange={(e) => update("signedName", e.target.value)}
          placeholder="Full name as signature"
        />
      </div>

      {quote ? (
        <div className="border border-border bg-soft/50 p-4">
          <h3 className="font-extrabold text-primary">Pay today</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {quote.lineItems.map((line) => (
              <li
                key={line.label}
                className="flex items-baseline justify-between gap-3"
              >
                <span className="text-muted">{line.label}</span>
                <span className="tabular-nums font-semibold text-primary">
                  {formatGBP(line.amount)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex items-baseline justify-between border-t border-border pt-3 text-base font-extrabold text-primary">
            <span>Total</span>
            <span className="tabular-nums">{formatGBP(quote.total)}</span>
          </p>
          {form.hireType === "flex" ? (
            <p className="mt-2 text-xs text-muted">
              Then {formatGBP(quote.category.flexMonthly)} each month in advance.
              Cancel after 3 months with 30 days&apos; notice.
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted">
              Damage deposit is refunded when the equipment comes back as it went
              out.
            </p>
          )}
        </div>
      ) : null}

      {error ? <p className="text-sm text-error">{error}</p> : null}

      <Button
        type="button"
        size="lg"
        variant="buy"
        className="w-full"
        disabled={submitting || !dnaReady || !quote}
        onClick={() => void pay()}
      >
        {submitting
          ? "Starting payment…"
          : quote
            ? `Pay ${formatGBP(quote.total)} and book`
            : "Complete the form to pay"}
      </Button>
      <p className="text-center text-xs text-muted">
        Secure card payment via DNA Payments. Prefer to talk it through?{" "}
        <button
          type="button"
          className="font-semibold text-primary underline"
          onClick={() => router.push("#enquiry-fallback")}
        >
          Send an enquiry instead
        </button>
        .
      </p>
    </div>
  );
}
