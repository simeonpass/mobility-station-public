"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { writeBusinessLane, type BusinessLane } from "@/lib/business-lane";
import { cn } from "@/lib/utils";

const PATHS: Array<{
  lane: BusinessLane;
  href: string;
  title: string;
  detail: string;
  video: string;
  poster: string;
  accent: "teal" | "lime";
}> = [
  {
    lane: "adaptations",
    href: "/vehicle-adaptations",
    title: "Vehicle adaptations",
    detail: "Quotation · supplied & fitted · Motability cars",
    video: "/images/home/hero-adaptations-hand-controls.mp4",
    poster: "/images/hero-options/05-hand-controls.png",
    accent: "teal",
  },
  {
    lane: "mobility",
    href: "/shop",
    title: "Scooters & wheelchairs",
    detail: "Home demos · Motability prices · shop online",
    video: "/images/home/hero-mobility.mp4",
    poster: "/images/hero-options/10-workshop-overview.png",
    accent: "lime",
  },
];

function HeroVideo({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.load();
    const play = el.play();
    if (play) {
      play.catch(() => {
        // Autoplay can be blocked; muted + playsInline usually works.
      });
    }
  }, [src]);

  return (
    <video
      key={src}
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export function HomeHero() {
  return (
    <section className="bg-white">
      <div className="container-site max-w-4xl py-12 text-center md:py-16 lg:py-20">
        <p className="text-sm font-semibold tracking-wide text-primary/65">
          Motability accredited · Heathrow &amp; Ferndown
        </p>
        <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight text-primary md:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
          Help with your car — or getting around
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          Two clear sides of the business from the same workshops: vehicle
          adaptations, or scooters &amp; wheelchairs. Pick the one that matches
          what you need.
        </p>
      </div>

      <div className="grid border-y border-border md:grid-cols-2">
        {PATHS.map((path) => (
          <Link
            key={path.lane}
            href={path.href}
            onClick={() => writeBusinessLane(path.lane)}
            className={cn(
              "group relative flex min-h-[22rem] flex-col overflow-hidden sm:min-h-[26rem] md:min-h-[32rem] lg:min-h-[36rem]",
              path.accent === "lime" && "md:border-l md:border-border",
            )}
          >
            <div className="relative min-h-0 flex-1 bg-soft">
              <HeroVideo src={path.video} poster={path.poster} />
            </div>

            <div className="relative z-10 border-t border-border bg-white px-6 py-6 sm:px-8 sm:py-7">
              <span
                className={cn(
                  "mb-3 block h-1 w-10",
                  path.accent === "lime" ? "bg-accent" : "bg-primary",
                )}
                aria-hidden
              />
              <span className="flex items-end justify-between gap-4">
                <span>
                  <span className="block text-xl font-extrabold tracking-tight text-primary group-hover:text-primary-dark sm:text-2xl">
                    {path.title}
                  </span>
                  <span className="mt-1.5 block text-sm text-muted">
                    {path.detail}
                  </span>
                </span>
                <span className="mb-0.5 inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-primary">
                  Continue
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className="container-site py-5 text-center text-sm text-muted">
        On Motability?{" "}
        <Link
          href="/motability"
          className="font-semibold text-primary underline underline-offset-2"
        >
          Scooters &amp; chairs or car adaptations
        </Link>
      </p>
    </section>
  );
}
