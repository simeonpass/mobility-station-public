# BAS compatibility dropdown — 10 October 2026

The public production deployment contained source changes beyond its Git metadata (9477cef), and differs from main (c124d0c). Do not deploy this branch or main wholesale without reconciling those changes.

This branch preserves the actual production product-detail-view.tsx with the compatibility presentation change. Vercel builds reuse all 430 files from dpl_9KDWgX3rmkV14ga86XecSSEHE4uW and apply scripts/bas-compatibility-patch.cjs before the normal build. The build command fetches that script from immutable commit c5e81e309abae3e36e5a3adeb96977d2e6d90509. It checks the source structure before changing it and fails safely on a mismatch. No product data or knowledge-base data is changed.

Verified staging: dpl_6HhEexLzKgrXhQUhfqMssJYdEEqt. Production build: dpl_5KgvrhHE54wzNDLsTHVXRYiX8YDz.

Checks: ESLint on the modified production component, full Next build with TypeScript, browser confirmed closed-by-default outer details, 38 manufacturer groups, 370 vehicle entries, and opening the Audi group. The existing product overview, pricing and page layout remain present.

For future source-based deployments, carry the compatibility split and details markup into the reconciled component and return to the ordinary build command. A direct unrelated source deployment can otherwise omit this presentation change.
