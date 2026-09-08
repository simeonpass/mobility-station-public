import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CatalogImage } from "@/components/product/catalog-image";
import { motabilityPriceLabel } from "@/components/product/motability-summary";
import { primaryImage, type ProductListItem } from "@/lib/products";

export function MotabilityProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link href={`/products/${product.slug}?from=motability`} className="ms-catalog-card group">
      <div className="ms-catalog-image">
        <CatalogImage src={primaryImage(product)} alt={product.name} fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-contain transition-transform duration-300 group-hover:scale-[1.025]" />
      </div>
      <div className="ms-catalog-copy">
        <p className="ms-product-category">{product.category || product.manufacturer || "Motability"}</p>
        <h3>{product.name}</h3>
        <p className="ms-catalog-price">{motabilityPriceLabel(product.motability_weekly_price, product.motability_price) ?? "Price on request"}</p>
        <p className="ms-motability-summary">Motability{product.adaptation_id ? <span className="ms-motability-id">ID {product.adaptation_id}</span> : null}</p>
        <span className="ms-catalog-link">Explore this model <ArrowUpRight size={16} aria-hidden /></span>
      </div>
    </Link>
  );
}
