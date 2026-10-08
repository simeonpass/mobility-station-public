"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import {
  FieldError,
  FormError,
  fieldValidity,
} from "@/components/forms/field-error";
import { FormSpamTraps } from "@/components/forms/form-spam-traps";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { formatPreferredDate, toIsoDate } from "@/lib/demo-booking";
import {
  MULTIMAC_FITTING_KIT_URL,
  MULTIMAC_FITTING_PRICE_GBP,
  MULTIMAC_QUOTE_URL,
  cartProductFromFittingBooking,
  earliestFittingDate,
  multimacFittingBookingSchema,
  type MultimacFittingBranch,
  type MultimacSeatSource,
} from "@/lib/multimac-fitting";
import { formatGBP } from "@/lib/products";
import { cn } from "@/lib/utils";

function optionClass(active: boolean) {
  return cn(
    "w-full rounded-md border px-4 py-3 text-left text-sm font-semibold transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-white text-primary hover:border-primary/40 hover:bg-soft",
  );
}

export function MultimacFittingForm() {
  const router = useRouter();
  const { addItem, setIsOpen } = useCart();
  const minDate = useMemo(() => toIsoDate(earliestFittingDate()), []);
  const [seatSource, setSeatSource] = useState<MultimacSeatSource | "">("");
  const [hasFittingKit, setHasFittingKit] = useState(false);
  const [orderedFitting, setOrderedFitting] = useState(false);
  const [branch, setBranch] = useState<MultimacFittingBranch | "">("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleReg, setVehicleReg] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const fd = new FormData(e.currentTarget);
    const parsed = multimacFittingBookingSchema.safeParse({
      seatSource,
      hasFittingKit,
      orderedFitting,
      branch,
      preferredDate,
      preferredTime,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleReg,
      notes,
      company_website: String(fd.get("website") || ""),
    });

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
      setError("Please complete the checks and booking details below.");
      return;
    }

    setSubmitting(true);
    const product = cartProductFromFittingBooking(parsed.data);
    const result = addItem(product, 1);
    if (!result.ok) {
      setSubmitting(false);
      setError(
        result.message ||
          "Could not add this fitting to your cart. Please clear your cart and try again.",
      );
      return;
    }

    setIsOpen(false);
    router.push("/checkout");
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-6">
      <FormSpamTraps />
      <FormError message={error} />

      <fieldset>
        <legend className="text-sm font-bold text-primary">
          1. Where is the Multimac?
        </legend>
        <p className="mt-1 text-sm text-muted">
          We fit seats you already have, or seats Multimac is sending to our
          workshop.
        </p>
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            className={optionClass(seatSource === "have_seat")}
            onClick={() => setSeatSource("have_seat")}
          >
            I already have the Multimac and will bring it to the fitting
          </button>
          <button
            type="button"
            className={optionClass(seatSource === "delivered_to_us")}
            onClick={() => setSeatSource("delivered_to_us")}
          >
            Multimac is delivering it to Mobility Station
          </button>
        </div>
        <FieldError
          id="seatSource-error"
          message={fieldErrors.seatSource?.[0]}
        />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-primary">
          2. Confirm before booking
        </legend>
        <label className="flex items-start gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={hasFittingKit}
            onChange={(e) => setHasFittingKit(e.target.checked)}
            {...fieldValidity(
              "hasFittingKit-error",
              fieldErrors.hasFittingKit?.[0],
            )}
          />
          <span>
            I have the vehicle-specific fitting kit, or it is included with the
            Multimac being delivered to you. Fitting kits are unique to make,
            model and year —{" "}
            <a
              href={MULTIMAC_FITTING_KIT_URL}
              className="font-semibold text-primary underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              order from Multimac
            </a>{" "}
            if you do not have one.
          </span>
        </label>
        <FieldError
          id="hasFittingKit-error"
          message={fieldErrors.hasFittingKit?.[0]}
        />

        <label className="flex items-start gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={orderedFitting}
            onChange={(e) => setOrderedFitting(e.target.checked)}
            {...fieldValidity(
              "orderedFitting-error",
              fieldErrors.orderedFitting?.[0],
            )}
          />
          <span>
            I have ordered the Multimac from{" "}
            <a
              href={MULTIMAC_QUOTE_URL}
              className="font-semibold text-primary underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Multimac
            </a>
            . This booking is for professional fitting only — we do not sell
            the seat.
          </span>
        </label>
        <FieldError
          id="orderedFitting-error"
          message={fieldErrors.orderedFitting?.[0]}
        />
      </fieldset>

      <fieldset>
        <legend className="text-sm font-bold text-primary">
          3. Vehicle details
        </legend>
        <p className="mt-1 text-sm text-muted">
          Fitting kits are car-specific. Please match the vehicle the kit was
          ordered for.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="vehicleMake">Make *</Label>
            <Input
              id="vehicleMake"
              value={vehicleMake}
              onChange={(e) => setVehicleMake(e.target.value)}
              autoComplete="off"
              {...fieldValidity(
                "vehicleMake-error",
                fieldErrors.vehicleMake?.[0],
              )}
            />
            <FieldError
              id="vehicleMake-error"
              message={fieldErrors.vehicleMake?.[0]}
            />
          </div>
          <div>
            <Label htmlFor="vehicleModel">Model *</Label>
            <Input
              id="vehicleModel"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              autoComplete="off"
              {...fieldValidity(
                "vehicleModel-error",
                fieldErrors.vehicleModel?.[0],
              )}
            />
            <FieldError
              id="vehicleModel-error"
              message={fieldErrors.vehicleModel?.[0]}
            />
          </div>
          <div>
            <Label htmlFor="vehicleYear">Year *</Label>
            <Input
              id="vehicleYear"
              inputMode="numeric"
              placeholder="e.g. 2021"
              value={vehicleYear}
              onChange={(e) => setVehicleYear(e.target.value)}
              {...fieldValidity(
                "vehicleYear-error",
                fieldErrors.vehicleYear?.[0],
              )}
            />
            <FieldError
              id="vehicleYear-error"
              message={fieldErrors.vehicleYear?.[0]}
            />
          </div>
          <div>
            <Label htmlFor="vehicleReg">Registration (optional)</Label>
            <Input
              id="vehicleReg"
              value={vehicleReg}
              onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
              autoComplete="off"
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-bold text-primary">
          4. Request a fitting date
        </legend>
        <p className="mt-1 text-sm text-muted">
          Weekdays at Heathrow or Ferndown. We’ll confirm the slot after
          payment — your date is a request, not a guaranteed booking.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-sm font-medium text-foreground">
              Workshop *
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                className={optionClass(branch === "heathrow")}
                onClick={() => setBranch("heathrow")}
              >
                Heathrow (West Drayton)
              </button>
              <button
                type="button"
                className={optionClass(branch === "ferndown")}
                onClick={() => setBranch("ferndown")}
              >
                Ferndown (Wimborne)
              </button>
            </div>
            <FieldError id="branch-error" message={fieldErrors.branch?.[0]} />
          </div>
          <div>
            <Label htmlFor="preferredDate">Preferred date *</Label>
            <Input
              id="preferredDate"
              type="date"
              min={minDate}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              {...fieldValidity(
                "preferredDate-error",
                fieldErrors.preferredDate?.[0],
              )}
            />
            <p className="mt-1 text-xs text-muted">
              Earliest: {formatPreferredDate(minDate)}
            </p>
            <FieldError
              id="preferredDate-error"
              message={fieldErrors.preferredDate?.[0]}
            />
          </div>
          <div>
            <Label htmlFor="preferredTime">Preferred time *</Label>
            <Select
              id="preferredTime"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              {...fieldValidity(
                "preferredTime-error",
                fieldErrors.preferredTime?.[0],
              )}
            >
              <option value="">Select a time</option>
              <option value="morning">Morning (9am – 12pm)</option>
              <option value="afternoon">Afternoon (12pm – 3pm)</option>
              <option value="late">Late afternoon (3pm – 5pm)</option>
            </Select>
            <FieldError
              id="preferredTime-error"
              message={fieldErrors.preferredTime?.[0]}
            />
          </div>
        </div>
      </fieldset>

      <div>
        <Label htmlFor="fittingNotes">Anything else we should know?</Label>
        <Textarea
          id="fittingNotes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. special fitting / floor mounts, Multimac order number, which children will use it"
        />
      </div>

      <div className="rounded-lg bg-primary p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-on-dark">
          Fitting fee
        </p>
        <p className="mt-1 text-3xl font-extrabold">
          {formatGBP(MULTIMAC_FITTING_PRICE_GBP)}
          <span className="ml-2 text-base font-semibold text-white/70">
            including VAT
          </span>
        </p>
        <p className="mt-2 text-sm text-white/70">
          Paid at checkout. We’ll then confirm your requested date.
        </p>
      </div>

      <Button
        type="submit"
        variant="buy"
        size="lg"
        className="w-full rounded-full"
        disabled={submitting}
      >
        {submitting
          ? "Taking you to checkout…"
          : `Continue to checkout — ${formatGBP(MULTIMAC_FITTING_PRICE_GBP)} inc VAT`}
      </Button>
    </form>
  );
}
