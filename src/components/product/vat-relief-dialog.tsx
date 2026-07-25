"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Info, X } from "lucide-react";
import { formatGBP } from "@/lib/products";
import { UK_VAT_PERCENT } from "@/lib/vat";

type Props = {
  /** Net (VAT relief) price for the example rows. */
  netPrice?: number | null;
  /** Gross (inc VAT) price. */
  grossPrice?: number | null;
  /** Compact trigger (chip) vs text button. */
  variant?: "chip" | "link" | "button";
  className?: string;
  children?: ReactNode;
};

export function VatReliefDialog({
  netPrice,
  grossPrice,
  variant = "chip",
  className = "",
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const trigger =
    variant === "chip" ? (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={`rounded bg-primary-soft px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary hover:bg-primary/15 ${className}`}
        aria-haspopup="dialog"
      >
        {children ?? "VAT relief"}
      </button>
    ) : (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={`inline-flex items-center gap-1 text-sm text-muted underline-offset-2 hover:text-primary hover:underline ${className}`}
        aria-haspopup="dialog"
      >
        <Info className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
        {children ?? "VAT relief available"}
      </button>
    );

  return (
    <>
      {trigger}
      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-white p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2
                id={titleId}
                className="text-lg font-extrabold text-primary"
              >
                VAT relief for disabled customers
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-muted hover:bg-soft hover:text-primary"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              If you have a long-term illness or disability, you may buy
              qualifying mobility products without paying VAT — saving{" "}
              {UK_VAT_PERCENT}%. Claim at checkout with a short declaration.
            </p>

            {netPrice != null && grossPrice != null ? (
              <ul className="mt-4 space-y-3 rounded-xl bg-soft p-4 text-sm">
                <li>
                  <p className="font-semibold text-primary">
                    VAT relief · {formatGBP(netPrice)}
                  </p>
                  <p className="text-xs text-muted">
                    Ex VAT — for eligible customers (declare at checkout).
                  </p>
                </li>
                <li>
                  <p className="font-semibold text-primary">
                    Standard · {formatGBP(grossPrice)}
                  </p>
                  <p className="text-xs text-muted">
                    Includes {UK_VAT_PERCENT}% UK VAT.
                  </p>
                </li>
              </ul>
            ) : null}

            <p className="mt-4 text-xs leading-relaxed text-muted">
              Making a false declaration is a criminal offence. Goods must be
              for the personal use of the disabled person.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/vat-relief"
                className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
                onClick={() => setOpen(false)}
              >
                Full VAT relief guide
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
