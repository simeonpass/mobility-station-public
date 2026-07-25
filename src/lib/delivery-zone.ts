/** Weight threshold in kg above which items require local or pallet delivery */
export const HEAVY_ITEM_THRESHOLD_KG = 30;

/** Items below this weight are classed as 'small' and ship via standard courier */
export const SMALL_ITEM_THRESHOLD_KG = 10;

export const SMALL_ITEM_DELIVERY_COST = 0;
export const FREE_DELIVERY_THRESHOLD = 0;

export function isSmallItem(weight: number | null | undefined): boolean {
  if (!weight) return true;
  return weight < SMALL_ITEM_THRESHOLD_KG;
}

export function isHeavyItem(weight: number | null | undefined): boolean {
  if (!weight) return false;
  return weight >= HEAVY_ITEM_THRESHOLD_KG;
}

export function isMidWeightItem(weight: number | null | undefined): boolean {
  if (!weight) return false;
  return weight >= SMALL_ITEM_THRESHOLD_KG && weight < HEAVY_ITEM_THRESHOLD_KG;
}

export function cartHasHeavyItem(
  items: Array<{ product: { weight?: number | null } }>,
): boolean {
  return items.some((i) => isHeavyItem(i.product.weight));
}

export function cartIsAllSmallItems(
  items: Array<{ product: { weight?: number | null } }>,
): boolean {
  return items.every((i) => isSmallItem(i.product.weight));
}

export const BRANCH_LOCATIONS = [
  {
    name: "Heathrow (West Drayton)",
    lat: 51.510494,
    lng: -0.459042,
    radiusMiles: 30,
  },
  {
    name: "Ferndown (Wimborne)",
    lat: 50.806106,
    lng: -1.918664,
    radiusMiles: 60,
  },
] as const;

export const LOCAL_DELIVERY_RADIUS_MILES = Math.max(
  ...BRANCH_LOCATIONS.map((b) => b.radiusMiles),
);

function haversineDistanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type DeliveryCheckResult =
  | { status: "local"; branch: string; distanceMiles: number }
  | { status: "pallet" }
  | { status: "error"; message: string }
  | { status: "loading" };

export async function checkDeliveryZone(
  postcode: string,
): Promise<DeliveryCheckResult> {
  const clean = postcode.trim().toUpperCase().replace(/\s+/g, "");
  if (!clean) return { status: "error", message: "Please enter a postcode." };

  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}`,
    );
    if (!res.ok) {
      if (res.status === 404) {
        return {
          status: "error",
          message: "Postcode not found. Please check and try again.",
        };
      }
      return {
        status: "error",
        message: "Unable to look up postcode. Please try again.",
      };
    }
    const json = (await res.json()) as {
      result: { latitude: number; longitude: number };
    };
    const { latitude, longitude } = json.result;

    let coveringBranch: { name: string; dist: number } | null = null;

    for (const branch of BRANCH_LOCATIONS) {
      const dist = haversineDistanceMiles(
        latitude,
        longitude,
        branch.lat,
        branch.lng,
      );
      if (dist <= branch.radiusMiles) {
        if (!coveringBranch || dist < coveringBranch.dist) {
          coveringBranch = { name: branch.name, dist };
        }
      }
    }

    if (coveringBranch) {
      return {
        status: "local",
        branch: coveringBranch.name,
        distanceMiles: Math.round(coveringBranch.dist),
      };
    }
    return { status: "pallet" };
  } catch {
    return {
      status: "error",
      message: "Unable to look up postcode. Please check your connection.",
    };
  }
}
