"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { HireBookingForm } from "@/components/hire/hire-booking-form";
import {
  rateCardForProduct,
  type HireMode,
} from "@/lib/hire";
import { formatGBP, type HireProduct } from "@/lib/products";

export function HireFleet({
  products,
  initialMode = "short",
  preview = false,
}: {
  products: HireProduct[];
  initialMode?: HireMode;
  /** True when showing sample fleet for layout review. */
  preview?: boolean;
}) {
  const [mode, setMode] = useState<HireMode>(initialMode);
  const [selected, setSelected] = useState<HireProduct | null>(
    products[0] ?? null,
  );

  const priced = useMemo(
    () =>
      products.map((p) => ({
        product: p,
        rates: rateCardForProduct(p),
      })),
    [products],
  );

  if (!products.length) {
    return (
      <p className="rounded-xl bg-soft px-4 py-6 text-sm text-muted">
        The hire fleet is being prepared.{" "}
        <a
          href="/contact?interest=callback#callback"
          className="font-semibold text-primary underline"
        >
          Request a callback
        </a>{" "}
        and we&apos;ll help you book, or check back once units are listed.
      </p>
    );
  }

  return (
    <div>
      {preview ? (
        <p className="mb-6 rounded-xl border border-dashed border-border bg-soft px-4 py-3 text-sm text-muted">
          Sample fleet for layout — replace these with real hire stock when
          you&apos;re ready. Pricing follows the published rate card by tier.
        </p>
      ) : null}

      <div className="mb-8 flex flex-wrap gap-2">
        {(
          [
            ["short", "Short-term hire"],
            ["flex", "Flex Hire (monthly)"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === value
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-white text-primary hover:border-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {priced.map(({ product: p, rates }) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className={`rounded-2xl border p-4 text-left transition ${
                selected?.id === p.id
                  ? "border-primary bg-primary-soft ring-1 ring-primary"
                  : "border-border bg-white hover:border-primary/40"
              }`}
            >
              <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-soft">
                <Image
                  src={p.image_url || "/images/products/placeholder-scooter.svg"}
                  alt={p.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 50vw, 280px"
                />
              </div>
              <p className="font-bold text-primary">{p.name}</p>
              <p className="mt-0.5 text-xs text-muted">{rates.label}</p>
              <p className="mt-2 text-sm font-semibold text-primary">
                {mode === "flex" ? (
                  <>
                    {formatGBP(rates.monthly)}
                    <span className="font-medium text-muted"> / month</span>
                  </>
                ) : (
                  <>
                    From {formatGBP(rates.weekly)}
                    <span className="font-medium text-muted"> / week</span>
                  </>
                )}
              </p>
              <p className="text-xs text-muted">
                Deposit {formatGBP(rates.deposit)}
              </p>
            </button>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-border bg-white p-5 lg:sticky lg:top-28">
          <h2 className="mb-1 text-xl font-extrabold text-primary">
            {mode === "flex" ? "Start Flex Hire" : "Book short-term"}
          </h2>
          <p className="mb-4 text-sm text-muted">{selected?.name}</p>
          {selected ? (
            <HireBookingForm
              key={`${selected.id}-${mode}`}
              product={selected}
              mode={mode}
              preview={preview}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
