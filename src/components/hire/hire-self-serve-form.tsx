"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState, useRef, type FormEvent, type InputHTMLAttributes } from "react";
import { CatalogImage } from "@/components/product/catalog-image";
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
  images,
}: {
  defaultHireType?: HireType;
  images?: Partial<Record<HirePricingCategoryId, { src: string | null; alt: string }>>;
  /** Hide the short/Flex switch when this page is for one product only. */
  lockHireType?: boolean;
}) {
  const { ready: dnaReady, failed: dnaFailed } = useDnaPaymentsSdk();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryMiles, setDeliveryMiles] = useState<number | null>(null);
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


  const [step, setStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const selectedCategory = HIRE_PRICING_CATEGORIES.find(c => c.id === form.categoryId) ?? HIRE_PRICING_CATEGORIES[0];
  const selectedImage = images?.[selectedCategory.id];
  const steps = ["Equipment", "Your details", "Collection / delivery", "Review"];
  const today = new Date();
  const minDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");

  function goTo(next: number) {
    setStep(next);
    setError(null);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 0 && !quote) {
      try {
        buildHireQuote({ hireType: form.hireType, categoryId: form.categoryId, startDate: form.startDate, endDate: form.endDate, delivery: "collect_heathrow", vatRelief: form.vatRelief });
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Please check your dates.");
      }
      return;
    }
    if (step === 1) {
      const digits = form.phone.replace(/\D/g, "");
      if (!/^[\d\s+()-]{10,20}$/.test(form.phone) || !(digits.startsWith("0") && digits.length >= 10 || digits.startsWith("44") && digits.length >= 12)) { setError("Please enter a valid UK phone number starting with 0 or +44."); return; }
    }
    if (step === 2 && form.delivery === "deliver" && deliveryMiles == null) {
      setError(coverageNote || "Please wait while we check delivery to your postcode. If it cannot be checked, choose collection or contact us.");
      return;
    }
    if (step < 3) goTo(step + 1);
    else void pay();
  }

  function field(key: "name" | "email" | "phone" | "userHeight" | "userWeight" | "addressLine1" | "addressLine2" | "city" | "postcode", label: string, options: InputHTMLAttributes<HTMLInputElement> = {}) {
    return <div key={key}><Label htmlFor={key}>{label}</Label><Input id={key} name={key} required={key !== "addressLine2"} {...options} value={form[key]} onChange={e => update(key, key === "postcode" ? e.target.value.toUpperCase() : e.target.value)} /></div>;
  }

  return (
    <form onSubmit={advance} className="ms-hire-booking">
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor="hire-pay-honeypot">Company website</label>
        <input id="hire-pay-honeypot" tabIndex={-1} autoComplete="off" value={form.company_website} onChange={e => update("company_website", e.target.value)} />
      </div>
      <ol className="ms-hire-steps" aria-label="Booking progress">{steps.map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined}><span>{index + 1}</span>{label}</li>)}</ol>
      <h2 ref={headingRef} tabIndex={-1} className="mt-7 text-2xl font-semibold outline-none">{steps[step]}</h2>

      {step === 0 && <div className="mt-6 grid gap-8 md:grid-cols-[1fr_0.8fr]">
        <div className="space-y-5">
          {!lockHireType && <div><Label htmlFor="hireType">Hire type</Label><Select id="hireType" value={form.hireType} onChange={e => update("hireType", e.target.value as HireType)}><option value="short">Short-term</option><option value="flex">Flex monthly</option></Select></div>}
          <div><Label htmlFor="categoryId">Choose your equipment</Label><Select id="categoryId" value={form.categoryId} onChange={e => update("categoryId", e.target.value as HirePricingCategoryId)}>
            <optgroup label="Mobility scooters">{HIRE_PRICING_CATEGORIES.filter(c => c.id.includes("scooter")).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</optgroup>
            <optgroup label="Wheelchairs">{HIRE_PRICING_CATEGORIES.filter(c => !c.id.includes("scooter")).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</optgroup>
          </Select></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="startDate">Start date</Label><Input id="startDate" type="date" required min={minDate} value={form.startDate} onChange={e => update("startDate", e.target.value)} /></div>
            {form.hireType === "short" && <div><Label htmlFor="endDate">End date</Label><Input id="endDate" type="date" required min={form.startDate || minDate} value={form.endDate} onChange={e => update("endDate", e.target.value)} /></div>}
          </div>
          <p className="text-sm text-muted">{form.hireType === "flex" ? "Three months minimum, then monthly. Delivery and handover are included in the set-up fee." : "Hire for 3–28 days. Collect free from either branch or choose delivery later."}</p>
        </div>
        <aside className="ms-hire-selection" aria-live="polite">
          {selectedImage?.src && <CatalogImage src={selectedImage.src} alt={selectedImage.alt} className="h-36 w-full object-contain" />}
          <p className="mt-3 text-sm text-muted">For users {selectedCategory.userWeight}. Image shows an example model.</p>
          <p className="mt-4 text-3xl font-semibold">{formatGBP(form.hireType === "flex" ? selectedCategory.flexMonthly : quote?.hireChargeExVat ?? selectedCategory.threeDay)}<span className="ml-2 text-sm font-normal text-muted">{form.hireType === "flex" ? "/ month" : quote ? "for " + quote.days + " days" : "for 3 days"}</span></p>
          <p className="mt-2 text-sm text-muted">{form.hireType === "flex" ? "+ " + formatGBP(FLEX_SETUP_FEE_GBP) + " one-off set-up" : "+ " + formatGBP(selectedCategory.deposit) + " refundable deposit"}. Prices before VAT.</p>
          <p className="mt-2 text-sm text-muted">VAT relief can be selected at review if you qualify.</p>
        </aside>
      </div>}

      {step === 1 && <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {field("name", "Full name", { autoComplete: "name", minLength: 2 })}
        {field("phone", "Phone", { type: "tel", autoComplete: "tel", minLength: 10, maxLength: 20 })}
        {field("email", "Email", { type: "email", autoComplete: "email" })}
        {field("userHeight", "Equipment user's height", { placeholder: "e.g. 5ft 6in" })}
        {field("userWeight", "Equipment user's weight", { placeholder: "e.g. 15 st" })}
        <p className="self-center text-sm text-muted">These measurements help us match suitable equipment.</p>
      </div>}

      {step === 2 && <div className="mt-6 space-y-5">
        <div><Label htmlFor="delivery">How would you like to receive it?</Label><Select id="delivery" value={form.delivery} onChange={e => update("delivery", e.target.value as HireDeliveryMode)}>
          <option value="collect_heathrow">Collect from Heathrow</option><option value="collect_ferndown">Collect from Ferndown</option>
          <option value="deliver">{form.hireType === "flex" ? "Delivery — included in set-up" : "Delivery — from £45 before VAT"}</option>
        </Select></div>
        <p className="text-sm text-muted">{form.delivery === "deliver" ? "Enter the delivery address. We’ll check your area before you continue." : "Your address is needed for the hire agreement, even when collecting."}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("addressLine1", "Address line 1", { autoComplete: "address-line1", minLength: 2 })}
          {field("addressLine2", "Address line 2 (optional)", { autoComplete: "address-line2" })}
          {field("city", "Town / city", { autoComplete: "address-level2", minLength: 2 })}
          {field("postcode", "Postcode", { autoComplete: "postal-code", pattern: "(?:GIR ?0AA|[A-Za-z]{1,2}[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2})", title: "Enter a valid UK postcode" })}
        </div>
        {coverageNote && <p role="status" className="text-sm text-muted">{coverageNote}</p>}
        <details><summary className="cursor-pointer text-sm font-semibold">Add a note (optional)</summary><Label htmlFor="notes" className="mt-3">Anything else we should know?</Label><Textarea id="notes" rows={2} maxLength={2000} value={form.notes} onChange={e => update("notes", e.target.value)} /></details>
      </div>}

      {step === 3 && <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <p className="text-sm text-muted">{selectedCategory.label}<br />From {form.startDate}{form.hireType === "short" ? " to " + form.endDate : " · three months minimum"}<br />{form.name} · {form.email}</p>
          <label className="flex cursor-pointer items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 shrink-0" checked={form.vatRelief} onChange={e => update("vatRelief", e.target.checked)} /><span><strong>Claim VAT relief</strong><span className="mt-2 block text-muted">{VAT_RELIEF_DECLARATION}</span></span></label>
          <label className="flex items-start gap-3 text-sm"><input type="checkbox" required className="mt-1 h-4 w-4 shrink-0" checked={form.termsAccepted} onChange={e => update("termsAccepted", e.target.checked)} /><span>I agree to the <Link href="/hire/terms" target="_blank" className="underline">hire terms &amp; conditions</Link>.</span></label>
          <div><Label htmlFor="signedName">Type your full name to sign</Label><Input id="signedName" required minLength={2} value={form.signedName} onChange={e => update("signedName", e.target.value)} /></div>
        </div>
        {quote && <div className="ms-hire-selection">
          <h3 className="text-xl font-semibold">Your total today</h3>
          <ul className="mt-4 space-y-3 text-sm">{quote.lineItems.map(line => <li key={line.label} className="flex justify-between gap-5"><span className="text-muted">{line.label}</span><strong className="shrink-0">{formatGBP(line.amount)}</strong></li>)}</ul>
          <p className="mt-5 flex justify-between border-t border-border pt-4 text-2xl font-semibold"><span>Total</span><span>{formatGBP(quote.total)}</span></p>
          <p className="mt-4 text-sm text-muted">{form.hireType === "flex" ? "Then " + formatGBP(quote.category.flexMonthly * (form.vatRelief ? 1 : 1.2)) + " each month in advance. Three months minimum, then monthly." : "Your damage deposit is refundable when the equipment is returned in good condition."}</p>
        </div>}
      </div>}

      {error && <p role="alert" className="mt-5 text-sm text-error">{error}</p>}
      {step === 3 && !dnaReady && <p role="status" className="mt-5 text-sm text-muted">{dnaFailed ? "Card payments could not load. Please refresh or contact us to arrange your hire." : "Loading secure card payments…"}</p>}
      <div className="mt-7 flex items-center gap-4">
        {step > 0 && <button type="button" className="ms-text-link" disabled={submitting} onClick={() => goTo(step - 1)}>Back</button>}
        <Button type="submit" size="lg" disabled={submitting || (step === 3 && (!dnaReady || !quote))} className="ml-auto">
          {step < 3 ? "Continue →" : submitting ? "Opening secure payment…" : "Pay " + formatGBP(quote?.total ?? 0) + " & book"}
        </Button>
      </div>
      <p className="mt-5 text-sm text-muted">Need help choosing? <Link href={"/contact?interest=" + encodeURIComponent(form.hireType === "flex" ? "Flex monthly hire" : "Short-term hire") + "&mode=callback#enquire"} className="font-semibold underline">Ask us to call you</Link>.</p>
    </form>
  );
}
