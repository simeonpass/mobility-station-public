import test from 'node:test';
import assert from 'node:assert/strict';
import { rankProductSearch, cleanSearchQuery } from '../src/lib/product-search.ts';

const product = (id, name, fields = {}) => ({ id, slug: id, name, ...fields });
const catalogue = [
  product('e60', 'Robooter E60', { manufacturer: 'Robooter', category: 'Folding Powered Wheelchairs', sku: 'FPW-014' }),
  product('e60pro', 'The Robooter E60 Pro', { manufacturer: 'Robooter', category: 'Powered Wheelchairs' }),
  product('e80', 'Robooter E80 Carbon', { manufacturer: 'Robooter', category: 'Powered Wheelchairs' }),
  product('gogo', 'Pride Go-Go Elite Traveller', { manufacturer: 'Pride Mobility', category: 'Small Scooters' }),
  product('fold', 'Kymco K-Lite FE Folding Mobility Scooter', { manufacturer: 'Kymco Healthcare', category: 'Folding Mobility Scooters' }),
  product('ctran', 'Guidosimplex C-Tran Wheelchair Storage Roof Box', { category: 'Wheelchair Stowage - Rooftop', product_type: 'vehicle_adaptation' }),
  product('logic', 'Excel G Logic Transit Wheelchair', { category: 'Manual Wheelchairs' }),
  product('q100r', 'Sunrise Medical Quickie Q100 R', { category: 'Powered Wheelchairs' }),
  product('q200r', 'Sunrise Medical Quickie Q200 R', { category: 'Powered Wheelchairs' }),
  product('hoist', 'Autochair Folding Boot Hoist', { category: 'Boot Hoists', product_type: 'vehicle_adaptation', description: 'A folding hoist for your scooter.' }),
  product('xsto', 'XSTO M4 Pro Power Wheelchair', { manufacturer: 'XSTO', category: 'Powered Wheelchairs' }),
  product('battery', 'Lithium Battery for XSTO M4', { manufacturer: 'XSTO', category: 'XSTO Accessories', is_featured: true }),
  product('hand', 'Jeff Gosling Hand Controls', { manufacturer: 'Jeff Gosling Ltd.', category: 'Mechanical Hand Controls' }),
  product('detail', 'Motion Example', { description: '<p>Carbon fibre frame</p>', features: ['Removable armrests'] }),
  product('hidden', 'Hidden Scooter', { website_visible: false }),
  product('draft', 'Unpublished Scooter', { published_to_website: false }),
  product('archived', 'Archived Scooter', { product_type: 'archived' }),
  product('empty', 'Blank Slug Scooter', { slug: ' ' }),
];
const search = query => rankProductSearch(catalogue, query);
const ids = query => search(query).items.map(item => item.id);

test('exact product and SKU outrank other matches', () => {
  assert.equal(ids('Robooter E60')[0], 'e60');
  assert.equal(ids('FPW014')[0], 'e60');
  assert.equal(ids('FPW-014')[0], 'e60');
});
test('model spacing, hyphens and case are interchangeable', () => {
  for (const query of ['C-Tran', 'ctran', 'c tran', 'GUIDOSIMPLEX C TRAN']) assert.equal(ids(query)[0], 'ctran');
  for (const query of ['q100r', 'Q 100 R']) assert.equal(ids(query)[0], 'q100r');
  for (const query of ['gogo', 'Go Go', 'go-go']) assert.equal(ids(query)[0], 'gogo');
});
test('compact matching respects the beginning of words', () => assert.deepEqual(ids('ctran'), ['ctran']));
test('names, manufacturer words and category words can be combined', () => {
  assert.equal(ids('Pride portable boot scooter')[0], 'gogo');
  assert.equal(ids('jeff gosling controls')[0], 'hand');
});
test('synonyms and plurals find powerchairs', () => {
  for (const query of ['powerchair', 'electric wheelchair', 'power chair', 'powered wheelchairs']) assert.ok(ids(query).includes('e60'));
  assert.ok(ids('foldable scooters').includes('fold'));
});
test('spelling recovery handles insertion and transposition', () => {
  for (const query of ['roboooter e60', 'robootre e60', 'folding scoooter']) {
    assert.equal(search(query).approximate, true);
    assert.ok(search(query).items.length);
  }
  assert.equal(ids('folding scoooter')[0], 'fold');
});
test('never changes model digits to invent an unavailable match', () => {
  assert.deepEqual(ids('robooter e600'), []);
  assert.deepEqual(ids('q900r'), []);
  assert.deepEqual(ids('xsto m9'), []);
});
test('whole products rank ahead of accessories for model searches', () => {
  assert.equal(ids('xsto m4')[0], 'xsto');
  assert.equal(ids('xsto m4 battery')[0], 'battery');
});
test('generic wheelchair searches start with wheelchairs, not hoists', () => {
  assert.notEqual(ids('wheelchairs')[0], 'ctran');
  assert.equal(ids('scooter hoist')[0], 'hoist');
});
test('search also uses descriptions and features', () => {
  assert.equal(ids('carbon fibre')[0], 'detail');
  assert.equal(ids('removable armrest')[0], 'detail');
});
test('hidden, draft, archived and unusable links are excluded', () => {
  for (const id of ['hidden', 'draft', 'archived', 'empty']) assert.equal(ids('scooter').includes(id), false);
});
test('all words matter; unrelated terms are not silently discarded', () => {
  assert.deepEqual(ids('Robooter unicorn'), []);
  assert.deepEqual(ids('zzzzzzzzzz'), []);
});
test('malformed and long user input is bounded and harmless', () => {
  assert.deepEqual(ids('%(),_*'), []);
  assert.deepEqual(ids('   '), []);
  assert.deepEqual(ids('a and the'), []);
  assert.equal(cleanSearchQuery(['  Robooter  ', 'ignored']), 'Robooter');
  assert.equal(cleanSearchQuery('a'.repeat(1000)).length, 120);
});
test('rank before any display limit and retain every result', () => {
  const many = Array.from({ length: 350 }, (_, i) => product(`s${i}`, `Scooter ${i}`, { is_featured: true }));
  many.push(product('target', 'Exact Scooter Target'));
  assert.equal(rankProductSearch(many, 'Exact Scooter Target').items[0].id, 'target');
  assert.equal(rankProductSearch(many, 'Scooter').items.length, 351);
});
