export type CategoryView = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  accent: string;
  featured: boolean;
};

export type ProductView = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  inventory: number;
  badge: string;
  tags: string[];
  images: string[];
  details: Record<string, string>;
  isTrending: boolean;
  isNewArrival: boolean;
  isFlashDeal: boolean;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  location: string;
};

export const demoCategories: CategoryView[] = [
  {
    id: "cat-atelier",
    name: "Atelier Fashion",
    slug: "atelier-fashion",
    description: "Sculptural silhouettes, rare textiles, and modern heirloom pieces.",
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85",
    accent: "from-[#f6e4b0] to-[#a8782a]",
    featured: true,
  },
  {
    id: "cat-time",
    name: "Time & Jewelry",
    slug: "time-jewelry",
    description: "Precision watches and champagne-lit jewelry curated for quiet status.",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
    accent: "from-[#fff4ca] to-[#d9aa4b]",
    featured: true,
  },
  {
    id: "cat-home",
    name: "Signature Home",
    slug: "signature-home",
    description: "Frosted glass, brushed metal, and atmospheric objects for refined rooms.",
    imageUrl: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=85",
    accent: "from-[#e6d5a1] to-[#7c5a22]",
    featured: true,
  },
  {
    id: "cat-tech",
    name: "Elite Tech",
    slug: "elite-tech",
    description: "Minimal devices, acoustic luxury, and design-forward connected living.",
    imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=85",
    accent: "from-[#f7df9e] to-[#9f6f24]",
    featured: true,
  },
];

export const demoProducts: ProductView[] = [
  {
    id: "prod-noir-coat",
    categoryId: "cat-atelier",
    name: "Noir Meridian Cashmere Coat",
    slug: "noir-meridian-cashmere-coat",
    subtitle: "Double-faced cashmere with satin-lined architecture",
    description:
      "A cinematic winter layer cut with relaxed precision, hidden horn closures, and a brushed finish that catches evening light.",
    price: 1280,
    compareAtPrice: 1640,
    currency: "USD",
    rating: 4.96,
    reviewCount: 214,
    inventory: 18,
    badge: "Private Sale",
    tags: ["cashmere", "fashion", "coat", "black"],
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=88",
    ],
    details: { Material: "Italian double-face cashmere", Origin: "Made in Portugal", Fit: "Relaxed tailored" },
    isTrending: true,
    isNewArrival: false,
    isFlashDeal: true,
  },
  {
    id: "prod-gold-watch",
    categoryId: "cat-time",
    name: "Aurum Eclipse Automatic",
    slug: "aurum-eclipse-automatic",
    subtitle: "Skeleton dial, sapphire crystal, champagne rotor",
    description:
      "An ultra-thin automatic watch balancing black ceramic restraint with a warm gold exhibition movement.",
    price: 3420,
    compareAtPrice: 3890,
    currency: "USD",
    rating: 4.98,
    reviewCount: 168,
    inventory: 9,
    badge: "Collector Drop",
    tags: ["watch", "gold", "automatic", "jewelry"],
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1200&q=88",
    ],
    details: { Movement: "Swiss automatic", Case: "Black ceramic and vermeil", Warranty: "5 years" },
    isTrending: true,
    isNewArrival: true,
    isFlashDeal: false,
  },
  {
    id: "prod-lamp",
    categoryId: "cat-home",
    name: "Solstice Halo Table Lamp",
    slug: "solstice-halo-table-lamp",
    subtitle: "Dim-to-warm halo glass with hand-brushed brass",
    description:
      "A luminous object that creates a soft champagne aura across marble, walnut, and lacquer surfaces.",
    price: 620,
    compareAtPrice: 780,
    currency: "USD",
    rating: 4.91,
    reviewCount: 92,
    inventory: 27,
    badge: "Flash Glow",
    tags: ["home", "lighting", "brass", "decor"],
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=88",
    ],
    details: { Finish: "Brushed brass", Glass: "Smoked gradient", Controls: "Touch dimmer" },
    isTrending: false,
    isNewArrival: true,
    isFlashDeal: true,
  },
  {
    id: "prod-headphones",
    categoryId: "cat-tech",
    name: "Obsidian Studio Headphones",
    slug: "obsidian-studio-headphones",
    subtitle: "Planar audio, lambskin comfort, adaptive silence",
    description:
      "Reference-grade sound wrapped in black anodized aluminum and cloud-soft ear cushions for long private listening sessions.",
    price: 890,
    compareAtPrice: 1040,
    currency: "USD",
    rating: 4.94,
    reviewCount: 301,
    inventory: 42,
    badge: "Top Rated",
    tags: ["tech", "audio", "headphones", "black"],
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=88",
    ],
    details: { Driver: "Planar magnetic", Battery: "44 hours", Mode: "Adaptive ANC" },
    isTrending: true,
    isNewArrival: false,
    isFlashDeal: false,
  },
  {
    id: "prod-perfume",
    categoryId: "cat-atelier",
    name: "Velvet Oud Parfum Extrait",
    slug: "velvet-oud-parfum-extrait",
    subtitle: "Oud, black tea, saffron, vanilla smoke",
    description:
      "A slow-burning extrait with a velvet trail, bottled in weighted black glass with a magnetic gold cap.",
    price: 310,
    currency: "USD",
    rating: 4.89,
    reviewCount: 76,
    inventory: 64,
    badge: "New Ritual",
    tags: ["fragrance", "oud", "beauty", "gift"],
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=88",
    ],
    details: { Concentration: "Extrait 28%", Volume: "75ml", Notes: "Oud, saffron, tea" },
    isTrending: false,
    isNewArrival: true,
    isFlashDeal: false,
  },
  {
    id: "prod-chair",
    categoryId: "cat-home",
    name: "Riviera Low Lounge Chair",
    slug: "riviera-low-lounge-chair",
    subtitle: "Bouclé cloud seat with smoked oak frame",
    description:
      "A gallery-like lounge chair with softened geometry, deep comfort, and a quiet silhouette from every angle.",
    price: 1840,
    compareAtPrice: 2140,
    currency: "USD",
    rating: 4.87,
    reviewCount: 54,
    inventory: 11,
    badge: "Design Edit",
    tags: ["home", "chair", "furniture", "boucle"],
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=88",
    ],
    details: { Upholstery: "Ivory bouclé", Frame: "Smoked oak", LeadTime: "2 weeks" },
    isTrending: true,
    isNewArrival: false,
    isFlashDeal: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Amara Solene",
    role: "Interior stylist",
    location: "Dubai",
    quote: "Duraiz Mart feels like a private showroom. Every interaction is calm, polished, and deeply considered.",
  },
  {
    name: "Nico Vale",
    role: "Collector",
    location: "Milan",
    quote: "The curation is rare without feeling loud. My order arrived with concierge-level updates and beautiful packaging.",
  },
  {
    name: "Lina Park",
    role: "Creative director",
    location: "Seoul",
    quote: "I came for a watch and stayed for the entire experience. Elegant, cinematic, and genuinely useful.",
  },
];

export const couponCodes = [
  { code: "CHAMPAGNE10", description: "Private launch courtesy", percentOff: 10 },
  { code: "DURAIZVIP", description: "VIP black card preview", percentOff: 15 },
];

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function productDiscount(product: ProductView) {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0;
  return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
}
