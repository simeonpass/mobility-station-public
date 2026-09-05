import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeCta() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="container-site grid overflow-hidden rounded-2xl lg:grid-cols-2">
        <div className="relative min-h-[18rem] bg-soft sm:min-h-[22rem] lg:min-h-[26rem]">
          {/* eslint-disable-next-line @next/next/no-img-element -- local editorial asset */}
          <img
            src="/images/hero-options/05-hand-controls.webp"
            alt="Hand controls fitted in a customer vehicle"
            width={1200}
            height={800}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex flex-col items-center justify-center bg-primary px-8 py-12 text-center text-white sm:px-12 sm:py-16">
          <h2 className="max-w-md text-balance text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl">
            Vehicle adaptations, fitted around you.
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/75">
            Speak to our Heathrow or Ferndown team.
          </p>
          <EnquiryDialog
            mode="callback"
            title="Talk to a specialist"
            triggerClassName={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 h-12 rounded-lg px-7 text-base",
            )}
          >
            Talk to a specialist
          </EnquiryDialog>
        </div>
      </div>
    </section>
  );
}
