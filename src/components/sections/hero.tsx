import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

type HeroProps = {
  title: string;
  subtitle: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  compact?: boolean;
};

export function Hero({
  title,
  subtitle,
  primaryHref = "/book-a-demo",
  primaryLabel = "Book a Demo",
  secondaryHref = SITE.phoneHref,
  secondaryLabel = `Call ${SITE.phone}`,
  compact = false,
}: HeroProps) {
  return (
    <section className={cn("bg-hero-mesh", compact ? "py-14 md:py-16" : "py-16 md:py-24")}>
      <div className="container-site max-w-3xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-primary-dark">
          Mobility Station
        </p>
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-primary md:text-5xl lg:text-[3.25rem]">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/80 md:text-xl">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={primaryHref} className={buttonVariants({ size: "lg" })}>
            {primaryLabel}
          </Link>
          <a
            href={secondaryHref}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            {secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
