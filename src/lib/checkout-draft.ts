/**
 * Checkout form draft kept in sessionStorage.
 *
 * DNA Payments and PayPal take the whole tab away from /checkout. If the
 * customer closes the payment page or presses back, Next re-mounts the form
 * with empty fields. The draft lets the form come back exactly as they left
 * it. It is cleared once the confirmation page accepts a payment, and it
 * never contains card details — only what the customer typed on our page.
 *
 * Kept free of path-alias imports so the Node test runner can load it.
 */

export const CHECKOUT_DRAFT_KEY = "ms-checkout-draft";
export const CHECKOUT_DRAFT_VERSION = 1;

export type CheckoutDraft = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  fulfillment: "delivery" | "collection";
  address: string;
  postcode: string;
  collectionBranch: string;
  isVatExempt: boolean;
  vatConditionId: string;
  declarationConfirmed: boolean;
  takeawayRequested: boolean;
  notes: string;
};

export const EMPTY_CHECKOUT_DRAFT: CheckoutDraft = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  fulfillment: "delivery",
  address: "",
  postcode: "",
  collectionBranch: "",
  isVatExempt: false,
  vatConditionId: "",
  declarationConfirmed: false,
  takeawayRequested: false,
  notes: "",
};

const str = (v: unknown) => (typeof v === "string" ? v : "");
const bool = (v: unknown) => v === true;

/** Build a draft from unknown input, dropping anything unexpected. */
export function normalizeCheckoutDraft(input: unknown): CheckoutDraft {
  const raw = (input && typeof input === "object" ? input : {}) as Record<
    string,
    unknown
  >;
  return {
    email: str(raw.email),
    firstName: str(raw.firstName),
    lastName: str(raw.lastName),
    phone: str(raw.phone),
    fulfillment: raw.fulfillment === "collection" ? "collection" : "delivery",
    address: str(raw.address),
    postcode: str(raw.postcode),
    collectionBranch: str(raw.collectionBranch),
    isVatExempt: bool(raw.isVatExempt),
    vatConditionId: str(raw.vatConditionId),
    declarationConfirmed: bool(raw.declarationConfirmed),
    takeawayRequested: bool(raw.takeawayRequested),
    notes: str(raw.notes),
  };
}

/** True when the customer has typed anything worth keeping. */
export function checkoutDraftHasContent(draft: CheckoutDraft): boolean {
  return (
    draft.email !== "" ||
    draft.firstName !== "" ||
    draft.lastName !== "" ||
    draft.phone !== "" ||
    draft.address !== "" ||
    draft.postcode !== "" ||
    draft.collectionBranch !== "" ||
    draft.notes !== "" ||
    draft.fulfillment !== "delivery" ||
    draft.isVatExempt ||
    draft.takeawayRequested
  );
}

export function serializeCheckoutDraft(draft: CheckoutDraft): string {
  return JSON.stringify({
    v: CHECKOUT_DRAFT_VERSION,
    ...normalizeCheckoutDraft(draft),
  });
}

/** Parse a stored draft; null when missing, malformed or from another version. */
export function parseCheckoutDraft(raw: string | null): CheckoutDraft | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    if ((parsed as { v?: unknown }).v !== CHECKOUT_DRAFT_VERSION) return null;
    return normalizeCheckoutDraft(parsed);
  } catch {
    return null;
  }
}

type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function storage(): DraftStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null; // storage disabled
  }
}

export function readCheckoutDraft(store = storage()): CheckoutDraft | null {
  if (!store) return null;
  try {
    return parseCheckoutDraft(store.getItem(CHECKOUT_DRAFT_KEY));
  } catch {
    return null;
  }
}

export function saveCheckoutDraft(draft: CheckoutDraft, store = storage()) {
  if (!store) return;
  try {
    if (checkoutDraftHasContent(draft)) {
      store.setItem(CHECKOUT_DRAFT_KEY, serializeCheckoutDraft(draft));
    } else {
      store.removeItem(CHECKOUT_DRAFT_KEY);
    }
  } catch {
    /* private mode or quota */
  }
}

export function clearCheckoutDraft(store = storage()) {
  if (!store) return;
  try {
    store.removeItem(CHECKOUT_DRAFT_KEY);
  } catch {
    /* ignore */
  }
}
