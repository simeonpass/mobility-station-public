import type { CSSProperties } from "react";
import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { CHECKOUT_BRANDS, type CheckoutBrand } from "@/lib/checkout-brands";
export function CheckoutShell({ brand = "mobilitystation", children }: { brand?: CheckoutBrand; children: React.ReactNode }) {
  const shop = CHECKOUT_BRANDS[brand];
  return <div className="min-h-screen bg-slate-50" style={brand === "ergofold" ? {"--primary":"#171717","--accent":"#c9231e","--accent-hover":"#a51d19","--buy":"#c9231e","--buy-hover":"#a51d19","--tertiary":"#c9231e","--soft":"#fff3f2"} as CSSProperties : undefined}>
    <header className="border-b border-slate-200 bg-white"><div className="container-site flex flex-wrap items-center justify-between gap-4 py-6">
      <a href={brand === "ergofold" ? "/ergofold" : shop.home} className="text-2xl font-extrabold tracking-tight" style={{ color: shop.colour }}>{brand === "ergofold" ? <Image src="/ergofold/logo.png" alt="ErgoFold — Life without limits" width={300} height={90} className="h-auto w-[220px] sm:w-[240px]" unoptimized /> : shop.name}</a>
      <span className="flex items-center gap-2 text-sm text-muted"><LockKeyhole size={17} />{brand === "ergofold" ? "Secure ErgoFold checkout" : "Secure checkout by Mobility Station"}</span>
    </div></header>
    <div className="container-site py-8 md:py-12">{children}</div>
    <footer className="container-site border-t border-slate-200 py-8 text-sm text-muted">
      <p>Owned and operated by Adaptation Station Ltd, trading as Mobility Station.</p>
      <p className="mt-2">Need a hand? <a href="tel:08007723870" className="font-semibold underline">0800 772 3870</a></p>
      <nav className="mt-4 flex flex-wrap gap-5" aria-label="Checkout information"><a href="https://mobilitystation.co.uk/terms">Terms &amp; returns</a><a href="https://mobilitystation.co.uk/privacy-policy">Privacy</a><a href="https://mobilitystation.co.uk/vat-relief">VAT relief</a></nav>
    </footer>
  </div>;
}
