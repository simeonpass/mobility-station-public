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
import { VatReliefDialog } from "@/components/product/vat-relief-dialog";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
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
import { getVatPriceDisplay } from "@/lib/vat";

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

  const headline = vat.mode === "always-inc" ? gross : net;
  const wasHeadline = vat.mode === "always-inc" ? wasGross : wasNet;
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
  const canBuy =
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
            {props.isAdaptation ? (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Supplied &amp; fitted
              </span>
            ) : null}
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

          {getBrandLogo(props.manufacturer) ? (
            <div className="mb-3">
              <BrandLogo manufacturer={props.manufacturer} height={36} />
            </div>
          ) : props.manufacturer ? (
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">
              {props.manufacturer}
            </p>
          ) : null}
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl md:text-4xl">
            {props.name}
          </h1>

          <p
            className={`mt-2 text-sm font-medium ${
              stockAvailable ? "text-success" : "text-error"
            }`}
          >
            {optionsOutOfStock ? "Selected option out of stock" : props.stockLabel}
          </p>

          <div className="mt-4 space-y-2">
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
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-sm text-muted">ex VAT</p>
                <VatReliefDialog
                  netPrice={net}
                  grossPrice={gross}
                  variant="link"
                />
              </div>
            ) : null}

            {vat.mode === "always-inc" && headline != null ? (
              <p className="text-sm text-muted">inc. VAT</p>
            ) : null}

            {vat.mode === "no-vat" && headline != null ? (
              <p className="text-sm text-muted">No VAT</p>
            ) : null}

            {props.isAdaptation && props.priceCurrent != null ? (
              <p className="text-xs text-muted">
                Indicative supplied &amp; fitted price — final quote tailored to
                your vehicle
              </p>
            ) : null}
          </div>

          {(motabilityWeekly != null && motabilityWeekly >= 0) ||
          motabilityPrice != null ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3 text-primary-foreground">
              <div>
                <MotabilityLogo variant="white" height={24} className="mb-2" />
                {motabilityWeekly != null && motabilityWeekly > 0 ? (
                  <p className="text-base font-bold">
                    {formatGBP(motabilityWeekly)}/week
                  </p>
                ) : motabilityWeekly === 0 || motabilityPrice === 0 ? (
                  <p className="text-base font-bold">Free of charge</p>
                ) : motabilityPrice != null ? (
                  <p className="text-base font-bold">
                    {formatGBP(motabilityPrice)}{" "}
                    {props.isAdaptation ? "advance payment" : "contribution"}
                  </p>
                ) : null}
                {adaptationId ? (
                  <p className="mt-0.5 text-[11px] opacity-80">
                    Code: {adaptationId}
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

          {props.isAdaptation ? (
            <div className="mt-4 grid gap-2 rounded-xl border border-border bg-soft p-4 text-sm sm:grid-cols-3">
              <div>
                <p className="font-semibold text-primary">Workshop fitting</p>
                <p className="mt-0.5 text-xs text-muted">
                  Included at Heathrow or Ferndown
                </p>
              </div>
              <div>
                <p className="font-semibold text-primary">Mobile fitting</p>
                <p className="mt-0.5 text-xs text-muted">Ask us where possible</p>
              </div>
              <div>
                <p className="font-semibold text-primary">Vehicle collection</p>
                <p className="mt-0.5 text-xs text-muted">
                  Available at reasonable cost
                </p>
              </div>
            </div>
          ) : null}

          {!props.isAdaptation && props.deliveryEstimate ? (
            <p className="mt-3 text-sm text-muted">
              Delivery: {props.deliveryEstimate}
            </p>
          ) : null}

          {!props.isAdaptation ? (
            <div className="mt-5">
              <DeliveryChecker weight={props.weight} compact />
              <p className="mt-2 text-xs text-muted">
                <Link href="/delivery" className="underline hover:text-primary">
                  Delivery &amp; returns information
                </Link>
              </p>
            </div>
          ) : null}

          {!props.isAdaptation && hasConfigurableOptions ? (
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
            {props.isAdaptation ? (
              <>
                <Link
                  href={`/contact?interest=adaptation&product=${encodeURIComponent(props.slug)}`}
                  className="flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3 text-center font-semibold text-accent-foreground hover:bg-accent-hover"
                >
                  Get a free quotation
                </Link>
                <Link
                  href={`/book-a-demo?type=adaptation&product=${encodeURIComponent(props.slug)}`}
                  className="flex w-full items-center justify-center rounded-xl border border-primary px-6 py-3 text-center font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Book a home demo
                </Link>
                <p className="text-xs leading-relaxed text-muted">
                  Adaptations aren&apos;t available for online checkout because
                  fitting depends on your vehicle. We&apos;ll confirm
                  compatibility and a firm price before any work starts.
                </p>
              </>
            ) : canBuy && hasConfigurableOptions ? (
              <div className="space-y-2">
                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="buy"
                    className="w-full rounded-xl"
                    onClick={handleAddConfigured}
                  >
                    Add to cart
                  </Button>
                  <Link
                    href={`/book-a-demo?product=${encodeURIComponent(props.slug)}`}
                    className="flex w-full items-center justify-center rounded-xl border border-primary px-6 py-3 text-center font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    Book a home demo
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
              <Link
                href={`/contact?interest=quote&product=${encodeURIComponent(props.slug)}`}
                className="flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3 text-center font-semibold text-accent-foreground hover:bg-accent-hover"
              >
                Request a quote
              </Link>
            ) : null}
            <a
              href="tel:08007723870"
              className="flex w-full rounded-xl border border-primary px-6 py-3 text-center font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Call 0800 772 3870
            </a>
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {props.isAdaptation ? (
              <>
                <li>Workshop fitting included</li>
                <li>Motability accredited</li>
                <li>Home visit available</li>
              </>
            ) : (
              <>
                <li>Free UK delivery</li>
                <li>Motability options</li>
                <li>Home demonstration</li>
              </>
            )}
          </ul>

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
