"use client";
import { usePathname } from "next/navigation";
export function StorefrontFrame({ children, header, footer }: { children: React.ReactNode; header: React.ReactNode; footer: React.ReactNode }) {
  const path = usePathname();
  const focused = path === "/ergofold" || path.startsWith("/checkout") || path === "/order-confirmation";
  return <>{!focused && header}<main id="main-content" tabIndex={-1} className="relative z-0 flex-1 overflow-x-clip outline-none">{children}</main>{!focused && footer}</>;
}
