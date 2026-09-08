import { formatGBP } from "@/lib/products";

/** Scheme rates and identifiers come directly from the catalogue. Keep zero prices. */
export function motabilityPriceLabel(weekly?: number | null, price?: number | null) {
  if (weekly != null && weekly >= 0) return `${formatGBP(weekly).replace(/\.00$/, "")} / week`;
  if (price != null && price >= 0) return formatGBP(price).replace(/\.00$/, "");
  return null;
}

export function MotabilitySummary({ weekly, price, id }: {
  weekly?: number | null;
  price?: number | null;
  id?: string | null;
}) {
  const label = motabilityPriceLabel(weekly, price);
  if (!label && !id) return null;
  return (
    <p className="ms-motability-summary">
      <span>Motability {label ?? "price on request"}</span>
      {id ? <span className="ms-motability-id">ID {id}</span> : null}
    </p>
  );
}
