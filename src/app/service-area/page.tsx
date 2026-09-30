import Link from "next/link";
import { CtaFooter } from "@/components/sections/cta-footer";
import { LOCATION_PAGES } from "@/data/location-pages";
import { WORKSHOPS } from "@/lib/service-area";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Workshop coverage & towns", description: "Browse the towns served by our Heathrow and Ferndown workshops, with separate information for vehicle collection and free shop delivery.", path: "/service-area" });

export default function ServiceAreaPage() {
  const heathrow = LOCATION_PAGES.filter((p) => p.branch === "Heathrow"); const ferndown = LOCATION_PAGES.filter((p) => p.branch === "Ferndown");
  return <>
    <section className="border-b border-border bg-white"><div className="container-site py-14 md:py-20 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Mobility Station · Coverage</p><h1 className="mt-4 max-w-4xl text-balance text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-primary md:text-6xl lg:text-7xl">Are we local to you?</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">Find our workshop coverage and local town pages. Vehicle collection charges and free scooter delivery are explained separately below.</p></div></section>
    <section className="py-14 md:py-20"><div className="container-site max-w-5xl"><div className="rounded-[2rem] border border-border bg-soft/55 p-5 md:p-7"><h2 className="text-xl font-bold text-primary">Choose the information you need</h2><div className="mt-4 flex flex-col gap-4"><Link href="/vehicle-adaptations/collection-cost" className="font-semibold text-primary underline">Vehicle collection, return &amp; fitting — postcode cost checker</Link><Link href="/delivery" className="font-semibold text-primary underline">Scooters &amp; wheelchairs — free delivery information</Link></div></div><div className="mt-10 grid gap-5 md:grid-cols-2">{WORKSHOPS.map((w) => <div key={w.id} className="rounded-[2rem] border border-border bg-white p-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Workshop coverage</p><h2 className="mt-2 text-2xl font-extrabold text-primary">{w.name}</h2><p className="mt-1 text-sm font-semibold text-muted">{w.postcode}</p><p className="mt-4 text-sm text-muted">Standard vehicle collection area: up to {w.maxRadiusMiles} miles. Use the vehicle collection checker for an estimate.</p></div>)}</div><TownGroup title="Heathrow catchment" towns={heathrow} /><TownGroup title="Ferndown catchment" towns={ferndown} /></div></section><CtaFooter />
  </>;
}
function TownGroup({ title, towns }: { title:string; towns:typeof LOCATION_PAGES }) { return <div className="mt-14 border-t border-border pt-9"><h2 className="text-2xl font-extrabold text-primary md:text-3xl">{title}</h2><div className="mt-5 flex flex-wrap gap-2">{towns.map((t) => <Link key={t.slug} href={`/service-area/${t.slug}`} className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-primary">{t.town}</Link>)}</div></div>; }
