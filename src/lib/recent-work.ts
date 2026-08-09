/** Public Recent Work case-study feed (Lovable edge — no auth). */

export const RECENT_WORK_CATEGORIES = [
  { id: "vehicle-adaptations", label: "Vehicle adaptations" },
  { id: "boot-hoists", label: "Boot hoists" },
  { id: "driving-controls", label: "Driving controls" },
  { id: "vehicle-access", label: "Vehicle access" },
  { id: "wheelchair-stowage", label: "Wheelchair stowage" },
  { id: "scooters-wheelchairs", label: "Scooters & wheelchairs" },
  { id: "servicing-repairs", label: "Servicing & repairs" },
] as const;

export type RecentWorkCategoryId =
  (typeof RECENT_WORK_CATEGORIES)[number]["id"];

export type RecentWorkImage = {
  url: string;
  alt: string;
};

export type RecentWorkProject = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  town: string | null;
  work_date: string | null;
  hero_image: string | null;
  image_count: number;
  images: RecentWorkImage[];
  body?: string;
  seo_description?: string | null;
  updated_at?: string | null;
};

type ListResponse = {
  total: number;
  projects: RecentWorkProject[];
};

type SingleResponse = {
  project: RecentWorkProject | null;
};

const DEFAULT_BASE =
  "https://uwalzdrmowrciwnbetzk.supabase.co/functions/v1/public-recent-work";

function recentWorkUrl() {
  const root = process.env.SUPABASE_URL?.replace(/\/$/, "");
  if (root) return `${root}/functions/v1/public-recent-work`;
  return DEFAULT_BASE;
}

export function categoryLabel(id: string | null | undefined) {
  if (!id) return "Recent work";
  const match = RECENT_WORK_CATEGORIES.find((c) => c.id === id);
  return match?.label ?? id.replace(/-/g, " ");
}

export function formatWorkDate(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Plain-text body → paragraphs (split on blank lines). Never markdown. */
export function bodyToParagraphs(body: string | null | undefined) {
  if (!body?.trim()) return [];
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export async function listRecentWork(opts: {
  limit?: number;
  offset?: number;
  category?: string;
} = {}): Promise<ListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(opts.limit ?? 24));
  if (opts.offset) params.set("offset", String(opts.offset));
  if (opts.category && opts.category !== "all") {
    params.set("category", opts.category);
  }

  try {
    const res = await fetch(`${recentWorkUrl()}?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error("Recent work feed failed:", res.status);
      return { total: 0, projects: [] };
    }
    const data = (await res.json()) as ListResponse;
    return {
      total: Number(data.total) || 0,
      projects: Array.isArray(data.projects) ? data.projects : [],
    };
  } catch (error) {
    console.error("Recent work feed error:", error);
    return { total: 0, projects: [] };
  }
}

export async function getRecentWorkProject(
  slug: string,
): Promise<RecentWorkProject | null> {
  if (!slug) return null;
  try {
    const res = await fetch(
      `${recentWorkUrl()}?slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) {
      if (res.status !== 404) {
        console.error("Recent work project failed:", res.status, slug);
      }
      return null;
    }
    const data = (await res.json()) as SingleResponse;
    return data.project ?? null;
  } catch (error) {
    console.error("Recent work project error:", error);
    return null;
  }
}

/** Paginate for sitemap / static params. */
export async function listAllRecentWork(): Promise<RecentWorkProject[]> {
  const all: RecentWorkProject[] = [];
  const limit = 48;
  let offset = 0;
  let total = Infinity;

  while (offset < total && offset < 500) {
    const page = await listRecentWork({ limit, offset });
    total = page.total;
    if (!page.projects.length) break;
    all.push(...page.projects);
    offset += page.projects.length;
    if (page.projects.length < limit) break;
  }

  return all;
}
