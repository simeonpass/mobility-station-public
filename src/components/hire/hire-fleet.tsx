"use client";

import { useState } from "react";
import Image from "next/image";
import { HireBookingForm } from "@/components/hire/hire-booking-form";
import { formatGBP, type HireProduct } from "@/lib/products";

export function HireFleet({ products }: { products: HireProduct[] }) {
  const [selected, setSelected] = useState<HireProduct | null>(
    products[0] ?? null,
  );

  if (!products.length) {
    return (
      <p className="rounded-xl bg-soft px-4 py-6 text-sm text-muted">
        No hire scooters are listed online right now. Call{" "}
        <a href="tel:08007723870" className="font-semibold text-primary">
          0800 772 3870
        </a>{" "}
        and we&apos;ll help you book.
      </p>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
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
                src={p.image_url || "/placeholder-product.svg"}
                alt={p.name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 50vw, 280px"
              />
            </div>
            <p className="font-bold text-primary">{p.name}</p>
            <p className="mt-1 text-sm text-muted">
              From{" "}
              {formatGBP(
                Number(p.hire_daily_rate || p.hire_weekly_rate || 0),
              )}
              {p.hire_daily_rate ? " / day" : " / week"}
            </p>
            {p.hire_deposit ? (
              <p className="text-xs text-muted">
                Deposit {formatGBP(Number(p.hire_deposit))}
              </p>
            ) : null}
          </button>
        ))}
      </div>

      <div className="h-fit rounded-2xl border border-border bg-white p-5 lg:sticky lg:top-28">
        <h2 className="mb-4 text-xl font-extrabold text-primary">
          Book {selected?.name}
        </h2>
        {selected ? <HireBookingForm key={selected.id} product={selected} /> : null}
      </div>
    </div>
  );
}
