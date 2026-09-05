import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeHero() {
  return (
    <section className="bg-white">
      <div className="container-site grid items-center gap-10 py-12 md:gap-12 md:py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:py-20">
        <div className="max-w-xl">
          <h1 className="text-balance text-[2.15rem] font-extrabold leading-[1.08] tracking-[-0.04em] text-primary sm:text-5xl lg:text-[3.25rem]">
            Vehicle adaptation specialists. Mobility for everyday life.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
            Specialist vehicle adaptations, scooters and wheelchairs — supplied,
            fitted and supported by experienced teams at Heathrow and Ferndown.
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
        <div className="relative min-h-[22rem] overflow-hidden rounded-2xl bg-soft sm:min-h-[28rem] lg:min-h-[32rem]">
          {/* eslint-disable-next-line @next/next/no-img-element -- local editorial asset */}
          <img
            src="/images/hero-options/06-customer-handover.webp"
            alt="Mobility Station adviser with a customer in an adapted car"
            width={900}
            height={1100}
            className="absolute inset-0 h-full w-full object-cover object-[50%_28%]"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
