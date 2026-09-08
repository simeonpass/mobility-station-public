import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CatalogImage } from "@/components/product/catalog-image";
import { formatGBP, primaryImage, stockStatus, type ProductListItem } from "@/lib/products";
import { getVatPriceDisplay } from "@/lib/vat";
export function HomeProductCard({ product, adaptation = false }: { product: ProductListItem; adaptation?: boolean }) {
  const vat = getVatPriceDisplay(product);
  const price = vat.mode === "always-inc" ? vat.gross : vat.net;
  const stock = stockStatus(product);
  return <Link href={`/products/${product.slug}`} className="ms-product-card">
    <div className="ms-product-image"><CatalogImage src={primaryImage(product)} alt={product.name} fill sizes="(max-width: 780px) 46vw, 23vw" /><span className="ms-product-arrow"><ArrowUpRight size={18} aria-hidden /></span></div>
    <div className="ms-product-copy"><p className="ms-product-category">{product.category}</p><h3>{product.name}</h3><p className="ms-product-price">{price == null ? "Contact for pricing" : <><small>From </small>{formatGBP(price)}</>}</p><p className="ms-tax-note">{vat.mode === "always-inc" ? "Including VAT" : vat.mode === "no-vat" ? "No VAT" : "With VAT relief"}{adaptation ? " · supplied & fitted" : vat.mode === "relief" ? " · ex VAT" : ""}</p>{!adaptation && !stock.available && <p className="ms-tax-note">{stock.label}</p>}</div>
  </Link>;
}
