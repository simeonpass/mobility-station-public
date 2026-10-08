import {
  displayPrice,
  isUsedCondition,
  type ProductListItem,
} from "@/lib/products";

export const UK_VAT_RATE = 0.2;
export const UK_VAT_PERCENT = 20;

export function priceIncVat(net: number) {
  return Number((net * (1 + UK_VAT_RATE)).toFixed(2));
}

export function isBatteryOrChargerProduct(p: {
  category?: string | null;
  name?: string | null;
}) {
  const hay = `${p.category ?? ""} ${p.name ?? ""}`.toLowerCase();
  return hay.includes("batter") || hay.includes("charger");
}

export type VatPriceMode = "relief" | "always-inc" | "no-vat";

export type VatPriceDisplay = {
  /** Catalogue net / VAT-relief price (null if POA). */
  net: number | null;
  /** Net + 20% VAT (same as net when mode is no-vat). */
  gross: number | null;
  /** RRP net (was price), if on sale. */
  wasNet: number | null;
  wasGross: number | null;
  mode: VatPriceMode;
  /** Whether the VAT relief chip / dialog should be offered. */
  showRelief: boolean;
};

export function getVatPriceDisplay(
  product: Pick<
    ProductListItem,
    "unit_price" | "sale_price" | "category" | "name" | "condition"
  >,
): VatPriceDisplay {
  const price = displayPrice(product);
  const net = price.current;
  const wasNet = price.was;

  if (net == null) {
    return {
      net: null,
      gross: null,
      wasNet: null,
      wasGross: null,
      mode: "relief",
      showRelief: false,
    };
  }

  if (isUsedCondition(product.condition)) {
    return {
      net,
      gross: net,
      wasNet,
      wasGross: wasNet,
      mode: "no-vat",
      showRelief: false,
    };
  }

  if (isBatteryOrChargerProduct(product)) {
    const gross = priceIncVat(net);
    return {
      net,
      gross,
      wasNet,
      wasGross: wasNet != null ? priceIncVat(wasNet) : null,
      mode: "always-inc",
      showRelief: false,
    };
  }

  return {
    net,
    gross: priceIncVat(net),
    wasNet,
    wasGross: wasNet != null ? priceIncVat(wasNet) : null,
    mode: "relief",
    showRelief: true,
  };
}
