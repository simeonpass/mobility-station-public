import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export const metadata:Metadata={title:"Page not found",robots:{index:false,follow:true}};
export default function NotFound(){return <div className="container-site py-20 text-center md:py-28"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">404 · Mobility Station</p><h1 className="mx-auto mt-4 max-w-2xl text-5xl font-extrabold tracking-[-0.045em] text-primary md:text-6xl">That page has moved on.</h1><p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">Try the mobility shop, vehicle adaptations, or head back to the homepage.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/" className={cn(buttonVariants({size:"lg"}),"rounded-full px-7")}>Go home</Link><Link href="/shop" className={cn(buttonVariants({variant:"outline",size:"lg"}),"rounded-full px-7")}>Scooters &amp; wheelchairs</Link><Link href="/vehicle-adaptations" className={cn(buttonVariants({variant:"outline",size:"lg"}),"rounded-full px-7")}>Vehicle adaptations</Link></div></div>}
