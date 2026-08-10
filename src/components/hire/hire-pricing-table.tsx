"use client";

import { useState } from "react";
import { CatalogImage } from "@/components/product/catalog-image";
import {
  FLEX_SETUP_FEE_GBP,
  HIRE_PRICING_CATEGORIES,
  type HirePricingCategoryId,
} from "@/lib/hire-pricing";
import { formatGBP } from "@/lib/products";
import { cn } from "@/lib/utils";

type Mode = "short" | "flex";

export function HirePricingTable({
  images,
  lockedMode,
}: {
  images: Record<HirePricingCategoryId, { src: string | null; alt: string }>;
  /** When set, only that price set is shown (no toggle). */
  lockedMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(lockedMode ?? "short");
  const active = lockedMode ?? mode;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            {active === "short" ? "Short-term prices" : "Flex monthly prices"}
          </h2>
          <p className="mt-2 text-base text-muted">
            {active === "short"
              ? "Prices before VAT. Deposit is refundable."
              : "Prices before VAT. Pay one month at a time."}
          </p>
        </div>
        {!lockedMode ? (
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
                  active === id
                    ? "bg-primary text-primary-foreground"
                    : "text-primary hover:bg-soft",
                )}
                aria-pressed={active === id}
                onClick={() => setMode(id)}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-6 overflow-x-auto border-y border-border">
        <table
          className={cn(
            "w-full border-collapse text-left text-base",
            active === "short" ? "min-w-[720px]" : "min-w-[480px]",
          )}
        >
          <thead>
            <tr className="border-b border-border bg-soft/60 text-sm font-semibold text-muted">
              <th className="px-3 py-3 font-semibold">What you need</th>
              <th className="px-3 py-3 font-semibold">User weight</th>
              {active === "short" ? (
                <>
                  <th className="px-3 py-3 font-semibold">3 days</th>
                  <th className="px-3 py-3 font-semibold">Extra day</th>
                  <th className="px-3 py-3 font-semibold">1 week</th>
                  <th className="px-3 py-3 font-semibold">2 weeks</th>
                  <th className="px-3 py-3 font-semibold">4 weeks</th>
                  <th className="px-3 py-3 font-semibold">Deposit</th>
                </>
              ) : (
                <th className="px-3 py-3 font-semibold">Each month</th>
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
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-soft">
                        <CatalogImage
                          src={image?.src}
                          alt={image?.alt || row.imageAlt}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <span className="font-semibold text-primary">
                        {row.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted">{row.userWeight}</td>
                  {active === "short" ? (
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
                    <td className="px-3 py-3 tabular-nums text-xl font-extrabold text-primary">
                      {formatGBP(row.flexMonthly)}
                      <span className="ml-1 text-sm font-semibold text-muted">
                        / month
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-2 text-base text-muted">
        <p>
          Prices shown are before VAT. Many disabled customers pay no VAT —
          tick the box when you book if it applies to you.
        </p>
        {active === "flex" ? (
          <p>
            Today you pay the first month plus a one-off{" "}
            {formatGBP(FLEX_SETUP_FEE_GBP)} set-up (delivery and handover).
            There is no separate short-term damage deposit on Flex.
          </p>
        ) : (
          <p>
            Every short-term hire includes a £100 refundable deposit. It comes
            back when the equipment is returned in good condition.
          </p>
        )}
      </div>
    </div>
  );
}
