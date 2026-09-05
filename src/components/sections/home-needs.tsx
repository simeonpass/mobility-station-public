import Link from "next/link";
import { ArrowRight, CarFront, PersonStanding, PackageOpen, Accessibility, Wrench, Route } from "lucide-react";

const NEEDS = [
  {
    title: "I struggle using the pedals",
    text: "Hand controls, left-foot accelerators and driving solutions.",
    href: "/vehicle-adaptations#driving-controls",
    icon: CarFront,
  },
  {
    title: "I struggle steering or using controls",
    text: "Steering aids and secondary control solutions.",
    href: "/vehicle-adaptations#driving-controls",
    icon: Route,
  },
  {
    title: "I struggle getting in or out of the car",
    text: "Swivel seats, transfer aids and vehicle access solutions.",
    href: "/vehicle-adaptations#vehicle-access",
    icon: PersonStanding,
  },
  {
    title: "I need to lift a scooter or wheelchair",
    text: "Boot hoists, stowage systems and loading solutions.",
    href: "/vehicle-adaptations#hoists-stowage",
    icon: PackageOpen,
  },
  {
    title: "I need something lightweight or folding",
    text: "Portable scooters and powerchairs for cars and travel.",
    href: "/shop?q=folding#catalogue",
    icon: Accessibility,
  },
  {
    title: "I need servicing, repairs or advice",
    text: "Workshop support for mobility products and adaptations.",
    href: "/book-a-service",
    icon: Wrench,
  },
] as const;

export function HomeNeeds() {
  return (
    <section className="bg-soft py-20 md:py-24">
      <div className="container-site">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Start with what you need</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-primary md:text-5xl">What are you finding difficult?</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">You do not need to know the name of the product. Tell us the problem and we will guide you to the right solution.</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {NEEDS.map(({ title, text, href, icon: Icon }) => (
            <Link key={title} href={href} className="group rounded-[1.6rem] border border-border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-34px_rgba(0,63,67,0.5)] sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/8 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-extrabold tracking-[-0.025em] text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">See solutions <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
