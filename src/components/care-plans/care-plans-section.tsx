import { Check } from "lucide-react";
import { CarePlanSignupDialog } from "@/components/care-plans/care-plan-signup-dialog";
import { buttonVariants } from "@/components/ui/button";
import { CARE_PLANS, formatCarePlanPrice } from "@/lib/carePlans";
import { cn } from "@/lib/utils";

export function CarePlansSection() {
  return (
    <section id="care-plans" className="scroll-mt-24 border-y border-border bg-soft/50 py-14 md:py-20">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary-dark">
            Mobility Care Plans
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            Keep your scooter or wheelchair looked after
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            Monthly plans from our Heathrow and Ferndown workshops — priority
            booking, parts and labour savings, and support when you need it.
          </p>
        </div>

        <ul className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-stretch lg:gap-5">
          {CARE_PLANS.map((plan) => (
            <li key={plan.key}>
              <article
                className={cn(
                  "relative flex h-full flex-col border bg-white p-6 md:p-7",
                  plan.mostPopular
                    ? "border-primary shadow-[0_20px_50px_-28px_rgba(0,63,67,0.45)] lg:-translate-y-1"
                    : "border-border",
                )}
              >
                {plan.mostPopular ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-md bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                    Most popular
                  </span>
                ) : null}

                <h3 className="text-xl font-extrabold text-primary">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
                <p className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-primary">
                    {plan.priceLabel}
                  </span>
                  <span className="text-sm font-semibold text-muted">/month</span>
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2.5 text-sm leading-snug text-foreground/90"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        aria-hidden
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <CarePlanSignupDialog
                    plan={plan}
                    triggerClassName={cn(
                      buttonVariants({
                        size: "lg",
                        variant: plan.mostPopular ? "default" : "primary",
                      }),
                      "w-full rounded-md",
                    )}
                  >
                    Choose {plan.name}
                  </CarePlanSignupDialog>
                </div>

                <ul className="mt-4 space-y-1 border-t border-border pt-4">
                  {plan.terms.map((term) => (
                    <li key={term} className="text-xs leading-relaxed text-muted">
                      {term}
                    </li>
                  ))}
                </ul>
                <p className="sr-only">{formatCarePlanPrice(plan)}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
