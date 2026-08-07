"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { CatalogImage } from "@/components/product/catalog-image";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { VatReliefDialog } from "@/components/product/vat-relief-dialog";
import { Switch } from "@/components/ui/switch";
import { formatGBP } from "@/lib/products";
import type { ProductListItem } from "@/lib/products";
import { cn } from "@/lib/utils";
import { getVatPriceDisplay, UK_VAT_PERCENT } from "@/lib/vat";

export type AdaptationDetailViewProps = {
  name: string;
  slug: string;
  category: string | null;
  manufacturer: string | null;
  sku: string | null;
  condition: ProductListItem["condition"];
  gallery: string[];
  priceCurrent: number | null;
  priceWas: number | null;
  motabilityWeekly: number | null;
  motabilityPrice: number | null;
  adaptationId: string | null;
  warranty: string | null;
  description: string | null;
  features: string[];
  suitabilityInfo: string | null;
  specs: Array<[string, string]>;
};

/** Split "£2,495.00" into pounds and muted pence so the pence can be de-emphasised. */
function splitPrice(value: number) {
  const formatted = formatGBP(value);
  const dot = formatted.lastIndexOf(".");
  if (dot === -1) return { pounds: formatted, pence: "" };
  return { pounds: formatted.slice(0, dot), pence: formatted.slice(dot) };
}

function toParagraphs(text: string) {
  return text
    .split(/\n{2,}|\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function AdaptationDetailView(props: AdaptationDetailViewProps) {
  const [showIncVat, setShowIncVat] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const vat = getVatPriceDisplay({
    unit_price: props.priceWas != null ? props.priceWas : props.priceCurrent,
    sale_price: props.priceWas != null ? props.priceCurrent : null,
    category: props.category,
    name: props.name,
    condition: props.condition,
  });

  const net = props.priceCurrent ?? vat.net;
  const gross =
    net != null && vat.mode !== "no-vat" ? (vat.gross ?? net) : net;
  const headline =
    vat.mode === "always-inc"
      ? gross
      : vat.mode === "relief" && showIncVat
        ? gross
        : net;
  const showVatToggle = vat.mode === "relief" && net != null && gross != null;

  const onScheme =
    (props.motabilityWeekly != null && props.motabilityWeekly > 0) ||
    props.motabilityPrice != null ||
    Boolean(props.adaptationId);

  const weeklyLabel =
    props.motabilityWeekly != null && props.motabilityWeekly > 0
      ? `From ${formatGBP(props.motabilityWeekly)} per week`
      : props.motabilityWeekly === 0
        ? "£0 per week"
        : props.motabilityPrice != null
          ? formatGBP(props.motabilityPrice)
          : "Ask us about weekly pricing";

  const tabs = useMemo(() => {
    const list: Array<{ id: string; label: string; content: ReactNode }> = [];

    if (props.description) {
      list.push({
        id: "description",
        label: "Description",
        content: (
          <div className="max-w-none space-y-4 text-[15px] leading-relaxed text-primary/80">
            {toParagraphs(props.description).map((para) => (
              <p key={para.slice(0, 48)} className="whitespace-pre-line">
                {para}
              </p>
            ))}
            {props.features.length > 0 ? (
              <ul className="mt-2 space-y-2 border-t border-hairline pt-4">
                {props.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-[15px] leading-snug text-primary/80"
                  >
                    <span
                      className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 bg-accent"
                      aria-hidden
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ),
      });
    }

    if (props.specs.length > 0) {
      list.push({
        id: "specifications",
        label: "Specifications",
        content: (
          <dl className="divide-y divide-hairline border-y border-hairline">
            {props.specs.map(([key, value]) => (
              <div
                key={key}
                className="flex items-baseline justify-between gap-6 py-3"
              >
                <dt className="text-[11px] font-bold uppercase tracking-widest text-primary/50">
                  {key.replace(/_/g, " ")}
                </dt>
                <dd className="text-right font-mono text-sm text-primary">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        ),
      });
    }

    const compatibilityBlocks: ReactNode[] = [];
    if (props.suitabilityInfo) {
      compatibilityBlocks.push(
        ...toParagraphs(props.suitabilityInfo).map((para) => (
          <p key={para.slice(0, 48)} className="whitespace-pre-line">
            {para}
          </p>
        )),
      );
    }
    compatibilityBlocks.push(
      <p key="fitting">
        Every adaptation is quoted around your make, model and year. We confirm a
        firm price once we have checked compatibility, then supply and fit at our
        Heathrow or Ferndown workshops — or mobile where the product and vehicle
        allow.
      </p>,
      <p key="coverage" className="pt-1">
        <Link
          href="/service-area"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          Check your postcode and call-out bands →
        </Link>
      </p>,
    );

    list.push({
      id: "compatibility",
      label: "Compatibility",
      content: (
        <div className="max-w-none space-y-4 text-[15px] leading-relaxed text-primary/80">
          {compatibilityBlocks}
        </div>
      ),
    });

    return list;
  }, [props.description, props.features, props.specs, props.suitabilityInfo]);

  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "description");
  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  const heroSrc = props.gallery[activeImage] ?? props.gallery[0];
  const thumbs = props.gallery.slice(0, 4);
  const price = headline != null ? splitPrice(headline) : null;

  return (
    <div className="grid grid-cols-1 gap-12 py-6 text-primary md:grid-cols-12 md:py-10">
      {/* LEFT (7) */}
      <div className="min-w-0 space-y-8 md:col-span-7">
        <div>
          <div className="mb-4 flex items-center gap-3">
            {onScheme ? (
              <span className="bg-tertiary px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-black">
                Motability
              </span>
            ) : null}
            {props.sku ? (
              <span className="font-mono text-[11px] uppercase tracking-tight text-primary/40">
                REF: {props.sku}
              </span>
            ) : null}
          </div>
          <h1 className="mb-2 text-4xl font-extrabold leading-[0.95] tracking-tight md:text-5xl">
            {props.name}
            {props.category ? (
              <>
                <br />
                <span className="text-primary/40">{props.category}</span>
              </>
            ) : null}
          </h1>
        </div>

        {/* GALLERY */}
        <div className="space-y-4">
          <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border border-hairline bg-panel">
            <CatalogImage
              src={heroSrc}
              alt={props.name}
              fill
              priority
              className="object-contain p-6"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
            <div className="absolute left-4 top-4 border-l-2 border-accent bg-white/90 py-1 pl-3 pr-2 backdrop-blur">
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Approved adaptation installer
              </span>
            </div>
          </div>
          {thumbs.length > 1 ? (
            <div className="grid grid-cols-4 gap-4">
              {thumbs.map((src, index) => (
                <button
                  key={src + index}
                  type="button"
                  aria-label={`Show image ${index + 1}`}
                  aria-current={index === activeImage}
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden bg-panel",
                    index === activeImage
                      ? "border border-primary ring-1 ring-primary"
                      : "border border-hairline",
                  )}
                >
                  <CatalogImage
                    src={src}
                    alt={`${props.name} thumbnail ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* NUMBERED TAB RAIL */}
        <div className="border-b border-hairline">
          <nav className="flex gap-8 overflow-x-auto">
            {tabs.map((tab, index) => {
              const selected = tab.id === active?.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap border-b-2 pb-4 text-[11px] font-bold uppercase tracking-widest transition-colors",
                    selected
                      ? "border-primary text-primary"
                      : "border-transparent text-primary/50 hover:text-primary",
                  )}
                >
                  <span
                    className={selected ? "text-accent" : "text-primary/30"}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div>{active?.content}</div>
      </div>

      {/* RIGHT (5) — sticky buy panel */}
      <div className="md:col-span-5">
        <div className="border border-hairline bg-panel md:sticky md:top-24">
          <div className="h-1.5 w-full bg-accent" />

          <div className="space-y-8 p-6 md:p-8">
            {/* PRICE */}
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary/60">
                    Price from
                  </span>
                  {price ? (
                    <h2 className="text-5xl font-extrabold tracking-tighter [font-variant-numeric:tabular-nums]">
                      {price.pounds}
                      <span className="text-2xl font-bold text-primary/40">
                        {price.pence}
                      </span>
                    </h2>
                  ) : (
                    <h2 className="text-3xl font-extrabold tracking-tight">
                      Quote on request
                    </h2>
                  )}
                </div>
                {price ? (
                  <div className="pb-1 text-right">
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      {vat.mode === "always-inc" ||
                      (vat.mode === "relief" && showIncVat)
                        ? "Inc-VAT"
                        : "Ex-VAT"}
                    </span>
                  </div>
                ) : null}
              </div>

              {showVatToggle ? (
                <>
                  <div className="flex items-center justify-between border-y border-hairline py-3">
                    <label
                      htmlFor="vat-toggle-adaptation"
                      className="cursor-pointer text-xs font-semibold"
                    >
                      Show price including VAT ({UK_VAT_PERCENT}%)
                    </label>
                    <Switch
                      id="vat-toggle-adaptation"
                      checked={showIncVat}
                      onCheckedChange={setShowIncVat}
                      label={`Show price including ${UK_VAT_PERCENT}% VAT`}
                    />
                  </div>
                  <p className="text-[10px] leading-relaxed text-primary/45">
                    You may be eligible for VAT relief if the adaptation is for
                    personal use due to a disability. We confirm eligibility
                    before invoicing.{" "}
                    <VatReliefDialog
                      netPrice={net}
                      grossPrice={gross}
                      variant="link"
                    >
                      About VAT
                    </VatReliefDialog>
                  </p>
                </>
              ) : null}
            </div>

            {/* MOTABILITY */}
            {onScheme ? (
              <div className="flex items-center justify-between border border-hairline bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center bg-tertiary">
                    <span className="text-[8px] font-black">M</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-primary/60">
                      Weekly rental
                    </span>
                    <span className="text-sm font-bold [font-variant-numeric:tabular-nums]">
                      {weeklyLabel}
                    </span>
                  </div>
                </div>
                {props.adaptationId ? (
                  <div className="border border-hairline bg-panel px-2 py-1 font-mono text-[10px] text-primary/50">
                    CODE: {props.adaptationId}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* CTAs */}
            <div className="space-y-3">
              <EnquiryDialog
                mode="enquiry"
                enquiryType="contact"
                title="Get a free quotation"
                defaultInterest={`Vehicle adaptation quotation — ${props.name}`}
                productSlug={props.slug}
                productLabel={props.name}
                triggerClassName="w-full rounded-sm bg-primary py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-primary-hover"
              >
                Get a free quotation
              </EnquiryDialog>
              <Link
                href={`/book-a-demo?type=adaptation&product=${encodeURIComponent(
                  props.slug,
                )}`}
                className="block w-full rounded-sm border border-primary py-4 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/5"
              >
                Book a demonstration
              </Link>
            </div>

            {/* META STRIP */}
            <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
              <div>
                <span className="mb-2 block text-[9px] font-bold uppercase text-primary/40">
                  Installation
                </span>
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((pip) => (
                    <span
                      key={pip}
                      className={cn(
                        "h-1.5 w-1.5",
                        pip < 4 ? "bg-accent" : "bg-hairline",
                      )}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
              {props.warranty ? (
                <div className="text-right">
                  <span className="mb-2 block text-[9px] font-bold uppercase text-primary/40">
                    Warranty
                  </span>
                  <span className="text-xs font-bold">{props.warranty}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
