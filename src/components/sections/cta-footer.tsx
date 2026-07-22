import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/seo";

export function CtaFooter({
  title = "Ready for a free home demonstration?",
  subtitle = "Tell us what you need and we will come to you — or visit our Heathrow or Ferndown branch.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-primary py-14 text-primary-foreground md:py-16">
      <div className="container-site flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-white/80">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/book-a-demo" className={buttonVariants({ size: "lg" })}>
            Book a Demo
          </Link>
          <a
            href={SITE.phoneHref}
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "border-white/40 text-white hover:bg-white/10",
            })}
          >
            Call {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
