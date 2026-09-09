import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import { CatalogImage } from "@/components/product/catalog-image";
import { MotabilitySummary } from "@/components/product/motability-summary";
import { quickViewPayload } from "@/lib/quick-view";
import { conditionGradeMeta, conditionLabel, formatGBP, isUsedCondition, primaryImage, stockStatus, type ProductListItem } from "@/lib/products";
import { getVatPriceDisplay } from "@/lib/vat";
import { CompareButton } from "@/components/product/product-comparison";
import { SCOOTER_CATS, WHEELCHAIR_CATS } from "@/lib/shop-catalogue";

export function ProductCard({ product, compare = false }: { product: ProductListItem; compare?: boolean }) {
  const vat = getVatPriceDisplay(product);
  const used = isUsedCondition(product.condition);
  const grade = conditionGradeMeta(product.condition_grade);
  const stock = stockStatus(product);
  const headline = vat.mode === "always-inc" ? vat.gross : vat.net;
  const wasHeadline = vat.mode === "always-inc" ? vat.wasGross : vat.wasNet;
  const saving = headline != null && wasHeadline != null && wasHeadline > headline ? wasHeadline - headline : 0;
  const clearanceMeta = used ? [conditionLabel(product.condition), grade ? `Grade ${grade.id}` : null].filter(Boolean).join(" · ") : null;

  return (
    <article className="ms-catalog-card group">
      <div className="ms-catalog-image">
        {saving > 0 ? <span className="ms-offer-badge ms-offer-image">Save {formatGBP(saving).replace(/\.00$/, "")}</span> : used ? <span className="ms-offer-badge ms-offer-image">Clearance</span> : null}
        <Link href={`/products/${product.slug}`} className="absolute inset-0">
          <CatalogImage src={primaryImage(product)} alt={product.name} fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.025]" />
        </Link>
        <button type="button" data-quick-view={quickViewPayload(product)}
          className="ms-quick-view" aria-haspopup="dialog" aria-label={`Quick view ${product.name}`}>
          <Eye size={18} aria-hidden />
        </button>
      </div>
      <Link href={`/products/${product.slug}`} className="ms-catalog-copy">
        <p className="ms-product-category">{product.category || product.manufacturer}</p>
        <h3>{product.name}</h3>
        {clearanceMeta ? <p className="ms-tax-note">{clearanceMeta}</p> : null}
        <p className="ms-catalog-price">
          {headline != null ? <>{formatGBP(headline).replace(/\.00$/, "")}</> : "Price on request"}
          {saving > 0 && wasHeadline != null ? <del>RRP {formatGBP(wasHeadline).replace(/\.00$/, "")}</del> : null}
        </p>
        <p className="ms-tax-note">{vat.mode === "relief" ? "With VAT relief · ex VAT" : vat.mode === "always-inc" ? "Including VAT" : "No VAT"}</p>
        <MotabilitySummary weekly={product.motability_weekly_price} price={product.motability_price} id={product.adaptation_id} />
        {!stock.available ? <p className="ms-tax-note">{stock.label}</p> : null}
        <span className="ms-catalog-link">View product <ArrowUpRight size={16} aria-hidden /></span>
      </Link>
      {compare && [...SCOOTER_CATS, ...WHEELCHAIR_CATS].includes(product.category || "") ? <CompareButton product={{ slug: product.slug, name: product.name }} /> : null}
    </article>
  );
}
