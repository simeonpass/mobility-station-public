import Link from "next/link";
import { ArrowRight, Accessibility, Wrench } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
type NeedIcon = ComponentType<IconProps>;

function PedalsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7.5 4.5v8.2" />
      <path d="M16.5 4.5v8.2" />
      <rect x="4.8" y="12.2" width="5.4" height="7.3" rx="1.4" />
      <rect x="13.8" y="12.2" width="5.4" height="7.3" rx="1.4" />
      <path d="M6.6 15.2h1.8M6.6 17h1.8M15.6 15.2h1.8M15.6 17h1.8" />
    </svg>
  );
}

function SteeringWheelIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M3.8 10.4h5.9M14.3 10.4h5.9M12 14.2v6.1" />
    </svg>
  );
}

function SwivelCarSeatIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8.2 4.2h3.1c1.2 0 2.1 1 2.1 2.1v5.2" />
      <path d="M7.2 5.3v6.6c0 1.1.9 2 2 2h7.2" />
      <path d="M9.2 13.9 7.8 18" />
      <path d="M15.8 13.9 17 18" />
      <path d="M6.3 18h11.5" />
      <path d="M12 20.2a5.7 5.7 0 0 0 5.1-2.5" />
      <path d="m16.4 20 .7-2.3 2.3.7" />
    </svg>
  );
}

function HoistIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19V6h10" />
      <path d="M8 6h10l2 3" />
      <path d="M17 6v6" />
      <path d="M15.2 12h3.6" />
      <path d="M17 12v3.2" />
      <path d="M14.5 17.5a2.5 2.5 0 0 0 5 0" />
      <path d="M4 19h6" />
    </svg>
  );
}

const NEEDS: Array<{
  title: string;
  text: string;
  href: string;
  icon: NeedIcon;
}> = [
  {
    title: "I struggle using the pedals",
    text: "Left-foot accelerators for drivers who cannot comfortably use the right accelerator pedal.",
    href: "/vehicle-adaptations/left-foot-accelerators#products",
    icon: PedalsIcon,
  },
  {
    title: "I struggle steering or using controls",
    text: "Steering aids to make turning and controlling the wheel easier.",
    href: "/vehicle-adaptations/steering-aids#products",
    icon: SteeringWheelIcon,
  },
  {
    title: "I struggle getting in or out of the car",
    text: "Swivel seats to make transferring into and out of the vehicle easier.",
    href: "/vehicle-adaptations/swivel-seats#products",
    icon: SwivelCarSeatIcon,
  },
  {
    title: "I need to lift a scooter or wheelchair",
    text: "Boot hoists to lift mobility equipment into and out of your vehicle.",
    href: "/vehicle-adaptations/boot-hoists#products",
    icon: HoistIcon,
  },
  {
    title: "I need something lightweight or folding",
    text: "Portable folding scooters and powerchairs for cars, storage and travel.",
    href: "/shop?q=folding#catalogue",
    icon: Accessibility,
  },
  {
    title: "I need servicing or repairs",
    text: "Workshop support for mobility products and vehicle adaptations.",
    href: "/book-a-service",
    icon: Wrench,
  },
];

export function HomeNeeds() {
  return (
    <section className="bg-soft py-20 md:py-24">
      <div className="container-site">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Start with what you need</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-primary md:text-5xl">What are you finding difficult?</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">You do not need to know the product name. Choose the problem and we will take you straight to the most relevant solution.</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {NEEDS.map(({ title, text, href, icon: Icon }) => (
            <Link key={title} href={href} className="group rounded-[1.6rem] border border-border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-34px_rgba(0,63,67,0.5)] sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/8 text-primary">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-extrabold tracking-[-0.025em] text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">See recommended products <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
