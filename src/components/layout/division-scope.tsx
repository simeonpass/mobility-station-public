"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react";
import { divisionForPath, type Division } from "@/lib/division";

const SiteDivisionContext = createContext<Division | null>(null);

function routeDivision(pathname: string): Division | null {
  if (pathname === "/checkout" || pathname.startsWith("/checkout/") || pathname === "/order-confirmation") return "shop";
  return divisionForPath(pathname);
}

/** Read the product's server-rendered classification, never guess from its name. */
function pageDivision(pathname: string): Division | null {
  const route = routeDivision(pathname);
  if (route || typeof document === "undefined") return route;
  if (window.location.pathname !== pathname) return null;
  if (pathname.startsWith("/products/")) {
    const value = document.querySelector("#main-content > [data-division]")?.getAttribute("data-division");
    return value === "adapt" || value === "shop" ? value : null;
  }
  if (pathname === "/contact" || pathname === "/book-a-demo" || pathname === "/search") {
    const query = new URLSearchParams(window.location.search);
    const interest = query.get("type") ?? query.get("interest");
    if (interest === "adaptation" || interest === "adaptations") return "adapt";
    if (interest === "scooter" || interest === "wheelchair" || interest === "mobility" || interest === "shop") return "shop";
  }
  return null;
}

export function useSiteDivision() {
  return useContext(SiteDivisionContext);
}

/** The header, page, footer and CTAs share one classification, including deep product links. */
export function DivisionScope({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const subscribe = useCallback((onChange: () => void) => {
    if (!pathname.startsWith("/products/") && !["/contact", "/book-a-demo", "/search"].includes(pathname)) return () => {};
    const main = document.getElementById("main-content");
    const observer = new MutationObserver(onChange);
    if (main) observer.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-division"] });
    window.addEventListener("popstate", onChange);
    return () => { observer.disconnect(); window.removeEventListener("popstate", onChange); };
  }, [pathname]);
  const getSnapshot = useCallback(() => pageDivision(pathname), [pathname]);
  const getServerSnapshot = useCallback(() => routeDivision(pathname), [pathname]);
  const division = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <SiteDivisionContext.Provider value={division}>
    <div className="contents msx-site" data-site-page={pathname} data-site-division={division ?? undefined} data-division={division ?? undefined}>
      {children}
    </div>
  </SiteDivisionContext.Provider>;
}
