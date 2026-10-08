"use client";

import { useActionState } from "react";
import { submitEnquiry, type ActionState } from "@/lib/actions";
import { FormSpamTraps } from "@/components/forms/form-spam-traps";
import { FieldError, FormError, fieldValidity } from "@/components/forms/field-error";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initial: ActionState = { success: false };

export function ServiceRequestForm() {
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  return (
    <form action={action} className="relative space-y-5">
      <FormSpamTraps />
      <input type="hidden" name="enquiry_type" value="service" />
      <input type="hidden" name="preferred_branch" value="either" />
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { name: "name", label: "Your name", type: "text", autoComplete: "name" },
          { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
          { name: "email", label: "Email address", type: "email", autoComplete: "email" },
          { name: "postcode", label: "Postcode", type: "text", autoComplete: "postal-code" },
        ].map((field) => <div key={field.name}>
          <Label htmlFor={`service-${field.name}`}>{field.label}</Label>
          <Input id={`service-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} required {...fieldValidity(`service-${field.name}-error`, state.errors?.[field.name]?.[0])} />
          <FieldError id={`service-${field.name}-error`} message={state.errors?.[field.name]?.[0]} />
        </div>)}
      </div>
      <div>
        <Label htmlFor="service-interest">What needs looking at?</Label>
        <Select id="service-interest" name="interest" required defaultValue="" {...fieldValidity("service-interest-error", state.errors?.interest?.[0])}>
          <option value="" disabled>Choose your equipment</option>
          <option>Mobility scooter</option><option>Wheelchair or powerchair</option><option>Vehicle adaptation</option><option>Something else / not sure</option>
        </Select>
        <FieldError id="service-interest-error" message={state.errors?.interest?.[0]} />
      </div>
      <div><Label htmlFor="service-message">Anything we should know? (optional)</Label><Textarea id="service-message" name="message" rows={3} maxLength={2000} placeholder="The make or model, a fault, or simply that it is due a service." /></div>
      <FormError message={!state.success ? state.message : null} />
      <Button type="submit" size="lg" disabled={pending} className="w-full">{pending ? "Sending…" : "Request a service or repair"}</Button>
      <p className="text-sm leading-relaxed text-muted">We’ll contact you to confirm the work, cost and appointment.</p>
    </form>
  );
}
