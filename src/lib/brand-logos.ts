/** Manufacturer name → public logo path. Ported from Lovable `brandLogos.ts` with extra aliases. */
export const BRAND_LOGOS: Record<string, string> = {
  "alfred bekker": "/brands/alfred-bekker.png",
  "alfred bekker api": "/brands/alfred-bekker.png",
  autochair: "/brands/autochair.png",
  "autochair ltd": "/brands/autochair.png",
  "bas nw": "/brands/bas-nw.png",
  "bas(nw)": "/brands/bas-nw.png",
  "bas(nw) ltd": "/brands/bas-nw.png",
  "bever controls": "/brands/bever-controls.png",
  bever: "/brands/bever-controls.png",
  "bever high-tech controls": "/brands/bever-controls.png",
  braunability: "/brands/braunability.png",
  "brig-ayd controls": "/brands/brig-ayd-controls.png",
  "brig ayd controls": "/brands/brig-ayd-controls.png",
  "brig ayd controls ltd": "/brands/brig-ayd-controls.png",
  "cowal mobility": "/brands/cowal-mobility.png",
  cowal: "/brands/cowal-mobility.png",
  "cowal mobility aids ltd": "/brands/cowal-mobility.png",
  "des gosling mobility": "/brands/des-gosling-mobility.png",
  "des gosling mobility ltd": "/brands/des-gosling-mobility.png",
  "drive devilbiss": "/brands/drive-devilbiss.png",
  drive: "/brands/drive-devilbiss.png",
  "drive medical": "/brands/drive-devilbiss.png",
  eezychair: "/brands/eezychair.png",
  "eezy chair": "/brands/eezychair.png",
  elap: "/brands/elap.png",
  "elap engineering": "/brands/elap.png",
  "elap mobility": "/brands/elap.png",
  "electric mobility": "/brands/electric-mobility.png",
  ergofold: "/brands/ergofold.png",
  freedomchair: "/brands/freedomchair.png",
  "freedom chair": "/brands/freedomchair.png",
  freedom: "/brands/freedomchair.png",
  freerider: "/brands/freerider-luggie.png",
  "freerider luggie": "/brands/freerider-luggie.png",
  luggie: "/brands/freerider-luggie.png",
  guidosimplex: "/brands/guidosimplex.png",
  "jeff gosling": "/brands/jeff-gosling.png",
  "jeff gosling ltd": "/brands/jeff-gosling.png",
  "karma mobility": "/brands/karma-mobility.png",
  karma: "/brands/karma-mobility.png",
  "kymco healthcare": "/brands/kymco-healthcare.png",
  kymco: "/brands/kymco-healthcare.png",
  lodgesons: "/brands/lodgesons.png",
  "monarch mobility": "/brands/monarch-mobility.png",
  "motion healthcare": "/brands/motion-healthcare.png",
  "motion health care": "/brands/motion-healthcare.png",
  "pride mobility": "/brands/pride-mobility.png",
  pride: "/brands/pride-mobility.png",
  qstraint: "/brands/qstraint.png",
  "q'straint": "/brands/qstraint.png",
  robooter: "/brands/robooter.png",
  "roma medical": "/brands/roma-medical.png",
  steelmate: "/brands/steelmate.png",
  strident: "/brands/strident.png",
  "sunrise medical": "/brands/sunrise-medical.png",
  sterling: "/brands/sunrise-medical.png",
  "tga mobility": "/brands/tga-mobility.png",
  tga: "/brands/tga-mobility.png",
  "van os medical": "/brands/van-os-medical.png",
  "van os": "/brands/van-os-medical.png",
  excel: "/brands/van-os-medical.png",
  veigel: "/brands/veigel.png",
  "veigel uk": "/brands/veigel.png",
  xsto: "/brands/xsto.png",
  invacare: "/brands/invacare.png",
  shoprider: "/brands/shoprider.png",
  scooterpac: "/brands/scooterpac.png",
  "komfi rider": "/brands/komfi-rider.png",
  "komfi-rider": "/brands/komfi-rider.png",
  rehasense: "/brands/rehasense.png",
  "allied mobility": "/brands/allied-mobility.png",
  "mcelmeel mobility": "/brands/mcelmeel-mobility.png",
};

function normalizeManufacturer(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[’'`]/g, "")
    .replace(/&/g, " and ")
    .replace(/\bltd\.?\b/g, "")
    .replace(/\blimited\b/g, "")
    .replace(/[^a-z0-9()]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getBrandLogo(
  manufacturer: string | null | undefined,
): string | null {
  if (!manufacturer) return null;
  const key = normalizeManufacturer(manufacturer);
  if (!key || key === "mobility station") return null;

  if (BRAND_LOGOS[key]) return BRAND_LOGOS[key];

  // Fuzzy: "Kivi (ELAP Engineering)" → elap engineering / elap
  for (const [alias, path] of Object.entries(BRAND_LOGOS)) {
    if (key.includes(alias) || alias.includes(key)) return path;
  }

  return null;
}
