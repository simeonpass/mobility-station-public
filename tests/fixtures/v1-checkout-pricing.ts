interface CheckoutItemInput {
  stockItemId: string; productName: string; productImageUrl?: string; quantity: number; unitPrice: number; isUsed?: boolean;
  variantIds?: string[]; addonVariantId?: string;
}
export interface ValidatedCheckoutItem extends CheckoutItemInput {
  unitPrice: number; isUsed: boolean; category?: string | null; productType?: string | null;
  preOrderEnabled?: boolean; depositPercentage?: number; isAddon?: boolean;
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const usedCondition = (v: unknown) => ['ex-demo','refurbished','pre-owned'].includes(String(v || ''));
const money = (n: number) => Math.round(n * 100) / 100;
const effective = (unit: unknown, sale: unknown) => Number(sale) > 0 ? Number(sale) : Number(unit);

export async function validateAndFetchPrices(supabase: any, items: CheckoutItemInput[], opts: { allowSynthetic?: boolean } = {}): Promise<ValidatedCheckoutItem[]> {
  if (!Array.isArray(items) || !items.length) throw new Error('Cart is empty');
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 1000) throw new Error(`Invalid quantity for ${item.productName || 'item'}`);
    if (!UUID.test(item.stockItemId) && !opts.allowSynthetic) throw new Error(`Invalid product reference: ${item.productName || 'item'}`);
  }
  const ids = [...new Set(items.map(i => i.stockItemId).filter(id => UUID.test(id)))];
  if (!ids.length && opts.allowSynthetic) return items.map(i => ({ ...i, unitPrice: Number(i.unitPrice), isUsed: !!i.isUsed }));
  const { data: products, error } = await supabase.from('stock_items')
    .select('id,name,category,product_type,condition,unit_price,sale_price,published_to_website,website_visible,pre_order_enabled,deposit_percentage,track_stock,quantity')
    .in('id', ids);
  if (error) throw new Error(`Price lookup failed: ${error.message}`);
  const productMap = new Map((products || []).map((p: any) => [p.id, p]));

  const requestedVariantIds = [...new Set(items.flatMap(i => [...(i.variantIds || []), ...(i.addonVariantId ? [i.addonVariantId] : [])]).filter(id => UUID.test(id)))];
  const variantMap = new Map<string, any>();
  if (requestedVariantIds.length) {
    const { data: variants, error: vErr } = await supabase.from('product_variants')
      .select('id,stock_item_id,label,unit_price,sale_price,price_adjustment,is_addon,track_stock,quantity')
      .in('id', requestedVariantIds);
    if (vErr) throw new Error(`Option price lookup failed: ${vErr.message}`);
    for (const v of variants || []) variantMap.set(v.id, v);
  }

  const validated: any[] = [];
  for (const item of items) {
    if (!UUID.test(item.stockItemId)) { validated.push({ ...item, unitPrice: Number(item.unitPrice), isUsed: !!item.isUsed }); continue; }
    const p: any = productMap.get(item.stockItemId);
    if (!p) throw new Error(`Product not available: ${item.productName}`);
    if (!p.published_to_website || p.website_visible === false) throw new Error(`Product is not published for sale: ${p.name}`);
    const basePrice = effective(p.unit_price, p.sale_price);
    if (!Number.isFinite(basePrice) || basePrice <= 0) throw new Error(`Product has no valid price: ${p.name}`);

    let linePrice = basePrice;
    let canonicalName = p.name;
    let isAddon = false;
    const optionVariants: any[] = [];

    if (item.addonVariantId) {
      const v = variantMap.get(item.addonVariantId);
      if (!v || v.stock_item_id !== p.id || !v.is_addon) throw new Error(`Optional extra is not available for ${p.name}`);
      linePrice = Number(v.sale_price) > 0 ? Number(v.sale_price) : Number(v.unit_price) > 0 ? Number(v.unit_price) : Number(v.price_adjustment) || 0;
      if (linePrice < 0) throw new Error(`Invalid optional extra price for ${p.name}`);
      canonicalName = v.label || item.productName || 'Optional extra';
      isAddon = true;
      optionVariants.push(v);
    } else if (item.variantIds?.length) {
      for (const id of item.variantIds) {
        const v = variantMap.get(id);
        if (!v || v.stock_item_id !== p.id || v.is_addon) throw new Error(`Selected option is not available for ${p.name}`);
        optionVariants.push(v);
      }
      const absolute = optionVariants.find(v => Number(v.unit_price) > 0);
      if (absolute) linePrice = Number(absolute.sale_price) > 0 ? Number(absolute.sale_price) : Number(absolute.unit_price);
      else linePrice = basePrice + optionVariants.reduce((sum, v) => sum + (Number(v.price_adjustment) || 0), 0);
      const labels = optionVariants.map(v => v.label).filter(Boolean);
      if (labels.length) canonicalName = `${p.name} — ${labels.join(', ')}`;
    }
    linePrice = money(linePrice);
    if (!Number.isFinite(linePrice) || linePrice < 0) throw new Error(`Invalid price for ${canonicalName}`);

    for (const v of optionVariants) {
      if (v.track_stock && Number(v.quantity ?? 0) < item.quantity) throw new Error(`${v.label || canonicalName} is out of stock`);
    }

    validated.push({ ...item, productName: canonicalName, unitPrice: linePrice, isUsed: usedCondition(p.condition), category: p.category, productType: p.product_type, preOrderEnabled: !!p.pre_order_enabled, depositPercentage: Number(p.deposit_percentage) || 0, isAddon });
  }

  const parentDemand = new Map<string, number>();
  for (const item of validated) if (!item.isAddon && UUID.test(item.stockItemId)) parentDemand.set(item.stockItemId, (parentDemand.get(item.stockItemId) || 0) + item.quantity);
  for (const [id, qty] of parentDemand) {
    const p: any = productMap.get(id);
    if (p?.track_stock && !p.pre_order_enabled && Number(p.quantity ?? 0) < qty) throw new Error(`${p.name} does not have enough stock for this order`);
  }
  return validated;
}

const ELIGIBLE = /scooter|wheelchair|power\s*chair|powerchair|mobility\s*chair/i;
export function takeawayCreditForValidatedItems(items: ValidatedCheckoutItem[]): number {
  let best = 0;
  for (const i of items) {
    if (i.isAddon || i.productType === 'vehicle_adaptation') continue;
    if (!ELIGIBLE.test(i.category || '') && !ELIGIBLE.test(i.productName || '')) continue;
    if (i.unitPrice > best) best = i.unitPrice;
  }
  if (!(best > 0)) return 0;
  return Math.min((Math.floor(best / 1000) + 1) * 100, 1000);
}
export function cartBlocksDeliveredVatRelief(items: ValidatedCheckoutItem[]): boolean {
  return items.some(i => {
    // Battery options supplied with a wheelchair are part of that wheelchair,
    // not standalone replacement batteries. Keep the delivery restriction for
    // separate batteries/chargers and optional extras.
    const category = i.category || '';
    if (!i.isAddon && /wheelchair|power\\s*chair|powerchair|scooter/i.test(category) && !/batter|charger/i.test(category)) return false;
    return /batter|charger/i.test(`${category} ${i.productName || ''}`);
  });
}

