import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CatalogImage } from "@/components/product/catalog-image";
import { MotabilitySummary } from "@/components/product/motability-summary";
import { formatGBP, primaryImage, type ProductListItem } from "@/lib/products";
import { getVatPriceDisplay } from "@/lib/vat";

export function AdaptationCard({ product }: { product: ProductListItem }) {
  const vat = getVatPriceDisplay(product);
  const headline = vat.mode === "always-inc" ? vat.gross : vat.net;
  return (
    <Link href={`/products/${product.slug}`} className="ms-catalog-card ms-adaptation-card group">
      <div className="ms-catalog-image">
        <CatalogImage src={primaryImage(product)} alt={product.name} fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
      </div>
      <div className="ms-catalog-copy">
        {product.category ? <p className="ms-product-category">{product.category}</p> : null}
        <h3>{product.name}</h3>
        <p className="ms-catalog-price">{headline != null ? <><small>From </small>{formatGBP(headline).replace(/\.00$/, "")}</> : "Quotation on request"}</p>
        <p className="ms-tax-note">{vat.mode === "relief" ? "With VAT relief · supplied & fitted" : vat.mode === "always-inc" ? "Including VAT · supplied & fitted" : "Supplied & fitted"}</p>
        <MotabilitySummary weekly={product.motability_weekly_price} price={product.motability_price} id={product.adaptation_id} />
        <span className="ms-catalog-link">View adaptation <ArrowUpRight size={16} aria-hidden /></span>
      </div>
    </Link>
  );
}
