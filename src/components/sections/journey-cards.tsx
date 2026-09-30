import Link from "next/link";
import { Accessibility, ArrowRight, CalendarDays, Car, CircleGauge, PackageOpen } from "lucide-react";
import { sectionHref } from "@/lib/adaptations";
import type { Division } from "@/lib/division";

const journeys = {
  adapt: [
    { title: "Help with driving", detail: "Hand controls, pedals and steering aids", href: sectionHref("driving-controls"), Icon: CircleGauge },
    { title: "Getting in and out", detail: "Swivel seats and vehicle access", href: sectionHref("vehicle-access"), Icon: Car },
    { title: "Lifting your equipment", detail: "Boot hoists and wheelchair stowage", href: sectionHref("hoists-stowage"), Icon: PackageOpen },
  ],
  shop: [
    { title: "Mobility scooters", detail: "Browse our scooter range", href: "/shop?sub=scooters#catalogue", Icon: CircleGauge },
    { title: "Wheelchairs & powerchairs", detail: "Manual and powered options", href: "/shop?sub=wheelchairs#catalogue", Icon: Accessibility },
    { title: "Looking to hire?", detail: "Explore short-term and monthly hire", href: "/hire", Icon: CalendarDays },
  ],
};

export function JourneyCards({ division }: { division: Division }) {
  return <section className="container-site msx-journeys" aria-labelledby={`journeys-${division}`}>
    <div className="msx-journeys-heading"><h2 id={`journeys-${division}`}>{division === "adapt" ? "What would you like help with?" : "Find your next step"}</h2><p>{division === "adapt" ? "Start with what you need, not a product name." : "Browse the range or talk to us about trying it first."}</p></div>
    <div className="msx-journey-grid">{journeys[division].map(({ title, detail, href, Icon }) => <Link href={href} className="msx-journey" key={href}>
      <span className="msx-journey-icon"><Icon size={24} aria-hidden="true" /></span><span><strong>{title}</strong><small>{detail}</small></span><ArrowRight size={19} aria-hidden="true" />
    </Link>)}</div>
  </section>;
}
