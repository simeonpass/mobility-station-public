"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startCarePlanCheckout } from "@/lib/care-plan-client";
import type { CarePlan } from "@/lib/carePlans";
import { formatCarePlanPrice } from "@/lib/carePlans";
import { cn } from "@/lib/utils";

export function CarePlanSignupDialog({
  plan,
  triggerClassName,
  children,
}: {
  plan: CarePlan;
  triggerClassName?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    try {
      const { url } = await startCarePlanCheckout({
        planKey: plan.key,
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        postcode: String(fd.get("postcode") || ""),
        equipment: String(fd.get("equipment") || ""),
        notes: String(fd.get("notes") || ""),
        website: String(fd.get("website") || ""),
      });
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

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
                className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl md:p-8"
                onClick={(ev) => ev.stopPropagation()}
              >
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 rounded-md p-1 text-muted hover:bg-soft hover:text-primary"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                <h2
                  id={titleId}
                  className="pr-10 text-2xl font-extrabold text-primary"
                >
                  Join {plan.name}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {formatCarePlanPrice(plan)} — pay securely with Stripe. We’ll
                  confirm your plan as soon as payment clears.
                </p>

                <form onSubmit={onSubmit} className="relative mt-6 space-y-4">
                  {/* Honeypot */}
                  <div
                    className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                    aria-hidden
                  >
                    <label htmlFor={`hp-${plan.key}`}>Website</label>
                    <input
                      id={`hp-${plan.key}`}
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      defaultValue=""
                    />
                  </div>

                  <Field
                    label="Full name"
                    name="name"
                    required
                    autoComplete="name"
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                  />
                  <Field
                    label="Postcode"
                    name="postcode"
                    required
                    autoComplete="postal-code"
                  />
                  <Field
                    label="Equipment make & model"
                    name="equipment"
                    required
                    placeholder="e.g. Pride Colt, ErgoFold"
                  />
                  <div>
                    <label
                      htmlFor={`notes-${plan.key}`}
                      className="text-sm font-semibold text-primary"
                    >
                      Notes{" "}
                      <span className="font-normal text-muted">(optional)</span>
                    </label>
                    <textarea
                      id={`notes-${plan.key}`}
                      name="notes"
                      rows={3}
                      className="mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
                    />
                  </div>

                  {error ? (
                    <p className="text-sm font-medium text-error" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Taking you to secure payment…"
                      : `Continue to payment — ${plan.priceLabel}/mo`}
                  </Button>
                  <p className="text-center text-xs text-muted">
                    You’ll complete payment on Stripe. Cancel anytime from your
                    confirmation email.
                  </p>
                </form>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        {children}
      </button>
      {overlay}
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  const id = `care-${name}`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-primary">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={cn(
          "mt-1.5 h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none ring-accent focus:ring-2",
        )}
      />
    </div>
  );
}
