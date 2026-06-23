// Shared data and product generation
export const CATEGORIES = [
  {
    id: "tech",
    name: "Electronics",
    color: "3b82f6",
    icon: "💻",
    keywords: "technology,gadget",
  },
  {
    id: "fashion",
    name: "Fashion",
    color: "ec4899",
    icon: "👕",
    keywords: "clothing,fashion",
  },
  {
    id: "home",
    name: "Home & Living",
    color: "10b981",
    icon: "🏠",
    keywords: "furniture,interior",
  },
  {
    id: "sports",
    name: "Sports",
    color: "f59e0b",
    icon: "⚽",
    keywords: "sports,fitness",
  },
  {
    id: "toys",
    name: "Toys & Hobbies",
    color: "8b5cf6",
    icon: "🎮",
    keywords: "toy,game",
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
    "Tshirt",
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
    "Robot",
    "Lego",
    "Doll",
    "Toy Car",
    "Puzzle",
    "Drone",
    "Teddy Bear",
    "Action Figure",
    "Kite",
    "Board Game",
  ],
};

export const generateProducts = () => {
  const products = [];
  let idCounter = 1;

  CATEGORIES.forEach((cat) => {
    for (let i = 0; i < 20; i++) {
      const noun = NOUNS[cat.id][Math.floor(Math.random() * NOUNS[cat.id].length)];
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const price = Math.floor(Math.random() * 200) + 20;

      const imageKeyword = `${cat.keywords},${noun.replace(" ", "")}`;

      products.push({
        id: idCounter++,
        name: `${adj} ${noun}`,
        category: cat.id,
        price: price,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        reviews: Math.floor(Math.random() * 500) + 10,
        image: `https://loremflickr.com/400/300/${encodeURIComponent(imageKeyword)}?lock=${idCounter}`,
        description: `Experience the best quality with our ${adj.toLowerCase()} ${noun.toLowerCase()}. Designed for the modern lifestyle and perfect for your daily needs.`,
      });
    }
  });

  return products.sort(() => Math.random() - 0.5);
};

export const ALL_PRODUCTS = generateProducts();
