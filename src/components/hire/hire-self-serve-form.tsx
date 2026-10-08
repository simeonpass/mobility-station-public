"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
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
  lockHireType = false,
}: {
  defaultHireType?: HireType;
  /** Hide the short/Flex switch when this page is for one product only. */
  lockHireType?: boolean;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current !== step) {
      stepHeading.current?.focus({ preventScroll: true });
      stepHeading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    previousStep.current = step;
  }, [step]);
  const { ready: dnaReady, failed: dnaFailed } = useDnaPaymentsSdk();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryMiles, setDeliveryMiles] = useState<number | null>(null);
  const [coveragePostcode, setCoveragePostcode] = useState<string | null>(null);
  const [coverageNote, setCoverageNote] = useState<string | null>(null);
  const [form, setForm] = useState<HireFormState>(() => {
    const saved = readRetryForm(defaultHireType);
    return lockHireType ? { ...saved, hireType: defaultHireType } : saved;
  });

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
        if (ctrl.signal.aborted) return;
        startTransition(() => {
          setCoveragePostcode(form.postcode.trim().toUpperCase());
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

  const quoteResult: { quote: HireQuote | null; error: string | null } = useMemo(() => {
    try {
      if (!form.startDate) return { quote: null, error: null };
      if (form.hireType === "short" && !form.endDate) return { quote: null, error: null };
      return { quote: buildHireQuote({
        hireType: form.hireType,
        categoryId: form.categoryId,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        delivery: form.delivery,
        deliveryMiles,
        vatRelief: form.vatRelief,
      }), error: null };
    } catch (error) {
      return { quote: null, error: error instanceof Error ? error.message : "Please check your dates." };
    }
  }, [form, deliveryMiles]);

  const quote = quoteResult.quote;
  const deliveryReady = form.delivery !== "deliver" || (deliveryMiles !== null && coveragePostcode === form.postcode.trim().toUpperCase());

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
      if (!form.termsAccepted || form.signedName.trim().length < 2) throw new Error("Please read and accept the hire terms, then type your name to sign.");
      if (!deliveryReady) throw new Error("Please check your delivery postcode or choose branch collection.");
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
    <form className="relative space-y-5" onSubmit={(event) => {
      event.preventDefault();
      if (step === 1) {
        if (!quote || !deliveryReady) { setError(quoteResult.error || "Please complete your dates and check delivery before continuing."); return; }
        setError(null); setStep(2);
      } else { void pay(); }
    }}>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden="true"><label htmlFor="hire-pay-honeypot">Company website</label><input id="hire-pay-honeypot" tabIndex={-1} autoComplete="off" value={form.company_website} onChange={event=>update("company_website",event.target.value)} /></div>
      <ol className="ms-hire-steps" aria-label="Booking progress"><li aria-current={step===1 ? "step" : undefined}>1. Equipment &amp; dates</li><li aria-current={step===2 ? "step" : undefined}>2. Your details &amp; payment</li></ol>
      <h2 ref={stepHeading} tabIndex={-1} className="ms-hire-step-title outline-none">{step===1 ? "What would you like to hire?" : "Your details & payment"}</h2>
      <p className="text-base leading-relaxed text-muted">{step===1 ? "Choose your equipment and dates to see the price." : "Tell us who the equipment is for and check your booking before paying."}</p>
      <fieldset className="ms-hire-fieldset space-y-5" hidden={step!==1} disabled={step!==1 || submitting}>
        <legend className="sr-only">Equipment and dates</legend>
        {!lockHireType ? <div><Label htmlFor="hire-type">Hire period</Label><Select id="hire-type" value={form.hireType} onChange={event=>update("hireType",event.target.value as HireType)}><option value="short">3–28 days</option><option value="flex">3 months or more</option></Select></div> : null}
        <div><Label htmlFor="categoryId">Equipment</Label><Select id="categoryId" value={form.categoryId} onChange={event=>update("categoryId",event.target.value as HirePricingCategoryId)}>{HIRE_PRICING_CATEGORIES.map(category=><option key={category.id} value={category.id}>{category.label}</option>)}</Select></div>
        <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="startDate">Start date</Label><Input id="startDate" type="date" required value={form.startDate} onChange={event=>update("startDate",event.target.value)} /></div><div><Label htmlFor="endDate">{form.hireType==="flex" ? "Minimum hire period" : "End date"}</Label>{form.hireType==="flex" ? <Input id="endDate" value="3 months, then monthly" readOnly /> : <Input id="endDate" type="date" required min={form.startDate || undefined} value={form.endDate} onChange={event=>update("endDate",event.target.value)} />}</div></div>
        <div><Label htmlFor="delivery">Delivery or collection</Label><Select id="delivery" value={form.delivery} onChange={event=>update("delivery",event.target.value as HireDeliveryMode)}><option value="collect_heathrow">Collect from Heathrow — free</option><option value="collect_ferndown">Collect from Ferndown — free</option><option value="deliver">{form.hireType==="flex" ? `Delivery included in ${formatGBP(FLEX_SETUP_FEE_GBP)} set-up` : "Delivery — check my postcode"}</option></Select></div>
        {form.delivery==="deliver" ? <div><Label htmlFor="hire-delivery-postcode">Delivery postcode</Label><Input id="hire-delivery-postcode" autoComplete="postal-code" required value={form.postcode} onChange={event=>update("postcode",event.target.value.toUpperCase())} /><p className="mt-2 text-sm text-muted" role="status">{coverageNote || "Enter your postcode to check delivery availability and cost."}</p></div> : null}
        {form.hireType==="flex" ? <p className="text-sm text-muted">Monthly hire has a 3-month minimum and a {formatGBP(FLEX_SETUP_FEE_GBP)} set-up fee before VAT.</p> : null}
      </fieldset>
      <fieldset className="ms-hire-fieldset space-y-5" hidden={step!==2} disabled={step!==2 || submitting}>
        <legend className="sr-only">Your contact details and hire agreement</legend>
        <div className="rounded border border-border bg-white p-4 text-sm leading-relaxed"><strong>{quote?.category.label}</strong><br />{form.startDate}{form.hireType==="short" ? ` to ${form.endDate}` : " · Monthly hire (Flex), 3-month minimum"}<br />{form.delivery==="deliver" ? "Delivery to your address" : form.delivery==="collect_heathrow" ? "Collect from Heathrow" : "Collect from Ferndown"}<button type="button" className="mt-2 block min-h-11 font-semibold text-primary underline" onClick={()=>{setStep(1);setError(null);}}>Change equipment or dates</button></div>
        <div className="grid gap-5 sm:grid-cols-2">
          {([
            ["name", "Full name", "name", "text"], ["phone", "Phone number", "tel", "tel"], ["email", "Email address", "email", "email"],
            ["addressLine1", "Address", "address-line1", "text"], ["city", "Town / city", "address-level2", "text"], ["postcode", "Postcode", "postal-code", "text"],
          ] as const).map(([key,label,autoComplete,type])=><div key={key} className={key==="email" || key==="addressLine1" ? "sm:col-span-2" : undefined}><Label htmlFor={`hire-${key}`}>{label}</Label><Input id={`hire-${key}`} required type={type} autoComplete={autoComplete} value={form[key]} onChange={event=>update(key,key==="postcode" ? event.target.value.toUpperCase() : event.target.value)} /></div>)}
          <div><Label htmlFor="userHeight">Equipment user’s height</Label><Input id="userHeight" required placeholder="e.g. 5ft 6in" value={form.userHeight} onChange={event=>update("userHeight",event.target.value)} /></div>
          <div><Label htmlFor="userWeight">Equipment user’s weight</Label><Input id="userWeight" required placeholder="e.g. 15 st" value={form.userWeight} onChange={event=>update("userWeight",event.target.value)} /></div>
        </div>
        <p className="text-sm text-muted">Height and weight help us match suitable equipment. Your address is needed for the hire agreement, including branch collections.</p>
        <details><summary className="cursor-pointer py-2 font-semibold">Add address details or a note (optional)</summary><div className="mt-3 space-y-4"><div><Label htmlFor="addressLine2">Address line 2</Label><Input id="addressLine2" autoComplete="address-line2" value={form.addressLine2} onChange={event=>update("addressLine2",event.target.value)} /></div><div><Label htmlFor="notes">Notes</Label><Textarea id="notes" rows={2} maxLength={2000} value={form.notes} onChange={event=>update("notes",event.target.value)} /></div></div></details>
        <label className="flex items-start gap-3 border-t border-border pt-5 text-sm leading-relaxed"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[var(--primary)]" checked={form.vatRelief} onChange={event=>update("vatRelief",event.target.checked)} /><span><strong>Apply VAT relief</strong><br />{VAT_RELIEF_DECLARATION}</span></label>
        <label className="flex items-start gap-3 text-sm leading-relaxed"><input type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-[var(--primary)]" checked={form.termsAccepted} onChange={event=>update("termsAccepted",event.target.checked)} /><span>I agree to the <Link href="/hire/terms" target="_blank" className="font-semibold underline">hire terms &amp; conditions</Link>.</span></label>
        <div><Label htmlFor="signedName">Type your full name to sign</Label><Input id="signedName" required minLength={2} value={form.signedName} onChange={event=>update("signedName",event.target.value)} /></div>
      </fieldset>
      {quote ? <div className="ms-hire-quote" aria-live="polite"><h3 className="text-xl font-semibold">{step===1 ? "Your price" : "Pay today"}</h3><ul className="mt-3 space-y-2 text-sm">{quote.lineItems.map(line=><li key={line.label} className="flex justify-between gap-4"><span className="text-muted">{line.label}</span><span className="shrink-0 tabular-nums font-semibold">{formatGBP(line.amount)}</span></li>)}</ul><p className="mt-4 flex justify-between border-t border-border pt-3 text-xl font-semibold"><span>Total</span><span>{formatGBP(quote.total)}</span></p><p className="mt-3 text-sm leading-relaxed text-muted">{form.hireType==="flex" ? `Then ${formatGBP(quote.category.flexMonthly * (form.vatRelief ? 1 : 1.2))} each month${form.vatRelief ? " with VAT relief" : " including VAT"}. Three-month minimum, then monthly.` : "Includes your refundable damage deposit."}{step===1 ? " Eligible for VAT relief? You can apply it in the next step." : ""}</p>{form.delivery==="deliver" && !deliveryReady ? <p className="mt-2 text-sm text-muted">Delivery charge is an estimate until your postcode is checked.</p> : null}</div> : null}
      {quoteResult.error ? <p role="alert" className="text-sm text-error">{quoteResult.error}</p> : null}
      {error ? <p role="alert" className="text-sm text-error">{error}</p> : null}
      <Button type="submit" size="lg" variant="buy" className="w-full" disabled={submitting || (step===2 && (!dnaReady || !quote || !deliveryReady))}>{step===1 ? "Continue to your details →" : submitting ? "Starting payment…" : quote ? `Pay ${formatGBP(quote.total)} and book` : "Check your booking details"}</Button>
      {step===2 && dnaFailed ? <p role="alert" className="text-sm text-error">Card payments could not load. Please refresh or call us.</p> : null}
      <p className="text-sm text-center text-muted">{step===1 ? "No payment until you review your booking." : "Secure card payment. You’ll review your card details next."}</p>
    </form>
  );
}
