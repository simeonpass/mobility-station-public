"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CalendarCheck, Phone, ShoppingBag, Store } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

function hideUtilityBar(pathname: string) {
  return (
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/hire/checkout") ||
    pathname.startsWith("/website/hire/checkout") ||
    pathname.startsWith("/order-confirmation") ||
    pathname.startsWith("/website/order-confirmation") ||
    pathname.includes("/thank-you")
  );
}

export function MobileUtilityBar() {
  const pathname = usePathname();
  const { itemCount, setIsOpen } = useCart();
  const hidden = hideUtilityBar(pathname);

  useEffect(() => {
    if (hidden) {
      document.body.classList.remove("has-mobile-utility-bar");
      return;
    }
    document.body.classList.add("has-mobile-utility-bar");
    return () => document.body.classList.remove("has-mobile-utility-bar");
  }, [hidden]);

  if (hidden) return null;

  const itemClass =
    "flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-primary motion-safe:transition-transform motion-safe:duration-200 active:scale-95";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/96 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_36px_rgba(0,0,0,0.10)] backdrop-blur-xl md:hidden"
      aria-label="Quick links"
    >
      <div className="flex h-14 items-stretch">
        <Link href="/shop" className={itemClass}>
          <Store className="h-5 w-5" aria-hidden />
          Shop
        </Link>
        <a href={SITE.phoneHref} className={itemClass}>
          <Phone className="h-5 w-5" aria-hidden />
          Call
        </a>
        <Link href="/book-a-demo" className={itemClass}>
          <CalendarCheck className="h-5 w-5" aria-hidden />
          Demo
        </Link>
        <button
          type="button"
          className={cn(itemClass, "relative")}
          onClick={() => setIsOpen(true)}
          aria-label={`Open cart${itemCount ? `, ${itemCount} items` : ""}`}
        >
          <span className="relative">
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {itemCount > 0 ? (
              <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold leading-none text-accent-foreground">
                {itemCount}
              </span>
            ) : null}
          </span>
          Cart
        </button>
      </div>
    </nav>
  );
}
