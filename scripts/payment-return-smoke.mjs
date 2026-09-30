/** Local build only. Provider replies are intercepted; no payment or order is made. */
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const session = 'mobility-payment-regression';
const browser = (...args) => execFileSync('agent-browser', ['--session', session, ...args], { encoding: 'utf8', timeout: 30000 });
const fixture = [{ product: { id: 'fixture', stockItemId: 'fixture', name: 'Test powerchair', slug: 'fixture', image_url: null, unit_price: 1595, sale_price: null, category: 'Powered Wheelchairs', weight: 13.5, condition: 'new', product_type: 'mobility_product' }, quantity: 1 }];
try {
  browser('open', 'http://localhost:3000/robots.txt');
  for (const [reply, expected, retained] of [
    [{ success: false, status: 'PENDING' }, 'Payment needs checking', true],
    [{}, 'Payment needs checking', true],
    [{ success: true, status: 'paid' }, 'Thank you for your order', false],
    [{ success: true, status: 'already_paid' }, 'Thank you for your order', false],
  ]) {
    // Seed storage on a same-origin static page so React cannot overwrite it during hydration.
    browser('open', 'http://localhost:3000/robots.txt');
    browser('eval', `localStorage.setItem('ms-cart', ${JSON.stringify(JSON.stringify(fixture))})`);
    browser('network', 'route', '**/api/checkout/paypal/capture', '--body', JSON.stringify(reply));
    browser('open', 'http://localhost:3000/order-confirmation?payment=success&provider=paypal&order=TEST');
    browser('wait', '--text', expected);
    const text = browser('get', 'text', 'main');
    assert.ok(text.includes(expected));
    if (retained) assert.ok(!text.includes('Payment received'));
    const count = browser('eval', "JSON.parse(localStorage.getItem('ms-cart')||'[]').length").trim();
    assert.equal(count, retained ? '1' : '0');
    console.log(`PASS PayPal ${JSON.stringify(reply)}: basket ${retained ? 'retained' : 'cleared'}`);
    browser('network', 'unroute');
  }
  browser('open', 'http://localhost:3000/robots.txt');
  browser('eval', `localStorage.setItem('ms-cart', ${JSON.stringify(JSON.stringify(fixture))})`);
  browser('open', 'http://localhost:3000/order-confirmation?payment=cancel&provider=paypal&order=TEST');
  assert.ok(browser('get', 'text', 'main').includes('Checkout cancelled'));
  assert.equal(browser('eval', "JSON.parse(localStorage.getItem('ms-cart')||'[]').length").trim(), '1');
  console.log('PASS cancelled payment retains basket');
} finally { browser('close'); }
