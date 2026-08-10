import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type Cta = { href: string; label: string };

export function CtaFooter({
  title = "Ready to try before you buy?",
  subtitle = "Tell us what you need and we will bring it to you — or visit our Heathrow or Ferndown branch.",
  primary = { href: "/book-a-demo", label: "Book a Demo" },
  secondary = {
    href: "/contact?interest=callback#callback",
    label: "Request a callback",
  },
}: {
  title?: string;
  subtitle?: string;
  primary?: Cta;
  secondary?: Cta;
}) {
  return (
    <section className="border-b border-border border-t-2 border-t-tertiary/70 bg-primary-soft py-14 text-foreground md:py-16">
      <div className="container-site flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-muted">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={primary.href} className={buttonVariants({ size: "lg" })}>
            {primary.label}
          </Link>
          <Link
            href={secondary.href}
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "bg-white/60",
            })}
          >
            {secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
