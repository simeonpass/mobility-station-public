import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Cta = { href: string; label: string };

export function CtaFooter({
  title = "Ready to try before you buy?",
  subtitle = "Tell us what you need and we will bring it to you — or visit our Heathrow or Ferndown branch.",
  primary = { href: "/book-a-demo", label: "Book a Demo" },
  secondary = { href: "/contact?interest=callback#callback", label: "Request a callback" },
}: {
  title?: string;
  subtitle?: string;
  primary?: Cta;
  secondary?: Cta;
}) {
  return (
    <section className="ms-cta border-y border-border py-14 md:py-20">
      <div className="container-site flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Mobility Station
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={primary.href}
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-md border border-primary bg-primary px-7 text-white hover:bg-primary-dark",
            )}
          >
            {primary.label}
          </Link>
          <Link
            href={secondary.href}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-md border-primary/30 bg-transparent px-7 text-primary hover:bg-white/60",
            )}
          >
            {secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
