# Mobility Station preview verification — 30 September 2026

Scope: `codex/clear-choice-site` only. Do not merge or promote without approval.

## Changes

- Upgrade Next.js and eslint-config-next from 16.2.11 to 16.3.7. Refresh affected transitive dependencies. The npm audit changed from six affected packages (one critical, five high) to zero reported vulnerabilities.
- Keep Care Plan checkout and verification on the existing Supabase functions, using the site's server connection. The preview has server credentials but no browser Supabase variables. Forward the preview origin so Stripe returns customers to the preview. Plan prices and backend payment logic are unchanged.
- Show PayPal success and clear the basket only after `success: true` and a `paid` or `already_paid` capture response. Keep the basket on pending, failed or malformed replies. Require an order reference for the success view.
- Add isolated pricing, VAT, options, demo-fee, form and payment-contract regressions, plus browser tests for payment return states. Gate preview CI on the dependency audit and regression tests. Make browser smoke tests usable against an authenticated Vercel preview and fail on broken routes/images or missing live product links.

## Evidence and limits

- Production build and TypeScript checks pass. Changed application and test files pass targeted ESLint.
- Seventeen regression tests pass with a mocked backend. These exercise actual route handlers and enquiry actions without making live submissions.
- Five browser payment-return cases pass: pending and malformed responses retain the basket; paid and already-paid responses clear it; cancellation retains it.
- The initial upgraded build passed 28 viewport/page checks and 37 static routes without credentials. A final expanded run and live Vercel preview checks are recorded in the accompanying launch report.
- The existing Vercel preview reports its server backend configured and returns 277 public catalogue products. A real powerchair page, add-to-cart, populated checkout, collection selection and VAT relief controls were checked.
- Full-source lint remains nonzero: 43 errors and five warnings, compared with 44 errors and five warnings on the unchanged branch baseline using the same linter. Most concern existing React state/effect patterns. They have not been hidden by disabling rules.
- No production database, backend function, environment setting, customer enquiry, order or payment was changed by this work. Mock tests do not prove live email delivery, payment settlement, webhooks or fulfilment.

## Release blockers

1. Next.js announced nine additional fixes for 30 September. Its official correction says 16.3.7 does **not** include them; 16.3.8 is planned. At the time checked, npm returned 404 for 16.3.8. Upgrade and rerun the checks once it is published, even if npm audit remains clear. Source: https://nextjs.org/blog/upcoming-nextjs-security-release-september-2026
2. Complete payment, booking/enquiry delivery and fulfilment tests against an isolated staging backend and payment sandbox. The current preview uses the live backend. Do not submit test transactions to it under the instruction to leave production untouched.
3. Review the remaining baseline lint findings before production approval.

Production remains on its existing main-branch deployment until explicitly approved.
