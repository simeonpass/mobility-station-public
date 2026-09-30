import Link from "next/link";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Scooter & Wheelchair Servicing", description: "One-off servicing and repairs for mobility scooters, powered wheelchairs and manual wheelchairs. Contact our Heathrow and Ferndown teams.", path: "/servicing" });

const checks = [
  ["Batteries & charging", "Battery condition, connections and charging checks on powered equipment."],
  ["Brakes, tyres & wheels", "Check braking, tyre wear, wheels and castors, with adjustments where appropriate."],
  ["Steering & controls", "Check steering, controls and the operation of your scooter or powered wheelchair."],
  ["Frame, seat & fittings", "Inspect the frame, seat, armrests, footrests and fixings for wear or looseness."],
  ["Cleaning & lubrication", "Clean serviceable areas and lubricate moving parts where the manufacturer recommends it."],
  ["Final checks & advice", "Check operation after servicing and explain any faults or further work recommended."],
];

export default function ServicingPage() {
  return <>
    <CatalogIntro breadcrumb="Servicing" eyebrow="Scooter & wheelchair servicing" title={<>Keep it running.<br />Keep moving.</>} subtitle="Straightforward, one-off servicing and repairs for your mobility scooter or wheelchair, with help from our Heathrow and Ferndown teams." primary={{ href: "/book-a-service", label: "Request a service" }} secondary={{ href: "#prices", label: "Service prices" }} image={{ src: "/images/redesign/scooter.webp", alt: "Mobility scooter" }} />
    <section id="prices" className="container-site scroll-mt-28 py-12"><h2 className="text-3xl font-semibold">One-off service prices</h2><p className="mt-3 max-w-2xl text-muted">Tell us your make and model and we’ll confirm the service price before booking. Replacement parts, batteries and additional repairs are quoted separately before work goes ahead.</p><div className="mt-7 grid gap-5 md:grid-cols-3">{["Mobility scooter", "Powered wheelchair", "Manual wheelchair"].map(label => <article key={label} className="rounded-2xl border border-border p-6"><h3 className="text-xl font-semibold">{label}</h3><p className="mt-4 text-lg font-semibold text-primary">Ask for a service price</p><Link href="/book-a-service" className="mt-5 inline-block text-sm font-semibold underline">Request a service</Link></article>)}</div></section>
    <section className="container-site pb-12"><h2 className="text-3xl font-semibold">What we check</h2><p className="mt-3 text-muted">Checks are tailored to your equipment and its manufacturer’s guidance.</p><div className="mt-7 grid gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-3">{checks.map(([title, body]) => <article key={title} className="border-t border-border pt-5"><h3 className="text-lg font-semibold">{title}</h3><p className="mt-3 text-muted">{body}</p></article>)}</div></section>
    <section className="container-site pb-14"><div className="rounded-2xl bg-soft p-7 md:p-9"><h2 className="text-2xl font-semibold">A fault, a flat battery or something not quite right?</h2><p className="mt-4 max-w-2xl text-muted">Tell us what is happening and we’ll arrange the right support. We can discuss workshop servicing, repairs and any collection or home-visit options, with charges confirmed before booking.</p><Link href="/book-a-service" className="ms-button mt-6">Request a service or repair</Link></div></section>
  </>;
}
