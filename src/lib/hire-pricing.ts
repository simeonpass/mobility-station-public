/**
 * Public hire pricing — short-term + Flex.
 * Headline prices are ex VAT. Source of truth for the /hire page table.
 */

export const FLEX_SETUP_FEE_GBP = 99;
export const LOCAL_DELIVERY_FEE_GBP = 45;
export const LOCAL_DELIVERY_MILES = 15;
export const WIDER_DELIVERY_FROM_GBP = 95;
/** Flat refundable short-term damage deposit for every hire category. */
export const SHORT_TERM_DEPOSIT_GBP = 100;

export type HirePricingCategoryId =
  | "transit_wheelchair"
  | "self_propelled_manual"
  | "heavy_duty_manual"
  | "folding_electric_wheelchair"
  | "powered_wheelchair"
  | "folding_scooter"
  | "small_boot_scooter"
  | "medium_scooter"
  | "large_scooter";

export type HirePricingCategory = {
  id: HirePricingCategoryId;
  label: string;
  userWeight: string;
  threeDay: number;
  extraDay: number;
  week: number;
  twoWeeks: number;
  fourWeeks: number;
  deposit: number;
  flexMonthly: number;
  /** Keywords used to match a real catalogue photo */
  imageMatch: RegExp;
  imageAlt: string;
};

export const HIRE_PRICING_CATEGORIES: HirePricingCategory[] = [
  {
    id: "transit_wheelchair",
    label: "Transit wheelchair (attendant-pushed)",
    userWeight: "up to 18 st",
    threeDay: 45,
    extraDay: 10,
    week: 60,
    twoWeeks: 100,
    fourWeeks: 160,
    deposit: SHORT_TERM_DEPOSIT_GBP,
    flexMonthly: 39,
    imageMatch: /transit|attendant/i,
    imageAlt: "Transit wheelchair from the Mobility Station hire fleet",
  },
  {
    id: "self_propelled_manual",
    label: "Self-propelled manual wheelchair",
    userWeight: "up to 18 st",
    threeDay: 45,
    extraDay: 10,
    week: 60,
    twoWeeks: 100,
    fourWeeks: 160,
    deposit: SHORT_TERM_DEPOSIT_GBP,
    flexMonthly: 45,
    imageMatch: /manual wheelchair|self.?propel/i,
    imageAlt: "Self-propelled manual wheelchair from the hire fleet",
  },
  {
    id: "heavy_duty_manual",
    label: "Heavy-duty manual wheelchair (wider seat)",
    userWeight: "up to 35 st",
    threeDay: 75,
    extraDay: 15,
    week: 95,
    twoWeeks: 165,
    fourWeeks: 260,
    deposit: SHORT_TERM_DEPOSIT_GBP,
    flexMonthly: 75,
    imageMatch:
      /(?:heavy.?duty|bariatric).*(?:manual )?wheelchair|(?:manual )?wheelchair.*(?:heavy.?duty|bariatric|wide(?:r)? seat)/i,
    imageAlt: "Heavy-duty manual wheelchair with wider seat",
  },
  {
    id: "folding_electric_wheelchair",
    label: "Folding electric wheelchair (lithium, boot-size)",
    userWeight: "up to 21 st",
    threeDay: 95,
    extraDay: 20,
    week: 120,
    twoWeeks: 210,
    fourWeeks: 340,
    deposit: SHORT_TERM_DEPOSIT_GBP,
    flexMonthly: 145,
    imageMatch: /folding.*(electric|power).*wheelchair|lightweight.*power/i,
    imageAlt: "Folding electric wheelchair suitable for car boot travel",
  },
  {
    id: "powered_wheelchair",
    label: "Powered wheelchair (full size indoor/outdoor)",
    userWeight: "up to 24 st",
    threeDay: 150,
    extraDay: 35,
    week: 195,
    twoWeeks: 340,
    fourWeeks: 540,
    deposit: SHORT_TERM_DEPOSIT_GBP,
    flexMonthly: 165,
    imageMatch: /powered wheelchair|powerchair|power chair/i,
    imageAlt: "Full-size powered wheelchair for indoor and outdoor use",
  },
  {
    id: "folding_scooter",
    label: "Folding mobility scooter",
    userWeight: "up to 21 st",
    threeDay: 120,
    extraDay: 25,
    week: 150,
    twoWeeks: 260,
    fourWeeks: 420,
    deposit: SHORT_TERM_DEPOSIT_GBP,
    flexMonthly: 125,
    imageMatch: /folding.*scooter/i,
    imageAlt: "Folding mobility scooter from the hire fleet",
  },
  {
    id: "small_boot_scooter",
    label: "Small boot scooter (dismantles, class 2)",
    userWeight: "up to 19 st",
    threeDay: 105,
    extraDay: 22,
    week: 135,
    twoWeeks: 235,
    fourWeeks: 380,
    deposit: SHORT_TERM_DEPOSIT_GBP,
    flexMonthly: 105,
    imageMatch: /boot|portable|travel.*scooter|small.*scooter|class 2/i,
    imageAlt: "Small boot scooter that dismantles for car travel",
  },
  {
    id: "medium_scooter",
    label: "Medium mobility scooter",
    userWeight: "up to 21 st",
    threeDay: 120,
    extraDay: 25,
    week: 155,
    twoWeeks: 270,
    fourWeeks: 430,
    deposit: SHORT_TERM_DEPOSIT_GBP,
    flexMonthly: 119,
    imageMatch: /medium|mid.?size|mobility scooter/i,
    imageAlt: "Medium mobility scooter from the hire fleet",
  },
  {
    id: "large_scooter",
    label: "Large mobility scooter (class 3, road legal)",
    userWeight: "up to 30 st",
    threeDay: 150,
    extraDay: 32,
    week: 195,
    twoWeeks: 340,
    fourWeeks: 540,
    deposit: SHORT_TERM_DEPOSIT_GBP,
    flexMonthly: 149,
    imageMatch: /large|road|class 3/i,
    imageAlt: "Large class 3 road-legal mobility scooter",
  },
];

export type HireFaqItem = { q: string; a: string };

/** Shared plain-language FAQs used on both product pages. */
export const HIRE_SHARED_FAQS: HireFaqItem[] = [
  {
    q: "Can I book and pay online?",
    a: "Yes. Fill in the form, pay by card, and we arrange delivery or free collection from our branch. You do not need to chase a quote for a normal booking.",
  },
  {
    q: "Is hire VAT free?",
    a: "Often yes. If the scooter or wheelchair is for a disabled person’s own use, tick the VAT relief box when you book and you pay the price shown with no VAT. Otherwise VAT is 20%.",
  },
  {
    q: "What do I need?",
    a: "Photo ID, proof of address, and a dry place to store and charge the machine. You pay by card when you book.",
  },
  {
    q: "Do you deliver to hotels and hospitals?",
    a: "Yes — put the address in when you book. We deliver locally for £45 (within 15 miles). Further away (up to about 40 miles) is £95.",
  },
  {
    q: "Can I hire on Motability?",
    a: "No. Motability is a different scheme. Hire is for short needs, or for people who cannot use Motability.",
  },
];

export const SHORT_TERM_FAQS: HireFaqItem[] = [
  {
    q: "How long can I hire for?",
    a: "From 3 days up to 28 days. If you need it longer than that, please use Flex hire instead — it is usually cheaper per week and includes servicing.",
  },
  {
    q: "What is the deposit?",
    a: "A refundable damage deposit of £100 on every hire. You pay it with the hire. We give it back when the machine comes home in good condition.",
  },
  {
    q: "What if I decide to buy one?",
    a: "We can credit the first week of your short-term hire towards buying a new scooter or wheelchair from us.",
  },
  ...HIRE_SHARED_FAQS,
];

export const FLEX_FAQS: HireFaqItem[] = [
  {
    q: "How long is Flex hire?",
    a: "At least 3 months. After that it rolls on month by month. No tie-in — cancel when you are ready if you no longer need it.",
  },
  {
    q: "What do I pay today?",
    a: "Your first month, plus a one-off £99 set-up fee. The set-up fee covers delivery, set-up and showing you how to use it. Then you pay each month in advance.",
  },
  {
    q: "Is there a separate damage deposit?",
    a: "No. Your first month is held as a rolling deposit (you are always a month ahead). At the end we return it, less any damage beyond fair wear and tear.",
  },
  {
    q: "What is included?",
    a: "Servicing, battery replacement when needed, breakdown repairs, and a loan machine if yours needs time in the workshop. No repair bills for fair wear and tear.",
  },
  {
    q: "What if I decide to buy one?",
    a: "We put your most recent month towards buying any new scooter or wheelchair from us.",
  },
  ...HIRE_SHARED_FAQS,
];


export const HIRE_COMPARISON_ROWS: {
  label: string;
  short: string;
  flex: string;
}[] = [
  { label: "Minimum", short: "3 days", flex: "3 months" },
  { label: "Maximum", short: "28 days", flex: "Rolling" },
  {
    label: "Paid",
    short: "Up front, per day / week",
    flex: "Monthly in advance",
  },
  {
    label: "Deposit",
    short: "£100 refundable",
    flex: "One month refundable",
  },
  { label: "Servicing", short: "Not needed", flex: "Included" },
  {
    label: "Batteries",
    short: "Included",
    flex: "Replaced when needed",
  },
  {
    label: "Breakdown",
    short: "Repair or swap",
    flex: "Repair or swap + loan",
  },
  {
    label: "Change model",
    short: "New hire",
    flex: "After 3 months",
  },
];

export const VAT_RELIEF_DECLARATION =
  "I declare that I am chronically sick or have a disabling condition and that the hired goods are being supplied to me for my domestic or personal use. I claim relief from Value Added Tax under the Value Added Tax Act 1994, Group 12, Schedule 8.";

export function hireCategoryById(id: string) {
  return HIRE_PRICING_CATEGORIES.find((c) => c.id === id);
}
