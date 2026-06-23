// Shared catalog data and product generation.
export const CATEGORIES = [
  {
    id: "tech",
    name: "Electronics",
    dept: "01",
    accent: "stamp",
  },
  {
    id: "fashion",
    name: "Fashion",
    dept: "02",
    accent: "moss",
  },
  {
    id: "home",
    name: "Home & Living",
    dept: "03",
    accent: "stamp",
  },
  {
    id: "sports",
    name: "Sport",
    dept: "04",
    accent: "moss",
  },
  {
    id: "toys",
    name: "Toys & Hobby",
    dept: "05",
    accent: "stamp",
  },
];

export const ADJECTIVES = [
  "Premium",
  "Ultra",
  "Smart",
  "Ergonomic",
  "Vintage",
  "Modern",
  "Durable",
  "Sleek",
  "Pro",
  "Compact",
];

export const NOUNS = {
  tech: [
    "Headphones",
    "Laptop",
    "Smartwatch",
    "Camera",
    "Keyboard",
    "Mouse",
    "Monitor",
    "Speaker",
    "Tablet",
    "Drone",
  ],
  fashion: [
    "Jacket",
    "Sneakers",
    "T-Shirt",
    "Backpack",
    "Sunglasses",
    "Watch",
    "Boots",
    "Scarf",
    "Jeans",
    "Hat",
  ],
  home: [
    "Lamp",
    "Chair",
    "Vase",
    "Planter",
    "Rug",
    "Pillow",
    "Desk",
    "Clock",
    "Mirror",
    "Sofa",
  ],
  sports: [
    "Yoga Mat",
    "Dumbbell",
    "Water Bottle",
    "Running Shoes",
    "Tennis Racket",
    "Soccer Ball",
    "Gym Bag",
    "Fitness Tracker",
    "Boxing Gloves",
    "Bicycle",
  ],
  toys: [
    "Robot Kit",
    "Building Blocks",
    "Doll",
    "Toy Car",
    "Puzzle",
    "Mini Drone",
    "Teddy Bear",
    "Action Figure",
    "Kite",
    "Board Game",
  ],
};

// Simple deterministic PRNG (mulberry32) so the catalog is stable across
// reloads instead of reshuffling every time the module is evaluated.
const createRng = (seed) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const generateProducts = () => {
  const rng = createRng(42);
  const products = [];
  let idCounter = 1;

  CATEGORIES.forEach((cat) => {
    for (let i = 0; i < 20; i++) {
      const noun = NOUNS[cat.id][Math.floor(rng() * NOUNS[cat.id].length)];
      const adj = ADJECTIVES[Math.floor(rng() * ADJECTIVES.length)];
      const price = Math.floor(rng() * 200) + 20;
      const sku = `${cat.dept}-${String(idCounter).padStart(4, "0")}`;

      products.push({
        id: idCounter++,
        sku,
        name: `${adj} ${noun}`,
        category: cat.id,
        price,
        rating: (rng() * 1.5 + 3.5).toFixed(1),
        reviews: Math.floor(rng() * 500) + 10,
        image: `https://picsum.photos/seed/${cat.id}-${idCounter}/480/360`,
        description: `Experience the best quality with our ${adj.toLowerCase()} ${noun.toLowerCase()}. Designed for the modern lifestyle and built to last.`,
      });
    }
  });

  // Deterministic shuffle so order is stable but not grouped by category.
  return products
    .map((p) => ({ p, key: rng() }))
    .sort((a, b) => a.key - b.key)
    .map(({ p }) => p);
};

export const ALL_PRODUCTS = generateProducts();
