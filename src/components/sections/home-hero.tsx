import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeHero() {
  return (
    <section className="bg-soft">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col justify-center px-5 py-10 sm:px-10 sm:py-14 lg:py-16 lg:pl-14 lg:pr-12 xl:pl-20">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Keeping you moving.</p>
          <h1 className="max-w-xl text-[2.45rem] font-extrabold leading-[1.08] tracking-[-0.04em] text-primary sm:text-5xl xl:text-[3.4rem]">
            Vehicle adaptation specialists.<br />Mobility for everyday life.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
            Expert vehicle adaptations, mobility scooters and wheelchairs.
            Personal advice from our Heathrow and Ferndown teams.
          </p>
          <div className="mt-8">
            <EnquiryDialog
              mode="callback"
              title="Talk to a specialist"
              triggerClassName={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-lg px-7 text-base",
              )}
            >
              Talk to a specialist
            </EnquiryDialog>
          </div>
        </div>
        <div className="relative aspect-[5/4] overflow-hidden bg-primary lg:aspect-auto lg:min-h-[36rem]">
          <Image
            src="/images/hero-options/specialist-advice.webp"
            alt="Illustration of a specialist explaining vehicle hand controls to a driver"
            fill
            sizes="(min-width: 1440px) 792px, (min-width: 1024px) 55vw, 100vw"
            className="object-cover object-center"
            preload
          />
        </div>
      </div>
    </section>
  );
}
import Image from "next/image";
