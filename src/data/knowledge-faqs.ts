import type { KnowledgeFaq } from "@/lib/types";

/**
 * Curated, anonymised Q&As based on common customer enquiries
 * (the same questions people ask on the phone). No personal details.
 *
 * When Lovable publishes reviewed rows to Supabase `knowledge_faqs`,
 * the live site prefers that catalogue over this seed list.
 */
export const KNOWLEDGE_FAQ_CATEGORIES = [
  { id: "boot-hoists", label: "Boot hoists & stowage" },
  { id: "driving-controls", label: "Driving controls" },
  { id: "vehicle-access", label: "Getting in & out" },
  { id: "motability", label: "Motability" },
  { id: "scooters-wheelchairs", label: "Scooters & wheelchairs" },
  { id: "buying-service", label: "Buying & service" },
] as const;

export type KnowledgeFaqCategoryId =
  (typeof KNOWLEDGE_FAQ_CATEGORIES)[number]["id"];

export const KNOWLEDGE_FAQS: KnowledgeFaq[] = [
  {
    id: "seed-1",
    slug: "will-a-boot-hoist-fit-a-ford-focus",
    question: "Will a boot hoist work in a Ford Focus?",
    answer:
      "Often yes — many Ford Focus models can take a boot hoist, but it depends on the year, boot aperture, spare-wheel well and the weight of your scooter or wheelchair. We check your exact car (and Motability contract rules if relevant) before quoting. Never assume a hoist from another vehicle will transfer without an assessment.",
    category: "boot-hoists",
    relatedHref: "/vehicle-adaptations/boot-hoists",
    relatedLabel: "Browse boot hoists",
    source: "call_summary",
    publishedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "seed-2",
    slug: "boot-hoist-for-motability-car",
    question: "Can I have a boot hoist fitted to a Motability car?",
    answer:
      "Yes, many Motability customers have boot hoists fitted. Suitability still depends on the vehicle and the equipment you need to lift. We confirm scheme rules, advance payment where relevant, and whether a workshop or mobile fitting is best for your area.",
    category: "motability",
    relatedHref: "/motability/vehicle-adaptations",
    relatedLabel: "Motability adaptations",
    source: "call_summary",
    publishedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "seed-3",
    slug: "scooter-too-heavy-for-boot-hoist",
    question: "My scooter feels too heavy to lift — do I need a hoist or a different scooter?",
    answer:
      "If loading strains your back or shoulders, a boot hoist is often the safer long-term option. Sometimes a lighter folding scooter reduces the need for a hoist; sometimes the hoist is essential because you want to keep a larger scooter. We weigh both options against your car boot and how often you travel.",
    category: "boot-hoists",
    relatedHref: "/vehicle-adaptations/hoists-stowage",
    relatedLabel: "Hoists & stowage options",
    source: "call_summary",
    publishedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "seed-4",
    slug: "hand-controls-automatic-only",
    question: "Do hand controls only work on automatic cars?",
    answer:
      "Most push/pull and electronic hand-control setups are designed for automatics. Manual cars need a different conversation about clutch operation and whether an automatic conversion or a different vehicle is more practical. Tell us the make, model and gearbox when you enquire.",
    category: "driving-controls",
    relatedHref: "/vehicle-adaptations/driving-controls",
    relatedLabel: "Driving controls",
    source: "call_summary",
    publishedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "seed-5",
    slug: "swivel-seat-small-car",
    question: "Will a swivel seat fit a smaller car?",
    answer:
      "Many smaller cars can take a swivel or turn-out seat, but door opening, seat-rail design and transfer height matter. We assess your vehicle in person (home or branch) before recommending a manual or powered system — so you are not buying a seat that will not clear the door pillar.",
    category: "vehicle-access",
    relatedHref: "/vehicle-adaptations/swivel-seats",
    relatedLabel: "Swivel seats",
    source: "call_summary",
    publishedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "seed-6",
    slug: "home-demo-before-buying-scooter",
    question: "Can you bring scooters to my home before I buy?",
    answer:
      "Yes. We offer home and branch demonstrations from Heathrow and Ferndown across our service area. Motability scooter and wheelchair home demos are free; private home visits follow our published demo terms. Trying equipment where you live is the best way to check turning space, thresholds and boot loading.",
    category: "scooters-wheelchairs",
    relatedHref: "/book-a-demo",
    relatedLabel: "Book a demonstration",
    source: "call_summary",
    publishedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "seed-7",
    slug: "adaptation-price-online",
    question: "Why can’t I just buy a vehicle adaptation online at a fixed price?",
    answer:
      "Every adaptation has to be checked against your vehicle, your strength and how you travel. Online prices are indicative supplied-and-fitted figures only. We quote after that check so the product, mounting and labour match your car — not a generic listing.",
    category: "buying-service",
    relatedHref: "/contact?interest=adaptation",
    relatedLabel: "Request a quotation",
    source: "call_summary",
    publishedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "seed-8",
    slug: "vat-relief-on-mobility-equipment",
    question: "Can I buy mobility equipment without VAT?",
    answer:
      "Many customers with a long-term illness or disability can claim VAT relief on eligible products. You declare eligibility at checkout. If you are unsure whether an item qualifies, ask us before you order and we will point you to the HMRC-style criteria we follow.",
    category: "buying-service",
    relatedHref: "/vat-relief",
    relatedLabel: "How VAT relief works",
    source: "editorial",
    publishedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "seed-9",
    slug: "boot-opener-and-hoist-together",
    question: "Do I need a powered boot opener as well as a hoist?",
    answer:
      "Not always. If you can open the boot comfortably but struggle with the lift, a hoist alone may be enough. If the boot lid is heavy or awkward, pairing an automatic boot opener with a hoist is often the safer setup. We decide that during the vehicle assessment.",
    category: "boot-hoists",
    relatedHref: "/vehicle-adaptations/automatic-boot-openers",
    relatedLabel: "Automatic boot openers",
    source: "call_summary",
    publishedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "seed-10",
    slug: "motability-weekly-price-meaning",
    question: "What does the Motability weekly price on your website mean?",
    answer:
      "Weekly figures are Motability scheme amounts from our live catalogue — not a high-street retail purchase price. Eligibility and how your allowance applies are confirmed during assessment. Contact us to talk through any model before you decide.",
    category: "motability",
    relatedHref: "/motability",
    relatedLabel: "Motability scooters & wheelchairs",
    source: "editorial",
    publishedAt: "2026-03-01T10:00:00.000Z",
  },
];
