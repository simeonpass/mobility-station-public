"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useDnaPaymentsSdk } from "@/hooks/use-dna-payments-sdk";
import { openDnaPaymentPage } from "@/lib/dna-payments";
import {
  DEMO_RETRY_STORAGE_KEY,
  HOME_DEMO_FEE_GBP,
  HOME_DEMO_LEAD_COPY,
  PWSS_LABEL,
  TIME_WINDOWS,
  calculateDemoFee,
  createBookingRef,
  earliestPreferredDate,
  isPwssEligible,
  leadClearDaysForLocation,
  toIsoDate,
  type CustomerType,
  type DemoBranch,
  type DemoLocation,
  type DemoProductCategory,
  type ScooterWheelchairKind,
  type TimeWindowId,
} from "@/lib/demo-booking";
import { formatGBP } from "@/lib/products";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type FormState = {
  productCategory: DemoProductCategory | "";
  scooterWheelchairKind: ScooterWheelchairKind | "";
  location: DemoLocation | "";
  branch: DemoBranch | "";
  customerType: CustomerType | "";
  pwss: boolean;
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  productName: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleReg: string;
  notes: string;
  preferredDate: string;
  preferredTime: TimeWindowId | "";
  company_website: string;
};

const initialForm: FormState = {
  productCategory: "",
  scooterWheelchairKind: "",
  location: "",
  branch: "",
  customerType: "",
  pwss: false,
  name: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postcode: "",
  productName: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleReg: "",
  notes: "",
  preferredDate: "",
  preferredTime: "",
  company_website: "",
};

const STEPS: { id: Step; title: string }[] = [
  { id: 1, title: "What are you demoing?" },
  { id: 2, title: "Where?" },
  { id: 3, title: "Customer type" },
  { id: 4, title: "Your details" },
  { id: 5, title: "Date & time" },
  { id: 6, title: "Payment" },
];

function optionClass(active: boolean) {
  return `w-full rounded-md border px-4 py-3 text-left text-sm font-semibold transition-colors ${
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-white text-primary hover:border-primary/40 hover:bg-soft"
  }`;
}

export function DemoBookingForm({
  defaultProductName = "",
  defaultCategory,
}: {
  defaultProductName?: string;
  defaultCategory?: DemoProductCategory;
}) {
  const router = useRouter();
  const { ready: dnaReady, failed: dnaFailed } = useDnaPaymentsSdk();
  const [step, setStep] = useState<Step>(defaultCategory ? 2 : 1);
  const [form, setForm] = useState<FormState>(() => ({
    ...initialForm,
    productName: defaultProductName,
    productCategory: defaultCategory ?? "",
  }));
  const [bookingRef, setBookingRef] = useState(() => createBookingRef());
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DEMO_RETRY_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        bookingRef?: string;
        form?: FormState;
      };
      startTransition(() => {
        if (saved.form) setForm({ ...initialForm, ...saved.form });
        if (saved.bookingRef) setBookingRef(saved.bookingRef);
        setStep(6);
      });
    } catch {
      /* ignore corrupt retry payload */
    }
  }, []);

  const fee = useMemo(() => {
    if (!form.location || !form.productCategory || !form.customerType) {
      return null;
    }
    return calculateDemoFee({
      location: form.location,
      productCategory: form.productCategory,
      customerType: form.customerType,
      scooterWheelchairKind: form.scooterWheelchairKind || undefined,
      pwss: form.pwss,
    });
  }, [form]);

  const minDate = useMemo(() => {
    if (!form.location) return "";
    return toIsoDate(
      earliestPreferredDate(leadClearDaysForLocation(form.location)),
    );
  }, [form.location]);

  const showPwss =
    form.productCategory === "scooter_wheelchair" &&
    form.customerType === "motability" &&
    isPwssEligible({
      productCategory: "scooter_wheelchair",
      customerType: "motability",
      scooterWheelchairKind: form.scooterWheelchairKind || undefined,
    });

  const requiresPayment = Boolean(fee && fee.amountGbp > 0);
  const visibleSteps = requiresPayment || step === 6 ? STEPS : STEPS.slice(0, 5);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "productCategory") {
        next.scooterWheelchairKind = "";
        next.pwss = false;
        if (value === "scooter_wheelchair" && !prev.productName) {
          /* keep empty for user input */
        }
      }
      if (key === "scooterWheelchairKind") next.pwss = false;
      if (key === "customerType" && value !== "motability") next.pwss = false;
      if (key === "location" && value === "home") next.branch = "";
      if (key === "location") next.preferredDate = "";
      return next;
    });
    setError(null);
    setFieldErrors({});
  }

  function validateStep(current: Step): string | null {
    if (current === 1) {
      if (!form.productCategory) return "Please choose what you are demoing.";
      if (
        form.productCategory === "scooter_wheelchair" &&
        !form.scooterWheelchairKind
      ) {
        return "Please choose scooter or wheelchair type.";
      }
    }
    if (current === 2) {
      if (!form.location) return "Please choose branch or home.";
      if (form.location === "branch" && !form.branch) {
        return "Please choose Heathrow or Ferndown.";
      }
    }
    if (current === 3) {
      if (!form.customerType) return "Please choose Private or Motability.";
    }
    if (current === 4) {
      if (!form.name.trim()) return "Please enter your name.";
      if (!form.phone.trim()) return "Please enter your phone number.";
      if (!form.email.trim()) return "Please enter your email.";
      if (!form.addressLine1.trim()) return "Please enter your address.";
      if (!form.city.trim()) return "Please enter your town / city.";
      if (!form.postcode.trim()) return "Please enter your postcode.";
      if (!form.productName.trim()) return "Please enter the product of interest.";
      if (form.productCategory === "vehicle_adaptation") {
        if (!form.vehicleMake.trim()) return "Please enter the vehicle make.";
        if (!form.vehicleModel.trim()) return "Please enter the vehicle model.";
      }
    }
    if (current === 5) {
      if (!form.preferredDate) return "Please choose a preferred date.";
      if (!form.preferredTime) return "Please choose a time window.";
    }
    return null;
  }

  function goNext() {
    const message = validateStep(step);
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    if (step === 5 && !requiresPayment) {
      void submitBooking(false);
      return;
    }
    setStep((s) => Math.min(6, s + 1) as Step);
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(1, s - 1) as Step);
  }

  function buildPayload() {
    return {
      productCategory: form.productCategory,
      scooterWheelchairKind: form.scooterWheelchairKind || undefined,
      location: form.location,
      branch: form.branch || undefined,
      customerType: form.customerType,
      pwss: form.pwss,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim() || undefined,
      city: form.city.trim(),
      postcode: form.postcode.trim(),
      productName: form.productName.trim(),
      vehicleMake: form.vehicleMake.trim() || undefined,
      vehicleModel: form.vehicleModel.trim() || undefined,
      vehicleReg: form.vehicleReg.trim() || undefined,
      notes: form.notes.trim() || undefined,
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime,
      company_website: form.company_website,
      bookingRef,
    };
  }

  function persistRetry() {
    try {
      sessionStorage.setItem(
        DEMO_RETRY_STORAGE_KEY,
        JSON.stringify({ bookingRef, form, step: 6 }),
      );
    } catch {
      /* private mode */
    }
  }

  async function submitBooking(withPayment: boolean) {
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      const payload = buildPayload();
      const bookRes = await fetch("/api/demo/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const bookData = (await bookRes.json()) as {
        success?: boolean;
        error?: string;
        errors?: Record<string, string[]>;
        bookingRef?: string;
        requiresPayment?: boolean;
        paymentData?: Record<string, unknown>;
      };

      if (!bookRes.ok || bookData.success === false) {
        if (bookData.errors) setFieldErrors(bookData.errors);
        throw new Error(bookData.error || "Could not submit booking");
      }

      const ref = bookData.bookingRef || bookingRef;
      setBookingRef(ref);

      if (!withPayment || !bookData.requiresPayment) {
        try {
          sessionStorage.removeItem(DEMO_RETRY_STORAGE_KEY);
        } catch {
          /* ignore */
        }
        router.push(
          `/book-a-demo/thank-you?ref=${encodeURIComponent(ref)}&payment=waived`,
        );
        return;
      }

      persistRetry();

      let paymentData = bookData.paymentData;
      if (!paymentData) {
        if (!dnaReady) {
          throw new Error(
            dnaFailed
              ? "Card payments could not load. Please refresh and try again, or call 0800 772 3870."
              : "Card payments are still loading — try again in a moment.",
          );
        }
        const payRes = await fetch("/api/demo/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, bookingRef: ref }),
        });
        const payData = (await payRes.json()) as {
          paymentData?: Record<string, unknown>;
          error?: string;
        };
        if (!payRes.ok || !payData.paymentData) {
          throw new Error(
            payData.error ||
              "Payment could not be started. Your booking is saved as payment pending — use Pay again to retry.",
          );
        }
        paymentData = payData.paymentData;
      }

      openDnaPaymentPage(paymentData);
      setSubmitting(false);
    } catch (err) {
      persistRetry();
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="relative space-y-6">
      {/* Honeypot — backend spam filter relies on company_website */}
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company_website}
          onChange={(e) => update("company_website", e.target.value)}
        />
      </div>

      <ol className="flex flex-wrap gap-2" aria-label="Booking steps">
        {visibleSteps.map((s) => (
          <li
            key={s.id}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
              s.id === step
                ? "bg-primary text-primary-foreground"
                : s.id < step
                  ? "bg-accent/30 text-primary"
                  : "bg-soft text-muted"
            }`}
          >
            {s.id}. {s.title}
          </li>
        ))}
      </ol>

      {step === 1 ? (
        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-primary">
            What are you demoing?
          </h2>
          <button
            type="button"
            className={optionClass(form.productCategory === "vehicle_adaptation")}
            onClick={() => update("productCategory", "vehicle_adaptation")}
          >
            Vehicle adaptation
          </button>
          <button
            type="button"
            className={optionClass(form.productCategory === "scooter_wheelchair")}
            onClick={() => update("productCategory", "scooter_wheelchair")}
          >
            Scooter &amp; wheelchair
          </button>
          {form.productCategory === "scooter_wheelchair" ? (
            <div className="pt-2">
              <Label htmlFor="kind">Equipment type</Label>
              <Select
                id="kind"
                value={form.scooterWheelchairKind}
                onChange={(e) =>
                  update(
                    "scooterWheelchairKind",
                    e.target.value as ScooterWheelchairKind | "",
                  )
                }
              >
                <option value="">Select…</option>
                <option value="scooter">Scooter</option>
                <option value="powered_wheelchair">Powered wheelchair</option>
                <option value="manual_wheelchair">Manual wheelchair</option>
              </Select>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-primary">Where?</h2>
          <button
            type="button"
            className={optionClass(form.location === "branch")}
            onClick={() => update("location", "branch")}
          >
            Our branch — free
          </button>
          <button
            type="button"
            className={optionClass(form.location === "home")}
            onClick={() => update("location", "home")}
          >
            Your home — {formatGBP(HOME_DEMO_FEE_GBP)}
          </button>
          {form.location === "branch" ? (
            <div className="pt-2">
              <Label htmlFor="branch">Which branch?</Label>
              <Select
                id="branch"
                value={form.branch}
                onChange={(e) =>
                  update("branch", e.target.value as DemoBranch | "")
                }
              >
                <option value="">Select…</option>
                <option value="heathrow">Heathrow</option>
                <option value="ferndown">Ferndown</option>
              </Select>
            </div>
          ) : null}
          {form.location === "home" ? (
            <p className="text-sm text-muted">
              The {formatGBP(HOME_DEMO_FEE_GBP)} fee is non-refundable but is
              deducted in full from your purchase price if you go ahead.
            </p>
          ) : null}
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-primary">Customer type</h2>
          <button
            type="button"
            className={optionClass(form.customerType === "private")}
            onClick={() => update("customerType", "private")}
          >
            Private
          </button>
          <button
            type="button"
            className={optionClass(form.customerType === "motability")}
            onClick={() => update("customerType", "motability")}
          >
            Motability
          </button>
          {showPwss ? (
            <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-md border border-border bg-soft/60 p-4 text-sm leading-relaxed">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[var(--primary)]"
                checked={form.pwss}
                onChange={(e) => update("pwss", e.target.checked)}
              />
              <span>{PWSS_LABEL}</span>
            </label>
          ) : null}
          {fee ? (
            <p className="text-sm font-semibold text-primary">
              Demo fee:{" "}
              {fee.amountGbp > 0
                ? formatGBP(fee.amountGbp)
                : fee.waived
                  ? "£0 (PWSS waived)"
                  : "Free"}
            </p>
          ) : null}
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-primary">Your details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
              {fieldErrors.name ? (
                <p className="mt-1 text-xs text-error">{fieldErrors.name[0]}</p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
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
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="addressLine1">Address line 1</Label>
              <Input
                id="addressLine1"
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
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                autoComplete="postal-code"
                value={form.postcode}
                onChange={(e) => update("postcode", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="productName">Product of interest</Label>
              <Input
                id="productName"
                value={form.productName}
                onChange={(e) => update("productName", e.target.value)}
              />
            </div>
            {form.productCategory === "vehicle_adaptation" ? (
              <>
                <div>
                  <Label htmlFor="vehicleMake">Vehicle make</Label>
                  <Input
                    id="vehicleMake"
                    value={form.vehicleMake}
                    onChange={(e) => update("vehicleMake", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleModel">Vehicle model</Label>
                  <Input
                    id="vehicleModel"
                    value={form.vehicleModel}
                    onChange={(e) => update("vehicleModel", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="vehicleReg">Registration (optional)</Label>
                  <Input
                    id="vehicleReg"
                    value={form.vehicleReg}
                    onChange={(e) => update("vehicleReg", e.target.value)}
                  />
                </div>
              </>
            ) : null}
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
              />
            </div>
          </div>
        </div>
      ) : null}

      {step === 5 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-primary">
            Requested date &amp; time
          </h2>
          {form.location === "home" ? (
            <p className="text-sm leading-relaxed text-muted">
              {HOME_DEMO_LEAD_COPY}
            </p>
          ) : (
            <p className="text-sm text-muted">
              Branch demos need at least 2 days&apos; notice. Weekends are not
              available.
            </p>
          )}
          <div>
            <Label htmlFor="preferredDate">Preferred date</Label>
            <Input
              id="preferredDate"
              type="date"
              min={minDate}
              value={form.preferredDate}
              onChange={(e) => {
                const value = e.target.value;
                if (!value) {
                  update("preferredDate", "");
                  return;
                }
                const day = new Date(`${value}T12:00:00`).getDay();
                if (day === 0 || day === 6) {
                  setError("Please choose a weekday (Monday–Friday).");
                  return;
                }
                update("preferredDate", value);
              }}
            />
          </div>
          <div>
            <Label htmlFor="preferredTime">Time window</Label>
            <Select
              id="preferredTime"
              value={form.preferredTime}
              onChange={(e) =>
                update("preferredTime", e.target.value as TimeWindowId | "")
              }
            >
              <option value="">Select…</option>
              {TIME_WINDOWS.map((window) => (
                <option key={window.id} value={window.id}>
                  {window.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      ) : null}

      {step === 6 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-primary">Payment</h2>
          <p className="text-sm leading-relaxed text-foreground/85">
            Pay the{" "}
            <strong className="text-foreground">
              {formatGBP(HOME_DEMO_FEE_GBP)} home demonstration fee
            </strong>{" "}
            securely by card. It is non-refundable, but deducted in full from
            your price if you go ahead.
          </p>
          <p className="rounded-md bg-soft px-4 py-3 text-sm text-muted">
            Line item: Home Demonstration Fee
            {form.preferredDate
              ? ` — ${new Date(`${form.preferredDate}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
              : ""}
          </p>
          {!dnaReady && !dnaFailed ? (
            <p className="text-sm text-muted">Loading secure card payment…</p>
          ) : null}
          {dnaFailed ? (
            <p className="text-sm text-error">
              Card payments could not load. Refresh the page or call 0800 772
              3870.
            </p>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="text-sm text-error">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={submitting}
          >
            Back
          </Button>
        ) : null}
        {step < 6 || (step === 5 && !requiresPayment) ? (
          <Button
            type="button"
            size="lg"
            onClick={goNext}
            disabled={submitting}
            className="min-w-40"
          >
            {submitting
              ? "Sending…"
              : step === 5 && !requiresPayment
                ? "Confirm booking"
                : "Continue"}
          </Button>
        ) : null}
        {step === 6 ? (
          <Button
            type="button"
            size="lg"
            variant="buy"
            disabled={submitting || !dnaReady}
            className="min-w-48"
            onClick={() => void submitBooking(true)}
          >
            {submitting
              ? "Starting payment…"
              : `Pay ${formatGBP(HOME_DEMO_FEE_GBP)}`}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
