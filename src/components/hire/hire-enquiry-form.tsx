"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import {
  HIRE_PRICING_CATEGORIES,
  VAT_RELIEF_DECLARATION,
  type HirePricingCategoryId,
} from "@/lib/hire-pricing";

type HireType = "short" | "flex";
type DeliveryMode = "collect_heathrow" | "collect_ferndown" | "deliver";

export function HireEnquiryForm({
  defaultHireType = "short",
}: {
  defaultHireType?: HireType;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [vatRelief, setVatRelief] = useState(false);
  const [form, setForm] = useState({
    hireType: defaultHireType as HireType,
    categoryId: (HIRE_PRICING_CATEGORIES[5]?.id ??
      "folding_scooter") as HirePricingCategoryId,
    startDate: "",
    endDate: "",
    userHeight: "",
    userWeight: "",
    delivery: "collect_heathrow" as DeliveryMode,
    name: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    notes: "",
    company_website: "",
  });

  const categoryLabel = useMemo(
    () =>
      HIRE_PRICING_CATEGORIES.find((c) => c.id === form.categoryId)?.label ??
      form.categoryId,
    [form.categoryId],
  );

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      const res = await fetch("/api/hire/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoryLabel,
          vatRelief,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        errors?: Record<string, string[]>;
        bookingRef?: string;
      };
      if (!res.ok || data.success === false) {
        if (data.errors) setFieldErrors(data.errors);
        throw new Error(data.error || "Could not send hire enquiry");
      }
      router.push(
        `/hire/thank-you?ref=${encodeURIComponent(data.bookingRef || "")}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-4">
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor="hire-company-website">Company website</label>
        <input
          id="hire-company-website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company_website}
          onChange={(e) => update("company_website", e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-primary">
          Request a hire quote
        </h2>
        <p className="mt-2 text-sm text-muted">
          No payment on this page — we confirm availability, then invoice hire
          charges, deposit and any Flex set-up fee.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="hireType">Hire type</Label>
          <Select
            id="hireType"
            value={form.hireType}
            onChange={(e) => update("hireType", e.target.value as HireType)}
          >
            <option value="short">Short-term</option>
            <option value="flex">Flex (long term)</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
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
            {form.hireType === "flex" ? "Preferred start confirmed" : "End date"}
          </Label>
          {form.hireType === "flex" ? (
            <Input
              id="endDate"
              value="Flex — 3 month minimum"
              readOnly
              className="bg-soft"
            />
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
            placeholder="e.g. 5ft 6in"
            required
            value={form.userHeight}
            onChange={(e) => update("userHeight", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="userWeight">User weight</Label>
          <Input
            id="userWeight"
            placeholder="e.g. 15 st"
            required
            value={form.userWeight}
            onChange={(e) => update("userWeight", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="delivery">Delivery</Label>
          <Select
            id="delivery"
            value={form.delivery}
            onChange={(e) =>
              update("delivery", e.target.value as DeliveryMode)
            }
          >
            <option value="collect_heathrow">Collect from Heathrow</option>
            <option value="collect_ferndown">Collect from Ferndown</option>
            <option value="deliver">Deliver to my address</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="hire-name">Full name</Label>
          <Input
            id="hire-name"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          {fieldErrors.name ? (
            <p className="mt-1 text-xs text-error">{fieldErrors.name[0]}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="hire-phone">Phone</Label>
          <Input
            id="hire-phone"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="hire-email">Email</Label>
          <Input
            id="hire-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="hire-address1">Address line 1</Label>
          <Input
            id="hire-address1"
            required={form.delivery === "deliver"}
            autoComplete="address-line1"
            value={form.addressLine1}
            onChange={(e) => update("addressLine1", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="hire-address2">Address line 2 (optional)</Label>
          <Input
            id="hire-address2"
            autoComplete="address-line2"
            value={form.addressLine2}
            onChange={(e) => update("addressLine2", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="hire-city">Town / city</Label>
          <Input
            id="hire-city"
            required={form.delivery === "deliver"}
            autoComplete="address-level2"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="hire-postcode">Postcode</Label>
          <Input
            id="hire-postcode"
            required
            autoComplete="postal-code"
            className="uppercase"
            value={form.postcode}
            onChange={(e) => update("postcode", e.target.value.toUpperCase())}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="hire-notes">Notes (optional)</Label>
          <Textarea
            id="hire-notes"
            rows={3}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 border-t border-border pt-4 text-sm leading-relaxed">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[var(--primary)]"
          checked={vatRelief}
          onChange={(e) => setVatRelief(e.target.checked)}
        />
        <span>
          <strong className="text-primary">VAT relief</strong> — the equipment
          is for a disabled person&apos;s personal use. I confirm:{" "}
          <span className="text-muted">{VAT_RELIEF_DECLARATION}</span>
        </span>
      </label>

      {error ? <p className="text-sm text-error">{error}</p> : null}

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Sending…" : "Send hire enquiry"}
      </Button>
    </form>
  );
}
