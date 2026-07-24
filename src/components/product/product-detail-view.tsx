"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import {
  AddToCartButton,
  StickyBuyBar,
} from "@/components/product/add-to-cart-button";
import { ProductAccordion } from "@/components/product/product-accordion";
import { ProductGallery } from "@/components/product/product-gallery";
import type { CartProduct } from "@/lib/cart";
import { formatGBP } from "@/lib/products";

export type ProductDetailViewProps = {
  name: string;
  manufacturer: string | null;
  gallery: string[];
  priceCurrent: number | null;
  priceWas: number | null;
  stockLabel: string;
  stockAvailable: boolean;
  used: boolean;
  conditionLabel: string | null;
  conditionGrade: string | null;
  saleSaveLabel: string | null;
  motabilityWeekly: number | null;
  motabilityPrice: number | null;
  deliveryEstimate: string | null;
  colourOptions: string[];
  optionVariants: Array<{
    id: string;
    label: string;
    priceLabel: string;
    outOfStock: boolean;
  }>;
  cartProduct: CartProduct | null;
  discontinuedMessage: string | null;
  description: string | null;
  features: string[];
  suitabilityInfo: string | null;
  specs: Array<[string, string]>;
  videoEmbed: string | null;
};

export function ProductDetailView(props: ProductDetailViewProps) {
  const buyRef = useRef<HTMLDivElement | null>(null);
  const priceLabel =
    props.priceCurrent == null ? "POA" : formatGBP(props.priceCurrent);

  const sections = [
    props.description
      ? {
          id: "description",
          title: "Description",
          defaultOpen: true,
          content: (
            <p className="whitespace-pre-line">{props.description}</p>
          ),
        }
      : null,
    props.features.length
      ? {
          id: "features",
          title: "Key features",
          content: (
            <ul className="space-y-2">
              {props.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="font-bold text-accent" aria-hidden>
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ),
        }
      : null,
    props.suitabilityInfo
      ? {
          id: "suitability",
          title: "Who is it suitable for?",
          content: (
            <div className="space-y-2">
              {props.suitabilityInfo
                .split("\n")
                .filter(Boolean)
                .map((line) => (
                  <p key={line}>{line}</p>
                ))}
            </div>
          ),
        }
      : null,
    props.specs.length
      ? {
          id: "specs",
          title: "Specifications",
          content: (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
              {props.specs.map(([key, value]) => (
                <div key={key} className="border-b border-border py-2">
                  <dt className="capitalize text-muted">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          ),
        }
      : null,
    props.optionVariants.length
      ? {
          id: "options",
          title: "Options & pricing",
          content: (
            <ul className="space-y-2">
              {props.optionVariants.map((variant) => (
                <li
                  key={variant.id}
                  className="flex items-center justify-between border-b border-border py-2"
                >
                  <span>
                    {variant.label}
                    {variant.outOfStock ? (
                      <span className="ml-2 text-muted">(out of stock)</span>
                    ) : null}
                  </span>
                  <span className="font-semibold">{variant.priceLabel}</span>
                </li>
              ))}
            </ul>
          ),
        }
      : null,
    props.videoEmbed
      ? {
          id: "video",
          title: "Video",
          content: (
            <div className="aspect-video overflow-hidden rounded-xl bg-soft">
              <iframe
                src={props.videoEmbed}
                title={`${props.name} video`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ),
        }
      : null,
  ].filter(Boolean) as Array<{
    id: string;
    title: string;
    content: ReactNode;
    defaultOpen?: boolean;
  }>;

  return (
    <>
      <div className="grid items-start gap-6 md:grid-cols-2 md:gap-10 lg:gap-12">
        <ProductGallery images={props.gallery} name={props.name} />

        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {props.used && props.conditionLabel ? (
              <span className="rounded-full bg-error px-3 py-1 text-xs font-semibold text-white">
                Clearance · {props.conditionLabel}
              </span>
            ) : null}
            {props.conditionGrade ? (
              <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">
                Grade {props.conditionGrade}
              </span>
            ) : null}
            {props.saleSaveLabel ? (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {props.saleSaveLabel}
              </span>
            ) : null}
          </div>

          {props.manufacturer ? (
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">
              {props.manufacturer}
            </p>
          ) : null}
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl md:text-4xl">
            {props.name}
          </h1>

          <p
            className={`mt-2 text-sm font-medium ${
              props.stockAvailable ? "text-success" : "text-error"
            }`}
          >
            {props.stockLabel}
          </p>

          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            {props.priceCurrent != null ? (
              <>
                <span className="text-sm text-muted">From</span>
                <span className="text-3xl font-bold text-primary">
                  {formatGBP(props.priceCurrent)}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary">POA</span>
            )}
            {props.priceWas ? (
              <span className="text-base text-muted line-through">
                RRP {formatGBP(props.priceWas)}
              </span>
            ) : null}
          </div>

          {(props.motabilityWeekly != null && props.motabilityWeekly >= 0) ||
          props.motabilityPrice != null ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3 text-primary-foreground">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
                  Motability
                </p>
                {props.motabilityWeekly != null && props.motabilityWeekly > 0 ? (
                  <p className="text-base font-bold">
                    {formatGBP(props.motabilityWeekly)}/week
                  </p>
                ) : props.motabilityWeekly === 0 ||
                  props.motabilityPrice === 0 ? (
                  <p className="text-base font-bold">Free of charge</p>
                ) : props.motabilityPrice != null ? (
                  <p className="text-base font-bold">
                    {formatGBP(props.motabilityPrice)} contribution
                  </p>
                ) : null}
              </div>
              <Link
                href="/motability"
                className="shrink-0 text-xs font-semibold underline opacity-90"
              >
                Learn more
              </Link>
            </div>
          ) : null}

          {props.deliveryEstimate ? (
            <p className="mt-3 text-sm text-muted">
              Delivery: {props.deliveryEstimate}
            </p>
          ) : null}

          {props.colourOptions.length > 0 ? (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-primary">Colours</p>
              <ul className="flex flex-wrap gap-2">
                {props.colourOptions.map((colour) => (
                  <li
                    key={colour}
                    className="rounded-full border border-border px-3 py-1 text-sm"
                  >
                    {colour}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div ref={buyRef} className="mt-6 space-y-3">
            {props.cartProduct && props.stockAvailable ? (
              <AddToCartButton product={props.cartProduct} layout="stack" />
            ) : null}
            <a
              href="tel:08007723870"
              className="flex w-full rounded-xl border border-primary px-6 py-3 text-center font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Call 0800 772 3870
            </a>
          </div>

          {props.discontinuedMessage ? (
            <p className="mt-4 rounded-lg bg-soft p-3 text-sm text-muted">
              {props.discontinuedMessage}
            </p>
          ) : null}

          <div className="mt-8 md:mt-10">
            <ProductAccordion sections={sections} />
          </div>
        </div>
      </div>

      {props.cartProduct && props.stockAvailable ? (
        <StickyBuyBar
          product={props.cartProduct}
          priceLabel={priceLabel}
          observeRef={buyRef}
        />
      ) : null}

      {/* Spacer so sticky bar doesn't cover accordion end on mobile */}
      {props.cartProduct && props.stockAvailable ? (
        <div className="h-20 md:hidden" aria-hidden />
      ) : null}
    </>
  );
}
