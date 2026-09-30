/** Preview-only, read-only checks. No production secrets, orders or enquiries. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const base = 'http://localhost:3000';
const out = path.resolve('artifacts');
mkdirSync(out, { recursive: true });
const report = { mode: 'Local production build with curated fallback data; no business submissions', pages: [], routes: [], interactions: [], failures: [] };
function browser(...args) {
  return execFileSync('agent-browser', args, { encoding: 'utf8', timeout: 65000, maxBuffer: 4 * 1024 * 1024 });
}
function decode(value) {
  if (typeof value === 'string') { try { return decode(JSON.parse(value)); } catch { return null; } }
  if (value && typeof value === 'object') {
    if (value._msx === true) return value;
    for (const child of Object.values(value)) { const found = decode(child); if (found) return found; }
  }
  return null;
}
function evaluate(expression) {
  const raw = browser('--json', 'eval', `JSON.stringify(${expression})`);
  const result = decode(raw);
  if (!result) throw new Error(`Unrecognised browser result: ${raw.slice(0, 250)}`);
  return result;
}
const measure = `(() => ({_msx:true, url:location.href, title:document.title,
  h1:Array.from(document.querySelectorAll('main h1')).map(e=>e.textContent.trim()),
  width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
  division:document.querySelector('[data-site-page]')?.getAttribute('data-division'),
  headingFont:document.querySelector('main h1') ? getComputedStyle(document.querySelector('main h1')).fontFamily : null,
  missingImages:Array.from(document.images).filter(e=>e.complete && e.naturalWidth===0).map(e=>e.src),
  productLinks:Array.from(document.querySelectorAll('main a[href^="/products/"]')).slice(0,5).map(e=>e.getAttribute('href')),
  pageError:document.body.innerText.includes('Application error:')
}))()`;
function key(route) { return route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'; }
function capture(route, width) {
  browser('set', 'viewport', String(width), '960');
  browser('open', base + route);
  const snapshot = browser('snapshot', '-i');
  writeFileSync(path.join(out, `${key(route)}-${width}.txt`), snapshot);
  const reject = snapshot.split('\n').find(line => /button/.test(line) && /reject|necessary only|essential only/i.test(line));
  const ref = reject?.match(/ref=(e\d+)/)?.[1];
  if (ref) { browser('click', '@' + ref); browser('snapshot', '-i'); }
  const value = evaluate(measure);
  report.pages.push({ route, ...value });
  if (value.scrollWidth > width + 1) report.failures.push(`Horizontal overflow: ${route} at ${width}px (${value.scrollWidth})`);
  if (value.h1.length !== 1) report.failures.push(`Expected one H1: ${route} at ${width}px; found ${value.h1.length}`);
  if (value.pageError) report.failures.push(`Application error: ${route}`);
  browser('screenshot', path.join(out, `${key(route)}-${width}.png`), '--full');
  return value;
}
function staticRoutes(dir = 'src/app', prefix = '') {
  const routes = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  if (entries.some(e => e.isFile() && e.name === 'page.tsx')) routes.push(prefix || '/');
  for (const e of entries) if (e.isDirectory() && !e.name.includes('[') && e.name !== 'api') {
    routes.push(...staticRoutes(path.join(dir,e.name), prefix + (e.name.startsWith('(') ? '' : '/' + e.name)));
  }
  return routes;
}
try {
  const core = ['/', '/vehicle-adaptations', '/shop', '/motability', '/motability/vehicle-adaptations', '/hire', '/support', '/contact', '/checkout', '/servicing', '/book-a-demo', '/search?q=scooter&type=shop'];
  const products = new Set();
  for (const width of [1440, 390]) for (const route of core) {
    try { const page = capture(route, width); for (const link of page.productLinks) products.add(link); }
    catch (error) { report.failures.push(`${route} at ${width}: ${error.message}`); }
  }
  for (const route of ['/', '/shop', '/vehicle-adaptations', '/contact']) {
    try { capture(route, 768); } catch (error) { report.failures.push(`Tablet ${route}: ${error.message}`); }
  }
  for (const route of [...products].slice(0, 3)) {
    try { const page = capture(route, 390); if (!page.division) report.failures.push(`Product lost its section: ${route}`); }
    catch (error) { report.failures.push(`Product ${route}: ${error.message}`); }
  }
  if (products.size === 0) report.interactions.push('Product detail checks skipped: curated fallback catalogue supplied no product links.');
  browser('set', 'viewport', '390', '844'); browser('open', base + '/');
  let snapshot = browser('snapshot', '-i');
  let ref = snapshot.split('\n').find(l => /button "Open menu"/.test(l))?.match(/ref=(e\d+)/)?.[1];
  if (!ref) report.failures.push('Mobile menu control not found');
  else { browser('click', '@'+ref); snapshot=browser('snapshot','-i'); writeFileSync(path.join(out,'mobile-menu.txt'), snapshot); browser('screenshot',path.join(out,'mobile-menu.png')); report.interactions.push('Opened mobile menu'); ref=snapshot.split('\n').find(l=>/button "Close menu"/.test(l))?.match(/ref=(e\d+)/)?.[1]; if(ref) browser('click','@'+ref); }
  browser('set','viewport','1440','960'); browser('open',base+'/'); snapshot=browser('snapshot','-i');
  ref=snapshot.split('\n').find(l=>/button "Request a callback/.test(l))?.match(/ref=(e\d+)/)?.[1];
  if(ref) {browser('click','@'+ref); writeFileSync(path.join(out,'callback-dialog.txt'),browser('snapshot','-i')); browser('screenshot',path.join(out,'callback-dialog.png')); report.interactions.push('Opened callback dialog; did not submit');}
  for (const route of staticRoutes()) {
    try { const r=await fetch(base+route,{signal:AbortSignal.timeout(20000)}); report.routes.push({route,status:r.status,finalUrl:r.url}); }
    catch(error){report.routes.push({route,error:error.message});}
  }
} catch(error) { report.failures.push(error.stack || error.message); }
finally {
  writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
  try {browser('close');} catch {}
}
console.log(JSON.stringify({pages:report.pages.length,routes:report.routes.length,failures:report.failures},null,2));
if(report.failures.length) process.exitCode=1;
