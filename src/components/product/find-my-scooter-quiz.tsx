"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Home,
  MapPin,
  Mountain,
  Package,
  RotateCcw,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import type { QuizProduct } from "@/lib/products";

type UseCase = "indoor" | "around-town" | "long-trips" | "rough-terrain";
type Portability = "boot" | "garage" | "stay-at-home";
type RangeNeed = "short" | "medium" | "long";

type QuizState = {
  useCase?: UseCase;
  portability?: Portability;
  range?: RangeNeed;
};

const TOTAL_STEPS = 3;

const useCaseOptions = [
  {
    value: "indoor" as const,
    label: "Mostly indoors",
    description: "Around the home, shops and corridors.",
    icon: Home,
  },
  {
    value: "around-town" as const,
    label: "Around town",
    description: "Pavements, local shops, café visits.",
    icon: MapPin,
  },
  {
    value: "long-trips" as const,
    label: "Longer trips",
    description: "Days out, longer distances.",
    icon: Car,
  },
  {
    value: "rough-terrain" as const,
    label: "Country & rough ground",
    description: "Parks, trails, gravel paths.",
    icon: Mountain,
  },
];

const portabilityOptions = [
  {
    value: "boot" as const,
    label: "Fits in my car boot",
    description: "I want to take it with me.",
    icon: Package,
  },
  {
    value: "garage" as const,
    label: "Stored in garage / shed",
    description: "I have somewhere safe to keep it.",
    icon: Home,
  },
  {
    value: "stay-at-home" as const,
    label: "Stays at home",
    description: "Driven from the front door.",
    icon: Home,
  },
];

const rangeOptions = [
  {
    value: "short" as const,
    label: "Up to 8 miles",
    description: "Local errands and short visits.",
    icon: User,
  },
  {
    value: "medium" as const,
    label: "8 – 15 miles",
    description: "Confident around-town distance.",
    icon: Users,
  },
  {
    value: "long" as const,
    label: "15+ miles",
    description: "Day trips without recharge worries.",
    icon: Mountain,
  },
];

function scoreProduct(product: QuizProduct, answers: QuizState): number {
  const haystack = [
    product.name,
    product.category,
    product.description,
    JSON.stringify(product.specifications || {}),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let score = 0;
  if (answers.useCase === "indoor") {
    if (/folding|portable|compact|small|class\s*1|pavement/.test(haystack))
      score += 4;
    if ((product.sale_price ?? product.unit_price ?? 9999) < 1500) score += 1;
  }
  if (
    answers.useCase === "around-town" &&
    /mid|class\s*2|4\s*mph|pavement|town/.test(haystack)
  )
    score += 3;
  if (
    answers.useCase === "long-trips" &&
    /8\s*mph|class\s*3|road|long\s*range/.test(haystack)
  )
    score += 4;
  if (
    answers.useCase === "rough-terrain" &&
    /all[-\s]?terrain|pneumatic|off[-\s]?road|rough|trail|suspension/.test(
      haystack,
    )
  )
    score += 5;

  if (answers.portability === "boot") {
    if (/folding|fold|portable|boot|lightweight|travel/.test(haystack))
      score += 5;
    if (/heavy[-\s]duty|all[-\s]?terrain|class\s*3/.test(haystack)) score -= 2;
  }
  if (
    answers.portability === "garage" &&
    /mid[-\s]?size|class\s*2|class\s*3/.test(haystack)
  )
    score += 2;
  if (
    answers.portability === "stay-at-home" &&
    /heavy[-\s]duty|class\s*3|road|all[-\s]?terrain/.test(haystack)
  )
    score += 2;

  const m = haystack.match(/(\d{1,3})\s*mile/);
  const productRange = m ? parseInt(m[1], 10) : null;
  if (productRange) {
    if (answers.range === "short" && productRange <= 12) score += 2;
    if (answers.range === "medium" && productRange >= 8 && productRange <= 20)
      score += 3;
    if (answers.range === "long" && productRange >= 15) score += 4;
  }

  if ((product.quantity ?? 0) > 0) score += 1;
  return score;
}

export function FindMyScooterQuiz({ products }: { products: QuizProduct[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizState>({});
  const [showResults, setShowResults] = useState(false);

  const recommendations = useMemo(() => {
    return [...products]
      .filter((p) => (p.quantity ?? 0) > 0 || p.pre_order_enabled)
      .map((p) => ({ product: p, score: scoreProduct(p, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => r.product);
  }, [products, answers]);

  const currentAnswerSet =
    step === 0
      ? !!answers.useCase
      : step === 1
        ? !!answers.portability
        : !!answers.range;

  const options =
    step === 0
      ? useCaseOptions
      : step === 1
        ? portabilityOptions
        : rangeOptions;

  const selected =
    step === 0
      ? answers.useCase
      : step === 1
        ? answers.portability
        : answers.range;

  return (
    <div className="mx-auto max-w-3xl">
      {!showResults ? (
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-10">
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm text-muted">
              <span>
                Step {step + 1} of {TOTAL_STEPS}
              </span>
              <span>
                {Math.round(((step + 1) / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-soft">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
              {step === 0
                ? "Where will you use it most?"
                : step === 1
                  ? "How will you store or transport it?"
                  : "How far do you usually need to go?"}
            </h2>
            <p className="mt-2 text-muted">
              {step === 0
                ? "The right scooter starts with where you'll be driving it."
                : step === 1
                  ? "This helps us match the right size and weight."
                  : "Range on a single charge — pick what feels comfortable."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {options.map(({ value, label, description, icon: Icon }) => {
              const isSelected = selected === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    if (step === 0)
                      setAnswers({ ...answers, useCase: value as UseCase });
                    else if (step === 1)
                      setAnswers({
                        ...answers,
                        portability: value as Portability,
                      });
                    else
                      setAnswers({ ...answers, range: value as RangeNeed });
                  }}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    isSelected
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-white hover:border-primary/40"
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-soft text-primary"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{label}</p>
                      <p className="mt-1 text-sm text-muted">{description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (step < TOTAL_STEPS - 1) setStep(step + 1);
                else setShowResults(true);
              }}
              disabled={!currentAnswerSet}
              className="gap-2"
            >
              {step === TOTAL_STEPS - 1 ? "See my matches" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center">
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-accent-foreground">
              <Sparkles className="h-4 w-4 text-primary" /> Your top matches
            </p>
            <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
              Scooters that fit your answers
            </h2>
            <p className="mt-2 text-muted">
              Based on your answers, these look like the best fit.
            </p>
          </div>

          {recommendations.length ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {recommendations.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-soft px-4 py-6 text-center text-sm text-muted">
              We couldn&apos;t match products automatically.{" "}
              <Link href="/shop?sub=scooters" className="font-semibold underline">
                Browse scooters
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="font-semibold underline">
                contact us
              </Link>
              .
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => {
                setAnswers({});
                setStep(0);
                setShowResults(false);
              }}
            >
              <RotateCcw className="h-4 w-4" /> Start again
            </Button>
            <Link
              href="/shop?sub=scooters"
              className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              Browse all scooters
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
