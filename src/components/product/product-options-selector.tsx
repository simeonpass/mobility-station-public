"use client";

import { useEffect, useMemo } from "react";
import {
  addonLinePrice,
  formatGBP,
  type ProductVariant,
} from "@/lib/products";

type Props = {
  variants: ProductVariant[];
  selectedByGroup: Record<string, ProductVariant>;
  onSelectVariant: (group: string, variant: ProductVariant) => void;
  selectedAddons: ProductVariant[];
  onToggleAddon: (addon: ProductVariant) => void;
  onImageChange?: (imageUrl: string) => void;
};

function optionPriceText(variant: ProductVariant) {
  if (variant.unit_price != null && Number(variant.unit_price) > 0) {
    const current =
      variant.sale_price != null &&
      Number(variant.sale_price) > 0 &&
      Number(variant.sale_price) < Number(variant.unit_price)
        ? Number(variant.sale_price)
        : Number(variant.unit_price);
    return formatGBP(current);
  }
  const adjustment = Number(variant.price_adjustment) || 0;
  if (adjustment === 0) return "Included";
  return `${adjustment > 0 ? "+" : "−"}${formatGBP(Math.abs(adjustment))}`;
}

export function ProductOptionsSelector({
  variants,
  selectedByGroup,
  onSelectVariant,
  selectedAddons,
  onToggleAddon,
  onImageChange,
}: Props) {
  const options = useMemo(
    () => variants.filter((v) => !v.is_addon),
    [variants],
  );
  const addons = useMemo(
    () => variants.filter((v) => v.is_addon),
    [variants],
  );

  const grouped = useMemo(() => {
    const groups: Record<string, ProductVariant[]> = {};
    for (const v of options) {
      const group = v.variant_group || "Options";
      if (!groups[group]) groups[group] = [];
      groups[group].push(v);
    }
    return groups;
  }, [options]);

  const groupNames = Object.keys(grouped);

  useEffect(() => {
    if (!groupNames.length) return;
    for (const group of groupNames) {
      if (selectedByGroup[group]) continue;
      const items = grouped[group];
      const def = items.find((v) => v.is_default) || items[0];
      if (def) onSelectVariant(group, def);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupNames.join("|")]);

  if (!groupNames.length && !addons.length) return null;

  return (
    <div className="space-y-5 border-t border-border pt-5">
      {groupNames.map((group) => {
        const items = grouped[group];
        const selected = selectedByGroup[group];
        const useSelect = items.length > 5;

        return (
          <div key={group}>
            <label
              htmlFor={useSelect ? `option-${group}` : undefined}
              className="mb-1.5 block text-sm font-medium text-primary"
            >
              {group}
            </label>

            {useSelect ? (
              <select
                id={`option-${group}`}
                className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                value={selected?.id ?? ""}
                onChange={(e) => {
                  const next = items.find((v) => v.id === e.target.value);
                  if (!next) return;
                  onSelectVariant(group, next);
                  if (next.image_url && onImageChange) {
                    onImageChange(next.image_url);
                  }
                }}
              >
                {items.map((variant) => {
                  const outOfStock =
                    variant.track_stock && (variant.quantity ?? 0) <= 0;
                  return (
                    <option
                      key={variant.id}
                      value={variant.id}
                      disabled={outOfStock}
                    >
                      {variant.label || "Option"}
                      {" — "}
                      {outOfStock ? "Out of stock" : optionPriceText(variant)}
                    </option>
                  );
                })}
              </select>
            ) : (
              <div
                className="divide-y divide-border rounded-lg border border-border"
                role="radiogroup"
                aria-label={group}
              >
                {items.map((variant) => {
                  const isSelected = selected?.id === variant.id;
                  const outOfStock =
                    variant.track_stock && (variant.quantity ?? 0) <= 0;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={outOfStock}
                      onClick={() => {
                        onSelectVariant(group, variant);
                        if (variant.image_url && onImageChange) {
                          onImageChange(variant.image_url);
                        }
                      }}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        isSelected
                          ? "bg-soft/80"
                          : "bg-white hover:bg-soft/50"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={`h-3.5 w-3.5 shrink-0 rounded-full border ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-border bg-white"
                          }`}
                          aria-hidden
                        />
                        <span className="truncate font-medium text-foreground">
                          {variant.label || "Option"}
                          {outOfStock ? (
                            <span className="ml-1.5 font-normal text-muted">
                              (out of stock)
                            </span>
                          ) : null}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 tabular-nums ${
                          optionPriceText(variant) === "Included"
                            ? "text-muted"
                            : "font-medium text-foreground"
                        }`}
                      >
                        {outOfStock ? "—" : optionPriceText(variant)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {addons.length > 0 ? (
        <div>
          <p className="mb-1.5 text-sm font-medium text-primary">
            Optional extras
          </p>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {addons.map((addon) => {
              const isSelected = selectedAddons.some((a) => a.id === addon.id);
              const amount = addonLinePrice(addon);
              const outOfStock =
                addon.track_stock && (addon.quantity ?? 0) <= 0;
              return (
                <li key={addon.id}>
                  <label
                    className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-sm ${
                      outOfStock ? "cursor-not-allowed opacity-50" : ""
                    } ${isSelected ? "bg-soft/80" : "bg-white hover:bg-soft/50"}`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 shrink-0 rounded border-border text-primary focus:ring-primary"
                        checked={isSelected}
                        disabled={outOfStock}
                        onChange={() => onToggleAddon(addon)}
                      />
                      <span className="truncate font-medium text-foreground">
                        {addon.label || "Extra"}
                      </span>
                    </span>
                    <span className="shrink-0 tabular-nums text-muted">
                      {outOfStock
                        ? "Out of stock"
                        : amount > 0
                          ? `+ ${formatGBP(amount)}`
                          : "Included"}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
