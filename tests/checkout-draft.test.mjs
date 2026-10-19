import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHECKOUT_DRAFT_KEY,
  EMPTY_CHECKOUT_DRAFT,
  checkoutDraftHasContent,
  clearCheckoutDraft,
  parseCheckoutDraft,
  readCheckoutDraft,
  saveCheckoutDraft,
  serializeCheckoutDraft,
} from '../src/lib/checkout-draft.ts';

/** Minimal sessionStorage stand-in for the Node test runner. */
function fakeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => void map.set(k, String(v)),
    removeItem: (k) => void map.delete(k),
    size: () => map.size,
  };
}

const typed = {
  ...EMPTY_CHECKOUT_DRAFT,
  email: 'jo@example.com',
  firstName: 'Jo',
  lastName: 'Bloggs',
  phone: '07700 900123',
  fulfillment: 'delivery',
  address: '1 High Street\nFerndown',
  postcode: 'BH22 9AA',
  isVatExempt: true,
  vatConditionId: 'mobility',
  declarationConfirmed: true,
  takeawayRequested: true,
  notes: 'Leave with neighbour',
};

test('a draft survives a save and read round trip exactly as typed', () => {
  const store = fakeStorage();
  saveCheckoutDraft(typed, store);
  assert.deepEqual(readCheckoutDraft(store), typed);
});

test('returning from DNA or PayPal restores delivery, VAT relief, takeaway and notes', () => {
  const restored = parseCheckoutDraft(serializeCheckoutDraft(typed));
  assert.equal(restored.fulfillment, 'delivery');
  assert.equal(restored.postcode, 'BH22 9AA');
  assert.equal(restored.isVatExempt, true);
  assert.equal(restored.vatConditionId, 'mobility');
  assert.equal(restored.declarationConfirmed, true);
  assert.equal(restored.takeawayRequested, true);
  assert.equal(restored.notes, 'Leave with neighbour');
});

test('collection with a branch is kept', () => {
  const draft = { ...EMPTY_CHECKOUT_DRAFT, fulfillment: 'collection', collectionBranch: 'Ferndown' };
  const restored = parseCheckoutDraft(serializeCheckoutDraft(draft));
  assert.equal(restored.fulfillment, 'collection');
  assert.equal(restored.collectionBranch, 'Ferndown');
});

test('malformed, foreign or outdated stored values are ignored, not thrown', () => {
  assert.equal(parseCheckoutDraft(null), null);
  assert.equal(parseCheckoutDraft(''), null);
  assert.equal(parseCheckoutDraft('{not json'), null);
  assert.equal(parseCheckoutDraft('"a string"'), null);
  assert.equal(parseCheckoutDraft(JSON.stringify({ v: 99, email: 'x' })), null);
  const odd = parseCheckoutDraft(JSON.stringify({ v: 1, email: 42, fulfillment: 'teleport', isVatExempt: 'yes', extra: true }));
  assert.deepEqual(odd, EMPTY_CHECKOUT_DRAFT);
});

test('an untouched form stores nothing and clears an older draft', () => {
  const store = fakeStorage();
  saveCheckoutDraft(typed, store);
  assert.equal(store.size(), 1);
  assert.equal(checkoutDraftHasContent(EMPTY_CHECKOUT_DRAFT), false);
  saveCheckoutDraft(EMPTY_CHECKOUT_DRAFT, store);
  assert.equal(store.getItem(CHECKOUT_DRAFT_KEY), null);
});

test('a confirmed payment clears the draft', () => {
  const store = fakeStorage();
  saveCheckoutDraft(typed, store);
  clearCheckoutDraft(store);
  assert.equal(readCheckoutDraft(store), null);
});

test('storage that throws (private mode) is tolerated', () => {
  const broken = {
    getItem: () => { throw new Error('blocked'); },
    setItem: () => { throw new Error('blocked'); },
    removeItem: () => { throw new Error('blocked'); },
  };
  assert.doesNotThrow(() => saveCheckoutDraft(typed, broken));
  assert.equal(readCheckoutDraft(broken), null);
  assert.doesNotThrow(() => clearCheckoutDraft(broken));
  assert.equal(readCheckoutDraft(null), null);
});
