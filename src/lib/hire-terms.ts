/**
 * Single source of truth for the Mobility Station hire agreement.
 * Used by the public hire checkout signature step and the customer
 * confirmation email so wording can never drift between them.
 */

export const HIRE_TERMS_VERSION = '2026-05-v2';

export interface HireTerm {
  heading: string;
  body: string;
}

export const HIRE_TERMS: HireTerm[] = [
  {
    heading: '1. The Agreement',
    body: 'This is a hire agreement between Adaptation Station Ltd, trading as Mobility Station ("we", "us"), and the named hirer ("you"). It applies to the equipment described in your booking confirmation for the dates shown. By signing, you agree to be bound by these terms.',
  },
  {
    heading: '2. Identification, billing address & delivery',
    body: 'For fraud prevention, courier deliveries are sent only to the cardholder\'s registered billing address — no exceptions. If you are collecting in person from one of our branches, or if our local delivery team is bringing the equipment to you, you must present valid photo ID (driving licence or passport) and a recent proof of address (dated within the last 3 months — utility bill, council tax or bank statement) that matches the billing address before equipment is released. We may withhold equipment if these checks cannot be completed.',
  },
  {
    heading: '3. Hire fee & refundable deposit',
    body: 'The total taken at checkout includes the hire charge, any delivery / call-out fees, and a refundable security deposit. The deposit is held against loss, theft or damage beyond fair wear and tear. It will be returned in full within 5 working days of safe equipment return — either to your original card via our website or in person on collection.',
  },
  {
    heading: '4. Your responsibilities',
    body: 'You agree to use the equipment safely, only for its intended purpose, and to follow the manufacturer instructions provided. You must not modify the equipment, lend it to a third party, or take it outside of mainland UK without our written consent. You are responsible for charging batteries and keeping the equipment clean and dry.',
  },
  {
    heading: '5. Damage, loss & theft',
    body: 'You are liable for the cost of repair or replacement of damaged, lost or stolen equipment up to its full retail value. Where the deposit does not cover the cost, we will invoice the balance. Any damage must be reported to us within 24 hours.',
  },
  {
    heading: '6. Returns & late returns',
    body: 'Equipment must be returned by the end-date shown on your booking. Late returns are charged at the daily rate per additional day until the equipment is back in our care. Equipment that is more than 7 days late may be reported as stolen.',
  },
  {
    heading: '7. Cancellation',
    body: 'You may cancel up to 48 hours before the start date for a full refund. Cancellations within 48 hours forfeit the first day\'s hire fee. The deposit is always returned in full on cancellation.',
  },
  {
    heading: '8. Liability',
    body: 'Mobility Station accepts no liability for any indirect or consequential loss arising from use of the equipment, except where caused by our negligence or required by law. Your statutory rights are unaffected.',
  },
  {
    heading: '9. Data',
    body: 'We process your personal information and uploaded documents only to fulfil this hire and to comply with our legal obligations. See our privacy policy on mobilitystation.co.uk for full details. Documents are deleted within 12 months of the hire ending unless required for an active dispute.',
  },
];

export const HIRE_TERMS_PLAIN_TEXT = HIRE_TERMS
  .map((t) => `${t.heading}\n${t.body}`)
  .join('\n\n');
