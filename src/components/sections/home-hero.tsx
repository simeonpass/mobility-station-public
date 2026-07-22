import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[min(92vh,52rem)] overflow-hidden bg-primary text-primary-foreground">
      <Image
        src="/images/hero-home.jpg"
        alt="Mobility Station adviser providing a free home demonstration with a power wheelchair and accessible vehicle"
        fill
        priority
        sizes="100vw"
        className="object-cover object-right md:object-[70%_center]"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-primary/10 md:hidden"
        aria-hidden
      />

      <div className="container-site relative flex min-h-[min(92vh,52rem)] items-center py-16 md:py-20">
        <div className="max-w-xl animate-[fadeRise_700ms_ease-out]">
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
            We come to you with mobility that fits real life
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85 md:text-xl">
            Free home demonstrations for scooters, wheelchairs and vehicle
            adaptations from our Heathrow and Ferndown branches.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/book-a-demo"
              className={cn(buttonVariants({ size: "lg" }), "shadow-sm")}
            >
              Book a Demo
            </Link>
            <a
              href={SITE.phoneHref}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white",
              )}
            >
              Call {SITE.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
