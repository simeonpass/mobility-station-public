"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Phone, Shield, Truck } from "lucide-react";
import {
  AddToCartButton,
  StickyBuyBar,
} from "@/components/product/add-to-cart-button";
import { BrandLogo } from "@/components/product/brand-logo";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductGallery } from "@/components/product/product-gallery";
import { FittedBadge } from "@/components/product/fitted-badge";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { ProductOptionsSelector } from "@/components/product/product-options-selector";
import { ProductPurchaseReassurance } from "@/components/product/product-purchase-reassurance";
import { TakeawayCallout } from "@/components/product/takeaway-callout";
import { VatReliefDialog } from "@/components/product/vat-relief-dialog";
import { AdaptationFittingGuide } from "@/components/product/adaptation-fitting-guide";
import { ShopBuyingGuide } from "@/components/product/shop-buying-guide";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  addonCartLineId,
  configuredCartLineId,
  type CartProduct,
} from "@/lib/cart";
import { getBrandLogo } from "@/lib/brand-logos";
import {
  addonLinePrice,
  formatGBP,
  priceWithVariants,
  type ProductListItem,
  type ProductVariant,
} from "@/lib/products";
import {
  isTakeawayEligibleProduct,
  takeawayCreditForPrice,
} from "@/lib/takeaway-credit";
import { cn } from "@/lib/utils";
import { getVatPriceDisplay, UK_VAT_PERCENT } from "@/lib/vat";

export type ProductDetailViewProps = {
  name: string;
  slug: string;
  manufacturer: string | null;
  category: string | null;
  condition: ProductListItem["condition"];
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
  adaptationId: string | null;
  isAdaptation: boolean;
  deliveryEstimate: string | null;
  trackStock?: boolean;
  weight: number | null;
  colourOptions: string[];
  variants: ProductVariant[];
  /** Base cart product without option configuration. */
  cartProduct: CartProduct | null;
  discontinuedMessage: string | null;
  description: string | null;
  features: string[];
  suitabilityInfo: string | null;
  specs: Array<[string, string]>;
  videoEmbed: string | null;
  /** Motability catalogue context: weekly price only, no retail checkout. */
  motabilityMode?: boolean;
};

export function ProductDetailView(props: ProductDetailViewProps) {
  const buyRef = useRef<HTMLDivElement | null>(null);
  const { addItem } = useCart();
  const [selectedByGroup, setSelectedByGroup] = useState<
    Record<string, ProductVariant>
  >({});
  const [selectedAddons, setSelectedAddons] = useState<ProductVariant[]>([]);
  const [galleryOverride, setGalleryOverride] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  /** Lovable-style: default shows VAT relief; toggle reveals inc. VAT. */
  const [showIncVat, setShowIncVat] = useState(false);

  const selectedOptions = useMemo(
    () => Object.values(selectedByGroup),
    [selectedByGroup],
  );

  const configuredPrice = useMemo(() => {
    if (!selectedOptions.length) {
      return { current: props.priceCurrent, was: props.priceWas };
    }
    return priceWithVariants(
      {
        unit_price: props.priceWas ?? props.priceCurrent,
        sale_price:
          props.priceWas != null ? props.priceCurrent : null,
      },
      selectedOptions,
    );
  }, [props.priceCurrent, props.priceWas, selectedOptions]);

  const addonTotal = useMemo(
    () => selectedAddons.reduce((sum, a) => sum + addonLinePrice(a), 0),
    [selectedAddons],
  );

  const vat = getVatPriceDisplay({
    unit_price:
      configuredPrice.was != null
        ? configuredPrice.was
        : configuredPrice.current,
    sale_price:
      configuredPrice.was != null ? configuredPrice.current : null,
    category: props.category,
    name: props.name,
    condition: props.condition,
  });
  const net = configuredPrice.current ?? vat.net;
  const wasNet = configuredPrice.was ?? vat.wasNet;
  const gross =
    net != null && vat.mode !== "no-vat" ? (vat.gross ?? net) : net;
  const wasGross =
    wasNet != null && vat.mode !== "no-vat"
      ? (vat.wasGross ?? wasNet)
      : wasNet;

  const headline =
    vat.mode === "always-inc"
      ? gross
      : vat.mode === "relief" && showIncVat
        ? gross
        : net;
  const wasHeadline =
    vat.mode === "always-inc"
      ? wasGross
      : vat.mode === "relief" && showIncVat
        ? wasGross
        : wasNet;
  const priceLabel = headline == null ? "POA" : formatGBP(headline);

  const motabilityFromVariant = selectedOptions.find(
    (v) => v.motability_weekly_price != null || v.motability_price != null,
  );
  const motabilityWeekly =
    motabilityFromVariant?.motability_weekly_price ?? props.motabilityWeekly;
  const motabilityPrice =
    motabilityFromVariant?.motability_price ?? props.motabilityPrice;
  const adaptationId =
    motabilityFromVariant?.adaptation_id ||
    motabilityFromVariant?.motability_crn ||
    selectedOptions.find((v) => v.adaptation_id || v.motability_crn)
      ?.adaptation_id ||
    selectedOptions.find((v) => v.motability_crn)?.motability_crn ||
    props.adaptationId;

  const trackedVariant = selectedOptions.find((v) => v.track_stock);
  const optionsOutOfStock = selectedOptions.some(
    (v) => v.track_stock && (v.quantity ?? 0) <= 0,
  );
  const stockAvailable =
    props.stockAvailable &&
    !optionsOutOfStock &&
    (trackedVariant
      ? !trackedVariant.track_stock || (trackedVariant.quantity ?? 0) > 0
      : true);

  const gallery = useMemo(() => {
    if (!galleryOverride) return props.gallery;
    if (props.gallery.includes(galleryOverride)) return props.gallery;
    return [galleryOverride, ...props.gallery];
  }, [galleryOverride, props.gallery]);

  const optionSummary = selectedOptions
    .map((v) => v.label)
    .filter(Boolean)
    .join(", ");

  const configuredCartProduct = useMemo((): CartProduct | null => {
    if (!props.cartProduct || net == null || net <= 0) return null;
    const variantIds = selectedOptions.map((v) => v.id);
    const id = configuredCartLineId(props.cartProduct.stockItemId, variantIds);
    return {
      ...props.cartProduct,
      id,
      name: optionSummary
        ? `${props.name} — ${optionSummary}`
        : props.name,
      unit_price:
        configuredPrice.was != null
          ? configuredPrice.was
          : configuredPrice.current ?? props.cartProduct.unit_price,
      sale_price:
        configuredPrice.was != null ? configuredPrice.current : null,
      image_url: galleryOverride || props.cartProduct.image_url,
      variantIds: variantIds.length ? variantIds : undefined,
      optionSummary: optionSummary || undefined,
      addonVariantId: undefined,
    };
  }, [
    props.cartProduct,
    props.name,
    net,
    selectedOptions,
    optionSummary,
    configuredPrice,
    galleryOverride,
  ]);

  function handleAddConfigured() {
    if (!configuredCartProduct) return;
    const result = addItem(configuredCartProduct, 1);
    if (!result.ok) {
      setCartMessage(result.message || "Could not add to cart");
      return;
    }

    for (const addon of selectedAddons) {
      const amount = addonLinePrice(addon);
      if (amount <= 0 && !addon.unit_price && !addon.sale_price) {
        // Still allow £0 / included extras as £0 lines if labelled
      }
      const parent = props.cartProduct!;
      const addonProduct: CartProduct = {
        ...parent,
        id: addonCartLineId(parent.stockItemId, addon.id),
        stockItemId: parent.stockItemId,
        name: addon.label || "Optional extra",
        unit_price: amount,
        sale_price: null,
        image_url: addon.image_url || parent.image_url,
        variantIds: undefined,
        addonVariantId: addon.id,
        optionSummary: undefined,
      };
      addItem(addonProduct, 1);
    }

    setCartMessage("Added to cart");
  }

  const sections = [
    props.description
      ? {
          id: "description",
          title: "Description",
          defaultOpen: true,
          content: (
            <div className="space-y-4 text-[15px] leading-7 text-foreground/90 sm:text-base sm:leading-8">
              {props.description
                .split(/\n{2,}/)
                .map((para) => para.trim())
                .filter(Boolean)
                .map((para) => (
                  <p key={para.slice(0, 48)} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
            </div>
          ),
        }
      : null,
    props.features.length
      ? {
          id: "features",
          title: "Key features",
          content: (
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
              {props.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 rounded-xl bg-soft/70 px-3.5 py-3 text-[15px] leading-snug text-foreground/90"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/25 text-xs font-bold text-primary"
                    aria-hidden
                  >
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
            <div className="space-y-3 rounded-xl border border-border/80 bg-soft/50 px-4 py-4 text-[15px] leading-7 text-foreground/90 sm:px-5 sm:py-5 sm:text-base sm:leading-8">
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
            <dl className="overflow-hidden rounded-xl border border-border">
              {props.specs.map(([key, value], index) => (
                <div
                  key={key}
                  className={cn(
                    "grid grid-cols-1 gap-1 px-4 py-3.5 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-baseline sm:gap-6 sm:px-5",
                    index % 2 === 0 ? "bg-soft/60" : "bg-white",
                    index > 0 ? "border-t border-border/70" : null,
                  )}
                >
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="text-[15px] font-semibold text-primary">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          ),
        }
      : null,
    props.isAdaptation
      ? {
          id: "fitting",
          title: "Fitting & coverage",
          content: <AdaptationFittingGuide />,
        }
      : !props.motabilityMode
        ? {
            id: "buying",
            title: "Delivery & buying",
            content: <ShopBuyingGuide />,
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

  const hasConfigurableOptions = props.variants.length > 0;
  const motabilityMode = Boolean(props.motabilityMode);
  const canBuy =
    !motabilityMode &&
    !props.isAdaptation &&
    configuredCartProduct &&
    stockAvailable &&
    headline != null;

  const takeawayCredit =
    !motabilityMode &&
    !props.isAdaptation &&
    isTakeawayEligibleProduct({
      category: props.category,
      name: props.name,
    }) &&
    props.priceCurrent != null
      ? takeawayCreditForPrice(props.priceCurrent)
      : 0;

  const previewFeatures = !props.isAdaptation
    ? props.features.slice(0, 4)
    : [];

  const panelClass =
    "overflow-hidden rounded-2xl border border-border/70 bg-white shadow-[0_8px_32px_-12px_rgba(0,63,67,0.14)]";

  const hasMotabilityFigure =
    (motabilityWeekly != null && motabilityWeekly >= 0) ||
    motabilityPrice != null;

  return (
    <>
      <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <ProductGallery
            images={gallery}
            name={props.name}
            showFittingPartner={props.isAdaptation}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {motabilityMode ? (
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-border">
                  <MotabilityLogo height={16} />
                </span>
              ) : null}
              {props.isAdaptation ? <FittedBadge size="md" /> : null}
              {props.used && props.conditionLabel && !motabilityMode ? (
                <span className="rounded-full bg-error px-3 py-1 text-xs font-semibold text-white">
                  Clearance · {props.conditionLabel}
                </span>
              ) : null}
              {props.conditionGrade && !motabilityMode ? (
                <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">
                  {props.conditionGrade}
                </span>
              ) : null}
              {props.saleSaveLabel && !motabilityMode ? (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {props.saleSaveLabel}
                </span>
              ) : null}
              {props.category && props.isAdaptation && !motabilityMode ? (
                <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">
                  {props.category}
                </span>
              ) : null}
            </div>

            {props.manufacturer && !props.isAdaptation ? (
              <p className="text-sm font-medium capitalize text-primary">
                {props.manufacturer}
              </p>
            ) : null}
            <h1 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-primary sm:text-3xl lg:text-[2.15rem]">
              {props.name}
            </h1>

            {getBrandLogo(props.manufacturer) ? (
              <div className="mt-3">
                <BrandLogo
                  manufacturer={props.manufacturer}
                  height={props.isAdaptation ? 48 : 36}
                />
              </div>
            ) : props.manufacturer && props.isAdaptation ? (
              <p className="mt-2 text-sm text-muted">{props.manufacturer}</p>
            ) : null}

            {previewFeatures.length > 0 ? (
              <ul className="mt-4 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                {previewFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm leading-snug text-foreground/85"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {motabilityMode ? (
            <div className={panelClass}>
              <div className="space-y-4 px-5 py-5 sm:px-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Motability scheme price
                  </p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    {motabilityWeekly != null && motabilityWeekly > 0 ? (
                      <>
                        <span className="text-4xl font-extrabold tabular-nums tracking-tight text-primary sm:text-5xl">
                          {formatGBP(motabilityWeekly)}
                        </span>
                        <span className="text-base font-semibold text-muted">
                          / week
                        </span>
                      </>
                    ) : motabilityWeekly === 0 || motabilityPrice === 0 ? (
                      <span className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        £0 / week
                      </span>
                    ) : (
                      <span className="text-2xl font-extrabold text-primary">
                        Weekly price on request
                      </span>
                    )}
                  </div>
                  {adaptationId ? (
                    <p className="mt-2 text-xs text-muted">Code {adaptationId}</p>
                  ) : null}
                </div>
              </div>
              <div ref={buyRef} className="space-y-3 border-t border-border/60 bg-soft/50 px-5 py-5 sm:px-6">
                <Link
                  href={`/book-a-demo?product=${encodeURIComponent(props.slug)}`}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 text-center text-base font-semibold text-accent-foreground hover:bg-accent-hover"
                >
                  Book a Motability demonstration
                </Link>
                <EnquiryDialog
                  mode="callback"
                  title="Contact us about this model"
                  defaultTopic="Motability"
                  productSlug={props.slug}
                  productLabel={props.name}
                  triggerClassName="flex h-12 w-full items-center justify-center rounded-xl border border-primary/25 bg-white px-6 text-center font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Contact us about this model
                </EnquiryDialog>
                <p className="text-center text-[11px] leading-relaxed text-muted">
                  Not available through online checkout · Branch demos free ·
                  Accredited dealer
                </p>
              </div>
            </div>
          ) : props.isAdaptation ? (
            <div className={panelClass}>
              <div className="space-y-5 border-b border-border/60 px-5 py-5 sm:px-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {headline != null ? "From" : "Price"}
                  </p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    {headline != null ? (
                      <span className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                        {formatGBP(headline)}
                      </span>
                    ) : (
                      <span className="text-3xl font-bold tracking-tight text-primary">
                        Quote on request
                      </span>
                    )}
                    {wasHeadline ? (
                      <span className="text-lg text-muted line-through">
                        RRP {formatGBP(wasHeadline)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    Supplied &amp; fitted — final quote tailored to your vehicle
                  </p>

                  {vat.mode === "relief" && net != null && gross != null ? (
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft/60 px-3 py-1.5">
                        <Switch
                          id="vat-toggle-adaptation"
                          checked={showIncVat}
                          onCheckedChange={setShowIncVat}
                          label={`Show price including ${UK_VAT_PERCENT}% VAT`}
                        />
                        <label
                          htmlFor="vat-toggle-adaptation"
                          className="cursor-pointer text-xs font-medium text-foreground"
                        >
                          Show price inc. {UK_VAT_PERCENT}% VAT
                        </label>
                      </div>
                      <VatReliefDialog
                        netPrice={net}
                        grossPrice={gross}
                        variant="link"
                      >
                        About VAT
                      </VatReliefDialog>
                    </div>
                  ) : null}
                </div>

                {hasMotabilityFigure ? (
                  <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-4">
                    <MotabilityLogo height={24} />
                    <p className="min-w-0 flex-1 text-lg font-bold tabular-nums text-primary">
                      {motabilityWeekly != null && motabilityWeekly > 0
                        ? `${formatGBP(motabilityWeekly)} / week`
                        : motabilityWeekly === 0 || motabilityPrice === 0
                          ? "£0"
                          : motabilityPrice != null
                            ? formatGBP(motabilityPrice)
                            : null}
                    </p>
                    {adaptationId ? (
                      <span className="rounded-md border border-border bg-soft/70 px-2 py-1 font-mono text-xs text-muted">
                        {adaptationId}
                      </span>
                    ) : (
                      <Link
                        href="/motability/vehicle-adaptations"
                        className="shrink-0 text-xs font-semibold text-primary underline-offset-2 hover:underline"
                      >
                        Learn more
                      </Link>
                    )}
                  </div>
                ) : null}
              </div>

              <div ref={buyRef} className="space-y-2.5 bg-soft/40 px-5 py-5 sm:px-6">
                <EnquiryDialog
                  mode="enquiry"
                  enquiryType="contact"
                  title="Get a free quotation"
                  defaultInterest={`Vehicle adaptation quotation — ${props.name}`}
                  productSlug={props.slug}
                  triggerClassName="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-accent px-6 text-center text-base font-semibold text-accent-foreground hover:bg-accent-hover sm:h-14"
                >
                  Get a free quotation
                </EnquiryDialog>
                <Link
                  href={`/book-a-demo?type=adaptation&product=${encodeURIComponent(props.slug)}`}
                  className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl border border-primary/25 bg-white px-6 text-center text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Book a demonstration
                </Link>
                <p className="pt-1 text-center text-[11px] leading-relaxed text-muted">
                  Free no-obligation quote · Fitted at Heathrow, Ferndown or
                  mobile where possible
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className={panelClass}>
                {(hasConfigurableOptions || props.colourOptions.length > 0) ? (
                  <div className="space-y-3 border-b border-border/60 px-5 py-5 sm:px-6">
                    {hasConfigurableOptions ? (
                      <ProductOptionsSelector
                        variants={props.variants}
                        selectedByGroup={selectedByGroup}
                        onSelectVariant={(group, variant) =>
                          setSelectedByGroup((prev) => ({
                            ...prev,
                            [group]: variant,
                          }))
                        }
                        selectedAddons={selectedAddons}
                        onToggleAddon={(addon) =>
                          setSelectedAddons((prev) =>
                            prev.some((a) => a.id === addon.id)
                              ? prev.filter((a) => a.id !== addon.id)
                              : [...prev, addon],
                          )
                        }
                        onImageChange={setGalleryOverride}
                      />
                    ) : (
                      <div>
                        <p className="mb-2 text-sm font-semibold text-primary">
                          Colours
                        </p>
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
                    )}
                  </div>
                ) : null}

                <div className="space-y-4 border-b border-border/60 px-5 py-5 sm:px-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                        {headline != null && !hasConfigurableOptions
                          ? "From"
                          : "Price"}
                      </p>
                      <div className="flex flex-wrap items-baseline gap-3">
                        {headline != null ? (
                          <span className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                            {formatGBP(headline)}
                          </span>
                        ) : (
                          <span className="text-4xl font-bold text-primary">
                            POA
                          </span>
                        )}
                        {wasHeadline ? (
                          <span className="text-lg text-muted line-through">
                            RRP {formatGBP(wasHeadline)}
                          </span>
                        ) : null}
                      </div>

                      {addonTotal > 0 ? (
                        <p className="text-sm text-muted">
                          + {formatGBP(addonTotal)} optional extras
                        </p>
                      ) : null}

                      {vat.mode === "relief" && net != null && gross != null ? (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <p className="text-sm text-muted">
                            {showIncVat
                              ? `inc. ${UK_VAT_PERCENT}% VAT`
                              : "VAT relief price"}
                          </p>
                          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft/60 px-3 py-1.5">
                            <Switch
                              id="vat-toggle"
                              checked={showIncVat}
                              onCheckedChange={setShowIncVat}
                              label={`Show price including ${UK_VAT_PERCENT}% VAT`}
                            />
                            <label
                              htmlFor="vat-toggle"
                              className="cursor-pointer text-xs font-medium text-foreground"
                            >
                              Show price inc. {UK_VAT_PERCENT}% VAT
                            </label>
                          </div>
                          <VatReliefDialog
                            netPrice={net}
                            grossPrice={gross}
                            variant="link"
                          >
                            About VAT
                          </VatReliefDialog>
                        </div>
                      ) : null}

                      {vat.mode === "always-inc" && headline != null ? (
                        <p className="text-sm text-muted">
                          inc. {UK_VAT_PERCENT}% VAT
                        </p>
                      ) : null}

                      {vat.mode === "no-vat" && headline != null ? (
                        <p className="text-sm text-muted">No VAT</p>
                      ) : null}
                    </div>

                    {props.stockLabel ? (
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          stockAvailable
                            ? "border border-primary/20 bg-primary/5 text-primary"
                            : "border border-error/25 bg-error/10 text-error"
                        }`}
                      >
                        {optionsOutOfStock
                          ? "Selected option out of stock"
                          : props.stockLabel}
                      </span>
                    ) : null}
                  </div>

                  {takeawayCredit > 0 ? (
                    <TakeawayCallout credit={takeawayCredit} />
                  ) : null}

                  {hasMotabilityFigure ? (
                    <Link
                      href="/motability"
                      className="flex flex-wrap items-center gap-3 rounded-xl bg-primary px-4 py-3 text-primary-foreground transition-opacity hover:opacity-95"
                    >
                      <MotabilityLogo variant="white" height={18} />
                      <p className="min-w-0 flex-1 text-sm font-bold tabular-nums">
                        {motabilityWeekly != null && motabilityWeekly > 0
                          ? `${formatGBP(motabilityWeekly)} / week`
                          : motabilityWeekly === 0 || motabilityPrice === 0
                            ? "£0 / week"
                            : motabilityPrice != null
                              ? formatGBP(motabilityPrice)
                              : null}
                      </p>
                      <span className="text-xs font-semibold text-accent-on-dark">
                        Learn more →
                      </span>
                    </Link>
                  ) : null}
                </div>

                <div ref={buyRef} className="space-y-3 bg-soft/40 px-5 py-5 sm:px-6">
                  {canBuy && hasConfigurableOptions ? (
                    <div className="space-y-2">
                      <div className="flex flex-col gap-2.5">
                        <Button
                          type="button"
                          variant="buy"
                          className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold sm:h-14"
                          onClick={handleAddConfigured}
                        >
                          Add to cart
                        </Button>
                        <Link
                          href={`/book-a-demo?product=${encodeURIComponent(props.slug)}`}
                          className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary/25 bg-white px-6 text-base font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          Book a demonstration
                        </Link>
                      </div>
                      {cartMessage ? (
                        <p className="text-sm text-muted">
                          {cartMessage}
                          {cartMessage === "Added to cart" ? (
                            <>
                              {" "}
                              ·{" "}
                              <Link
                                href="/checkout"
                                className="font-semibold text-primary underline"
                              >
                                Checkout
                              </Link>
                            </>
                          ) : null}
                        </p>
                      ) : null}
                    </div>
                  ) : canBuy && configuredCartProduct ? (
                    <AddToCartButton
                      product={configuredCartProduct}
                      layout="stack"
                    />
                  ) : headline == null ? (
                    <EnquiryDialog
                      mode="enquiry"
                      enquiryType="contact"
                      title="Request a quote"
                      defaultInterest={`Quote request — ${props.name}`}
                      productSlug={props.slug}
                      triggerClassName="flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 text-center font-semibold text-accent-foreground hover:bg-accent-hover"
                    >
                      Request a quote
                    </EnquiryDialog>
                  ) : null}

                  {stockAvailable ? (
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-1 text-xs text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Shield
                          className="h-3.5 w-3.5 text-primary"
                          aria-hidden
                        />
                        UK warranty*
                      </span>
                      <span
                        className="hidden h-3 w-px bg-border sm:block"
                        aria-hidden
                      />
                      <span className="inline-flex items-center gap-1.5">
                        <Truck
                          className="h-3.5 w-3.5 text-primary"
                          aria-hidden
                        />
                        Free UK delivery*
                      </span>
                      <span
                        className="hidden h-3 w-px bg-border sm:block"
                        aria-hidden
                      />
                      <span className="inline-flex items-center gap-1.5">
                        <Phone
                          className="h-3.5 w-3.5 text-primary"
                          aria-hidden
                        />
                        UK support
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              <ProductPurchaseReassurance
                deliveryEstimate={props.deliveryEstimate}
                trackStock={props.trackStock ?? true}
                manufacturer={props.manufacturer}
                weight={props.weight}
              />
            </>
          )}

          {props.discontinuedMessage ? (
            <p className="rounded-xl border border-border bg-soft p-4 text-sm text-muted">
              {props.discontinuedMessage}
            </p>
          ) : null}
        </div>
      </div>

      {sections.length > 0 ? (
        <div className="mt-12 md:mt-16">
          <ProductTabs sections={sections} />
        </div>
      ) : null}

      {canBuy && configuredCartProduct ? (
        <StickyBuyBar
          product={configuredCartProduct}
          priceLabel={priceLabel}
          observeRef={buyRef}
          onAdd={hasConfigurableOptions ? handleAddConfigured : undefined}
        />
      ) : null}

      {canBuy ? <div className="h-20 md:hidden" aria-hidden /> : null}
    </>
  );

}
