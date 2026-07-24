export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  unit_price: number;
  sale_price: number | null;
  category: string | null;
  weight: number | null;
  condition: "new" | "ex-demo" | "refurbished" | "pre-owned" | null;
  product_type: string | null;
  pre_order_enabled?: boolean;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

export const CART_STORAGE_KEY = "ms-cart";

export function linePrice(product: CartProduct) {
  if (product.sale_price != null && product.sale_price > 0) {
    return product.sale_price;
  }
  return product.unit_price;
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce(
    (sum, item) => sum + linePrice(item.product) * item.quantity,
    0,
  );
}

export function isUsedCartProduct(product: CartProduct) {
  return (
    product.condition === "ex-demo" ||
    product.condition === "refurbished" ||
    product.condition === "pre-owned"
  );
}

export function isAdaptationProduct(product: CartProduct) {
  return (
    product.product_type === "vehicle_adaptation" ||
    // Keep in sync with src/lib/adaptations.ts category list for cart safety
    [
      "Mechanical Hand Controls",
      "Electronic Accelerators",
      "Hinged Accelerator",
      "Parking Sensors",
      "Left Foot Accelerators",
      "Pedal Extensions",
      "Pedal Guards",
      "Steering Aids",
      "Electric Handbrakes",
      "Secondary Controls",
      "Easy Release",
      "Boot Hoists",
      "Pre-Owned Boot Hoists",
      "Person Hoists",
      "Wheelchair Docking Systems",
      "Wheelchair Stowage - Rooftop",
      "Wheelchair Winches",
      "Boot Straps",
      "Automatic Boot Openers",
      "Swivel Seats",
      "Transfer Plates",
      "Side Steps",
      "Grab Handles",
      "Seating Modifications",
      "Protective Screens",
    ].includes(product.category || "")
  );
}

export type CheckoutPayload = {
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  items: Array<{
    stockItemId: string;
    productName: string;
    productImageUrl?: string;
    quantity: number;
    unitPrice: number;
    isUsed?: boolean;
  }>;
  fulfillmentMethod: "delivery" | "collection";
  deliveryType?: string;
  deliveryAddress?: string;
  deliveryPostcode?: string;
  collectionBranch?: string;
  isVatExempt: boolean;
  vatExemptionReason?: string;
  vatExemptionDeclaration?: string;
  notes?: string;
  deliveryFee?: number;
};

export const VAT_CONDITIONS = [
  { id: "mobility", label: "Mobility impairment" },
  { id: "physical", label: "Physical disability" },
  { id: "chronic", label: "Chronic illness" },
  { id: "neurological", label: "Neurological condition" },
  { id: "musculoskeletal", label: "Musculoskeletal condition" },
  { id: "amputee", label: "Limb loss / amputation" },
  { id: "sight", label: "Visual impairment" },
  { id: "hearing", label: "Hearing impairment" },
  { id: "mental", label: "Mental health condition" },
  { id: "learning", label: "Learning disability" },
  { id: "terminal", label: "Terminal illness" },
  { id: "other", label: "Other qualifying condition" },
] as const;

export const VAT_DECLARATION =
  "I declare that I am chronically sick or have a disabling condition and that the goods I am purchasing are being supplied to me for my domestic or personal use. I claim relief from Value Added Tax under the Value Added Tax Act 1994, Group 12, Schedule 8.";
