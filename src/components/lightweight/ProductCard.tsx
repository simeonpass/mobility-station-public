import Link from "next/link";
import { formatPrice, currentPrice, type LightweightProduct } from "@/lib/lightweight-products";

export function LightweightProductCard({ product }: { product: LightweightProduct }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/${product.slug}`} className="block bg-white p-5">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-50">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-contain p-3" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">Image coming soon</div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-5 pb-5">
        {product.manufacturer && <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">{product.manufacturer}</p>}
        <h3 className="mt-2 text-xl font-bold leading-tight text-slate-950">
          <Link href={`/${product.slug}`} className="hover:text-teal-700">{product.name}</Link>
        </h3>
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
          {typeof product.weight === "number" && product.weight > 0 && (
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-800">{product.weight}kg</span>
          )}
          {product.category && <span className="rounded-full bg-slate-100 px-3 py-1">{product.category}</span>}
        </div>
        <div className="mt-auto pt-5">
          <p className="text-2xl font-extrabold text-slate-950">{formatPrice(currentPrice(product))}</p>
          <p className="mt-1 text-sm text-slate-600">VAT relief may be available if you qualify.</p>
          <Link href={`/${product.slug}`} className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-4 text-base font-bold text-white transition hover:bg-teal-800">
            View product
          </Link>
        </div>
      </div>
    </article>
  );
}
