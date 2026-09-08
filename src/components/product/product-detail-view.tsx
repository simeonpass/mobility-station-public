"use client";

import Link from "next/link";
import { MotabilitySummary, motabilityPriceLabel } from "@/components/product/motability-summary";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  AddToCartButton,
  StickyBuyBar,
  StickyEnquiryBar,
} from "@/components/product/add-to-cart-button";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductOptionsSelector } from "@/components/product/product-options-selector";
import { ProductPurchaseReassurance } from "@/components/product/product-purchase-reassurance";
import { TakeawayCallout } from "@/components/product/takeaway-callout";
import { VatReliefDialog } from "@/components/product/vat-relief-dialog";
import { AdaptationFittingGuide } from "@/components/product/adaptation-fitting-guide";
import { ShopBuyingGuide } from "@/components/product/shop-buying-guide";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import {
  addonCartLineId,
  configuredCartLineId,
  type CartProduct,
} from "@/lib/cart";
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
import { getVatPriceDisplay, UK_VAT_PERCENT } from "@/lib/vat";

export type ProductDetailViewProps = {
  reviews?: ReactNode;
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
  /** The displayed VAT basis can be changed without altering cart prices. */
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


  const hasConfigurableOptions = props.variants.length > 0;
  const motabilityMode = Boolean(props.motabilityMode);
  const canBuy = !motabilityMode && !props.isAdaptation && configuredCartProduct && stockAvailable && headline != null;
  const takeawayCredit = !motabilityMode && !props.isAdaptation &&
    isTakeawayEligibleProduct({ category: props.category, name: props.name }) && props.priceCurrent != null
      ? takeawayCreditForPrice(props.priceCurrent) : 0;
  const schemePrice = motabilityPriceLabel(motabilityWeekly, motabilityPrice);
  const descriptionText = props.description?.replace(/,? available now at Lightweight Mobility\.?/gi, ".").replace(/\s+/g, " ").trim() ?? "";
  const firstSentence = descriptionText.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || descriptionText;
  const shortDescription = firstSentence.length > 220 ? firstSentence.slice(0, 217).replace(/\s+\S*$/, "") + "…" : firstSentence;
  const sections: Array<{ id: string; title: string; content: ReactNode }> = [];
  if (props.description) sections.push({
    id: "description", title: props.isAdaptation ? "About this adaptation" : "About this product",
    content: <div className="space-y-4">{props.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}</div>,
  });
  if (props.features.length) sections.push({
    id: "features", title: "Key features",
    content: <ul className="list-disc space-y-2 pl-5">{props.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>,
  });
  if (props.suitabilityInfo) sections.push({
    id: "suitability", title: "Who is it suitable for?",
    content: <div className="space-y-3">{props.suitabilityInfo.split("\n").filter(Boolean).map((line, i) => <p key={i}>{line}</p>)}</div>,
  });
  if (props.specs.length) sections.push({
    id: "specs", title: "Specifications",
    content: <dl className="ms-specifications">{props.specs.map(([key, value]) => <div key={key}><dt>{key.replace(/_/g, " ")}</dt><dd>{value}</dd></div>)}</dl>,
  });
  if (props.isAdaptation) sections.push({ id: "fitting", title: "Compatibility, fitting & aftercare", content: <AdaptationFittingGuide /> });
  else if (!motabilityMode) sections.push({
    id: "buying", title: "Delivery, collection & aftercare",
    content: <div className="space-y-6">
      <ProductPurchaseReassurance deliveryEstimate={props.deliveryEstimate} trackStock={props.trackStock ?? true} manufacturer={props.manufacturer} weight={props.weight} />
      {takeawayCredit > 0 ? <TakeawayCallout credit={takeawayCredit} /> : null}
      <ShopBuyingGuide />
    </div>,
  });
  if (props.videoEmbed) sections.push({
    id: "video", title: "Watch the video",
    content: <div className="aspect-video overflow-hidden rounded-lg bg-soft"><iframe src={props.videoEmbed} title={`${props.name} video`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" /></div>,
  });
  if (props.reviews) sections.push({ id: "reviews", title: "Customer reviews", content: props.reviews });

  return (
    <>
      <div className={`ms-product-detail ${props.isAdaptation ? "ms-product-detail-adaptation" : ""}`}>
        <div className="min-w-0">
          <ProductGallery key={galleryOverride || props.slug} images={gallery} name={props.name} adaptation={props.isAdaptation} />
        </div>
        <div className="ms-product-overview">
          <p className="ms-eyebrow">{props.category || (props.isAdaptation ? "Vehicle adaptations" : "Everyday mobility")}</p>
          <h1>{props.name}</h1>
          <p className="ms-product-introduction">
            {props.isAdaptation
              ? "Specialist advice, a compatibility check and professional fitting for your vehicle. Talk to our team about the right setup for you."
              : shortDescription || "Find the right fit for your everyday journeys, with advice and demonstrations from our team."}
          </p>
          {props.used && !motabilityMode ? <p className="ms-product-condition">{[props.conditionLabel, props.conditionGrade].filter(Boolean).join(" · ")}</p> : null}

          {hasConfigurableOptions && !props.isAdaptation ? (
            <ProductOptionsSelector variants={motabilityMode ? props.variants.filter((v) => !v.is_addon) : props.variants}
              selectedByGroup={selectedByGroup}
              onSelectVariant={(group, variant) => setSelectedByGroup((prev) => ({ ...prev, [group]: variant }))}
              selectedAddons={selectedAddons}
              onToggleAddon={(addon) => setSelectedAddons((prev) => prev.some((a) => a.id === addon.id) ? prev.filter((a) => a.id !== addon.id) : [...prev, addon])}
              onImageChange={setGalleryOverride} />
          ) : !props.isAdaptation && props.colourOptions.length > 0 ? (
            <p className="ms-tax-note">Available colours: {props.colourOptions.map((colour) => colour.split("|")[0].trim()).join(", ")}</p>
          ) : null}

          <div className="ms-product-pricing">
            {motabilityMode ? (
              <>
                <p className="ms-price-label">Motability</p>
                <p className="ms-detail-price">{schemePrice ?? "Price on request"}</p>
                {adaptationId ? <p className="ms-tax-note">Motability ID {adaptationId}</p> : null}
              </>
            ) : (
              <>
                <p className="ms-detail-price">
                  {headline != null ? <><small>{props.isAdaptation || !hasConfigurableOptions ? "From " : ""}</small>{formatGBP(headline).replace(/\.00$/, "")}</> : "Quotation on request"}
                  {wasHeadline ? <del>RRP {formatGBP(wasHeadline).replace(/\.00$/, "")}</del> : null}
                </p>
                {headline != null ? <p className="ms-tax-note">
                  {vat.mode === "relief" ? showIncVat ? `Including ${UK_VAT_PERCENT}% VAT` : "With VAT relief · ex VAT" : vat.mode === "always-inc" ? `Including ${UK_VAT_PERCENT}% VAT` : "No VAT"}
                  {props.isAdaptation ? " · supplied & fitted" : ""}
                </p> : props.isAdaptation ? <p className="ms-tax-note">Supplied &amp; fitted</p> : null}
                {vat.mode === "relief" && net != null && gross != null ? (
                  <div className="ms-vat-options">
                    <button type="button" aria-pressed={showIncVat} onClick={() => setShowIncVat((value) => !value)}>
                      {showIncVat ? "Show VAT relief price" : `Show price including ${UK_VAT_PERCENT}% VAT`}
                    </button>
                    <VatReliefDialog netPrice={net} grossPrice={gross} variant="link">About VAT relief</VatReliefDialog>
                  </div>
                ) : null}
                {addonTotal > 0 ? <p className="ms-tax-note">+ {formatGBP(addonTotal)} selected extras</p> : null}
                <MotabilitySummary weekly={motabilityWeekly} price={motabilityPrice} id={adaptationId} />
                {!props.isAdaptation && props.stockLabel ? <p className={`ms-stock-note ${stockAvailable ? "" : "text-error"}`}>{optionsOutOfStock ? "Selected option out of stock" : props.stockLabel}</p> : null}
              </>
            )}
          </div>

          <div ref={buyRef} className="ms-product-actions">
            {props.isAdaptation ? (
              <>
                <EnquiryDialog mode="enquiry" enquiryType="contact" title="Get a free quotation"
                  defaultInterest={`Vehicle adaptation quotation — ${props.name}`} productSlug={props.slug}
                  triggerClassName="ms-button ms-product-primary">
                  Get a free quotation <ArrowUpRight size={18} aria-hidden />
                </EnquiryDialog>
                <Link href={`/book-a-demo?type=adaptation&product=${encodeURIComponent(props.slug)}`} className="ms-button ms-button-outline">
                  Book a demonstration <ArrowUpRight size={18} aria-hidden />
                </Link>
                <p className="ms-tax-note">Your vehicle and fitting requirements are checked before we confirm your quotation.</p>
              </>
            ) : motabilityMode ? (
              <>
                <Link href={`/book-a-demo?product=${encodeURIComponent(props.slug)}`} className="ms-button ms-product-primary">Book a Motability demonstration <ArrowUpRight size={18} aria-hidden /></Link>
                <EnquiryDialog mode="callback" title="Contact us about this model" defaultTopic="Motability"
                  productSlug={props.slug} productLabel={props.name} triggerClassName="ms-button ms-button-outline">
                  Contact us about this model
                </EnquiryDialog>
                <p className="ms-tax-note">Our team will help with your Motability application.</p>
              </>
            ) : canBuy && hasConfigurableOptions ? (
              <>
                <Button type="button" variant="buy" className="ms-button ms-product-primary" onClick={handleAddConfigured}>Add to cart <ArrowUpRight size={18} aria-hidden /></Button>
                <Link href={`/book-a-demo?product=${encodeURIComponent(props.slug)}`} className="ms-button ms-button-outline">Book a demonstration <ArrowUpRight size={18} aria-hidden /></Link>
                {cartMessage ? <p role="status" className="ms-tax-note">{cartMessage}{cartMessage === "Added to cart" ? <> · <Link href="/checkout" className="underline">Checkout</Link></> : null}</p> : null}
              </>
            ) : canBuy && configuredCartProduct ? (
              <AddToCartButton product={configuredCartProduct} layout="stack" />
            ) : headline == null ? (
              <EnquiryDialog mode="enquiry" enquiryType="contact" title="Request a quote" defaultInterest={`Quote request — ${props.name}`} productSlug={props.slug} triggerClassName="ms-button ms-product-primary">Request a quote</EnquiryDialog>
            ) : (
              <EnquiryDialog mode="callback" title="Ask about availability" defaultTopic="Product availability" productSlug={props.slug} productLabel={props.name} triggerClassName="ms-button ms-product-primary">Ask about availability</EnquiryDialog>
            )}
          </div>
          <p className="ms-product-support">Heathrow &amp; Ferndown · Specialist advice &amp; ongoing support</p>
          {props.discontinuedMessage ? <p className="text-sm text-muted">{props.discontinuedMessage}</p> : null}
        </div>
      </div>
      <ProductTabs sections={sections} />

      {canBuy && configuredCartProduct ? <StickyBuyBar product={configuredCartProduct} priceLabel={priceLabel} observeRef={buyRef} onAdd={hasConfigurableOptions ? handleAddConfigured : undefined} />
        : props.isAdaptation ? <StickyEnquiryBar productName={props.name} priceLabel={priceLabel} observeRef={buyRef}
            primary={<EnquiryDialog mode="enquiry" enquiryType="contact" title="Get a free quotation" defaultInterest={`Vehicle adaptation quotation — ${props.name}`} productSlug={props.slug} triggerClassName="ms-button">Get a quote</EnquiryDialog>} />
        : motabilityMode ? <StickyEnquiryBar productName={props.name} priceLabel={schemePrice ?? "On request"} observeRef={buyRef}
            primary={<Link href={`/book-a-demo?product=${encodeURIComponent(props.slug)}`} className="ms-button">Book a demo</Link>} />
        : null}
    </>
  );
}
