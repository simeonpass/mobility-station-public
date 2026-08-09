"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pollCarePlanVerify } from "@/lib/care-plan-client";
import { getCarePlan } from "@/lib/carePlans";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Phase = "loading" | "active" | "pending" | "error";

export function CarePlanSuccessClient({
  sessionId,
}: {
  sessionId: string | null;
}) {
  const [phase, setPhase] = useState<Phase>(sessionId ? "loading" : "error");
  const [planName, setPlanName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setPhase("error");
      setMessage("Missing payment session. If you’ve paid, call us and we’ll check.");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const result = await pollCarePlanVerify(sessionId);
        if (cancelled) return;
        if (result.status === "active") {
          setPhase("active");
          const fromKey = result.planKey
            ? getCarePlan(result.planKey)?.name
            : null;
          setPlanName(result.planName || fromKey || "your Care Plan");
          return;
        }
        if (result.error) {
          setPhase("error");
          setMessage(result.error);
          return;
        }
        setPhase("pending");
        setMessage(
          "Payment is still confirming. You’ll get an email shortly — or refresh this page in a minute.",
        );
      } catch (err) {
        if (cancelled) return;
        setPhase("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "We couldn’t confirm your plan yet. Please call us.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (phase === "loading") {
    return (
      <div className="max-w-xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
          Confirming your Care Plan…
        </h1>
        <p className="mt-4 text-lg text-muted">
          Just a moment while we check your payment with Stripe.
        </p>
      </div>
    );
  }

  if (phase === "active") {
    return (
      <div className="max-w-xl">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary-dark">
          You’re all set
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
          Welcome to {planName}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground/85">
          Your Care Plan is active. We’ll be in touch from Heathrow or Ferndown
          if we need anything else — keep an eye on your inbox for confirmation.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/book-a-service"
            className={cn(buttonVariants({ size: "lg" }), "rounded-md")}
          >
            Book a service
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-md",
            )}
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
        {phase === "pending" ? "Almost there" : "We need to check something"}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-foreground/85">
        {message ||
          "Your payment may still be processing. If you’ve been charged, call us and we’ll activate your plan."}
      </p>
      <p className="mt-4 text-base text-muted">
        Call{" "}
        <a
          href={SITE.phoneHref}
          className="font-bold text-primary underline underline-offset-2"
        >
          {SITE.phone}
        </a>
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/servicing#care-plans"
          className={cn(buttonVariants({ size: "lg" }), "rounded-md")}
        >
          Back to Care Plans
        </Link>
      </div>
    </div>
  );
}
