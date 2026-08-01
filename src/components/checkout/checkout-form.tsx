"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { CatalogImage } from "@/components/product/catalog-image";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, Select } from "@/components/ui/input";
import {
  VAT_CONDITIONS,
  VAT_DECLARATION,
  isUsedCartProduct,
  linePrice,
  type CheckoutPayload,
} from "@/lib/cart";
import {
  cartHasHeavyItem,
  checkDeliveryZone,
  isHeavyItem,
  type DeliveryCheckResult,
} from "@/lib/delivery-zone";
import { formatGBP } from "@/lib/products";
import {
  isTakeawayEligibleProduct,
  takeawayCreditForCart,
} from "@/lib/takeaway-credit";

export function CheckoutForm() {
  const { items, subtotal } = useCart();
  const [loading, setLoading] = useState<"revolut" | "paypal" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [declarationConfirmed, setDeclarationConfirmed] = useState(false);
  const [takeawayRequested, setTakeawayRequested] = useState(false);
  const [zoneCheck, setZoneCheck] = useState<DeliveryCheckResult | null>(null);
  const [zoneChecking, setZoneChecking] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    fulfillment: "delivery" as "delivery" | "collection",
    address: "",
    postcode: "",
    collectionBranch: "",
    isVatExempt: false,
    vatConditionId: "",
    notes: "",
  });

  const hasHeavyItem = useMemo(() => cartHasHeavyItem(items), [items]);
  const heavyItemNames = useMemo(
    () =>
      items
        .filter((item) => isHeavyItem(item.product.weight))
        .map((item) => item.product.name),
    [items],
  );

  const hasBatteryOrCharger = useMemo(
    () =>
      items.some((item) => {
        const cat = item.product.category?.toLowerCase() || "";
        const name = item.product.name.toLowerCase();
        return (
          cat.includes("batter") ||
          cat.includes("charger") ||
          name.includes("battery") ||
          name.includes("charger")
        );
      }),
    [items],
  );

  const batteryVatBlocked =
    hasBatteryOrCharger && form.fulfillment === "delivery";

  const vatableSubtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (isUsedCartProduct(item.product)) return sum;
        return sum + linePrice(item.product) * item.quantity;
      }, 0),
    [items],
  );

  const vatRate = form.isVatExempt && !batteryVatBlocked ? 0 : 20;
  const vatAmount = vatableSubtotal * (vatRate / 100);
  const deliveryFee = 0;
  const takeawayEligible = useMemo(
    () =>
      items.some((item) =>
        isTakeawayEligibleProduct({
          category: item.product.category,
          name: item.product.name,
          product_type: item.product.product_type,
        }),
      ),
    [items],
  );
  const availableTakeawayCredit = useMemo(
    () =>
      takeawayCreditForCart(
        items.map((item) => ({
          unitPrice: linePrice(item.product),
          category: item.product.category,
          name: item.product.name,
          product_type: item.product.product_type,
        })),
      ),
    [items],
  );
  const takeawayCredit =
    takeawayRequested && takeawayEligible ? availableTakeawayCredit : 0;
  const total = Math.max(0, subtotal + vatAmount + deliveryFee - takeawayCredit);

  /** Heavy items (30 kg+) can only be delivered inside the local service area. */
  const heavyNeedsLocalCheck =
    hasHeavyItem && form.fulfillment === "delivery";
  const heavyOutOfArea =
    heavyNeedsLocalCheck && zoneCheck?.status === "out_of_area";
  const heavyLocalOk =
    heavyNeedsLocalCheck && zoneCheck?.status === "local";
  const heavyPaymentBlocked =
    heavyNeedsLocalCheck &&
    (zoneChecking ||
      heavyOutOfArea ||
      zoneCheck?.status === "error" ||
      !heavyLocalOk);

  useEffect(() => {
    if (!heavyNeedsLocalCheck) {
      setZoneCheck(null);
      setZoneChecking(false);
      return;
    }

    const cleaned = form.postcode.trim();
    if (cleaned.length < 5) {
      setZoneCheck(null);
      setZoneChecking(false);
      return;
    }

    let cancelled = false;
    setZoneChecking(true);
    const timer = window.setTimeout(() => {
      void checkDeliveryZone(cleaned).then((result) => {
        if (cancelled) return;
        setZoneCheck(result);
        setZoneChecking(false);
      });
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [form.postcode, heavyNeedsLocalCheck]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "fulfillment" && value === "delivery" && hasBatteryOrCharger) {
        next.isVatExempt = false;
        next.vatConditionId = "";
        setDeclarationConfirmed(false);
      }
      return next;
    });
  };

  function buildPayload(): CheckoutPayload {
    return {
      customer: {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
      },
      items: items.map((i) => ({
        stockItemId: i.product.stockItemId || i.product.id.split("__")[0],
        productName: i.product.name,
        productImageUrl: i.product.image_url || undefined,
        quantity: i.quantity,
        unitPrice: linePrice(i.product),
        isUsed: isUsedCartProduct(i.product),
        variantIds: i.product.variantIds,
        addonVariantId: i.product.addonVariantId,
      })),
      fulfillmentMethod: form.fulfillment,
      collectionBranch:
        form.fulfillment === "collection" ? form.collectionBranch : undefined,
      deliveryType: form.fulfillment === "delivery" ? "courier" : undefined,
      deliveryAddress:
        form.fulfillment === "delivery" ? form.address.trim() : undefined,
      deliveryPostcode:
        form.fulfillment === "delivery"
          ? form.postcode.trim().toUpperCase()
          : undefined,
      deliveryFee,
      isVatExempt: form.isVatExempt && !batteryVatBlocked,
      vatExemptionReason:
        form.isVatExempt && !batteryVatBlocked
          ? VAT_CONDITIONS.find((c) => c.id === form.vatConditionId)?.label
          : undefined,
      vatExemptionDeclaration:
        form.isVatExempt && !batteryVatBlocked ? VAT_DECLARATION : undefined,
      notes: form.notes.trim() || undefined,
      takeawayRequested: takeawayRequested && takeawayCredit > 0,
    };
  }

  function validate() {
    if (!form.email || !form.firstName || !form.lastName || !form.phone) {
      return "Please fill in all contact details";
    }
    if (form.fulfillment === "delivery" && (!form.address || !form.postcode)) {
      return "Please enter your delivery address and postcode";
    }
    if (form.fulfillment === "collection" && !form.collectionBranch) {
      return "Please select a collection branch";
    }
    if (heavyNeedsLocalCheck) {
      if (form.postcode.trim().length < 5) {
        return "Please enter a full postcode so we can check local delivery for items over 30 kg";
      }
      if (zoneChecking) {
        return "Checking your postcode for local delivery — please wait a moment";
      }
      if (zoneCheck?.status === "out_of_area") {
        return "Items over 30 kg can only be delivered within our Heathrow & Ferndown service area. Choose collection, or remove the heavy item to continue.";
      }
      if (zoneCheck?.status === "error") {
        return zoneCheck.message || "We couldn't verify this postcode";
      }
      if (zoneCheck?.status !== "local") {
        return "Please enter a valid postcode in our local service area for items over 30 kg";
      }
    }
    if (form.isVatExempt && !batteryVatBlocked && !form.vatConditionId) {
      return "Please select your qualifying condition for VAT relief";
    }
    if (form.isVatExempt && !batteryVatBlocked && !declarationConfirmed) {
      return "Please confirm the VAT exemption declaration";
    }
    return null;
  }

  async function pay(provider: "revolut" | "paypal") {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(provider);
    try {
      const res = await fetch(`/api/checkout/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }
      // Keep the cart until order confirmation clears it after a successful return.
      // Clearing before redirect loses the basket if the shopper abandons Revolut/PayPal.
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-10 text-center">
        <h1 className="text-2xl font-extrabold text-primary">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add some products before checking out.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-xl bg-accent px-5 py-3 font-semibold text-accent-foreground"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-bold text-primary">1. Contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First name *</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last name *</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-bold text-primary">2. Delivery or collection</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                form.fulfillment === "delivery"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-primary"
              }`}
              onClick={() => update("fulfillment", "delivery")}
            >
              Delivery
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                form.fulfillment === "collection"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-primary"
              }`}
              onClick={() => update("fulfillment", "collection")}
            >
              Collection
            </button>
          </div>

          {hasHeavyItem ? (
            <div className="mt-4 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-primary">
              <p className="font-semibold">Items over 30 kg — local delivery only</p>
              <p className="mt-1 text-muted">
                {heavyItemNames.length === 1 ? (
                  <>
                    <strong className="text-primary">{heavyItemNames[0]}</strong>{" "}
                    is over 30 kg.
                  </>
                ) : (
                  <>Your basket includes equipment over 30 kg.</>
                )}{" "}
                We don&apos;t ship these nationwide — they&apos;re too heavy to
                handle by courier, and too difficult to bring back if there&apos;s
                a problem. Delivery must be inside our Heathrow or Ferndown
                service area, or you can collect from a branch.
              </p>
              <p className="mt-2 text-xs text-muted">
                <Link href="/service-area" className="font-semibold underline">
                  Check service area
                </Link>
                {" · "}
                <Link href="/delivery" className="font-semibold underline">
                  Delivery policy
                </Link>
              </p>
            </div>
          ) : null}

          {form.fulfillment === "delivery" ? (
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode *</Label>
                <Input
                  id="postcode"
                  value={form.postcode}
                  onChange={(e) => update("postcode", e.target.value)}
                  required
                  className="uppercase"
                />
              </div>

              {heavyNeedsLocalCheck ? (
                <div className="space-y-2">
                  {zoneChecking ? (
                    <p className="text-sm text-muted">
                      Checking if we can deliver this heavy item to your
                      postcode…
                    </p>
                  ) : null}
                  {heavyLocalOk && zoneCheck?.status === "local" ? (
                    <p className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-primary">
                      Good news — you&apos;re about{" "}
                      <strong>{zoneCheck.distanceMiles} miles</strong> from{" "}
                      <strong>{zoneCheck.branch}</strong>. We can deliver this
                      locally.
                    </p>
                  ) : null}
                  {heavyOutOfArea ? (
                    <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-primary">
                      <p className="font-semibold text-error">
                        Outside our local delivery area
                      </p>
                      <p className="mt-1 text-muted">
                        We can&apos;t deliver items over 30 kg to this postcode.
                        Switch to <strong>collection</strong> at Heathrow or
                        Ferndown, remove the heavy item, or{" "}
                        <Link
                          href="/contact?interest=callback#callback"
                          className="font-semibold underline"
                        >
                          request a callback
                        </Link>{" "}
                        if you&apos;re near the boundary.
                      </p>
                    </div>
                  ) : null}
                  {zoneCheck?.status === "error" ? (
                    <p className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                      {zoneCheck.message}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-muted">
                  Lightweight items (under 30 kg) ship free by tracked courier
                  nationwide. Equipment over 30 kg is local delivery only from
                  Heathrow &amp; Ferndown.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div>
                <Label htmlFor="branch">Collection branch *</Label>
                <Select
                  id="branch"
                  value={form.collectionBranch}
                  onChange={(e) => update("collectionBranch", e.target.value)}
                  required
                >
                  <option value="">Select a branch</option>
                  <option value="Heathrow">Heathrow (West Drayton)</option>
                  <option value="Ferndown">Ferndown (Wimborne)</option>
                </Select>
              </div>
              {hasHeavyItem ? (
                <p className="text-sm text-muted">
                  Collection is available for heavy equipment from either
                  workshop — no postcode restriction.
                </p>
              ) : null}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-bold text-primary">3. VAT relief</h2>
          <p className="mt-2 text-sm text-muted">
            Catalogue line prices are ex VAT (VAT relief price). Standard
            customers pay +20% VAT.{" "}
            <Link
              href="/vat-relief"
              className="font-semibold text-primary underline"
            >
              Learn about VAT relief
            </Link>
            .
          </p>
          {batteryVatBlocked ? (
            <p className="mt-3 text-sm text-muted">
              Batteries and chargers are only eligible for VAT relief when
              collected and fitted at our workshop.
            </p>
          ) : (
            <>
              <label className="mt-4 flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.isVatExempt}
                  onChange={(e) => update("isVatExempt", e.target.checked)}
                />
                <span>
                  I qualify for VAT relief on mobility goods for personal use
                </span>
              </label>
              {form.isVatExempt ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="vatCondition">Qualifying condition *</Label>
                    <Select
                      id="vatCondition"
                      value={form.vatConditionId}
                      onChange={(e) => update("vatConditionId", e.target.value)}
                    >
                      <option value="">Select condition</option>
                      {VAT_CONDITIONS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={declarationConfirmed}
                      onChange={(e) => setDeclarationConfirmed(e.target.checked)}
                    />
                    <span>{VAT_DECLARATION}</span>
                  </label>
                </div>
              ) : null}
            </>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-bold text-primary">4. Old scooter takeaway</h2>
          {takeawayEligible ? (
            <>
              <p className="mt-2 text-sm text-muted">
                Fixed credit off this order when we collect and dispose of (or
                keep) your old scooter or wheelchair — not a trade-in valuation.{" "}
                <Link href="/trade-in" className="font-semibold text-primary underline">
                  See the credit bands
                </Link>
                .
              </p>
              <label className="mt-4 flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={takeawayRequested}
                  onChange={(e) => setTakeawayRequested(e.target.checked)}
                />
                <span>
                  Yes — take my old scooter or wheelchair away
                  {availableTakeawayCredit > 0
                    ? ` and knock ${formatGBP(availableTakeawayCredit)} off this order`
                    : ""}
                </span>
              </label>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">
              Add a scooter or wheelchair to your basket to unlock the takeaway
              credit.{" "}
              <Link href="/trade-in" className="font-semibold text-primary underline">
                How it works
              </Link>
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-bold text-primary">5. Notes</h2>
          <div className="mt-4">
            <Label htmlFor="notes">Order notes (optional)</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder={
                takeawayRequested
                  ? "e.g. old scooter make/model, or access notes for collection"
                  : undefined
              }
            />
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-white p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-bold text-primary">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.product.id} className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-soft">
                <CatalogImage
                  src={item.product.image_url || "/placeholder-product.svg"}
                  alt={item.product.name}
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-primary">
                  {item.product.name}
                </p>
                {item.product.optionSummary ? (
                  <p className="text-xs text-muted">{item.product.optionSummary}</p>
                ) : null}
                <p className="text-xs text-muted">
                  Qty {item.quantity}
                  {isHeavyItem(item.product.weight) ? (
                    <span className="ml-1 font-medium text-warning">
                      · Over 30 kg
                    </span>
                  ) : null}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatGBP(linePrice(item.product) * item.quantity)}
                <span className="block text-[10px] font-normal text-muted">
                  ex VAT
                </span>
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal (ex VAT)</dt>
            <dd className="font-medium">{formatGBP(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">
              {form.isVatExempt && !batteryVatBlocked
                ? "VAT (relief claimed)"
                : `VAT (${vatRate}%)`}
            </dt>
            <dd className="font-medium">{formatGBP(vatAmount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="font-medium">Free</dd>
          </div>
          {takeawayCredit > 0 ? (
            <div className="flex justify-between text-accent-foreground">
              <dt>Old scooter takeaway</dt>
              <dd className="font-semibold">−{formatGBP(takeawayCredit)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-border pt-2 text-base">
            <dt className="font-bold text-primary">
              Total {form.isVatExempt && !batteryVatBlocked ? "(ex VAT)" : "(inc VAT)"}
            </dt>
            <dd className="font-extrabold text-primary">{formatGBP(total)}</dd>
          </div>
        </dl>

        {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}
        {heavyOutOfArea ? (
          <p className="mt-4 text-sm text-error">
            Payment is blocked until you choose collection or a postcode in our
            local service area.
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="buy"
            className="w-full rounded-xl"
            disabled={loading !== null || heavyPaymentBlocked}
            onClick={() => pay("revolut")}
          >
            {loading === "revolut"
              ? "Redirecting to Revolut…"
              : zoneChecking && heavyNeedsLocalCheck
                ? "Checking postcode…"
                : "Pay securely with Revolut"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl"
            disabled={loading !== null || heavyPaymentBlocked}
            onClick={() => pay("paypal")}
          >
            {loading === "paypal" ? "Redirecting to PayPal…" : "Pay with PayPal"}
          </Button>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Secure checkout. Prices are re-validated on the server before payment.
        </p>
      </aside>
    </div>
  );
}
