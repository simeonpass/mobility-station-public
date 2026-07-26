/**
 * Split adaptation option-variants into standalone stock_items.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/split-adaptation-variants.mjs --dry-run
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/split-adaptation-variants.mjs --apply
 *
 * Creates new products with confirmed titles. Does NOT delete parents.
 * After review, run with --delete-parents to remove the original parents
 * (and their leftover variant rows).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MANIFEST = resolve(__dirname, "split-adaptation-variants.manifest.json");

function loadEnv() {
  for (const file of [
    resolve(ROOT, ".env.local"),
    resolve(ROOT, ".env"),
    "/Users/simeonpass/mobilitystation/.env",
  ]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
    }
  }
}

loadEnv();

const args = new Set(process.argv.slice(2));
const DRY = !args.has("--apply") && !args.has("--delete-parents");
const APPLY = args.has("--apply");
const DELETE_PARENTS = args.has("--delete-parents");

const CANVAS_DATA =
  "/Users/simeonpass/.cursor/projects/Users-simeonpass-mobilitystation-projects-mobility-station-public/canvases/adaptation-variant-titles.canvas.data.json";

/** Short variant-id prefix → final title (defaults; canvas overrides win). */
const DEFAULT_TITLES = {
  "61290bf7": "Jeff Gosling Push Brake Only Hand Controls",
  "9e14ca8c": "Jeff Gosling Push Pull Brake & Accelerator Hand Controls",
  fea33c04: "Jeff Gosling Push Pull Brake & Accelerator Hand Controls with Indicator Switch",
  dc632b36:
    "Jeff Gosling Push Pull Brake & Accelerator Hand Controls with Indicator Switch (CANbus)",
  "8e7dceb8": "Cowal Push Brake Only Hand Controls",
  "2fea6933": "Cowal Push Pull Hand Controls (No Indicator Switch)",
  ed7612f7:
    "Cowal Push Pull Hand Controls with Indicator Switch (Standard Wiring)",
  d2a024b1:
    "Cowal Push Pull Hand Controls with Indicator Switch (CANbus Wiring)",
  "90e63898": "Brig-Ayd Push Pull Hand Controls (No Indicator Switch)",
  "19998cdf":
    "Brig-Ayd Push Pull Hand Controls with Indicator Switch (Standard Wiring)",
  "7e6cba86":
    "Brig-Ayd Push Pull Hand Controls with Indicator Switch (CANbus Wiring)",
  d9951d5f: "Jeff Gosling Apex Assist 100kg 4 Way Boot Hoist",
  "99115938": "Jeff Gosling Apex Assist 150kg 4 Way Boot Hoist",
  "08c26797": "Autochair Smartlifter LC 80kg 4 Way Boot Hoist",
  "65639b79": "Autochair Smartlifter LC 100kg 4 Way Boot Hoist",
  a2d80bb0: "Autochair Smartlifter LC 80kg 4 Way Boot Hoist with Battery Pack",
  "2a97c643": "Autochair Smartlifter LM Mini 40kg 2 Way Folding Boot Hoist",
  d349471e: "Autochair Smartlifter LM Mini 40kg 4 Way Folding Boot Hoist",
  c5e0aef2: "Autochair Smartlifter LM Mini 80kg 4 Way Fixed Boot Hoist",
  a3fb6033: "Autochair Smartlifter LM Mini 80kg 4 Way Folding Boot Hoist",
  "92b466e4":
    "Autochair Smartlifter LM 80kg 4 Way Transferable EV Boot Hoist with Battery Pack",
  a4303f1f: "Autochair Smart Lifter LP Olympian 150kg Boot Hoist",
  "9c8091ce": "Autochair Smart Lifter LP Olympian 200kg Boot Hoist",
  ccd1c047: "Brig-Ayd Evotech 80kg 4 Way Boot Hoist",
  "054bbee4": "Brig-Ayd Evotech 100kg 4 Way Boot Hoist",
  "17a4f6a9": "Brig-Ayd Evotech 120kg 4 Way Boot Hoist",
  ddbbb59b: "Brig-Ayd Evotech 150kg 4 Way Boot Hoist",
  edbc30d3: "Bever Smartsteer Classic 5 Wireless Secondary Controls",
  a298c6fb: "Bever Smartsteer Premium 5 Wireless Secondary Controls",
  "361c9386": "Bever Smartsteer Classic 8 Wireless Secondary Controls",
  eee19a0a: "Bever Smartsteer Premium 8 Wireless Secondary Controls",
  b704e79d: "Lodgesons 7 Way Wireless Secondary Controls",
  ff5a87a0: "Lodgesons 10 Way Wireless Secondary Controls",
  f78b6e91: "Lodgesons 13 Way Wireless Secondary Controls",
  "99de19e7":
    "Lodgesons 13 Way Wireless Secondary Controls with Headlights",
  ede1a6d5: "Alfred Bekker Pedal Extension (1 Pedal)",
  be1a3f7c: "Alfred Bekker Pedal Extensions (2 Pedals)",
  "7504b9cb": "Alfred Bekker Pedal Extensions (3 Pedals)",
  "139261ab": "BraunAbility Menox Mini Stamp Pedal Extensions (2 Pedals)",
  "58058c34": "BraunAbility Menox Mini Stamp Pedal Extensions (3 Pedals)",
  f7993c98: "Jeff Gosling Easy Release Conventional Handbrake",
  "5bf1ad55": "Jeff Gosling Easy Release Foot Operated Handbrake",
  d2ddaab6: "Jeff Gosling Easy Release Handbrake (Vehicle Specific)",
  "982c8a72": "Des Gosling A-Pillar Grab Handle",
  "71757c7a": "Des Gosling B-Pillar Grab Handle",
  d6d89416: "Guidosimplex Tran-Step 45/C Electric Cassette Step (45cm)",
  "1fe50812": "Guidosimplex Tran-Step 60/C Electric Cassette Step (60cm)",
  b3668c4e: "Guidosimplex Tran-Step 75/C Electric Cassette Step (75cm)",
  "6289185c": "Guidosimplex Tran-Step 100 Electric Cassette Step (100cm)",
  "51ded29a":
    "Mobility Station Perspex Single Driver Protection Screen (Car)",
  cb1f9bba:
    "Mobility Station Perspex Single Driver Protection Screen (WAV/Van)",
  "00548478": "Mobility Station Perspex Pair of Driver Protection Screens",
  "739bec9e":
    "Mobility Station Perspex Front Seats Protection Screen (WAV/Van)",
  "92941408":
    "Mobility Station Perspex Large Double Front Passenger Protection Screen",
};

function loadTitles() {
  const titles = { ...DEFAULT_TITLES };
  if (existsSync(CANVAS_DATA)) {
    const data = JSON.parse(readFileSync(CANVAS_DATA, "utf8"));
    for (const [id, title] of Object.entries(data.titleOverrides || {})) {
      const clean = String(title).replace(/\s+/g, " ").trim();
      if (clean) titles[id] = clean;
    }
  }
  return titles;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function shortId(uuid) {
  return uuid.slice(0, 8);
}

function resolvePrice(parent, variant) {
  if (variant.unit_price != null && Number(variant.unit_price) > 0) {
    return {
      unit_price: Number(variant.unit_price),
      sale_price:
        variant.sale_price != null && Number(variant.sale_price) > 0
          ? Number(variant.sale_price)
          : null,
    };
  }
  const adj = Number(variant.price_adjustment) || 0;
  const base =
    parent.unit_price != null && Number(parent.unit_price) > 0
      ? Number(parent.unit_price)
      : 0;
  const saleBase =
    parent.sale_price != null && Number(parent.sale_price) > 0
      ? Number(parent.sale_price)
      : null;
  return {
    unit_price: base + adj,
    sale_price: saleBase != null ? saleBase + adj : null,
  };
}

const SKIP_PARENT_FIELDS = new Set([
  "id",
  "created_at",
  "updated_at",
  "slug",
  "name",
  "sku",
  "unit_price",
  "sale_price",
  "motability_price",
  "motability_weekly_price",
  "adaptation_id",
  "variant_group_id",
  "variant_label",
  "ebay_item_id",
  "ebay_title",
  "ebay_price",
  "ebay_description",
  "ebay_category_id",
  "ebay_category_name",
  "ebay_store_category_id",
  "ebay_store_category_name",
  "stripe_price_id",
  "stripe_product_id",
  "quantity",
]);

async function main() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publicKey =
    process.env.SUPABASE_PUBLIC_SITE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url) throw new Error("Missing SUPABASE_URL");

  const titles = loadTitles();
  console.log(`Loaded ${Object.keys(titles).length} titles (canvas overrides applied)`);

  if (DELETE_PARENTS) {
    if (!serviceKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY required for --delete-parents",
      );
    }
    if (!existsSync(MANIFEST)) {
      throw new Error(`Manifest not found: ${MANIFEST}. Run --apply first.`);
    }
    const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
    const db = createClient(url, serviceKey, { auth: { persistSession: false } });
    const parentIds = [...new Set(manifest.created.map((c) => c.parentId))];
    console.log(`Deleting ${parentIds.length} parent products…`);
    for (const parentId of parentIds) {
      await db.from("product_variants").delete().eq("stock_item_id", parentId);
      await db.from("stock_item_images").delete().eq("stock_item_id", parentId);
      const { error } = await db.from("stock_items").delete().eq("id", parentId);
      if (error) console.error(`  FAIL delete ${parentId}:`, error.message);
      else console.log(`  deleted ${parentId}`);
    }
    console.log("Done.");
    return;
  }

  // Read plan with public or service key
  const readKey = serviceKey || publicKey;
  if (!readKey) throw new Error("No Supabase key available");
  const readDb = createClient(url, readKey, { auth: { persistSession: false } });

  const { data: products, error: pe } = await readDb
    .from("stock_items")
    .select("*")
    .eq("product_type", "vehicle_adaptation")
    .eq("published_to_website", true)
    .eq("website_visible", true)
    .not("slug", "is", null)
    .limit(500);
  if (pe) throw pe;

  const ids = products.map((p) => p.id);
  const { data: variants, error: ve } = await readDb
    .from("product_variants")
    .select("*")
    .in("stock_item_id", ids)
    .eq("is_addon", false)
    .order("sort_order");
  if (ve) throw ve;

  const { data: images } = await readDb
    .from("stock_item_images")
    .select("*")
    .in("stock_item_id", ids)
    .order("sort_order");

  const imagesByParent = new Map();
  for (const img of images || []) {
    if (!imagesByParent.has(img.stock_item_id))
      imagesByParent.set(img.stock_item_id, []);
    imagesByParent.get(img.stock_item_id).push(img);
  }

  const byParent = new Map(products.map((p) => [p.id, p]));
  const plan = [];

  for (const v of variants) {
    const parent = byParent.get(v.stock_item_id);
    if (!parent) continue;
    const key = shortId(v.id);
    const title = titles[key];
    if (!title) {
      console.warn(`No title for variant ${v.id} (${v.label}) — skipping`);
      continue;
    }
    const pricing = resolvePrice(parent, v);
    const adaptationId =
      v.adaptation_id || v.motability_crn || parent.adaptation_id || null;
    const motabilityPrice =
      v.motability_price != null
        ? Number(v.motability_price)
        : parent.motability_price;
    const motabilityWeekly =
      v.motability_weekly_price != null
        ? Number(v.motability_weekly_price)
        : parent.motability_weekly_price;

    let slug = slugify(title);
    plan.push({
      variantId: v.id,
      parentId: parent.id,
      parentName: parent.name,
      label: v.label,
      title,
      slug,
      pricing,
      adaptationId,
      motabilityPrice,
      motabilityWeekly,
      image_url: v.image_url || parent.image_url,
      sku: parent.sku
        ? `${parent.sku}-${v.sku_suffix || slugify(v.label).slice(0, 20)}`
        : null,
      parent,
      variant: v,
      images: imagesByParent.get(parent.id) || [],
    });
  }

  // Ensure unique slugs within plan
  const usedSlugs = new Set();
  const { data: existingSlugs } = await readDb
    .from("stock_items")
    .select("slug")
    .not("slug", "is", null);
  for (const row of existingSlugs || []) usedSlugs.add(row.slug);

  for (const item of plan) {
    let slug = item.slug;
    let n = 2;
    while (usedSlugs.has(slug)) {
      slug = `${item.slug}-${n++}`;
    }
    usedSlugs.add(slug);
    item.slug = slug;
  }

  console.log(`\nPlan: ${plan.length} new products from ${new Set(plan.map((p) => p.parentId)).size} parents\n`);
  for (const item of plan) {
    console.log(
      `  + ${item.title}\n    £${item.pricing.unit_price}${item.motabilityPrice != null ? ` | Motability £${item.motabilityPrice}` : ""} | slug=${item.slug}`,
    );
  }

  if (DRY) {
    console.log(
      "\nDry run only. Re-run with --apply and SUPABASE_SERVICE_ROLE_KEY to create.",
    );
    writeFileSync(
      resolve(__dirname, "split-adaptation-variants.plan.json"),
      JSON.stringify(plan.map(({ parent, variant, images, ...rest }) => rest), null, 2),
    );
    console.log(`Wrote plan → scripts/split-adaptation-variants.plan.json`);
    return;
  }

  if (!APPLY) return;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for --apply.\n" +
        "Add it to the environment and re-run:\n" +
        "  SUPABASE_SERVICE_ROLE_KEY=eyJ... node scripts/split-adaptation-variants.mjs --apply",
    );
  }

  const db = createClient(url, serviceKey, { auth: { persistSession: false } });
  const created = [];

  for (const item of plan) {
    const row = {};
    for (const [k, val] of Object.entries(item.parent)) {
      if (SKIP_PARENT_FIELDS.has(k)) continue;
      row[k] = val;
    }
    row.name = item.title;
    row.slug = item.slug;
    row.sku = item.sku;
    row.unit_price = item.pricing.unit_price;
    row.sale_price = item.pricing.sale_price;
    row.motability_price = item.motabilityPrice;
    row.motability_weekly_price = item.motabilityWeekly;
    row.adaptation_id = item.adaptationId;
    row.image_url = item.image_url;
    row.seo_title = item.title;
    row.meta_description =
      item.parent.meta_description ||
      `${item.title}. Supplied and fitted by Mobility Station.`;
    row.product_type = "vehicle_adaptation";
    row.published_to_website = true;
    row.website_visible = true;
    row.quantity = item.variant.track_stock
      ? item.variant.quantity ?? 0
      : item.parent.quantity ?? 0;
    row.variant_label = item.label;
    // Tag so we can find these later
    row.variant_group_id = item.parent.id;

    const { data: inserted, error } = await db
      .from("stock_items")
      .insert(row)
      .select("id, slug, name")
      .single();

    if (error) {
      console.error(`FAIL ${item.title}:`, error.message);
      continue;
    }

    // Copy gallery images
    if (item.images.length) {
      const imageRows = item.images.map((img) => ({
        stock_item_id: inserted.id,
        image_url: img.image_url,
        alt_text: img.alt_text || item.title,
        sort_order: img.sort_order,
        is_primary: img.is_primary,
      }));
      const { error: imgErr } = await db
        .from("stock_item_images")
        .insert(imageRows);
      if (imgErr) console.error(`  images fail:`, imgErr.message);
    } else if (item.image_url) {
      await db.from("stock_item_images").insert({
        stock_item_id: inserted.id,
        image_url: item.image_url,
        alt_text: item.title,
        sort_order: 0,
        is_primary: true,
      });
    }

    console.log(`OK ${inserted.slug} (${inserted.id})`);
    created.push({
      newId: inserted.id,
      slug: inserted.slug,
      name: inserted.name,
      parentId: item.parentId,
      parentName: item.parentName,
      variantId: item.variantId,
      label: item.label,
    });
  }

  writeFileSync(
    MANIFEST,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        created,
        parentIds: [...new Set(created.map((c) => c.parentId))],
      },
      null,
      2,
    ),
  );
  console.log(
    `\nCreated ${created.length}/${plan.length}. Manifest → ${MANIFEST}`,
  );
  console.log(
    "Parents are still live. After you review the new products, run:\n" +
      "  SUPABASE_SERVICE_ROLE_KEY=... node scripts/split-adaptation-variants.mjs --delete-parents",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
