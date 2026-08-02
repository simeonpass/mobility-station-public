export type Branch = {
  id: string;
  slug: "heathrow" | "ferndown";
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  addressLocality: string;
  postalCode: string;
  lat: number;
  lng: number;
  openingHours: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  brand: string;
  price: number | null;
  excerpt: string;
  description: string;
  seoCopy?: string;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  motability: boolean;
  weightKg?: number;
  productCode?: string;
  features: string[];
  specifications: { label: string; value: string }[];
  accessories: { name: string; slug?: string; price?: number }[];
  createdAt: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Plain-text fallback (static seed posts). */
  content: string;
  /** HTML body from Supabase `blog_articles.content_html`. */
  contentHtml?: string;
  image: string;
  imageAlt?: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags?: string[];
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  quote: string;
  location?: string;
  relativeTime?: string;
  authorPhotoUrl?: string | null;
};

export type ReviewsSummary = {
  reviews: Review[];
  averageRating: number | null;
  totalReviews: number;
};

export type AdaptationService = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  faqs: { question: string; answer: string }[];
};
