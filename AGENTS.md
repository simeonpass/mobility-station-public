<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Single Next.js 16 (App Router) app — no monorepo, no backend service in-repo. Commands live in `package.json` (`dev`, `build`, `start`, `lint`).

- Run: `npm run dev` serves the entire site at `http://localhost:3000` (all routes, API routes under `src/app/api/`, and Server Actions). This is the only service needed to exercise the product end-to-end in dev.
- Supabase is optional in dev. With no `SUPABASE_URL`/`SUPABASE_PUBLIC_SITE_KEY` set, the site serves curated fallback content and enquiry Server Actions log to the console (`Enquiry (dev fallback): ...`) instead of writing to the database — so forms/checkout flows can be tested without any external services.
- Lint: `npm run lint` currently reports pre-existing errors (mostly `react-hooks/set-state-in-effect`) and exits non-zero. This is a property of the current code, not the environment; do not treat a non-zero lint exit as a broken setup.
- No automated test framework is configured (no `test` script, no Jest/Vitest/Playwright). "Testing" means manually exercising the running dev site. Scripts in `scripts/` are one-off data migration utilities, not part of the dev/test loop.
