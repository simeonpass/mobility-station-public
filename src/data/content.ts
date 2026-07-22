import type {
  AdaptationService,
  BlogPost,
  Branch,
  Product,
  Review,
} from "@/lib/types";

export const BRANCHES: Branch[] = [
  {
    id: "heathrow",
    slug: "heathrow",
    name: "Heathrow Branch",
    phone: "020 8848 8888",
    email: "heathrow@mobilitystation.co.uk",
    addressLine1: "Unit 4, Stockley Park",
    addressLine2: "4 Longwalk Road",
    addressLocality: "West Drayton",
    postalCode: "UB11 1FE",
    lat: 51.5074,
    lng: -0.449,
    openingHours: [
      "Monday–Friday: 9:00am – 5:30pm",
      "Saturday: 9:00am – 1:00pm",
      "Sunday: Closed",
    ],
  },
  {
    id: "ferndown",
    slug: "ferndown",
    name: "Ferndown Branch",
    phone: "01202 870870",
    email: "ferndown@mobilitystation.co.uk",
    addressLine1: "Unit 3, Ferndown Industrial Estate",
    addressLine2: "Wimbourne Road",
    addressLocality: "Wimborne",
    postalCode: "BH21 7PT",
    lat: 50.805,
    lng: -1.899,
    openingHours: [
      "Monday–Friday: 9:00am – 5:30pm",
      "Saturday: 9:00am – 1:00pm",
      "Sunday: Closed",
    ],
  },
];

export const PRODUCT_CATEGORIES = [
  {
    slug: "lightweight-folding-wheelchairs",
    name: "Lightweight Folding Wheelchairs",
  },
  {
    slug: "lightweight-folding-scooters",
    name: "Lightweight Folding Scooters",
  },
  { slug: "powerchairs", name: "Powerchairs" },
  { slug: "electric-wheelchairs", name: "Electric Wheelchairs" },
  { slug: "mobility-scooters", name: "Mobility Scooters" },
  { slug: "accessories", name: "Accessories" },
] as const;

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "shoprider-cordoba",
    name: "Shoprider Cordoba",
    categorySlug: "mobility-scooters",
    categoryName: "Mobility Scooters",
    brand: "Shoprider",
    price: 1895,
    excerpt:
      "A reliable mid-size mobility scooter with comfort seating and stable outdoor performance.",
    description:
      "The Shoprider Cordoba is a dependable mid-size mobility scooter designed for everyday independence. With a comfortable captain’s seat, smooth tiller controls and solid outdoor capability, it is a popular choice for customers who want confidence on pavements and longer local trips. We bring the Cordoba to your home for a free demonstration so you can try it in the places you actually use every day.",
    seoCopy:
      "Buy the Shoprider Cordoba mobility scooter with free home demonstration from Mobility Station. Motability options available. Heathrow & Ferndown branches.",
    image: "/images/products/placeholder-scooter.svg",
    images: ["/images/products/placeholder-scooter.svg"],
    inStock: true,
    featured: true,
    motability: true,
    weightKg: 95,
    productCode: "SR-CORDOBA",
    features: [
      "Comfortable captain’s seat",
      "Smooth delta tiller controls",
      "LED lighting package",
      "Front and rear suspension",
      "Generous basket storage",
      "Stable mid-size chassis",
      "Ideal for pavement and local trips",
      "Available on Motability",
    ],
    specifications: [
      { label: "Product Code", value: "SR-CORDOBA" },
      { label: "Max user weight", value: "136 kg (21 st)" },
      { label: "Top speed", value: "8 mph" },
      { label: "Range", value: "Up to 20 miles" },
      { label: "Seat width", value: "18 inch" },
      { label: "Ground clearance", value: "80 mm" },
      { label: "Turning radius", value: "1.4 m" },
      { label: "Battery", value: "2 × 40Ah" },
      { label: "Tyres", value: "Pneumatic" },
      { label: "Colour options", value: "Red / Blue" },
    ],
    accessories: [
      { name: "Rear view mirror", price: 29 },
      { name: "Weather canopy", price: 249 },
      { name: "Oxygen bottle holder", price: 49 },
    ],
    createdAt: "2025-11-12",
  },
  {
    id: "2",
    slug: "lightweight-travel-chair",
    name: "Featherweight Travel Chair",
    categorySlug: "lightweight-folding-wheelchairs",
    categoryName: "Lightweight Folding Wheelchairs",
    brand: "Mobility Station",
    price: 599,
    excerpt:
      "Ultra-portable folding wheelchair for travel, holidays and easy boot storage.",
    description:
      "Our Featherweight Travel Chair folds quickly for car boots, trains and holidays. It is designed for carers and users who need a practical, compact wheelchair without compromising comfort on shorter journeys.",
    image: "/images/products/placeholder-wheelchair.svg",
    images: ["/images/products/placeholder-wheelchair.svg"],
    inStock: true,
    featured: true,
    motability: false,
    weightKg: 8.9,
    productCode: "MS-FWTC",
    features: [
      "Folds compact for travel",
      "Carer-friendly push handles",
      "Swing-away footrests",
      "Padded seat and backrest",
      "Hand brakes",
      "Ideal for holidays and days out",
    ],
    specifications: [
      { label: "Product Code", value: "MS-FWTC" },
      { label: "Chair weight", value: "8.9 kg" },
      { label: "Max user weight", value: "115 kg" },
      { label: "Seat width", value: "18 inch" },
      { label: "Folded size", value: "Compact boot-ready" },
    ],
    accessories: [{ name: "Travel bag", price: 45 }],
    createdAt: "2026-01-08",
  },
  {
    id: "3",
    slug: "compact-folding-scooter",
    name: "Compact Folding Scooter",
    categorySlug: "lightweight-folding-scooters",
    categoryName: "Lightweight Folding Scooters",
    brand: "Mobility Station",
    price: 1495,
    excerpt:
      "Airline-friendly folding scooter that packs down for travel and boot storage.",
    description:
      "The Compact Folding Scooter is built for customers who want independence away from home. It folds quickly, stores neatly and is well suited to holidays, visiting family and everyday short trips.",
    image: "/images/products/placeholder-folding-scooter.svg",
    images: ["/images/products/placeholder-folding-scooter.svg"],
    inStock: true,
    featured: true,
    motability: true,
    weightKg: 24,
    productCode: "MS-CFS",
    features: [
      "Folds in seconds",
      "Airline lithium battery option",
      "Compact tiller",
      "Removable seat",
      "Ideal for travel",
    ],
    specifications: [
      { label: "Product Code", value: "MS-CFS" },
      { label: "Weight", value: "24 kg" },
      { label: "Max user weight", value: "115 kg" },
      { label: "Top speed", value: "4 mph" },
      { label: "Range", value: "Up to 10 miles" },
    ],
    accessories: [{ name: "Spare battery", price: 199 }],
    createdAt: "2026-02-14",
  },
  {
    id: "4",
    slug: "indoor-outdoor-powerchair",
    name: "Indoor Outdoor Powerchair",
    categorySlug: "powerchairs",
    categoryName: "Powerchairs",
    brand: "Mobility Station",
    price: 2795,
    excerpt:
      "Smooth indoor manoeuvrability with outdoor stability for everyday independence.",
    description:
      "This indoor-outdoor powerchair balances tight turning for home use with enough stability for pavements and local trips. We assess seating, controls and access at your home before you commit.",
    image: "/images/products/placeholder-powerchair.svg",
    images: ["/images/products/placeholder-powerchair.svg"],
    inStock: true,
    featured: true,
    motability: true,
    weightKg: 78,
    productCode: "MS-IOPC",
    features: [
      "Tight turning radius",
      "Joystick controls",
      "Adjustable seating",
      "Indoor and outdoor capability",
      "Motability available",
    ],
    specifications: [
      { label: "Product Code", value: "MS-IOPC" },
      { label: "Max user weight", value: "136 kg" },
      { label: "Top speed", value: "4 mph" },
      { label: "Range", value: "Up to 15 miles" },
    ],
    accessories: [{ name: "Lap belt", price: 35 }],
    createdAt: "2025-12-01",
  },
];

export const REVIEWS: Review[] = [
  {
    id: "1",
    author: "Margaret T.",
    rating: 5,
    quote:
      "They brought three scooters to my driveway and helped me choose the right one. No pressure, just clear advice.",
    location: "Near Heathrow",
  },
  {
    id: "2",
    author: "David R.",
    rating: 5,
    quote:
      "The hand controls fitted to my car have given me my independence back. The engineer explained everything carefully.",
    location: "Dorset",
  },
  {
    id: "3",
    author: "Susan P.",
    rating: 5,
    quote:
      "From Motability paperwork to the home demonstration, the whole process felt straightforward and reassuring.",
    location: "Berkshire",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "free-home-demonstrations-explained",
    title: "Free home demonstrations explained",
    excerpt:
      "Why we come to you, what happens on the day, and how to prepare for your mobility assessment.",
    content:
      "A free home demonstration means we bring suitable scooters, wheelchairs or adaptations to your door. You can try equipment where you live, park and get around every day — which is far more useful than browsing somewhere unfamiliar.\n\nWe start with a short conversation about your needs, then demonstrate the safest options. There is no obligation to buy on the day.",
    image: "/images/blog/placeholder-demo.svg",
    publishedAt: "2026-03-12",
    author: "Mobility Station",
  },
  {
    id: "2",
    slug: "motability-scooter-guide",
    title: "A practical Motability scooter guide",
    excerpt:
      "How Motability works for scooters and wheelchairs, and what to expect from an accredited supplier.",
    content:
      "Motability can make powered mobility more affordable by exchanging qualifying mobility allowance for a scooter or wheelchair package. As an accredited supplier, we help you understand eligibility, assessments and ongoing support.\n\nBring your award letter to your demonstration and we will talk through the options that best fit your lifestyle.",
    image: "/images/blog/placeholder-motability.svg",
    publishedAt: "2026-02-20",
    author: "Mobility Station",
  },
  {
    id: "3",
    slug: "choosing-lightweight-folding-mobility",
    title: "Choosing lightweight folding mobility",
    excerpt:
      "Folding scooters and wheelchairs for travel, car boots and days out — plus when to visit our dedicated lightweight store.",
    content:
      "Lightweight folding scooters and wheelchairs are ideal when portability matters as much as comfort. Think holidays, visiting family, or storing equipment in a smaller vehicle.\n\nFor a deeper range of ultra-lightweight products, visit our dedicated store at lightweightmobility.co.uk.",
    image: "/images/blog/placeholder-lightweight.svg",
    publishedAt: "2026-01-18",
    author: "Mobility Station",
  },
  {
    id: "4",
    slug: "vehicle-adaptations-we-come-to-you",
    title: "Vehicle adaptations: we come to you",
    excerpt:
      "Hand controls, swivel seats, hoists and more — assessed and demonstrated at your home or branch.",
    content:
      "Driving adaptations should be assessed around your vehicle, your strength and your daily journeys. That is why our adaptation specialists come to you whenever possible.\n\nFrom hand controls and left-foot accelerators to boot openers and scooter hoists, we help you find a safe, comfortable solution.",
    image: "/images/blog/placeholder-adaptations.svg",
    publishedAt: "2025-12-05",
    author: "Mobility Station",
  },
];

export const ADAPTATION_SERVICES: AdaptationService[] = [
  {
    slug: "hand-controls",
    title: "Hand Controls",
    shortDescription:
      "Drive safely without using pedals, with push/pull or twist-style hand controls.",
    description:
      "Hand controls let you operate the accelerator and brake by hand. We assess your vehicle, strength and preferred control style at home or at our Heathrow and Ferndown branches, then arrange professional installation.",
    benefits: [
      "Stay independent in your own car",
      "Push/pull and twist options available",
      "Assessed around your vehicle and mobility needs",
      "Compatible with many Motability and private vehicles",
    ],
    faqs: [
      {
        question: "Will hand controls damage my car?",
        answer:
          "When professionally installed, modern hand controls are designed to work with your vehicle’s systems and can usually be removed later if required.",
      },
      {
        question: "Can I try hand controls before deciding?",
        answer:
          "Yes. We offer demonstrations so you can feel the control style before committing to installation.",
      },
    ],
  },
  {
    slug: "push-pull-brake-accelerator",
    title: "Push/Pull Brake & Accelerator",
    shortDescription:
      "A proven hand-control layout: pull to go, push to brake.",
    description:
      "Push/pull controls are one of the most popular driving adaptations. Pull towards you to accelerate and push to brake, keeping both actions on one lever for a simple, intuitive drive.",
    benefits: [
      "Simple one-lever operation",
      "Widely used and easy to learn",
      "Suitable for many automatic vehicles",
      "Free assessment available",
    ],
    faqs: [
      {
        question: "Is push/pull suitable for every driver?",
        answer:
          "It suits many drivers, but we always assess strength, seating position and vehicle layout before recommending a control type.",
      },
    ],
  },
  {
    slug: "left-foot-accelerators",
    title: "Left-Foot Accelerators",
    shortDescription:
      "Transfer throttle control to your left foot when the right is limited.",
    description:
      "Left-foot accelerators help drivers who cannot safely use a conventional right-foot pedal. We demonstrate options and ensure the pedal layout remains clear and safe.",
    benefits: [
      "Keeps braking on the conventional pedal",
      "Useful after right-leg injury or amputation",
      "Professional fitting and advice",
    ],
    faqs: [
      {
        question: "Do I need to relearn driving?",
        answer:
          "There is a short adjustment period. We talk you through technique and can recommend additional training if helpful.",
      },
    ],
  },
  {
    slug: "steering-aids",
    title: "Steering Aids",
    shortDescription:
      "Spinner knobs and steering aids for easier, one-handed control.",
    description:
      "Steering aids reduce the effort needed to turn the wheel and can support one-handed driving when combined with the right seating and control setup.",
    benefits: [
      "Reduced steering effort",
      "Supports limited grip or reach",
      "Quick to fit on many vehicles",
    ],
    faqs: [
      {
        question: "Can steering aids be used with hand controls?",
        answer:
          "Yes. Many customers combine a steering aid with hand controls for a complete driving solution.",
      },
    ],
  },
  {
    slug: "swivel-seats",
    title: "Swivel Seats",
    shortDescription:
      "Rotate and lower your car seat for safer transfers.",
    description:
      "Swivel seats make getting in and out of the car easier and safer. Options range from simple rotating bases to powered lift-and-swivel systems.",
    benefits: [
      "Safer car transfers",
      "Manual and powered options",
      "Assessed in your own vehicle",
    ],
    faqs: [
      {
        question: "Will a swivel seat fit my car?",
        answer:
          "Most popular vehicles can be assessed. We check door aperture, seat rails and transfer height before recommending a system.",
      },
    ],
  },
  {
    slug: "boot-openers",
    title: "Boot Openers",
    shortDescription:
      "Powered boot access for scooters, wheelchairs and shopping.",
    description:
      "Boot openers and related access solutions help you load mobility equipment without strain. We look at your vehicle, scooter or wheelchair and recommend a practical setup.",
    benefits: [
      "Easier loading",
      "Less lifting strain",
      "Works with many family cars",
    ],
    faqs: [
      {
        question: "Do I need a hoist as well?",
        answer:
          "Sometimes. If you struggle to lift a scooter or wheelchair, a hoist paired with boot access is often the safest combination.",
      },
    ],
  },
  {
    slug: "scooter-hoists",
    title: "Scooter Hoists",
    shortDescription:
      "Lift and stow your scooter safely into the boot or onto a carrier.",
    description:
      "Scooter hoists remove the heavy lifting from travel. We match hoist capacity and mounting style to your scooter and vehicle.",
    benefits: [
      "Protect your back",
      "Travel with confidence",
      "Boot and external carrier options",
    ],
    faqs: [
      {
        question: "What is an Adaptation ID?",
        answer:
          "Each adaptation solution can be referenced with an Adaptation ID so your vehicle setup is easy to identify for servicing and support.",
      },
    ],
  },
  {
    slug: "wheelchair-lifts",
    title: "Wheelchair Lifts",
    shortDescription:
      "Powered lifting solutions for wheelchair users and carers.",
    description:
      "Wheelchair lifts help transfer a chair into a vehicle safely. We assess weight, vehicle type and whether a WAV may be a better long-term option.",
    benefits: [
      "Safer loading for carers",
      "Suitable for many wheelchair weights",
      "Professional installation",
    ],
    faqs: [
      {
        question: "Is a lift better than a WAV?",
        answer:
          "It depends on how often you travel and whether you stay in the wheelchair. We help you compare both routes honestly.",
      },
    ],
  },
  {
    slug: "car-ramps",
    title: "Car Ramps",
    shortDescription:
      "Portable and vehicle-mounted ramps for smoother access.",
    description:
      "Car ramps provide a simple access solution for some vehicles and wheelchairs. We check gradient, threshold and storage before recommending a ramp.",
    benefits: [
      "Cost-effective access",
      "Portable options available",
      "Useful for lower vehicles",
    ],
    faqs: [
      {
        question: "Are ramps suitable for powered wheelchairs?",
        answer:
          "Sometimes, if the gradient and vehicle height are suitable. Heavier chairs often need a lift or WAV instead.",
      },
    ],
  },
  {
    slug: "wheelchair-accessible-vehicles",
    title: "Wheelchair Accessible Vehicles (WAVs)",
    shortDescription:
      "Travel seated in your wheelchair with a fully accessible vehicle solution.",
    description:
      "WAVs are designed so you can travel while remaining in your wheelchair. We discuss access method, seating layout and Motability WAV options where relevant.",
    benefits: [
      "Remain in your wheelchair",
      "Motability WAV routes available",
      "Advice from adaptation specialists",
    ],
    faqs: [
      {
        question: "Can I try a WAV before ordering?",
        answer:
          "Yes. We can arrange demonstrations so you understand access, headroom and travelling position before you decide.",
      },
    ],
  },
];

export const SOLUTIONS = [
  {
    title: "Vehicle Adaptations",
    href: "/vehicle-adaptations",
    description: "Hand controls, seats, hoists and WAV advice — we come to you.",
  },
  {
    title: "Scooters & Wheelchairs",
    href: "/shop",
    description: "Mobility scooters, powerchairs and folding travel solutions.",
  },
  {
    title: "Mobility Hoists",
    href: "/vehicle-adaptations/scooter-hoists",
    description: "Lift scooters and chairs safely into your vehicle.",
  },
  {
    title: "Swivel Seats",
    href: "/vehicle-adaptations/swivel-seats",
    description: "Easier, safer transfers in and out of the car.",
  },
  {
    title: "Hand Controls",
    href: "/vehicle-adaptations/hand-controls",
    description: "Drive without pedals using proven control systems.",
  },
  {
    title: "Boot Openers",
    href: "/vehicle-adaptations/boot-openers",
    description: "Powered boot access for everyday loading.",
  },
  {
    title: "Car Ramps",
    href: "/vehicle-adaptations/car-ramps",
    description: "Practical ramp solutions for suitable vehicles.",
  },
  {
    title: "Wheelchair Accessible Vehicles",
    href: "/vehicle-adaptations/wheelchair-accessible-vehicles",
    description: "Travel seated in your wheelchair with WAV options.",
  },
] as const;

export const TRUST_ITEMS = [
  "Free Home Demonstrations",
  "Mobility Credit Expert Advice",
  "Motability Accredited",
  "7-Day Support",
] as const;
