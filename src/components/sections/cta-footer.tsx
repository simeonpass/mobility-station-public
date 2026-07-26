import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function CtaFooter({
  title = "Ready to try before you buy?",
  subtitle = "Tell us what you need and we will bring it to you — or visit our Heathrow or Ferndown branch.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="border-y border-border bg-primary-soft py-14 text-foreground md:py-16">
      <div className="container-site flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-muted">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/book-a-demo" className={buttonVariants({ size: "lg" })}>
            Book a Demo
          </Link>
          <Link
            href="/contact?interest=callback#callback"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "bg-white/60",
            })}
          >
            Request a callback
          </Link>
        </div>
      </div>
    </section>
  );
}
