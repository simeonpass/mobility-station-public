export type BusinessLane = "adaptations" | "mobility";

export const BUSINESS_LANE_KEY = "ms-business-lane";

export function isBusinessLane(value: string | null | undefined): value is BusinessLane {
  return value === "adaptations" || value === "mobility";
}

/** Infer lane from URL when the section is unambiguous. */
export function laneFromPathname(pathname: string): BusinessLane | null {
  const path = pathname.split("?")[0] || pathname;

  if (
    path.startsWith("/vehicle-adaptations") ||
    path === "/quote" ||
    path.startsWith("/quote/") ||
    path.startsWith("/motability/vehicle-adaptations")
  ) {
    return "adaptations";
  }

  if (
    path.startsWith("/shop") ||
    path.startsWith("/hire") ||
    path.startsWith("/clearance") ||
    path.startsWith("/products") ||
    path.startsWith("/checkout") ||
    path.startsWith("/trade-in") ||
    path.startsWith("/delivery") ||
    path.startsWith("/lightweight") ||
    path.startsWith("/vat-relief") ||
    path.startsWith("/order-confirmation") ||
    path.startsWith("/motability/scooters-wheelchairs")
  ) {
    return "mobility";
  }

  return null;
}

export function readBusinessLane(): BusinessLane | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BUSINESS_LANE_KEY);
    return isBusinessLane(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeBusinessLane(lane: BusinessLane) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BUSINESS_LANE_KEY, lane);
    window.dispatchEvent(
      new CustomEvent("ms-business-lane", { detail: lane }),
    );
  } catch {
    // Ignore storage failures (private browsing, etc.)
  }
}

export function clearBusinessLane() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(BUSINESS_LANE_KEY);
    window.dispatchEvent(new CustomEvent("ms-business-lane", { detail: null }));
  } catch {
    // Ignore
  }
}

