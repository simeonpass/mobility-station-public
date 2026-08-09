# `website-hire-checkout` Edge Function (Lovable / Supabase)

Required for automated short-term and Flex hire payments on the public site.
DNA credentials stay on Supabase — never on Vercel.

## Request

`POST /functions/v1/website-hire-checkout`

The Vercel route `/api/hire/checkout` posts the customer booking plus a
**server-calculated** `quote.total`. Recalculate on Lovable from the same
published card and reject mismatches.

## Response

```json
{
  "success": true,
  "paymentData": { "...": "DNA openPaymentPage payload" },
  "bookingId": "uuid",
  "orderNumber": "HIRE-XXXXXXXX"
}
```

## Behaviour expected on Lovable

1. Create `hire_bookings` (or equivalent) as **payment pending**.
2. Charge **exactly** the server total (hire + delivery/setup + deposit rules + VAT).
3. DNA line description e.g. `Short-term hire — Folding mobility scooter 2026-09-01 to 2026-09-10` or `Flex hire — …`.
4. On DNA success: mark **paid**, email customer confirmation + team notify, queue for delivery/collection.
5. On failure: leave **payment pending** so the site thank-you page can retry.
6. Flex due today = first month + £99 set-up (includes delivery/handover).
7. Short-term due today = hire package + refundable deposit + delivery
   (£0 collect / £45 local ≤15mi / £95 wider ≤40mi).
8. VAT relief: 0% when declaration flagged; otherwise 20% on hire + delivery/setup (not on short-term damage deposit).
9. Reject if site `amount` / `quote.total` differs by more than £0.05 after recalculation.

## Return URLs

- Success: `/hire/thank-you?payment=success&ref=HIRE-…&provider=dna`
- Failure: `/hire/thank-you?payment=failed&ref=HIRE-…&provider=dna`
