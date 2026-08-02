"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const overlay =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain bg-black/50"
            role="presentation"
            onClick={() => setOpen(false)}
          >
            <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-6">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="my-auto flex max-h-[min(92vh,calc(100dvh-2rem))] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border/70 px-5 py-4 sm:px-6">
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

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
                  <p className="text-sm leading-relaxed text-muted">
                    If you have a long-term illness or disability, you may buy
                    qualifying mobility products without paying VAT — saving{" "}
                    {UK_VAT_PERCENT}%. Claim at checkout with a short
                    declaration.
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
                    Making a false declaration is a criminal offence. Goods must
                    be for the personal use of the disabled person.
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
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {trigger}
      {overlay}
    </>
  );
}
