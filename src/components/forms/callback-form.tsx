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
  productSlug,
  productLabel,
  inline = false,
  compact = false,
}: {
  title?: string;
  defaultTopic?: string;
  productSlug?: string;
  productLabel?: string;
  /** Stay on the page / in a dialog instead of redirecting. */
  inline?: boolean;
  /** Tighter spacing for dialogs. */
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const topicValue = defaultTopic || TOPICS[0];
  const topicOptions =
    defaultTopic && !TOPICS.includes(defaultTopic as (typeof TOPICS)[number])
      ? [defaultTopic, ...TOPICS]
      : TOPICS;

  if (state.success) {
    return (
      <div className="rounded-xl border border-border bg-soft/70 p-5 text-center">
        <p className="text-lg font-extrabold text-primary">Request sent</p>
        <p className="mt-2 text-sm text-muted">
          {state.message ??
            "Thanks — we’ll call you back shortly during opening hours."}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className={compact ? "space-y-3" : "space-y-4"}>
      {title ? <h2 className="text-2xl font-extrabold">{title}</h2> : null}
      {!compact ? (
        <p className="text-sm text-muted">
          Tell us when to call and what it&apos;s about — we&apos;ll ring you
          back instead of you waiting on hold.
        </p>
      ) : null}
      <input type="hidden" name="enquiry_type" value="callback" />
      <input type="hidden" name="preferred_branch" value="either" />
      {inline ? <input type="hidden" name="inline" value="1" /> : null}
      {productSlug ? (
        <input type="hidden" name="product_slug" value={productSlug} />
      ) : null}

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
          defaultValue={topicValue}
        >
          {topicOptions.map((topic) => (
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
          defaultValue={
            productLabel
              ? `I'd like to talk about ${productLabel} on Motability.`
              : undefined
          }
        />
      </div>

      {state.message && !state.success ? (
        <p className="text-sm text-error">{state.message}</p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Request callback"}
      </Button>
    </form>
  );
}
