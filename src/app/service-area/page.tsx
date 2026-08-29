import Link from "next/link";
import { ServiceAreaChecker } from "@/components/service-area/service-area-checker";
import { CtaFooter } from "@/components/sections/cta-footer";
import { LOCATION_PAGES } from "@/data/location-pages";
import { WORKSHOPS } from "@/lib/service-area";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Service area, call-out bands & towns", description: "Check if we cover your postcode, see local call-out bands and browse the towns served by our Heathrow and Ferndown workshops.", path: "/service-area" });

export default function ServiceAreaPage() {
  const heathrow = LOCATION_PAGES.filter((p) => p.branch === "Heathrow"); const ferndown = LOCATION_PAGES.filter((p) => p.branch === "Ferndown");
  return <>
    <section className="border-b border-border bg-white"><div className="container-site py-14 md:py-20 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Mobility Station · Coverage</p><h1 className="mt-4 max-w-4xl text-balance text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-primary md:text-6xl lg:text-7xl">Are we local to you?</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">Check your postcode for home visits, delivery and service call-out coverage from Heathrow and Ferndown.</p></div></section>
    <section className="py-14 md:py-20"><div className="container-site max-w-5xl"><div className="rounded-[2rem] border border-border bg-soft/55 p-5 md:p-7"><ServiceAreaChecker /></div><div className="mt-10 grid gap-5 md:grid-cols-2">{WORKSHOPS.map((w) => <div key={w.id} className="rounded-[2rem] border border-border bg-white p-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Workshop coverage</p><h2 className="mt-2 text-2xl font-extrabold text-primary">{w.name}</h2><p className="mt-1 text-sm font-semibold text-muted">{w.postcode}</p><p className="mt-4 text-sm leading-relaxed text-muted">{w.bandRationale}</p><ul className="mt-6 divide-y divide-border text-sm">{w.bands.map((b) => <li key={b.range} className="flex justify-between gap-3 py-2.5"><span className="text-muted">{b.range}</span><span className="font-bold text-primary">{b.fee === 0 ? "Free" : `£${b.fee}`}</span></li>)}</ul></div>)}</div><TownGroup title="Heathrow catchment" towns={heathrow} /><TownGroup title="Ferndown catchment" towns={ferndown} /></div></section><CtaFooter />
  </>;
}
function TownGroup({ title, towns }: { title:string; towns:typeof LOCATION_PAGES }) { return <div className="mt-14 border-t border-border pt-9"><h2 className="text-2xl font-extrabold text-primary md:text-3xl">{title}</h2><div className="mt-5 flex flex-wrap gap-2">{towns.map((t) => <Link key={t.slug} href={`/service-area/${t.slug}`} className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-primary">{t.town}</Link>)}</div></div>; }
