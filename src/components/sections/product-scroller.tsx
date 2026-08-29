import Link from "next/link";
import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ProductScroller({ title, subtitle, viewAllHref, viewAllLabel="See all", tone="white", children }: { title:string; subtitle?:string; viewAllHref?:string; viewAllLabel?:string; tone?:"white"|"soft"; children:ReactNode }) {
  const items = Children.toArray(children).filter(Boolean); if (!items.length) return null;
  return <section className={cn("border-b border-border py-14 md:py-20", tone === "soft" ? "bg-soft/55" : "bg-white")}><div className="container-site"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div className="max-w-2xl"><h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">{title}</h2>{subtitle ? <p className="mt-3 text-sm text-muted md:text-base">{subtitle}</p> : null}</div>{viewAllHref ? <Link href={viewAllHref} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">{viewAllLabel} →</Link> : null}</div></div><div className="overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:thin]"><ul className="container-site flex snap-x snap-mandatory gap-4 pr-6 md:gap-5 md:pr-8">{items.map((child,index) => <li key={index} className="w-[min(78vw,17.5rem)] shrink-0 snap-start sm:w-72">{child}</li>)}</ul></div></section>;
}
