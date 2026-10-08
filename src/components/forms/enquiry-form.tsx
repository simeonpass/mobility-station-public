"use client";

import { useActionState } from "react";
import { submitEnquiry, type ActionState } from "@/lib/actions";
import { FormSpamTraps } from "@/components/forms/form-spam-traps";
import { FieldError, FormError, fieldValidity } from "@/components/forms/field-error";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initial: ActionState = { success: false };

type EnquiryFormProps = {
  enquiryType: "demo" | "service" | "contact" | "hire" | "trade-in";
  title?: string;
  defaultInterest?: string;
  productSlug?: string;
  showBranch?: boolean;
  showDate?: boolean;
  showPostcode?: boolean;
  /** Stay on the page / in a dialog instead of redirecting. */
  inline?: boolean;
  /** Tighter spacing for dialogs. */
  compact?: boolean;
};

export function EnquiryForm({
  enquiryType,
  title,
  defaultInterest = "",
  productSlug,
  showBranch = true,
  showDate = true,
  showPostcode = true,
  inline = false,
  compact = false,
}: EnquiryFormProps) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);

  if (state.success) {
    return (
      <div className="rounded-xl border border-border bg-soft/70 p-5 text-center">
        <p className="text-lg font-extrabold text-primary">Message sent</p>
        <p className="mt-2 text-sm text-muted">
          {state.message ??
            "Thanks — we’ve received your message and will be in touch soon."}
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className={`relative ${compact ? "space-y-3" : "space-y-4"}`}
    >
      <FormSpamTraps />
      {title ? <h2 className="text-2xl font-extrabold">{title}</h2> : null}
      <input type="hidden" name="enquiry_type" value={enquiryType} />
      {inline ? <input type="hidden" name="inline" value="1" /> : null}
      {productSlug ? (
        <input type="hidden" name="product_slug" value={productSlug} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            {...fieldValidity("name-error", state.errors?.name?.[0])}
          />
          <FieldError id="name-error" message={state.errors?.name?.[0]} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            required
            autoComplete="tel"
            {...fieldValidity("phone-error", state.errors?.phone?.[0])}
          />
          <FieldError id="phone-error" message={state.errors?.phone?.[0]} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            {...fieldValidity("email-error", state.errors?.email?.[0])}
          />
          <FieldError id="email-error" message={state.errors?.email?.[0]} />
        </div>
        {showPostcode ? (
          <div>
            <Label htmlFor="postcode">Postcode</Label>
            <Input
              id="postcode"
              name="postcode"
              required
              autoComplete="postal-code"
              {...fieldValidity("postcode-error", state.errors?.postcode?.[0])}
            />
            <FieldError id="postcode-error" message={state.errors?.postcode?.[0]} />
          </div>
        ) : (
          <input type="hidden" name="postcode" value="UB7 8EB" />
        )}
      </div>

      <div>
        <Label htmlFor="interest">
          {enquiryType === "service" ? "Service needed" : "Product / interest"}
        </Label>
        <Input
          id="interest"
          name="interest"
          required
          defaultValue={defaultInterest}
          {...fieldValidity("interest-error", state.errors?.interest?.[0])}
        />
        <FieldError id="interest-error" message={state.errors?.interest?.[0]} />
      </div>

      {showBranch ? (
        <div>
          <Label htmlFor="preferred_branch">Preferred branch</Label>
          <Select
            id="preferred_branch"
            name="preferred_branch"
            defaultValue="either"
          >
            <option value="either">Either / not sure</option>
            <option value="heathrow">Heathrow</option>
            <option value="ferndown">Ferndown</option>
            <option value="mobile">Mobile demo (we come to you)</option>
          </Select>
        </div>
      ) : (
        <input type="hidden" name="preferred_branch" value="either" />
      )}

      {showDate ? (
        <div>
          <Label htmlFor="preferred_date">Preferred date (optional)</Label>
          <Input id="preferred_date" name="preferred_date" type="date" />
        </div>
      ) : null}

      <div>
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea id="message" name="message" rows={compact ? 3 : 4} />
      </div>

      <FormError message={!state.success ? state.message : null} />

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Submit enquiry"}
      </Button>
    </form>
  );
}
