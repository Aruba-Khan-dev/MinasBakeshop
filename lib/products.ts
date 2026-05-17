// Minas Bakeshop Product Data with exact pricing from requirements

export const FLAVOURS = [
  'French Vanilla',
  'Celestial Caramel',
  'Cherry Chocolate Fantasy',
  'Chocolate Amour',
  'Nutella Caramel'
];

export const CAKE_SIZES = [
  { label: '1 Pound', value: '1lb', price: 2600 },
  { label: '2 Pounds', value: '2lb', price: 4200 },
  { label: '3 Pounds', value: '3lb', price: 6000 },
  { label: '4 Pounds', value: '4lb', price: 8000 },
];

export const CAKE_SHAPES = ['Round', 'Square', 'Heart'];

export const ADD_ONS = [
  { id: 'message-card', label: 'Custom Message Card (Printed / Handwritten)', price: 150 },
  { id: 'candles', label: 'Extra Candles (Themed / Plain)', price: 30 },
  { id: 'topper', label: 'Cake Topper (Happy Birthday, Eid, Love)', price: 250 },
  { id: 'balloon', label: 'Helium Balloon', price: 200 },
];

// Cake products organized by category slug
export interface CakeProductItem {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export const CAKE_PRODUCTS: Record<string, CakeProductItem[]> = {
  'wedding-cakes': [
    { id: 'elegant-white-pearl', name: 'Elegant White Pearl', description: 'Pristine white elegance for your special day', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wedding%20Cake%201-Gzh3voS2x4IOyNayA75ewMpxgs1D9f.jpeg' },
    { id: 'rose-garden-romance', name: 'Rose Garden Romance', description: 'Romantic floral design with delicate roses', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wedding%20%20Cake%202-rfC1MHHldanXnpXD8WQeeQ5YoteYiC.jpeg' },
    { id: 'golden-anniversary', name: 'Golden Anniversary', description: 'Luxurious gold accents for milestone celebrations', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wedding%20Cake%203-oGxeaqtftrLo84UJLkrSPCG8ToS0Gy.jpeg' },
    { id: 'blush-and-gold', name: 'Blush & Gold', description: 'Soft blush tones with gold leaf details', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wedding%20Cake%204-5Aq2nyCNAUVjfIMHd9Ax1GyDm37kak.jpeg' },
    { id: 'enchanted-garden', name: 'Enchanted Garden', description: 'A fairy-tale cake with trailing florals', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wedding%20Cake%205-5tZM5mqJDQmSMUFdGLSYoLFsRGILj3.jpeg' },
  ],
  'valentines-day-cakes': [
    { id: 'love-in-bloom', name: 'Love In Bloom', description: 'Floral romance in every layer', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Valentine%27s%20Day%20Cake%201-cmkdZkpFbHP3RZvwt4Ldhjrkm1PYux.jpeg' },
    { id: 'romantic-red-velvet', name: 'Romantic Red Velvet', description: 'Rich red velvet with cream cheese frosting', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Valentine%27s%20Day%20Cake%202-HJ2Zc97xRwqxW8HMTv7QcPIDH5707O.jpeg' },
    { id: 'sweetheart-delight', name: 'Sweetheart Delight', description: 'Sweet heart-shaped masterpiece', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Valentine%27s%20Day%20Cake%203-x2qeYtaiYVGexoVnwGvW0TyErL8rXs.jpeg' },
    { id: 'cupids-choice', name: "Cupid's Choice", description: 'Elegant design for the romantic at heart', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Valentine%27s%20Day%20Cake%204-lzlna8Frr2ICkqICvAbkxv1WaYvUTR.jpeg' },
    { id: 'eternal-love', name: 'Eternal Love', description: 'Timeless beauty for Valentine celebrations', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Valentine%27s%20Day%20Cake%205-RQRXuuu9hhmHLiT2UOegkYtMNotXBH.jpeg' },
  ],
  '3d-cakes': [
    { id: 'sculpted-character', name: 'Sculpted Character', description: '3D character cake, fully customizable' },
    { id: 'themed-sculpture', name: 'Themed Sculpture', description: 'Custom 3D themed design' },
    { id: 'whimsical-creation', name: 'Whimsical Creation', description: 'Fun and creative 3D cake art' },
    { id: 'stacked-wonder', name: 'Stacked Wonder', description: 'Multi-tier 3D masterpiece' },
  ],
  'anniversary-cakes': [
    { id: 'golden-years', name: 'Golden Years', description: 'Celebrate milestones in style' },
    { id: 'silver-elegance', name: 'Silver Elegance', description: 'Sophisticated silver-themed design' },
    { id: 'love-forever', name: 'Love Forever', description: 'Romantic anniversary celebration' },
    { id: 'milestone-marvel', name: 'Milestone Marvel', description: 'Custom anniversary numbers cake' },
  ],
  'baby-cakes': [
    { id: 'welcome-baby', name: 'Welcome Baby', description: 'Soft pastel design for newborns' },
    { id: 'teddy-bear-dream', name: 'Teddy Bear Dream', description: 'Adorable teddy bear themed cake' },
    { id: 'stork-delivery', name: 'Stork Delivery', description: 'Classic baby shower design' },
    { id: 'little-prince', name: 'Little Prince', description: 'Royal themed baby cake' },
    { id: 'first-birthday-star', name: 'First Birthday Star', description: 'Perfect for turning one' },
  ],
  'bento-cakes': [
    { id: 'classic-bento', name: 'Classic Bento', description: 'Minimal and elegant bento cake' },
    { id: 'message-bento', name: 'Message Bento', description: 'Bento cake with custom message' },
    { id: 'heart-bento', name: 'Heart Bento', description: 'Heart-shaped bento design' },
    { id: 'pastel-bento', name: 'Pastel Bento', description: 'Soft pastel colored bento cake' },
  ],
  'classic-cakes': [
    { id: 'vanilla-dream', name: 'Vanilla Dream', description: 'Timeless vanilla buttercream beauty' },
    { id: 'chocolate-indulgence', name: 'Chocolate Indulgence', description: 'Rich chocolate layered cake' },
    { id: 'red-velvet-classic', name: 'Red Velvet Classic', description: 'Classic red velvet perfection' },
    { id: 'strawberry-shortcake', name: 'Strawberry Shortcake', description: 'Fresh strawberry delight' },
  ],
  'dholki-mehndi-cakes': [
    { id: 'mehndi-magic', name: 'Mehndi Magic', description: 'Henna-inspired intricate design' },
    { id: 'dholki-beats', name: 'Dholki Beats', description: 'Vibrant dholki celebration theme' },
    { id: 'bridal-henna', name: 'Bridal Henna', description: 'Elegant bridal mehndi design' },
    { id: 'colorful-celebration', name: 'Colorful Celebration', description: 'Festive and colorful design' },
  ],
  'eid-cakes': [
    { id: 'eid-mubarak', name: 'Eid Mubarak', description: 'Classic Eid celebration cake' },
    { id: 'crescent-moon', name: 'Crescent Moon', description: 'Elegant crescent and star design' },
    { id: 'lantern-glow', name: 'Lantern Glow', description: 'Beautiful lantern themed cake' },
    { id: 'festive-joy', name: 'Festive Joy', description: 'Joyful festive celebration design' },
  ],
  'floral-design-cakes': [
    { id: 'garden-bloom', name: 'Garden Bloom', description: 'Lush garden of buttercream flowers' },
    { id: 'pastel-petals', name: 'Pastel Petals', description: 'Soft pastel floral arrangement' },
    { id: 'wildflower-meadow', name: 'Wildflower Meadow', description: 'Natural wildflower design' },
    { id: 'rose-cascade', name: 'Rose Cascade', description: 'Cascading rose design' },
  ],
  'fondant-cakes': [
    { id: 'smooth-elegance', name: 'Smooth Elegance', description: 'Perfectly smooth fondant finish' },
    { id: 'sculpted-fondant', name: 'Sculpted Fondant', description: 'Detailed fondant sculpting' },
    { id: 'modern-geometric', name: 'Modern Geometric', description: 'Clean geometric fondant design' },
    { id: 'ruffled-beauty', name: 'Ruffled Beauty', description: 'Beautiful fondant ruffles' },
  ],
  'football-themed-cakes': [
    { id: 'stadium-cake', name: 'Stadium Cake', description: 'Football stadium themed design' },
    { id: 'jersey-cake', name: 'Jersey Cake', description: 'Custom team jersey cake' },
    { id: 'football-field', name: 'Football Field', description: 'Green field with goalposts' },
    { id: 'champions-trophy', name: 'Champions Trophy', description: 'Trophy celebration cake' },
  ],
  'fresh-flower-cakes': [
    { id: 'rose-elegance', name: 'Rose Elegance', description: 'Fresh roses on buttercream' },
    { id: 'sunflower-sunshine', name: 'Sunflower Sunshine', description: 'Bright sunflower arrangement' },
    { id: 'lavender-fields', name: 'Lavender Fields', description: 'Fragrant lavender decoration' },
    { id: 'mixed-bouquet', name: 'Mixed Bouquet', description: 'Beautiful mixed flower cake' },
  ],
  'mothers-day-cakes': [
    { id: 'best-mom', name: 'Best Mom', description: 'Special design for the best mom' },
    { id: 'floral-love', name: 'Floral Love', description: 'Flowers for our beloved mothers' },
    { id: 'elegant-tribute', name: 'Elegant Tribute', description: 'Elegant cake to honor mothers' },
    { id: 'pastel-paradise', name: 'Pastel Paradise', description: 'Pastel themed motherly love' },
  ],
  'umrah-hajj-cakes': [
    { id: 'kaaba-design', name: 'Kaaba Design', description: 'Beautiful Kaaba themed cake' },
    { id: 'umrah-mubarak', name: 'Umrah Mubarak', description: 'Celebrate the sacred journey' },
    { id: 'hajj-blessings', name: 'Hajj Blessings', description: 'Blessed Hajj celebration cake' },
    { id: 'madinah-theme', name: 'Madinah Theme', description: 'Beautiful Madinah themed design' },
  ],
  'vintage-cakes': [
    { id: 'retro-charm', name: 'Retro Charm', description: 'Vintage-inspired buttercream design' },
    { id: 'antique-rose', name: 'Antique Rose', description: 'Old-world rose arrangement' },
    { id: 'lace-elegance', name: 'Lace Elegance', description: 'Delicate lace pattern cake' },
    { id: 'vintage-pearl', name: 'Vintage Pearl', description: 'Pearl and ribbon vintage design' },
  ],
};

// Helper to get cake products by category
export function getCakeProductsByCategory(categorySlug: string): CakeProductItem[] {
  return CAKE_PRODUCTS[categorySlug] || [];
}

// Helper to get a single cake product
export function getCakeProduct(categorySlug: string, productSlug: string): CakeProductItem | null {
  const products = CAKE_PRODUCTS[categorySlug];
  if (!products) return null;
  return products.find(p => p.id === productSlug) || null;
}

export const TIME_SLOTS = [
  '9:00 AM - 12:00 PM',
  '12:00 PM - 3:00 PM',
  '3:00 PM - 6:00 PM',
  '6:00 PM - 9:00 PM',
];

// Dessert products with exact pricing
export const DESSERTS = {
  'banana-bread': {
    id: 'banana-bread',
    name: 'Banana Bread',
    category: 'Desserts',
    description: 'Freshly baked banana bread with a moist, tender crumb.',
    price: 900,
    hasCustomization: false,
    image: '/images/banana-bread.jpg',
  },
  'brownies': {
    id: 'brownies',
    name: 'Brownies',
    category: 'Desserts',
    description: 'Rich, fudgy brownies with a perfect crispy top.',
    sizes: [
      { label: '6 pieces', value: '6', price: 1600 },
      { label: '9 pieces', value: '9', price: 2400 },
    ],
    hasCustomization: true,
    hasAddOns: true,
    image: '/images/brownies.jpg',
  },
  'cookies': {
    id: 'cookies',
    name: 'Cookies',
    category: 'Desserts',
    description: 'Soft and chewy cookies baked fresh to order.',
    sizes: [
      { label: '4 cookies', value: '4', price: 850 },
      { label: '6 cookies', value: '6', price: 1300 },
    ],
    hasCustomization: false,
    image: '/images/cookies.jpg',
  },
  'cupcakes': {
    id: 'cupcakes',
    name: 'Cupcakes',
    category: 'Desserts',
    description: 'Beautifully decorated cupcakes in your choice of flavour.',
    sizes: [
      { label: '6 cupcakes', value: '6', price: 1600 },
      { label: '12 cupcakes', value: '12', price: 3000 },
    ],
    hasCustomization: true,
    hasAddOns: true,
    hasFlavours: true,
    image: '/images/cupcakes.jpg',
  },
};

// Luxury Gifting products with exact pricing
export const LUXURY_GIFTING = {
  '2-cupcake-bento-box': {
    id: '2-cupcake-bento-box',
    name: '2 Cupcake Bento Box',
    category: 'Luxury Gifting',
    description: 'Elegant bento box with 2 premium decorated cupcakes.',
    price: 2300,
    hasCustomization: true,
    hasAddOns: true,
    hasFlavours: true,
    customizationFields: ['theme', 'colorPreferences', 'message', 'referenceImage', 'specialInstructions'],
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bento%202%20cupcakes-ObNydCNfi30icsrqG5fJ0DaFjveZfK.jpeg',
  },
  '5-cupcake-bento-box': {
    id: '5-cupcake-bento-box',
    name: '5 Cupcake Bento Box',
    category: 'Luxury Gifting',
    description: 'Premium bento box with 5 beautifully decorated cupcakes.',
    price: 2700,
    hasCustomization: true,
    hasAddOns: true,
    hasFlavours: true,
    customizationFields: ['theme', 'colorPreferences', 'message', 'referenceImage', 'specialInstructions'],
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bento%205%20cupcakes-zBsUAp4GRsKbVA2sACl0RrBZmNkhZb.jpeg',
  },
  'bento-flower-box': {
    id: 'bento-flower-box',
    name: 'Bento & Flower Box',
    category: 'Luxury Gifting',
    description: 'Beautiful bento cake paired with fresh flowers. Flowers selected based on availability.',
    price: 2600,
    hasCustomization: true,
    hasAddOns: true,
    hasFlavours: true,
    customizationFields: ['theme', 'colorPreferences', 'message', 'referenceImage', 'specialInstructions'],
    flowersNote: 'Flowers will be selected based on availability. No custom flower selection option.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bento%20Flower%20Box%20-G5Tw02isZu3zxVfJ0fw4KsL7jAkMr2.jpeg',
  },
};

// Cake categories with all themes from requirements
export const CAKE_CATEGORIES = [
  { id: '3d-cakes', name: '3D Cakes', slug: '3d-cakes' },
  { id: 'anniversary-cakes', name: 'Anniversary Cakes', slug: 'anniversary-cakes' },
  { id: 'baby-cakes', name: 'Baby Cakes', slug: 'baby-cakes' },
  { id: 'bento-cakes', name: 'Bento Cakes', slug: 'bento-cakes' },
  { id: 'classic-cakes', name: 'Classic Cakes', slug: 'classic-cakes' },
  { id: 'dholki-mehndi-cakes', name: 'Dholki / Mehndi Cakes', slug: 'dholki-mehndi-cakes' },
  { id: 'eid-cakes', name: 'Eid Cakes', slug: 'eid-cakes' },
  { id: 'floral-design-cakes', name: 'Floral Design Cakes', slug: 'floral-design-cakes' },
  { id: 'fondant-cakes', name: 'Fondant Cakes', slug: 'fondant-cakes' },
  { id: 'football-themed-cakes', name: 'Football Themed Cakes', slug: 'football-themed-cakes' },
  { id: 'fresh-flower-cakes', name: 'Fresh Flower Cakes', slug: 'fresh-flower-cakes' },
  { id: 'mothers-day-cakes', name: "Mother's Day Cakes", slug: 'mothers-day-cakes' },
  { id: 'umrah-hajj-cakes', name: 'Umrah / Hajj Cakes', slug: 'umrah-hajj-cakes' },
  { id: 'valentines-day-cakes', name: "Valentine's Day Cakes", slug: 'valentines-day-cakes' },
  { id: 'vintage-cakes', name: 'Vintage Cakes', slug: 'vintage-cakes' },
  { id: 'wedding-cakes', name: 'Wedding Cakes', slug: 'wedding-cakes' },
];

export const DESSERT_CATEGORIES = [
  { id: 'banana-bread', name: 'Banana Bread', slug: 'banana-bread' },
  { id: 'brownies', name: 'Brownies', slug: 'brownies' },
  { id: 'cookies', name: 'Cookies', slug: 'cookies' },
  { id: 'cupcakes', name: 'Cupcakes', slug: 'cupcakes' },
];

export const LUXURY_CATEGORIES = [
  { id: '2-cupcake-bento-box', name: '2 Cupcake Bento Box', slug: '2-cupcake-bento-box' },
  { id: '5-cupcake-bento-box', name: '5 Cupcake Bento Box', slug: '5-cupcake-bento-box' },
  { id: 'bento-flower-box', name: 'Bento & Flower Box', slug: 'bento-flower-box' },
];

// Product type definitions
export type ProductType = 'cake' | 'dessert' | 'luxury';

export interface CakeProduct {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  image?: string;
  hasSizes: true;
  hasFlavours: true;
  hasShapes: true;
  hasCustomization: true;
  hasAddOns: true;
}

export interface DessertProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price?: number;
  sizes?: { label: string; value: string; price: number }[];
  hasCustomization: boolean;
  hasAddOns?: boolean;
  hasFlavours?: boolean;
  image?: string;
}

export interface LuxuryProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  hasCustomization: boolean;
  hasAddOns: boolean;
  hasFlavours: boolean;
  customizationFields: string[];
  flowersNote?: string;
  image?: string;
}

// Helper function to get product type from category slug
export function getProductTypeFromSlug(slug: string): ProductType | null {
  if (slug === 'luxury-gifting') return 'luxury';
  if (CAKE_CATEGORIES.some(c => c.slug === slug)) return 'cake';
  if (DESSERT_CATEGORIES.some(c => c.slug === slug)) return 'dessert';
  if (LUXURY_CATEGORIES.some(c => c.slug === slug)) return 'luxury';
  return null;
}

// Helper function to get category info
export function getCategoryInfo(slug: string) {
  // Handle the aggregate "luxury-gifting" page
  if (slug === 'luxury-gifting') {
    return { id: 'luxury-gifting', name: 'Luxury Gifting', slug: 'luxury-gifting', type: 'luxury' as ProductType };
  }

  const cakeCategory = CAKE_CATEGORIES.find(c => c.slug === slug);
  if (cakeCategory) return { ...cakeCategory, type: 'cake' as ProductType };

  const dessertCategory = DESSERT_CATEGORIES.find(c => c.slug === slug);
  if (dessertCategory) return { ...dessertCategory, type: 'dessert' as ProductType };

  const luxuryCategory = LUXURY_CATEGORIES.find(c => c.slug === slug);
  if (luxuryCategory) return { ...luxuryCategory, type: 'luxury' as ProductType };

  return null;
}

// Helper to get dessert product
export function getDessertProduct(slug: string): DessertProduct | null {
  return DESSERTS[slug as keyof typeof DESSERTS] || null;
}

// Helper to get luxury product
export function getLuxuryProduct(slug: string): LuxuryProduct | null {
  return LUXURY_GIFTING[slug as keyof typeof LUXURY_GIFTING] || null;
}
