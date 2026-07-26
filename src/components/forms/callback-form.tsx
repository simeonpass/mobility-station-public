"use client";

import { useActionState } from "react";
import { submitEnquiry, type ActionState } from "@/lib/actions";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initial: ActionState = { success: false };

const TOPICS = [
  "Scooter or wheelchair advice",
  "Vehicle adaptation",
  "Motability",
  "Hire / Flex Hire",
  "Service or repair",
  "Order or delivery",
  "Something else",
] as const;

export function CallbackForm({
  title = "Request a callback",
  defaultTopic = "",
}: {
  title?: string;
  defaultTopic?: string;
}) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);

  return (
    <form action={action} className="space-y-4">
      {title ? <h2 className="text-2xl font-extrabold">{title}</h2> : null}
      <p className="text-sm text-muted">
        Tell us when to call and what it&apos;s about — we&apos;ll ring you back
        instead of you waiting on hold.
      </p>
      <input type="hidden" name="enquiry_type" value="callback" />
      <input type="hidden" name="preferred_branch" value="either" />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="cb-name">Full name</Label>
          <Input id="cb-name" name="name" required autoComplete="name" />
          {state.errors?.name ? (
            <p className="mt-1 text-xs text-error">{state.errors.name[0]}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="cb-phone">Phone to call you on</Label>
          <Input id="cb-phone" name="phone" required autoComplete="tel" />
          {state.errors?.phone ? (
            <p className="mt-1 text-xs text-error">{state.errors.phone[0]}</p>
          ) : null}
        </div>
      </div>

      <div>
        <Label htmlFor="cb-email">Email (optional)</Label>
        <Input id="cb-email" name="email" type="email" autoComplete="email" />
        {state.errors?.email ? (
          <p className="mt-1 text-xs text-error">{state.errors.email[0]}</p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="cb-interest">What is it about?</Label>
        <Select
          id="cb-interest"
          name="interest"
          required
          defaultValue={defaultTopic || TOPICS[0]}
        >
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="cb-message">Best time to call (and any notes)</Label>
        <Textarea
          id="cb-message"
          name="message"
          rows={3}
          placeholder="e.g. weekday mornings, after 2pm, or leave a short note"
        />
      </div>

      {state.message && !state.success ? (
        <p className="text-sm text-error">{state.message}</p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Request callback"}
      </Button>
    </form>
  );
}
