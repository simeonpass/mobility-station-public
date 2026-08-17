import Link from "next/link";
import { Truck, BadgePoundSterling, ShieldCheck, Headphones, Weight, CarFront, Plane } from "lucide-react";
import { LightweightProductCard } from "@/components/lightweight/ProductCard";
import { getLightweightProducts, isScooter, isPoweredWheelchair, underWeight } from "@/lib/lightweight-products";

export const revalidate = 300;

const needs = [
  { href: "/under-20kg", title: "Under 20kg", copy: "Our easiest models to lift", icon: Weight },
  { href: "/under-25kg", title: "Under 25kg", copy: "Lightweight everyday choices", icon: Weight },
  { href: "/under-30kg", title: "Under 30kg", copy: "More comfort, still portable", icon: Weight },
  { href: "/folding-scooters", title: "Folds for travel", copy: "Built for simple transport", icon: CarFront },
  { href: "/mobility-scooters", title: "Car-boot friendly", copy: "Compare weights before you buy", icon: CarFront },
  { href: "/electric-wheelchairs", title: "Travel powerchairs", copy: "Portable powered independence", icon: Plane },
];

export default async function HomePage() {
  let products = await getLightweightProducts();
  products = products.filter((p) => !p.is_discontinued);

  const featured = products.filter((p) => underWeight(p, 30) && p.image_url).slice(0, 8);
  const scooters = products.filter((p) => isScooter(p) && underWeight(p, 35) && p.image_url).slice(0, 4);
  const chairs = products.filter((p) => isPoweredWheelchair(p) && underWeight(p, 35) && p.image_url).slice(0, 4);
  const hero = featured[0] ?? products.find((p) => p.image_url) ?? null;

  return (
    <>
      <section className="border-b border-slate-200 bg-[#eef6f5]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-teal-700">UK lightweight mobility specialists</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Lightweight mobility, made for life on the move.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700 sm:text-xl">
              Folding scooters and electric wheelchairs chosen for easier lifting, simpler car-boot transport and travel without the bulk.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/mobility-scooters" className="flex min-h-14 items-center rounded-xl bg-teal-700 px-6 text-base font-extrabold text-white hover:bg-teal-800">Shop Mobility Scooters</Link>
              <Link href="/electric-wheelchairs" className="flex min-h-14 items-center rounded-xl border-2 border-slate-900 bg-white px-6 text-base font-extrabold text-slate-950">Shop Electric Wheelchairs</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-700">
              <span>Free UK delivery</span><span>VAT relief support</span><span>30-day returns</span>
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {hero?.image_url ? <img src={hero.image_url} alt={hero.name} className="aspect-[4/3] w-full object-contain" fetchPriority="high" /> : <div className="aspect-[4/3]" />}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-700">Find the right weight</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Shop by what matters to you</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map(({ href, title, copy, icon: Icon }) => (
            <Link key={href} href={href} className="group flex min-h-32 items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-teal-500 hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Icon className="h-6 w-6" /></div>
              <div><h3 className="text-xl font-extrabold text-slate-950">{title}</h3><p className="mt-1 text-slate-600">{copy}</p></div>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-slate-100/70 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-700">Popular now</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Lightweight favourites</h2></div>
              <Link href="/under-30kg" className="font-bold text-teal-800">View products under 30kg →</Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{featured.map((p) => <LightweightProductCard key={p.id} product={p} />)}</div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="flex items-end justify-between gap-3"><div><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-700">Easy to transport</p><h2 className="mt-2 text-3xl font-black">Folding scooters</h2></div><Link href="/folding-scooters" className="font-bold text-teal-800">View all →</Link></div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">{scooters.map((p) => <LightweightProductCard key={p.id} product={p} />)}</div>
          </div>
          <div>
            <div className="flex items-end justify-between gap-3"><div><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-700">Powered independence</p><h2 className="mt-2 text-3xl font-black">Electric wheelchairs</h2></div><Link href="/electric-wheelchairs" className="font-bold text-teal-800">View all →</Link></div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">{chairs.map((p) => <LightweightProductCard key={p.id} product={p} />)}</div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black sm:text-4xl">Why buy from Lightweight Mobility</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Truck, "Nationwide delivery", "Mobility products delivered across the UK."],
              [BadgePoundSterling, "VAT relief support", "Clear guidance for customers who qualify."],
              [Headphones, "Real mobility specialists", "Advice from a team that works with mobility equipment every day."],
              [ShieldCheck, "Warranty & aftercare", "Support after the product arrives, not just at checkout."],
            ].map(([Icon, title, copy]) => {
              const I = Icon as typeof Truck;
              return <div key={String(title)}><I className="h-8 w-8 text-teal-400" /><h3 className="mt-4 text-xl font-extrabold">{String(title)}</h3><p className="mt-2 leading-7 text-slate-300">{String(copy)}</p></div>;
            })}
          </div>
        </div>
      </section>
    </>
  );
}
