# Mobility Station Public Website

Premium SEO-first public site for [mobilitystation.co.uk](https://mobilitystation.co.uk), built with Next.js App Router, TypeScript and Tailwind CSS v4.

## Stack

- Next.js (App Router) + React 19
- Tailwind CSS v4 with Mobility Station brand tokens
- Supabase (read products/content; insert enquiries)
- Leaflet + OpenStreetMap for branch maps
- Vercel Speed Insights + optional GA4

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Supabase credentials the site serves curated fallback content so pages and forms still work in development.

## Environment

```env
SUPABASE_URL=
SUPABASE_PUBLIC_SITE_KEY=
NEXT_PUBLIC_SITE_URL=https://mobilitystation.co.uk
NEXT_PUBLIC_GA_ID=
```

Run `supabase/public_site_grants.sql` in Supabase to create the minimum `public_site` grants.

## Key routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/vehicle-adaptations` | Adaptations hub + service pages |
| `/shop` | Scooters & wheelchairs listing |
| `/{category}/{slug}` | Root-level product URLs |
| `/locations` | Heathrow & Ferndown |
| `/book-a-demo` | Demo booking (Server Action → `enquiries`) |
| `/book-a-service` | Service booking |
| `/blog` | Advice articles |
| `/lightweight-folding-mobility` | Lightweight hub + spin-off CTA |
| `/mobility-scooter-hire` | Hire |
| `/trade-in` | Trade-in valuation |
| `/sitemap.xml` / `/robots.txt` | SEO |

## Notes

- Brand colours and Manrope typography are enforced via CSS variables / theme tokens
- Forms validate with Zod on the server and write to Supabase `enquiries`
- Do not generate `og:image` in code unless an absolute HTTPS asset URL is supplied
