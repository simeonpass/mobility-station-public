/**
 * Public hire pricing — short-term + Flex.
 * Headline prices are ex VAT. Source of truth for the /hire page table.
 */

export const FLEX_SETUP_FEE_GBP = 99;
export const LOCAL_DELIVERY_FEE_GBP = 45;
export const LOCAL_DELIVERY_MILES = 15;
export const WIDER_DELIVERY_FROM_GBP = 95;

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
    deposit: 100,
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
    deposit: 100,
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
    deposit: 150,
    flexMonthly: 75,
    imageMatch: /heavy.?duty|bariatric|wide/i,
    imageAlt: "Heavy-duty manual wheelchair with wider seat",
  },
  {
    id: "folding_electric_wheelchair",
    label: "Folding electric wheelchair (lithium, boot-size)",
    userWeight: "up to 21 st",
    threeDay: 135,
    extraDay: 30,
    week: 175,
    twoWeeks: 300,
    fourWeeks: 480,
    deposit: 250,
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
    deposit: 250,
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
    deposit: 250,
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
    deposit: 200,
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
    deposit: 200,
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
    deposit: 250,
    flexMonthly: 149,
    imageMatch: /large|road|class 3/i,
    imageAlt: "Large class 3 road-legal mobility scooter",
  },
];

export const HIRE_FAQS: { q: string; a: string }[] = [
  {
    q: "Can I book and pay online?",
    a: "Yes. Choose your hire, pay securely by card, and we deliver or prepare free branch collection. No quote chase needed for standard bookings.",
  },
  {
    q: "Minimum hire?",
    a: "Short-term starts at 3 days. Flex has a 3-month minimum.",
  },
  {
    q: "Why does short-term stop after 4 weeks?",
    a: "Beyond 28 days the machine needs servicing, battery care and cover a daily rate cannot fund; longer hires move to Flex, which includes all of that and is much cheaper per week.",
  },
  {
    q: "What is the £99 Flex set-up fee?",
    a: "A one-off fee covering delivery, set-up and handover when you start Flex. It is charged with your first month when you book online.",
  },
  {
    q: "How does the Flex deposit work?",
    a: "One month up front, then monthly in advance — always a month ahead. Returned at the end less damage beyond fair wear and tear.",
  },
  {
    q: "Can I cancel Flex?",
    a: "Yes, after the 3-month minimum with 30 days' written notice; the month already paid covers the notice period.",
  },
  {
    q: "Is hire VAT free?",
    a: "Yes if it is for a disabled person's personal use — tick the declaration when booking. Otherwise VAT at 20% on hire and delivery/set-up.",
  },
  {
    q: "Damage deposit on short-term?",
    a: "Yes, £100–£250 refundable, paid with the hire online and returned in full when the equipment comes back as it went out.",
  },
  {
    q: "What if I decide to buy?",
    a: "On Flex we put your most recent month towards the purchase of any new scooter or wheelchair. On short-term we credit the first week.",
  },
  {
    q: "Can I hire on Motability?",
    a: "No — Motability is a lease scheme in its own right. Hire is for people who cannot go on the scheme or only need equipment briefly.",
  },
  {
    q: "What do I need to provide?",
    a: "Photo ID, proof of address, and somewhere dry to store and charge it. Card payment is taken online when you book.",
  },
  {
    q: "Do you deliver to hotels, hospitals and holiday lets?",
    a: "Yes — enter the address when you book. Local delivery is £45 within 15 miles; wider (15–40 miles) is £95.",
  },
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
    short: "£100–£250 refundable",
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
