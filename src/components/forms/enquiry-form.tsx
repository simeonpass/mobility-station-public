"use client";

import { useActionState } from "react";
import { submitEnquiry, type ActionState } from "@/lib/actions";
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
};

export function EnquiryForm({
  enquiryType,
  title,
  defaultInterest = "",
  productSlug,
  showBranch = true,
  showDate = true,
  showPostcode = true,
}: EnquiryFormProps) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);

  return (
    <form action={action} className="space-y-4">
      {title ? <h2 className="text-2xl font-extrabold">{title}</h2> : null}
      <input type="hidden" name="enquiry_type" value={enquiryType} />
      {productSlug ? (
        <input type="hidden" name="product_slug" value={productSlug} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required autoComplete="name" />
          {state.errors?.name ? (
            <p className="mt-1 text-xs text-error">{state.errors.name[0]}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required autoComplete="tel" />
          {state.errors?.phone ? (
            <p className="mt-1 text-xs text-error">{state.errors.phone[0]}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
          {state.errors?.email ? (
            <p className="mt-1 text-xs text-error">{state.errors.email[0]}</p>
          ) : null}
        </div>
        {showPostcode ? (
          <div>
            <Label htmlFor="postcode">Postcode</Label>
            <Input id="postcode" name="postcode" required autoComplete="postal-code" />
            {state.errors?.postcode ? (
              <p className="mt-1 text-xs text-error">{state.errors.postcode[0]}</p>
            ) : null}
          </div>
        ) : (
          <input type="hidden" name="postcode" value="UB11 1FE" />
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
        />
        {state.errors?.interest ? (
          <p className="mt-1 text-xs text-error">{state.errors.interest[0]}</p>
        ) : null}
      </div>

      {showBranch ? (
        <div>
          <Label htmlFor="preferred_branch">Preferred branch</Label>
          <Select id="preferred_branch" name="preferred_branch" defaultValue="either">
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
        <Textarea id="message" name="message" rows={4} />
      </div>

      {state.message && !state.success ? (
        <p className="text-sm text-error">{state.message}</p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Submit enquiry"}
      </Button>
    </form>
  );
}
