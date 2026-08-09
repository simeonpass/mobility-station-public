# `website-demo-checkout` Edge Function (Lovable / Supabase)

The public Vercel site starts DNA hosted checkout for the £195 home
demonstration fee via this function. DNA credentials must stay on Supabase —
never on Vercel.

## Request

`POST /functions/v1/website-demo-checkout`

```json
{
  "bookingRef": "DEMO-XXXXXXXX",
  "amount": 195,
  "description": "Home Demonstration Fee — Thursday 20 August 2026",
  "lineItemDescription": "Home Demonstration Fee — Thursday 20 August 2026",
  "enquiryType": "demo",
  "customer": {
    "email": "customer@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "07700900000"
  },
  "address": {
    "addressLine1": "1 Example Road",
    "addressLine2": "",
    "city": "Uxbridge",
    "postcode": "UB8 1AA"
  },
  "preferredDate": "2026-08-20",
  "preferredTime": "morning",
  "productName": "Shoprider Cordoba",
  "returnUrl": "https://mobilitystation.co.uk/book-a-demo/thank-you?payment=success&ref=DEMO-XXXXXXXX&provider=dna",
  "failureReturnUrl": "https://mobilitystation.co.uk/book-a-demo/thank-you?payment=failed&ref=DEMO-XXXXXXXX&provider=dna"
}
```

## Response

```json
{
  "success": true,
  "paymentData": { "...": "DNA openPaymentPage payload" },
  "orderNumber": "DEMO-XXXXXXXX"
}
```

## Behaviour expected on Lovable

1. Create / update the demo booking as **payment pending** before opening DNA.
2. DNA line item / description: `Home Demonstration Fee — <requested date>`.
3. On DNA success callback: mark **PAID**, send customer confirmation email,
   notify the team (same channel as `send-contact-enquiry`).
4. On failure / cancel: leave booking as **payment pending** so the Vercel
   retry link can call this function again.
5. Amount must remain **£195** — do not accept client-supplied overrides for a
   lower fee. PWSS / branch free bookings never call this function.

## Related

Bookings themselves are also posted to `send-contact-enquiry` with
`enquiryType: "demo"` and the labelled message body from the Vercel brief.
