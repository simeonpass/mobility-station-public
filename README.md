# KLYM Mobility storefront

Focused XSTO storefront for KLYM / Mobility Station.

- Next.js App Router
- Premium black / white / #0171E3 visual system
- M4B-first commercial homepage
- Public catalogue sync from the Mobility Station V1 `klym-catalog` Supabase Edge Function
- Demo and sales enquiries write to V1 through `klym-enquiry`
- Product pages for M4, M4B, M4 Pro, X12 and X12 Pro
- Comparison, VAT relief and SEO landing pages
- sitemap.xml and robots.txt

## Important launch note
M4B is not yet a `stock_items` record in V1. The storefront has an M4B content/pricing fallback so the site can be built now, but its product record and correct image should be added to V1 before production launch. The current preview deliberately does not create a second product admin.
