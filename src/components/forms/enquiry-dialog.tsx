"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { CallbackForm } from "@/components/forms/callback-form";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { cn } from "@/lib/utils";

type EnquiryDialogProps = {
  /** Visual style of the trigger control. */
  triggerClassName?: string;
  children: ReactNode;
  mode?: "callback" | "enquiry";
  enquiryType?: "demo" | "service" | "contact" | "hire" | "trade-in";
  title?: string;
  defaultInterest?: string;
  defaultTopic?: string;
  productSlug?: string;
  productLabel?: string;
  showDate?: boolean;
};

export function EnquiryDialog({
  triggerClassName,
  children,
  mode = "enquiry",
  enquiryType = "contact",
  title,
  defaultInterest,
  defaultTopic,
  productSlug,
  productLabel,
  showDate = false,
}: EnquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const dialogTitle =
    title ??
    (mode === "callback" ? "Request a callback" : "Send a message");

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

  return (
    <>
      <button
        type="button"
        className={cn(triggerClassName)}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>

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
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-white p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2
                id={titleId}
                className="text-xl font-extrabold tracking-tight text-primary"
              >
                {dialogTitle}
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

            {mode === "callback" ? (
              <CallbackForm
                title=""
                inline
                compact
                defaultTopic={defaultTopic || defaultInterest}
                productSlug={productSlug}
                productLabel={productLabel}
              />
            ) : (
              <EnquiryForm
                title=""
                enquiryType={enquiryType}
                defaultInterest={defaultInterest}
                productSlug={productSlug}
                showDate={showDate}
                inline
                compact
              />
            )}

            <p className="mt-4 text-center text-xs text-muted">
              Prefer the full form?{" "}
              <a
                href="/contact"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Open contact page
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
