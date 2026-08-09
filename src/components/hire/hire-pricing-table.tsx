"use client";

import { useState } from "react";
import { CatalogImage } from "@/components/product/catalog-image";
import {
  HIRE_PRICING_CATEGORIES,
  type HirePricingCategoryId,
} from "@/lib/hire-pricing";
import { formatGBP } from "@/lib/products";
import { cn } from "@/lib/utils";

type Mode = "short" | "flex";

export function HirePricingTable({
  images,
}: {
  images: Record<HirePricingCategoryId, { src: string | null; alt: string }>;
}) {
  const [mode, setMode] = useState<Mode>("short");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            Hire prices
          </h2>
          <p className="mt-2 text-sm text-muted md:text-base">
            Ex VAT headline prices. Toggle Short-term or Flex to compare the
            right rate set.
          </p>
        </div>
        <div
          className="inline-flex rounded-md border border-border bg-white p-1"
          role="group"
          aria-label="Price set"
        >
          {(
            [
              ["short", "Short-term"],
              ["flex", "Flex"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={cn(
                "rounded px-4 py-2 text-sm font-semibold transition-colors",
                mode === id
                  ? "bg-primary text-primary-foreground"
                  : "text-primary hover:bg-soft",
              )}
              aria-pressed={mode === id}
              onClick={() => setMode(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border-y border-border">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-soft/60 text-xs font-semibold uppercase tracking-wide text-muted">
              <th className="px-3 py-3 font-semibold">Category</th>
              <th className="px-3 py-3 font-semibold">User weight</th>
              {mode === "short" ? (
                <>
                  <th className="px-3 py-3 font-semibold">3 days</th>
                  <th className="px-3 py-3 font-semibold">+day</th>
                  <th className="px-3 py-3 font-semibold">Week</th>
                  <th className="px-3 py-3 font-semibold">2 wks</th>
                  <th className="px-3 py-3 font-semibold">4 wks</th>
                  <th className="px-3 py-3 font-semibold">Deposit</th>
                </>
              ) : (
                <>
                  <th className="px-3 py-3 font-semibold">Flex / month</th>
                  <th className="px-3 py-3 font-semibold">
                    Short-term deposit*
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {HIRE_PRICING_CATEGORIES.map((row) => {
              const image = images[row.id];
              return (
                <tr
                  key={row.id}
                  className="border-b border-border/80 align-middle"
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-soft">
                        <CatalogImage
                          src={image?.src}
                          alt={image?.alt || row.imageAlt}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-primary">
                        {row.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted">{row.userWeight}</td>
                  {mode === "short" ? (
                    <>
                      <td className="px-3 py-3 tabular-nums font-semibold text-primary">
                        {formatGBP(row.threeDay)}
                      </td>
                      <td className="px-3 py-3 tabular-nums text-foreground/85">
                        {formatGBP(row.extraDay)}
                      </td>
                      <td className="px-3 py-3 tabular-nums font-semibold text-primary">
                        {formatGBP(row.week)}
                      </td>
                      <td className="px-3 py-3 tabular-nums text-foreground/85">
                        {formatGBP(row.twoWeeks)}
                      </td>
                      <td className="px-3 py-3 tabular-nums text-foreground/85">
                        {formatGBP(row.fourWeeks)}
                      </td>
                      <td className="px-3 py-3 tabular-nums text-foreground/85">
                        {formatGBP(row.deposit)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-3 tabular-nums text-lg font-extrabold text-primary">
                        {formatGBP(row.flexMonthly)}
                        <span className="ml-1 text-xs font-semibold text-muted">
                          /mo
                        </span>
                      </td>
                      <td className="px-3 py-3 tabular-nums text-muted">
                        {formatGBP(row.deposit)} short-term only
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted">
        <p>
          All prices exclude VAT. If the equipment is for a disabled person&apos;s
          personal use, VAT relief applies and you pay the price shown.
        </p>
        <p>
          Models shown are examples from our hire fleet. The exact make and
          model depends on availability and what suits the user — we confirm
          before delivery.
        </p>
        {mode === "flex" ? (
          <p>
            * Flex uses one month paid up front as the deposit (always a month
            ahead), not the short-term damage deposit column. Plus a one-off{" "}
            {formatGBP(99)} set-up fee including delivery, set-up and handover.
          </p>
        ) : null}
      </div>
    </div>
  );
}
