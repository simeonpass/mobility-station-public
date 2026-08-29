import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Cta = { href: string; label: string };

export function CtaFooter({ title = "Ready to try before you buy?", subtitle = "Tell us what you need and we will bring it to you — or visit our Heathrow or Ferndown branch.", primary = { href: "/book-a-demo", label: "Book a Demo" }, secondary = { href: "/contact?interest=callback#callback", label: "Request a callback" } }: { title?: string; subtitle?: string; primary?: Cta; secondary?: Cta }) {
  return <section className="border-y border-black bg-primary py-14 text-white md:py-20"><div className="container-site flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Mobility Station</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">{title}</h2><p className="mt-3 max-w-xl leading-relaxed text-white/65">{subtitle}</p></div><div className="flex flex-wrap gap-3"><Link href={primary.href} className={cn(buttonVariants({ size: "lg" }), "rounded-full bg-accent px-7 text-accent-foreground hover:bg-accent-hover")}>{primary.label}</Link><Link href={secondary.href} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full border-white/30 bg-transparent px-7 text-white hover:bg-white hover:text-primary")}>{secondary.label}</Link></div></div></section>;
}
