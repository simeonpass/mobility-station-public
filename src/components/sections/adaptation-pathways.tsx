import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PATHWAYS = [
  {
    title: "Driving controls",
    eyebrow: "Driving",
    text: "Hand controls, left-foot accelerators, steering aids and secondary controls to make driving easier.",
    href: "/vehicle-adaptations/driving-controls#products",
    image: "/images/hero-options/05-hand-controls.webp",
    alt: "Driving controls fitted inside a vehicle",
    position: "object-center",
  },
  {
    title: "Getting in & out",
    eyebrow: "Access",
    text: "Swivel seats, transfer plates, steps and other solutions to make getting into your vehicle easier.",
    href: "/vehicle-adaptations/vehicle-access#products",
    image: "/images/hero-options/07-swivel-seat.webp",
    alt: "Swivel seat vehicle adaptation",
    position: "object-center",
  },
  {
    title: "Boot hoists & stowage",
    eyebrow: "Loading",
    text: "Lift and secure scooters or wheelchairs with boot hoists, stowage systems and loading solutions.",
    href: "/vehicle-adaptations/hoists-stowage#products",
    image: "/images/hero-options/06-customer-handover.webp",
    alt: "Mobility Station specialist helping a customer with an adapted vehicle",
    position: "object-[50%_42%]",
  },
] as const;

export function AdaptationPathways() {
  return (
    <section className="py-14 md:py-20">
      <div className="container-site">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Choose what you need help with</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-primary md:text-5xl">Start with the problem, not the product.</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">You do not need to know the name of an adaptation. Choose the area you need help with and we will take you straight to the relevant solutions.</p>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {PATHWAYS.map((item) => (
            <Link key={item.title} href={item.href} className="group relative min-h-[360px] overflow-hidden rounded-[2rem] bg-primary text-white shadow-sm md:min-h-[420px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- local editorial asset */}
              <img src={item.image} alt={item.alt} className={`absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.025] ${item.position}`} width={900} height={900} loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/28 to-black/5" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/75">{item.eyebrow}</p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">{item.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">{item.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">See solutions <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden /></span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-7 rounded-[1.6rem] border border-border bg-soft/55 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div>
            <h3 className="text-lg font-bold text-primary">Not sure which category fits?</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">Tell us what is difficult and what vehicle you drive. Our adaptations team can recommend the right options.</p>
          </div>
          <Link href="/contact?interest=adaptation" className="mt-4 inline-flex shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground sm:mt-0">Ask an adaptation specialist</Link>
        </div>
      </div>
    </section>
  );
}
