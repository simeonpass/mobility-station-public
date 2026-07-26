"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { SignaturePad } from "@/components/hire/signature-pad";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { HIRE_TERMS } from "@/lib/hire-terms";
import { formatGBP } from "@/lib/products";
import { lookupCoverage, type CoverageResult } from "@/lib/service-area";

type Fulfilment = "branch" | "mobile";

type HireBooking = {
  id: string;
  booking_number: string | null;
  product_name: string;
  fulfilment_mode: Fulfilment | string;
  preferred_branch: string | null;
  postcode: string | null;
  start_date: string;
  end_date: string;
  hire_days: number;
  hire_subtotal: number;
  callout_fee: number;
  courier_fee: number;
  deposit_amount: number;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string | null;
  terms_signature_url: string | null;
  terms_signed_name?: string | null;
  hire_payment_status: string | null;
  billing_address_line1: string | null;
  billing_address_city: string | null;
  billing_address_postcode: string | null;
  notes?: string | null;
};

export function HireCheckoutClient({ bookingId }: { bookingId: string }) {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<HireBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fulfilment, setFulfilment] = useState<Fulfilment>("branch");
  const [branch, setBranch] = useState("heathrow");
  const [mobilePostcode, setMobilePostcode] = useState("");
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [coverageLoading, setCoverageLoading] = useState(false);
  const [savingFulfilment, setSavingFulfilment] = useState(false);

  const [billLine1, setBillLine1] = useState("");
  const [billCity, setBillCity] = useState("");
  const [billPostcode, setBillPostcode] = useState("");
  const [deliveryAddr, setDeliveryAddr] = useState("");
  const [savingAddr, setSavingAddr] = useState(false);

  const [signedName, setSignedName] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const [signing, setSigning] = useState(false);
  const [paying, setPaying] = useState(false);

  const reload = async () => {
    const res = await fetch(`/api/hire/${bookingId}`);
    const data = await res.json();
    if (!res.ok) {
      setBooking(null);
      setLoading(false);
      return;
    }
    const b = data as HireBooking;
    setBooking(b);
    setSignedName(b.terms_signed_name || b.customer_name || "");
    setFulfilment((b.fulfilment_mode as Fulfilment) || "branch");
    setBranch(b.preferred_branch || "heathrow");
    setBillLine1(b.billing_address_line1 || "");
    setBillCity(b.billing_address_city || "");
    setBillPostcode(b.billing_address_postcode || b.postcode || "");
    setDeliveryAddr(b.delivery_address || "");
    setMobilePostcode(b.postcode || "");
    if (b.hire_payment_status === "paid") setStep(5);
    else if (b.terms_signature_url) setStep(4);
    else if (b.billing_address_line1 && b.billing_address_postcode) setStep(3);
    else setStep(1);
    setLoading(false);
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    if (fulfilment !== "mobile") {
      setCoverage(null);
      return;
    }
    const pc = mobilePostcode.trim();
    if (pc.length < 5) {
      setCoverage(null);
      return;
    }
    setCoverageLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      const r = await lookupCoverage(pc, ctrl.signal);
      setCoverage(r);
      setCoverageLoading(false);
    }, 350);
    return () => {
      clearTimeout(t);
      ctrl.abort();
      setCoverageLoading(false);
    };
  }, [mobilePostcode, fulfilment]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-primary">Booking not found</h1>
        <p className="mt-2 text-muted">This hire link is invalid or has expired.</p>
        <Link href="/hire" className="mt-4 inline-block font-semibold text-primary underline">
          Back to hire
        </Link>
      </div>
    );
  }

  if (booking.hire_payment_status === "paid" || step === 5) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-success" />
        <h1 className="text-3xl font-extrabold text-primary">Hire confirmed</h1>
        <p className="mt-3 text-muted">
          Booking {booking.booking_number}. We&apos;ll be in touch shortly to
          confirm next steps.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const saveFulfilment = async () => {
    setError(null);
    if (fulfilment === "mobile") {
      if (!mobilePostcode.trim()) {
        setError("Enter your postcode so we can price local delivery");
        return;
      }
      if (!coverage || coverage.kind !== "covered") {
        setError("Please enter a postcode in our local delivery area");
        return;
      }
    }
    setSavingFulfilment(true);
    try {
      const res = await fetch("/api/hire/fulfilment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          fulfilmentMode: fulfilment,
          preferredBranch: fulfilment === "branch" ? branch : null,
          postcode: fulfilment === "mobile" ? mobilePostcode.trim().toUpperCase() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save fulfilment");
      await reload();
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save fulfilment");
    } finally {
      setSavingFulfilment(false);
    }
  };

  const saveAddress = async () => {
    setError(null);
    if (!billLine1.trim() || !billCity.trim() || !billPostcode.trim()) {
      setError("Please fill in your billing address (matching your payment card)");
      return;
    }
    setSavingAddr(true);
    try {
      const billingFull = `${billLine1.trim()}, ${billCity.trim()}, ${billPostcode.trim().toUpperCase()}`;
      const delivery =
        fulfilment === "mobile" ? deliveryAddr.trim() || billingFull : null;

      const res = await fetch("/api/hire/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          billing_address_line1: billLine1,
          billing_address_city: billCity,
          billing_address_postcode: billPostcode,
          delivery_address: delivery,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save address");
      await reload();
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save address");
    } finally {
      setSavingAddr(false);
    }
  };

  const sign = async () => {
    setError(null);
    if (!agree) {
      setError("Please tick to agree to the hire terms");
      return;
    }
    if (!signedName.trim()) {
      setError("Please type your full name");
      return;
    }
    if (!signatureDataUrl) {
      setError("Please sign in the box");
      return;
    }
    setSigning(true);
    try {
      const res = await fetch("/api/hire/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          signedName,
          signatureDataUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signing failed");
      await reload();
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Signing failed");
    } finally {
      setSigning(false);
    }
  };

  const pay = async () => {
    setError(null);
    setPaying(true);
    try {
      const res = await fetch("/api/hire/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "No Revolut checkout URL returned");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start payment");
      setPaying(false);
    }
  };

  const steps = [
    { n: 1, label: "Fulfilment", icon: Truck },
    { n: 2, label: "Billing", icon: MapPin },
    { n: 3, label: "Sign", icon: ShieldCheck },
    { n: 4, label: "Pay", icon: CreditCard },
  ];

  const isFlex =
    Boolean(booking.notes?.includes("FLEX:")) ||
    (Number(booking.hire_days) >= 60 &&
      Number(booking.callout_fee) === 0 &&
      Number(booking.hire_subtotal) > 0);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/hire" className="text-sm font-semibold text-muted hover:text-primary">
        ← Back to hire
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-primary">
        {isFlex ? "Complete your Flex Hire" : "Complete your hire"}
      </h1>
      <p className="mt-1 text-muted">
        {booking.product_name}
        {isFlex
          ? ` · Flex monthly · ${booking.start_date} → ${booking.end_date}`
          : ` · ${booking.hire_days} days`}{" "}
        · Booking {booking.booking_number}
      </p>

      <div className="my-6 flex flex-wrap gap-2">
        {steps.map((s) => (
          <button
            key={s.n}
            type="button"
            onClick={() => s.n < step && setStep(s.n)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
              step === s.n
                ? "bg-primary text-primary-foreground"
                : step > s.n
                  ? "bg-primary-soft text-primary"
                  : "bg-soft text-muted"
            }`}
          >
            <s.icon className="h-3.5 w-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-white p-5 md:p-8">
        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary">
              {isFlex ? "Delivery" : "How would you like to receive it?"}
            </h2>
            {isFlex ? (
              <div className="rounded-xl border border-primary/30 bg-primary-soft p-4 text-sm">
                <p className="font-semibold text-primary">
                  Flex delivery included
                </p>
                <p className="mt-1 text-muted">
                  We’ll deliver to your address inside the Flex zone. Collection
                  is free when you end the hire. Postcode on this booking:{" "}
                  <strong>{booking.postcode || "—"}</strong>
                </p>
              </div>
            ) : (
              (
                [
                  ["branch", "Collect from a branch", "Free — Heathrow or Ferndown"],
                  [
                    "mobile",
                    "Deliver & collect by our team",
                    "Call-out band charged both ways",
                  ],
                ] as const
              ).map(([value, title, sub]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFulfilment(value)}
                  className={`block w-full rounded-xl border p-4 text-left ${
                    fulfilment === value
                      ? "border-primary bg-primary-soft"
                      : "border-border"
                  }`}
                >
                  <p className="font-semibold text-primary">{title}</p>
                  <p className="text-sm text-muted">{sub}</p>
                </button>
              ))
            )}
            {!isFlex && fulfilment === "branch" ? (
              <div className="grid grid-cols-2 gap-2">
                {["heathrow", "ferndown"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBranch(b)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium capitalize ${
                      branch === b
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            ) : null}
            {!isFlex && fulfilment === "mobile" ? (
              <div>
                <Label htmlFor="mobile-pc">Delivery postcode</Label>
                <Input
                  id="mobile-pc"
                  value={mobilePostcode}
                  onChange={(e) =>
                    setMobilePostcode(e.target.value.toUpperCase())
                  }
                  className="uppercase"
                />
                {coverageLoading ? (
                  <p className="mt-1 text-xs text-muted">Checking coverage…</p>
                ) : null}
                {coverage?.kind === "covered" ? (
                  <p className="mt-1 text-xs text-success">
                    {coverage.workshop.name} — deliver &amp; collect{" "}
                    {coverage.fee === 0
                      ? "free locally"
                      : formatGBP(coverage.fee * 2)}
                  </p>
                ) : null}
              </div>
            ) : null}
            <Button
              className="w-full"
              onClick={() => {
                if (isFlex) {
                  setStep(2);
                  return;
                }
                void saveFulfilment();
              }}
              disabled={savingFulfilment}
            >
              {savingFulfilment ? "Saving…" : "Continue"}
            </Button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary">Billing address</h2>
            <p className="text-sm text-muted">
              Must match the address registered to your payment card.
            </p>
            <div>
              <Label htmlFor="line1">Address line 1</Label>
              <Input id="line1" value={billLine1} onChange={(e) => setBillLine1(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="city">Town / city</Label>
              <Input id="city" value={billCity} onChange={(e) => setBillCity(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="bpc">Postcode</Label>
              <Input
                id="bpc"
                value={billPostcode}
                onChange={(e) => setBillPostcode(e.target.value.toUpperCase())}
                className="uppercase"
              />
            </div>
            {fulfilment === "mobile" ? (
              <div>
                <Label htmlFor="daddr">Delivery address (if different)</Label>
                <Input
                  id="daddr"
                  value={deliveryAddr}
                  onChange={(e) => setDeliveryAddr(e.target.value)}
                />
              </div>
            ) : null}
            <Button className="w-full" onClick={() => void saveAddress()} disabled={savingAddr}>
              {savingAddr ? "Saving…" : "Continue"}
            </Button>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary">Sign hire agreement</h2>
            <div className="max-h-64 space-y-3 overflow-y-auto rounded-xl bg-soft p-4 text-sm">
              {HIRE_TERMS.map((t) => (
                <div key={t.heading}>
                  <p className="font-semibold text-primary">{t.heading}</p>
                  <p className="text-muted">{t.body}</p>
                </div>
              ))}
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1"
              />
              I agree to the hire terms above
            </label>
            <div>
              <Label htmlFor="signed">Full name</Label>
              <Input
                id="signed"
                value={signedName}
                onChange={(e) => setSignedName(e.target.value)}
              />
            </div>
            <SignaturePad onChange={setSignatureDataUrl} />
            <Button className="w-full" onClick={() => void sign()} disabled={signing}>
              {signing ? "Saving signature…" : "Sign & continue"}
            </Button>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary">Pay securely</h2>
            <div className="rounded-xl bg-soft px-4 py-3 text-sm">
              <p>
                {isFlex ? "Month 1 Flex" : "Hire"}:{" "}
                {formatGBP(Number(booking.hire_subtotal))}
              </p>
              {Number(booking.callout_fee) > 0 ? (
                <p>
                  Deliver &amp; collect:{" "}
                  {formatGBP(Number(booking.callout_fee))}
                </p>
              ) : isFlex ? (
                <p>Delivery &amp; collection: included</p>
              ) : null}
              {Number(booking.deposit_amount) > 0 ? (
                <p>Deposit: {formatGBP(Number(booking.deposit_amount))}</p>
              ) : null}
              <p className="mt-2 text-lg font-bold text-primary">
                Due today: {formatGBP(Number(booking.total_amount))}
              </p>
              {isFlex ? (
                <p className="mt-2 text-xs text-muted">
                  After this payment we’ll bill the same monthly fee each month.
                  Three-month minimum, then cancel with 14 days’ notice.
                </p>
              ) : null}
            </div>
            <p className="text-sm text-muted">
              You&apos;ll be taken to Revolut&apos;s secure checkout to pay.
            </p>
            <Button className="w-full" variant="buy" onClick={() => void pay()} disabled={paying}>
              {paying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Opening payment…
                </>
              ) : (
                "Pay securely with Revolut"
              )}
            </Button>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}
      </div>
    </div>
  );
}
