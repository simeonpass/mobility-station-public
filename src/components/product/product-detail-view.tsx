"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  AddToCartButton,
  StickyBuyBar,
} from "@/components/product/add-to-cart-button";
import { BrandLogo } from "@/components/product/brand-logo";
import { DeliveryChecker } from "@/components/product/delivery-checker";
import { ProductAccordion } from "@/components/product/product-accordion";
import { ProductGallery } from "@/components/product/product-gallery";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { ProductOptionsSelector } from "@/components/product/product-options-selector";
import { ProductPurchaseReassurance } from "@/components/product/product-purchase-reassurance";
import { VatReliefDialog } from "@/components/product/vat-relief-dialog";
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

  return (
    <>
      <div className="grid items-start gap-6 md:grid-cols-2 md:gap-10 lg:gap-12">
        <ProductGallery images={gallery} name={props.name} />

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2">
            {motabilityMode ? (
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-border">
                <MotabilityLogo height={16} />
              </span>
            ) : null}
            {props.isAdaptation ? (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Supplied &amp; fitted
              </span>
            ) : null}
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
          </div>

          {getBrandLogo(props.manufacturer) ? (
            <div className="mb-3">
              <BrandLogo manufacturer={props.manufacturer} height={52} />
            </div>
          ) : props.manufacturer ? (
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">
              {props.manufacturer}
            </p>
          ) : null}
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl md:text-4xl">
            {props.name}
          </h1>

          {props.category && props.isAdaptation && !motabilityMode ? (
            <p className="mt-2 text-sm text-muted">{props.category}</p>
          ) : props.stockLabel ? (
            <p
              className={`mt-2 text-sm font-medium ${
                stockAvailable ? "text-success" : "text-error"
              }`}
            >
              {optionsOutOfStock
                ? "Selected option out of stock"
                : props.stockLabel}
            </p>
          ) : null}

          <div className="mt-4 space-y-2">
            {motabilityMode ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  From your Motability allowance
                </p>
                <div className="flex flex-wrap items-baseline gap-2">
                  {motabilityWeekly != null && motabilityWeekly > 0 ? (
                    <>
                      <span className="text-3xl font-extrabold tabular-nums text-primary">
                        {formatGBP(motabilityWeekly)}
                      </span>
                      <span className="text-base font-semibold text-muted">
                        / week
                      </span>
                    </>
                  ) : motabilityWeekly === 0 || motabilityPrice === 0 ? (
                    <span className="text-3xl font-extrabold text-primary">
                      £0 / week
                    </span>
                  ) : (
                    <span className="text-2xl font-extrabold text-primary">
                      Weekly price on request
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted">
                  Indicative Motability weekly figure — not a retail purchase
                  price. Confirmed at assessment.
                </p>
                {adaptationId ? (
                  <p className="text-xs text-muted">Code: {adaptationId}</p>
                ) : null}
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-baseline gap-2">
                  {headline != null ? (
                    <>
                      {!hasConfigurableOptions ? (
                        <span className="text-sm text-muted">From</span>
                      ) : null}
                      <span className="text-3xl font-bold text-primary">
                        {formatGBP(headline)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-primary">POA</span>
                  )}
                  {wasHeadline ? (
                    <span className="text-base text-muted line-through">
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
                    <div className="flex items-center gap-2">
                      <Switch
                        id="vat-toggle"
                        checked={showIncVat}
                        onCheckedChange={setShowIncVat}
                        label={`Show price including ${UK_VAT_PERCENT}% VAT`}
                      />
                      <label
                        htmlFor="vat-toggle"
                        className="cursor-pointer text-sm text-muted"
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

                {props.isAdaptation && props.priceCurrent != null ? (
                  <p className="text-sm text-muted">
                    Indicative supplied &amp; fitted — final quote for your
                    vehicle
                  </p>
                ) : null}
              </>
            )}
          </div>

          {!motabilityMode &&
          props.isAdaptation &&
          ((motabilityWeekly != null && motabilityWeekly >= 0) ||
            motabilityPrice != null) ? (
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary-soft/60 px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <MotabilityLogo height={20} />
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Motability reference
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    {motabilityWeekly != null && motabilityWeekly > 0 ? (
                      <>
                        <span className="text-3xl font-extrabold tabular-nums text-primary">
                          {formatGBP(motabilityWeekly)}
                        </span>
                        <span className="text-base font-semibold text-muted">
                          / week
                        </span>
                      </>
                    ) : motabilityWeekly === 0 || motabilityPrice === 0 ? (
                      <span className="text-3xl font-extrabold text-primary">
                        £0
                      </span>
                    ) : motabilityPrice != null ? (
                      <span className="text-3xl font-extrabold tabular-nums text-primary">
                        {formatGBP(motabilityPrice)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {motabilityWeekly != null && motabilityWeekly > 0
                      ? "Indicative weekly Motability figure"
                      : motabilityWeekly === 0 || motabilityPrice === 0
                        ? "£0 advance payment on Motability"
                        : "Indicative Motability advance payment"}
                    {adaptationId ? ` · Code ${adaptationId}` : ""}
                  </p>
                </div>
                <Link
                  href="/motability/vehicle-adaptations"
                  className="shrink-0 text-sm font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Learn more
                </Link>
              </div>
            </div>
          ) : !motabilityMode &&
            !props.isAdaptation &&
            ((motabilityWeekly != null && motabilityWeekly >= 0) ||
              motabilityPrice != null) ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-primary px-3.5 py-2.5 text-primary-foreground">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
                <MotabilityLogo variant="white" height={18} />
                <p className="text-sm">
                  {motabilityWeekly != null && motabilityWeekly > 0 ? (
                    <>
                      <span className="font-bold tabular-nums">
                        {formatGBP(motabilityWeekly)}/week
                      </span>
                      <span className="text-primary-foreground/75">
                        {" "}
                        on Motability
                      </span>
                    </>
                  ) : motabilityWeekly === 0 || motabilityPrice === 0 ? (
                    <>
                      <span className="font-bold">£0 / week</span>
                      <span className="text-primary-foreground/75">
                        {" "}
                        on Motability
                      </span>
                    </>
                  ) : motabilityPrice != null ? (
                    <>
                      <span className="font-bold tabular-nums">
                        {formatGBP(motabilityPrice)}
                      </span>
                      <span className="text-primary-foreground/75">
                        {" "}
                        contribution on Motability
                      </span>
                    </>
                  ) : null}
                </p>
              </div>
              <Link
                href="/motability"
                className="shrink-0 text-xs font-semibold text-accent-on-dark underline-offset-2 hover:underline"
              >
                Learn more
              </Link>
            </div>
          ) : null}

          {props.isAdaptation ? (
            <p className="mt-3 text-sm text-muted">
              Fitted at Heathrow or Ferndown · mobile where possible ·
              collection available
            </p>
          ) : null}

          {!motabilityMode && !props.isAdaptation ? (
            <div className="mt-5">
              <DeliveryChecker weight={props.weight} compact />
            </div>
          ) : null}

          {!motabilityMode && !props.isAdaptation && hasConfigurableOptions ? (
            <div className="mt-5">
              <ProductOptionsSelector
                variants={props.variants}
                selectedByGroup={selectedByGroup}
                onSelectVariant={(group, variant) =>
                  setSelectedByGroup((prev) => ({ ...prev, [group]: variant }))
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
            </div>
          ) : props.colourOptions.length > 0 ? (
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
            {motabilityMode ? (
              <>
                <Link
                  href={`/book-a-demo?product=${encodeURIComponent(props.slug)}`}
                  className="flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3 text-center font-semibold text-accent-foreground hover:bg-accent-hover"
                >
                  Book a Motability demonstration
                </Link>
                <EnquiryDialog
                  mode="callback"
                  title="Contact us about this model"
                  defaultTopic="Motability"
                  productSlug={props.slug}
                  productLabel={props.name}
                  triggerClassName="flex w-full items-center justify-center rounded-xl border border-primary px-6 py-3 text-center font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Contact us about this model
                </EnquiryDialog>
                <p className="text-xs leading-relaxed text-muted">
                  Motability models aren&apos;t sold through online checkout.
                  Book a free demo or request a callback and we&apos;ll confirm
                  weekly figures and eligibility with you.
                </p>
              </>
            ) : props.isAdaptation ? (
              <>
                <EnquiryDialog
                  mode="enquiry"
                  enquiryType="contact"
                  title="Get a free quotation"
                  defaultInterest={`Vehicle adaptation quotation — ${props.name}`}
                  productSlug={props.slug}
                  triggerClassName="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-accent px-6 text-center text-base font-semibold text-accent-foreground hover:bg-accent-hover"
                >
                  Get a free quotation
                </EnquiryDialog>
                <Link
                  href={`/book-a-demo?type=adaptation&product=${encodeURIComponent(props.slug)}`}
                  className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl border border-primary px-6 text-center text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Book a demonstration
                </Link>
                <p className="text-xs leading-relaxed text-muted">
                  Quoted and fitted to your vehicle — not available for online
                  checkout.
                </p>
              </>
            ) : canBuy && hasConfigurableOptions ? (
              <div className="space-y-2">
                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="buy"
                    className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold"
                    onClick={handleAddConfigured}
                  >
                    Add to cart
                  </Button>
                  <Link
                    href={`/book-a-demo?product=${encodeURIComponent(props.slug)}`}
                    className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary px-6 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
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
            ) : headline == null && !props.isAdaptation ? (
              <EnquiryDialog
                mode="enquiry"
                enquiryType="contact"
                title="Request a quote"
                defaultInterest={`Quote request — ${props.name}`}
                productSlug={props.slug}
                triggerClassName="flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3 text-center font-semibold text-accent-foreground hover:bg-accent-hover"
              >
                Request a quote
              </EnquiryDialog>
            ) : null}
          </div>

          {!motabilityMode && !props.isAdaptation ? (
            <ProductPurchaseReassurance
              deliveryEstimate={props.deliveryEstimate}
            />
          ) : null}

          {motabilityMode ? (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              <li>Weekly Motability figures</li>
              <li>Free Motability demonstrations</li>
              <li>Accredited dealer</li>
            </ul>
          ) : null}

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
