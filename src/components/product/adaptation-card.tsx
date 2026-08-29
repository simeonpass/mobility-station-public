import Link from "next/link";
import { BrandLogo } from "@/components/product/brand-logo";
import { CatalogImage } from "@/components/product/catalog-image";
import { FittingPartnerCorner } from "@/components/product/fitted-badge";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { getBrandLogo } from "@/lib/brand-logos";
import { formatGBP, primaryImage, type ProductListItem } from "@/lib/products";
import { getVatPriceDisplay } from "@/lib/vat";

export function AdaptationCard({ product }: { product: ProductListItem }) {
  const vat = getVatPriceDisplay(product); const img = primaryImage(product); const freeMotability = product.motability_price === 0; const hasMotability = freeMotability || (product.motability_price != null && product.motability_price > 0); const headline = vat.mode === "always-inc" ? vat.gross : vat.net;
  return <Link href={`/products/${product.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.3)]">
    <div className="relative aspect-[4/3] overflow-hidden bg-soft/30"><CatalogImage src={img} alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" /><FittingPartnerCorner size="card" /></div>
    <div className="flex flex-1 flex-col p-5"><div>{product.category ? <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{product.category}</p> : null}<div className="mt-2">{getBrandLogo(product.manufacturer) ? <BrandLogo manufacturer={product.manufacturer} height={22} /> : product.manufacturer ? <p className="text-xs font-medium text-muted">{product.manufacturer}</p> : null}</div><h3 className="mt-3 line-clamp-2 min-h-[2.7rem] text-[15px] font-bold leading-snug text-primary">{product.name}</h3></div>
    <div className="mt-5 border-t border-border pt-4">{headline != null ? <div><div className="flex flex-wrap items-baseline gap-2"><span className="text-xs text-muted">From</span><span className="text-xl font-extrabold tabular-nums text-primary">{formatGBP(headline)}</span></div><p className="mt-1 text-[11px] text-muted">{vat.mode === "relief" ? "VAT relief price · supplied & fitted" : vat.mode === "always-inc" ? "inc. VAT · supplied & fitted" : "Supplied & fitted"}</p></div> : <p className="text-sm font-semibold text-primary">Contact for pricing</p>}{hasMotability ? <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-primary"><span>{freeMotability ? "£0 on" : `${formatGBP(product.motability_price)} on`}</span><MotabilityLogo height={22} className="shrink-0" /></div> : null}</div>
    <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary">View details <span className="ml-1 transition-transform group-hover:translate-x-0.5" aria-hidden>→</span></span></div>
  </Link>;
}
