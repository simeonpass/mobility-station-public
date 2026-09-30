import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { cartProductFromListItem, cartSubtotal, configuredCartLineId, type CheckoutPayload } from '../src/lib/cart';
import { getVatPriceDisplay } from '../src/lib/vat';
import { takeawayCreditForPrice } from '../src/lib/takeaway-credit';
import { calculateDemoFee, earliestPreferredDate, toIsoDate } from '../src/lib/demo-booking';
import { submitEnquiry } from '../src/lib/actions';
import { POST as carePlan } from '../src/app/api/care-plan/[action]/route';
import { POST as dna } from '../src/app/api/checkout/dna/route';
import { POST as paypal } from '../src/app/api/checkout/paypal/route';
import { POST as stripe } from '../src/app/api/checkout/stripe/route';
import { POST as capture } from '../src/app/api/checkout/paypal/capture/route';
import { POST as demo } from '../src/app/api/demo/book/route';
import { startCarePlanCheckout, pollCarePlanVerify } from '../src/lib/care-plan-client';

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
afterEach(() => { globalThis.fetch = originalFetch; process.env = { ...originalEnv }; });
function mockBackend(response: unknown, status = 200) {
  process.env.SUPABASE_URL = 'https://backend.example.test';
  process.env.SUPABASE_PUBLIC_SITE_KEY = 'test-only-not-a-real-key';
  const requests: { url: string; body: Record<string, unknown>; headers: Headers }[] = [];
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /^https:\/\/backend\.example\.test\/functions\/v1\//);
    requests.push({ url: String(url), body: JSON.parse(String(init?.body)), headers: new Headers(init?.headers) });
    return Response.json(response, { status });
  };
  return requests;
}
const product = { id: 'fixture', name: 'Test powerchair', slug: 'fixture', image_url: null, unit_price: 1595, sale_price: null, category: 'Powered Wheelchairs', condition: 'new' as const, product_type: 'mobility_product' };
const payload: CheckoutPayload = { customer: { email: 'test@example.test', firstName: 'Preview', lastName: 'Test' }, items: [{ stockItemId: 'fixture', productName: product.name, quantity: 2, unitPrice: 1595, variantIds: ['option-1'] }], fulfillmentMethod: 'collection', collectionBranch: 'heathrow', isVatExempt: true, vatExemptionReason: 'Mobility impairment', vatExemptionDeclaration: 'test declaration', takeawayRequested: true };
function req(path: string, body: unknown) { return new Request(`https://preview.example.test${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://preview.example.test' }, body: JSON.stringify(body) }); }

test('catalogue, sale pricing, quantities and configured options retain their existing rules', () => {
  const p = cartProductFromListItem(product)!;
  assert.equal(cartSubtotal([{ product: p, quantity: 2 }]), 3190);
  assert.equal(cartSubtotal([{ product: { ...p, sale_price: 1295 }, quantity: 2 }]), 2590);
  assert.equal(cartProductFromListItem({ ...product, product_type: 'vehicle_adaptation' }), null);
  assert.equal(cartProductFromListItem({ ...product, unit_price: 0 }), null);
  assert.equal(configuredCartLineId('id', ['b', 'a']), 'id__opts__a_b');
});
test('VAT display preserves new, used and battery rules', () => {
  assert.deepEqual(getVatPriceDisplay(product), { net: 1595, gross: 1914, wasNet: null, wasGross: null, mode: 'relief', showRelief: true });
  assert.equal(getVatPriceDisplay({ ...product, condition: 'pre-owned' }).gross, 1595);
  assert.equal(getVatPriceDisplay({ ...product, name: 'Battery charger' }).mode, 'always-inc');
  assert.equal(getVatPriceDisplay({ ...product, sale_price: 1295 }).wasGross, 1914);
});
test('takeaway bands stay unchanged at boundaries', () => {
  assert.deepEqual([0, 999.99, 1000, 1999.99, 2000, 20000].map(takeawayCreditForPrice), [0, 100, 200, 200, 300, 1000]);
});
test('demo fees retain free branch, £195 home and eligible PWSS waiver', () => {
  const input = { location: 'home' as const, productCategory: 'scooter_wheelchair' as const, customerType: 'private' as const, scooterWheelchairKind: 'scooter' as const, pwss: false };
  assert.equal(calculateDemoFee(input).amountGbp, 195);
  assert.equal(calculateDemoFee({ ...input, location: 'branch' }).amountGbp, 0);
  assert.equal(calculateDemoFee({ ...input, customerType: 'motability', pwss: true }).amountGbp, 0);
  assert.equal(calculateDemoFee({ ...input, customerType: 'motability', pwss: true, scooterWheelchairKind: 'manual_wheelchair' }).amountGbp, 195);
  assert.equal(toIsoDate(earliestPreferredDate(2, new Date('2026-09-30T12:00:00'))), '2026-10-05');
});
for (const [name, handler, response, functionName] of [
  ['DNA', dna, { paymentData: { test: true }, orderNumber: 'TEST' }, 'website-checkout'],
  ['PayPal', paypal, { url: 'https://payment.example.test', orderNumber: 'TEST' }, 'website-paypal-checkout'],
  ['Stripe', stripe, { url: 'https://payment.example.test', orderNumber: 'TEST' }, 'website-stripe-checkout'],
] as const) test(`${name} checkout preserves items, VAT, options, collection and preview return origin`, async () => {
  const calls = mockBackend(response);
  const result = await handler(req('/api/checkout/test', payload));
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), response);
  assert.deepEqual(calls[0].body, payload);
  assert.ok(calls[0].url.endsWith(functionName));
  assert.equal(calls[0].headers.get('Origin'), 'https://preview.example.test');
});
test('checkout propagates provider failure without inventing payment success', async () => {
  mockBackend({ error: 'Provider unavailable' }, 503);
  const result = await dna(req('/api/checkout/dna', payload));
  assert.equal(result.status, 500);
  assert.equal((await result.json()).error, 'Provider unavailable');
});
test('PayPal capture preserves pending and confirmed backend results', async () => {
  for (const response of [{ success: false, status: 'PENDING' }, { success: true, status: 'paid' }, { success: true, status: 'already_paid' }]) {
    mockBackend(response);
    assert.deepEqual(await (await capture(req('/api/checkout/paypal/capture', { orderNumber: 'TEST' }))).json(), response);
  }
  assert.equal((await capture(req('/api/checkout/paypal/capture', {}))).status, 400);
});
for (const enquiry_type of ['contact', 'service', 'callback']) test(`${enquiry_type} form forwards the existing enquiry contract`, async () => {
  const calls = mockBackend({ success: true });
  const fd = new FormData();
  for (const [key, value] of Object.entries({ name: 'Preview Test', phone: '07700900123', email: 'test@example.test', postcode: 'UB7 8EB', interest: 'Powerchair service', preferred_branch: 'heathrow', enquiry_type, message: 'Isolated regression test', inline: '1' })) fd.set(key, value);
  assert.equal((await submitEnquiry({ success: false }, fd)).success, true);
  assert.equal(calls[0].body.enquiryType, enquiry_type);
  assert.equal(calls[0].body.email, 'test@example.test');
  assert.match(String(calls[0].body.message), /Powerchair service/);
});
test('invalid enquiries never reach the backend and delivery failures remain visible', async () => {
  const calls = mockBackend({ success: false }, 500);
  assert.equal((await submitEnquiry({ success: false }, new FormData())).success, false);
  assert.equal(calls.length, 0);
});
test('demo booking validates and sends a free branch booking without payment', async () => {
  const calls = mockBackend({ success: true });
  const booking = { productCategory: 'scooter_wheelchair', scooterWheelchairKind: 'scooter', location: 'branch', branch: 'heathrow', customerType: 'private', pwss: false, name: 'Preview Test', phone: '07700900123', email: 'test@example.test', addressLine1: 'Test address', city: 'Test town', postcode: 'UB7 8EB', productName: 'Test scooter', preferredDate: toIsoDate(earliestPreferredDate(10)), preferredTime: 'morning' };
  const response = await demo(req('/api/demo/book', booking));
  const data = await response.json();
  assert.equal(response.status, 200, JSON.stringify(data));
  assert.equal(data.requiresPayment, false);
  assert.equal(data.feeGbp, 0);
  assert.equal(calls[0].body.enquiryType, 'demo');
  assert.equal((await demo(req('/api/demo/book', {}))).status, 400);
});
test('Care Plan proxy uses only configured server credentials and preserves preview return URL', async () => {
  const calls = mockBackend({ url: 'https://checkout.stripe.com/test', subscriptionId: 'TEST' });
  const body = { planKey: 'complete', name: 'Preview Test', email: 'test@example.test', phone: '07700900123', postcode: 'UB7 8EB', equipment: 'Powerchair', website: '', monthlyPrice: 0 };
  const response = await carePlan(req('/api/care-plan/checkout', body), { params: Promise.resolve({ action: 'checkout' }) });
  assert.equal(response.status, 200);
  assert.equal(calls[0].headers.get('Origin'), 'https://preview.example.test');
  assert.equal(calls[0].body.planKey, 'complete');
  assert.equal(calls[0].body.monthlyPrice, undefined);
  assert.equal(calls[0].headers.get('apikey'), 'test-only-not-a-real-key');
});
test('Care Plan proxy rejects malformed input, unknown actions and cross-origin submissions', async () => {
  const calls = mockBackend({});
  for (const [action, body, expected] of [['checkout', {}, 400], ['verify', { sessionId: 'invalid' }, 400], ['arbitrary-function', {}, 404]] as const) {
    assert.equal((await carePlan(req('/api/care-plan/'+action, body), { params: Promise.resolve({ action }) })).status, expected);
  }
  const request = req('/api/care-plan/checkout', {}); request.headers.set('Origin', 'https://unrelated.example.test');
  assert.equal((await carePlan(request, { params: Promise.resolve({ action: 'checkout' }) })).status, 403);
  assert.equal(calls.length, 0);
});
test('Care Plan browser calls work without public Supabase variables and poll pending to active', async () => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL; delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const paths: string[] = [];
  globalThis.fetch = async (url) => { paths.push(String(url)); return Response.json(paths.length === 1 ? { url: 'https://checkout.stripe.com/test' } : { status: paths.length === 2 ? 'pending' : 'active' }); };
  assert.equal((await startCarePlanCheckout({ planKey: 'essential', name: 'Test', email: 'test@example.test', phone: '', postcode: '', equipment: '' })).url, 'https://checkout.stripe.com/test');
  assert.equal((await pollCarePlanVerify('cs_test_fixture', 2, 0)).status, 'active');
  assert.deepEqual(paths, ['/api/care-plan/checkout', '/api/care-plan/verify', '/api/care-plan/verify']);
});
