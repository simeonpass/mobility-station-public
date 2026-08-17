import Link from "next/link";
import { Search, ShoppingBag, Phone } from "lucide-react";

export function LightweightHeader() {
  return (
    <>
      <div className="bg-slate-950 px-4 py-2 text-center text-sm font-medium text-white">
        Free UK delivery · VAT relief available · 30-day returns · Expert mobility advice
      </div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            LIGHTWEIGHT <span className="text-teal-700">MOBILITY</span>
          </Link>
          <div className="hidden flex-1 md:flex md:max-w-xl">
            <div className="flex min-h-12 w-full items-center rounded-xl border border-slate-300 bg-slate-50 px-4 text-slate-500">
              <Search className="mr-3 h-5 w-5" /> Search scooters, wheelchairs and brands
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="tel:08007723870" className="hidden min-h-12 items-center gap-2 rounded-xl border border-slate-300 px-4 font-semibold text-slate-800 sm:flex">
              <Phone className="h-5 w-5" /> 0800 772 3870
            </a>
            <button type="button" aria-label="Basket" className="flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-slate-300 text-slate-800">
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav className="border-t border-slate-100">
          <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-3 text-sm font-bold text-slate-800 sm:px-6 lg:px-8">
            <Link href="/mobility-scooters">Mobility Scooters</Link>
            <Link href="/electric-wheelchairs">Electric Wheelchairs</Link>
            <Link href="/folding-scooters">Folding Scooters</Link>
            <Link href="/under-20kg">Under 20kg</Link>
            <Link href="/under-25kg">Under 25kg</Link>
            <Link href="/under-30kg">Under 30kg</Link>
            <Link href="/clearance">Clearance</Link>
          </div>
        </nav>
      </header>
    </>
  );
}

export function LightweightFooter() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="text-xl font-black text-white">LIGHTWEIGHT <span className="text-teal-400">MOBILITY</span></p>
          <p className="mt-3 max-w-sm text-sm leading-6">Specialists in lightweight, folding and travel-friendly mobility products delivered across the UK.</p>
        </div>
        <div>
          <p className="font-bold text-white">Shop</p>
          <div className="mt-3 space-y-2 text-sm"><p>Mobility Scooters</p><p>Electric Wheelchairs</p><p>Under 20kg</p><p>Under 30kg</p></div>
        </div>
        <div>
          <p className="font-bold text-white">Need help?</p>
          <a href="tel:08007723870" className="mt-3 block text-lg font-bold text-white">0800 772 3870</a>
          <p className="mt-6 text-xs leading-5 text-slate-400">Lightweight Mobility is operated by Adaptation Station Limited, the company behind Mobility Station.</p>
        </div>
      </div>
    </footer>
  );
}
