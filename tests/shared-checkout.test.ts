import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBasketReferences, checkoutBrand, sharedCheckoutPath } from '../src/lib/checkout-brands';
import { cartBlocksDeliveredVatRelief, validateAndFetchPrices } from './fixtures/v1-checkout-pricing';
const id = 'bcabc0e5-eba0-4c7f-9b75-19d78010be9b';
const variantId = '48c7dc5c-4150-419b-8fc5-976fd25257ca';
test('handoff strips supplied prices and personal information and preserves product options', () => {
 const refs = parseBasketReferences(JSON.stringify([{id,slug:'ergofold-folding-power-chair',quantity:1,variantIds:[variantId],unitPrice:0.01,email:'private@example.test'}]));
 assert.deepEqual(refs,[{id,slug:'ergofold-folding-power-chair',quantity:1,variantIds:[variantId],addonVariantId:undefined}]);
 assert.ok(!sharedCheckoutPath('ergofold', refs).includes('private'));
});
test('handoff rejects invalid quantities, duplicate options, oversized and empty baskets', () => {
 for (const quantity of [0,-1,1.5,101,'1']) assert.throws(()=>parseBasketReferences(JSON.stringify([{id,slug:'chair',quantity}])));
 assert.throws(()=>parseBasketReferences('[]'));
 assert.throws(()=>parseBasketReferences(JSON.stringify([{id,slug:'chair',quantity:1,variantIds:[variantId,variantId]}])));
 assert.throws(()=>parseBasketReferences(' '.repeat(12001)));
 assert.equal(checkoutBrand('https://evil.example'), 'mobilitystation');
 assert.equal(checkoutBrand('__proto__'),'mobilitystation');
});
test('wheelchair battery packages remain eligible, standalone batteries and chargers retain delivery restriction', () => {
 const chair={stockItemId:id,productName:'ErgoFold Elite — 3 x 10Ah Batteries',unitPrice:1495,quantity:1,isUsed:false,category:'Folding Powered Wheelchairs'};
 assert.equal(cartBlocksDeliveredVatRelief([chair]),false);
 assert.equal(cartBlocksDeliveredVatRelief([{...chair,category:'Batteries & Chargers'}]),true);
 assert.equal(cartBlocksDeliveredVatRelief([{...chair,isAddon:true}]),true);
 assert.equal(cartBlocksDeliveredVatRelief([chair,{...chair,category:'Scooter Batteries'}]),true);
});
test('live V1 pricing logic ignores tampered prices and rejects insufficient combined stock', async () => {
 const product={id,name:'ErgoFold Elite',category:'Folding Powered Wheelchairs',unit_price:1995,sale_price:995,published_to_website:true,website_visible:true,track_stock:true,quantity:2};
 const variant={id:variantId,stock_item_id:id,label:'2 x 10Ah Batteries',unit_price:2249,sale_price:1249,is_addon:false,track_stock:false};
 const client={from:(table:string)=>({select:()=>({in:async()=>({data:table==='stock_items'?[product]:[variant],error:null})})})};
 const item={stockItemId:id,productName:'Cheap chair',unitPrice:0.01,quantity:1,variantIds:[variantId]};
 const [result]=await validateAndFetchPrices(client,[item]);
 assert.equal(result.unitPrice,1249);
 assert.equal(result.productName,'ErgoFold Elite — 2 x 10Ah Batteries');
 await assert.rejects(()=>validateAndFetchPrices(client,[{...item,quantity:2},{...item,quantity:1}]),/enough stock/);
});
