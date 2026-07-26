/**
 * Postcode coverage + collection pricing for vehicle adaptation orders.
 * Customer's postcode is geocoded via postcodes.io (free, no key needed).
 *
 * Symmetric ladder of fees — same five numbers (£50 → £100 → £150 → £175
 * → £200) at both branches. The only difference is how many miles each
 * step buys, because a London mile and a Dorset mile are not the same:
 *
 *   • Heathrow (max 30 mi) — half the range, no free band. London traffic,
 *     parking and the Congestion Charge mean we charge from the first mile.
 *       0 – 5 mi    £50
 *       5 – 10 mi   £100
 *       10 – 15 mi  £150
 *       15 – 22 mi  £175
 *       22 – 30 mi  £200
 *
 *   • Ferndown (max 60 mi) — twice the range, free local band. Rural roads
 *     flow freely so each step covers roughly twice as many miles.
 *       0 – 5 mi    Free
 *       5 – 15 mi   £50
 *       15 – 30 mi  £100
 *       30 – 45 mi  £150
 *       45 – 55 mi  £175
 *       55 – 60 mi  £200
 *
 * Where the rings meet at the outer edge both branches charge the same
 * £200, so customers in the overlap aren't penalised for which side of
 * the line they live on.
 *
 * Central London surcharge — any EC / WC / W1 / SW1 postcode incurs a
 * minimum £150 call-out because of the Congestion Charge / ULEZ window.
 *
 * Beyond either branch's max we treat as out of range — customer can drop
 * the vehicle off, or we ship pallet-only items nationwide by courier.
 */

/** Minimum call-out fee for central London postcodes (Congestion Charge / ULEZ) */
export const CENTRAL_LONDON_MIN_FEE = 150;

/** Returns true for EC / WC / W1 / SW1 postcodes */
export function isCentralLondonPostcode(postcode: string): boolean {
  const p = postcode.toUpperCase().replace(/\s+/g, '');
  return p.startsWith('EC') || p.startsWith('WC') || p.startsWith('W1') || p.startsWith('SW1');
}

export interface BandRow {
  /** Upper bound in miles (inclusive) for this band */
  upTo: number;
  /** Round-trip collection fee in £ */
  fee: number;
  /** Short label shown to customers */
  label: string;
  /** Range label e.g. "0 – 3 miles" */
  range: string;
}

export interface Workshop {
  id: 'heathrow' | 'ferndown';
  name: string;
  postcode: string;
  phone: string;
  lat: number;
  lon: number;
  /** Max one-way distance in miles we will collect from for this branch */
  maxRadiusMiles: number;
  /** Flex Hire free-delivery / free call-out zone (tighter than sale coverage) */
  flexRadiusMiles: number;
  /** One-line explanation of why this branch's bands look the way they do */
  bandRationale: string;
  /** Pricing bands for this branch (sorted ascending by upTo) */
  bands: BandRow[];
}

export const WORKSHOPS: Workshop[] = [
  {
    id: 'heathrow',
    name: 'Heathrow',
    postcode: 'UB7 8EB',
    phone: '01895 520361',
    lat: 51.510494,
    lon: -0.459042,
    maxRadiusMiles: 30,
    flexRadiusMiles: 10,
    bandRationale:
      'In London every mile costs more in time, fuel and parking — so there is no free band and the prices step up quickly. The same £200 ceiling applies as Ferndown at the outer edge so the rings line up where they meet.',
    bands: [
      { upTo: 5,  fee: 50,  label: 'Local collection',     range: '0 – 5 miles' },
      { upTo: 10, fee: 100, label: 'City collection',      range: '5 – 10 miles' },
      { upTo: 15, fee: 150, label: 'Inner London',         range: '10 – 15 miles' },
      { upTo: 22, fee: 175, label: 'Greater London',       range: '15 – 22 miles' },
      { upTo: 30, fee: 200, label: 'Edge of M25',          range: '22 – 30 miles' },
    ],
  },
  {
    id: 'ferndown',
    name: 'Ferndown',
    postcode: 'BH21 7RR',
    phone: '01202 287361',
    lat: 50.806106,
    lon: -1.918664,
    maxRadiusMiles: 60,
    flexRadiusMiles: 20,
    bandRationale:
      'Rural Dorset and Hampshire roads flow freely, so each step on the ladder buys roughly twice the distance of London — and the first five miles are on us.',
    bands: [
      { upTo: 5,  fee: 0,   label: 'Free local',           range: '0 – 5 miles' },
      { upTo: 15, fee: 50,  label: 'Local collection',     range: '5 – 15 miles' },
      { upTo: 30, fee: 100, label: 'Regional collection',  range: '15 – 30 miles' },
      { upTo: 45, fee: 150, label: 'Extended collection',  range: '30 – 45 miles' },
      { upTo: 55, fee: 175, label: 'Long-distance',        range: '45 – 55 miles' },
      { upTo: 60, fee: 200, label: 'County edge',          range: '55 – 60 miles' },
    ],
  },
];

export const WORKSHOP = WORKSHOPS[0];

/** Lookup helper for callers that already know which workshop applies */
export function getWorkshop(id: Workshop['id']): Workshop {
  return WORKSHOPS.find(w => w.id === id) ?? WORKSHOPS[0];
}

export type CoverageResult =
  | {
      kind: 'covered';
      postcode: string;
      miles: number;
      fee: number;
      label: string;
      band: BandRow;
      isCentralLondon: boolean;
      workshop: Workshop;
    }
  | {
      kind: 'out-of-range';
      postcode: string;
      miles: number;
      workshop: Workshop;
    }
  | { kind: 'not-found' }
  | { kind: 'error' };

function haversineMiles(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.asin(Math.sqrt(a));
}

/** Find the band a given mile distance falls into, for a specific workshop */
export function bandForMiles(workshop: Workshop, miles: number): BandRow | null {
  for (const b of workshop.bands) {
    if (miles <= b.upTo) return b;
  }
  return null;
}

export async function lookupCoverage(
  rawPostcode: string,
  signal?: AbortSignal,
): Promise<CoverageResult> {
  const cleaned = rawPostcode.trim().toUpperCase().replace(/\s+/g, ' ');
  if (cleaned.length < 5) return { kind: 'not-found' };

  try {
    const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(cleaned)}`;
    const res = await fetch(url, { signal });
    if (res.status === 404) return { kind: 'not-found' };
    if (!res.ok) return { kind: 'error' };
    const json = await res.json();
    const lat = json?.result?.latitude;
    const lon = json?.result?.longitude;
    if (typeof lat !== 'number' || typeof lon !== 'number') return { kind: 'not-found' };

    // Distance to every workshop
    const distances = WORKSHOPS.map(w => ({
      workshop: w,
      miles: haversineMiles(lat, lon, w.lat, w.lon),
    }));

    // Pick the cheapest covering workshop. If two cover, the lower fee wins;
    // ties broken by closer distance.
    const eligible = distances
      .filter(d => d.miles <= d.workshop.maxRadiusMiles)
      .map(d => ({ ...d, band: bandForMiles(d.workshop, d.miles)! }))
      .filter(d => d.band)
      .sort((a, b) => a.band.fee - b.band.fee || a.miles - b.miles);

    if (eligible.length === 0) {
      const nearest = distances.sort((a, b) => a.miles - b.miles)[0];
      return {
        kind: 'out-of-range',
        postcode: cleaned,
        miles: nearest.miles,
        workshop: nearest.workshop,
      };
    }

    const chosen = eligible[0];
    const isCentralLondon = isCentralLondonPostcode(cleaned);

    // Central London (EC/WC/W1/SW1) has a £150 minimum because of the
    // Congestion Charge / ULEZ — bump the band fee up if needed.
    const fee = isCentralLondon
      ? Math.max(chosen.band.fee, CENTRAL_LONDON_MIN_FEE)
      : chosen.band.fee;
    const label = isCentralLondon && fee > chosen.band.fee
      ? 'Central London (Congestion Charge)'
      : chosen.band.label;

    return {
      kind: 'covered',
      postcode: cleaned,
      miles: chosen.miles,
      fee,
      label,
      band: chosen.band,
      isCentralLondon,
      workshop: chosen.workshop,
    };
  } catch (err) {
    if ((err as Error).name === 'AbortError') return { kind: 'error' };
    console.error('[adaptationServiceArea] lookup failed', err);
    return { kind: 'error' };
  }
}

export type FlexCoverageResult =
  | {
      kind: 'in-zone';
      postcode: string;
      miles: number;
      workshop: Workshop;
    }
  | {
      kind: 'out-of-zone';
      postcode: string;
      miles: number;
      workshop: Workshop;
      /** True if still inside short-term / sale call-out coverage */
      shortTermAvailable: boolean;
    }
  | { kind: 'not-found' }
  | { kind: 'error' };

/** Flex Hire zone check — Heathrow 10 mi / Ferndown 20 mi. */
export async function lookupFlexCoverage(
  rawPostcode: string,
  signal?: AbortSignal,
): Promise<FlexCoverageResult> {
  const cleaned = rawPostcode.trim().toUpperCase().replace(/\s+/g, ' ');
  if (cleaned.length < 5) return { kind: 'not-found' };

  try {
    const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(cleaned)}`;
    const res = await fetch(url, { signal });
    if (res.status === 404) return { kind: 'not-found' };
    if (!res.ok) return { kind: 'error' };
    const json = await res.json();
    const lat = json?.result?.latitude;
    const lon = json?.result?.longitude;
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return { kind: 'not-found' };
    }

    const distances = WORKSHOPS.map((w) => ({
      workshop: w,
      miles: haversineMiles(lat, lon, w.lat, w.lon),
    })).sort((a, b) => a.miles - b.miles);

    const inFlex = distances
      .filter((d) => d.miles <= d.workshop.flexRadiusMiles)
      .sort((a, b) => a.miles - b.miles);

    if (inFlex.length) {
      return {
        kind: 'in-zone',
        postcode: cleaned,
        miles: inFlex[0].miles,
        workshop: inFlex[0].workshop,
      };
    }

    const nearest = distances[0];
    return {
      kind: 'out-of-zone',
      postcode: cleaned,
      miles: nearest.miles,
      workshop: nearest.workshop,
      shortTermAvailable: nearest.miles <= nearest.workshop.maxRadiusMiles,
    };
  } catch (err) {
    if ((err as Error).name === 'AbortError') return { kind: 'error' };
    console.error('[flexCoverage] lookup failed', err);
    return { kind: 'error' };
  }
}
