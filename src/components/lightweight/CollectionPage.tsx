import { LightweightProductCard } from "./ProductCard";
import type { LightweightProduct } from "@/lib/lightweight-products";

export function LightweightCollectionPage({ title, intro, products }: { title: string; intro: string; products: LightweightProduct[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-700">Lightweight Mobility</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-700">{intro}</p>
      </div>
      {products.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => <LightweightProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-lg text-slate-700">No matching products are currently published.</div>
      )}
    </section>
  );
}
