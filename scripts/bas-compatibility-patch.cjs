const fs = require('node:fs');
const file = 'src/components/product/product-detail-view.tsx';
let source = fs.readFileSync(file, 'utf8');
if (source.includes('const basCompatibilityMarker =')) process.exit(0);
const anchor = '  const sections = [';
if (source.split(anchor).length !== 2 || source.split('props.description').length !== 3) throw new Error('Unexpected live product component; refusing to patch');
source = source.replaceAll('props.description', 'productDescription');
source = source.replace(anchor, `  const basCompatibilityMarker = "VEHICLE COMPATIBILITY — BAS ELECTRIC BOOT OPENER";
  const compatibilityStart = props.description?.indexOf(basCompatibilityMarker) ?? -1;
  const compatibility = compatibilityStart >= 0 ? props.description!.slice(compatibilityStart) : null;
  const productDescription = compatibilityStart >= 0 ? props.description!.slice(0, compatibilityStart).trim() : props.description;

${anchor}`);
const viewAnchor = '      {sections.length > 0 ? (';
if (source.split(viewAnchor).length !== 2) throw new Error('Unexpected section location');
source = source.replace(viewAnchor, `      {compatibility ? (
        <details className="my-8 rounded-2xl border border-border bg-white p-5 sm:p-6">
          <summary className="cursor-pointer text-lg font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4">
            Does this fit my vehicle?
            <span className="ml-2 text-sm font-normal">View vehicle compatibility</span>
          </summary>
          <div className="mt-5 space-y-4 text-base leading-relaxed">
            {compatibility.split(/\\n{2,}/).slice(1).map((block, index) => {
              const lines = block.split("\\n");
              const vehicles = lines.slice(1);
              return vehicles.length > 0 && vehicles.every((line) => line.startsWith("• ")) ? (
                <details key={index} className="rounded-xl border border-border px-4 py-3">
                  <summary className="cursor-pointer font-semibold text-primary">{lines[0]} <span className="font-normal text-muted">({vehicles.length})</span></summary>
                  <ul className="mt-3 list-disc space-y-2 pl-5">{vehicles.map((vehicle, vehicleIndex) => <li key={vehicleIndex}>{vehicle.slice(2)}</li>)}</ul>
                </details>
              ) : <p key={index} className="whitespace-pre-line">{block}</p>;
            })}
          </div>
        </details>
      ) : null}

${viewAnchor}`);
fs.writeFileSync(file, source);
console.log('Applied BAS compatibility dropdown to the existing production component.');
