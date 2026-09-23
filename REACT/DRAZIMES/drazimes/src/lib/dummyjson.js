// Thin client for the DummyJSON public API (https://dummyjson.com/docs/products) —
// a free, keyless, CORS-enabled REST API built for exactly this use case
// (frontend prototyping with real product data). No auth, no rate-limit
// headaches: it's the same API countless React/Vue/Flutter tutorials fetch
// directly from the browser.
//
// DummyJSON has no single "fashion" endpoint, so we pull from several of
// its real categories in parallel and normalize them into one shape our
// UI understands. See CATEGORY_SOURCES below for exactly which source
// category feeds which part of the site.

const BASE_URL = "https://dummyjson.com";

// Our own site taxonomy -> DummyJSON's real category slugs. Two of ours
// ("shoes", "watches") merge a men's + women's source category into one
// browsable section; gender is attached per source so filtering by
// gender still works even though the category is unified.
export const CATEGORY_SOURCES = [
  { slug: "tops", label: "Tops", dummyCategory: "tops", gender: null },
  { slug: "dresses", label: "Dresses", dummyCategory: "womens-dresses", gender: "women" },
  { slug: "shirts", label: "Shirts", dummyCategory: "mens-shirts", gender: "men" },
  { slug: "shoes", label: "Shoes", dummyCategory: "womens-shoes", gender: "women" },
  { slug: "shoes", label: "Shoes", dummyCategory: "mens-shoes", gender: "men" },
  { slug: "bags", label: "Bags", dummyCategory: "womens-bags", gender: "women" },
  { slug: "jewelry", label: "Jewelry", dummyCategory: "womens-jewellery", gender: "women" },
  { slug: "watches", label: "Watches", dummyCategory: "womens-watches", gender: "women" },
  { slug: "watches", label: "Watches", dummyCategory: "mens-watches", gender: "men" },
  { slug: "sunglasses", label: "Sunglasses", dummyCategory: "sunglasses", gender: null },
];

export const SITE_CATEGORIES = [
  { slug: "tops", label: "Tops" },
  { slug: "shirts", label: "Shirts" },
  { slug: "dresses", label: "Dresses" },
  { slug: "shoes", label: "Shoes" },
  { slug: "bags", label: "Bags" },
  { slug: "jewelry", label: "Jewelry" },
  { slug: "watches", label: "Watches" },
  { slug: "sunglasses", label: "Sunglasses" },
];

// DummyJSON doesn't model size options, so we offer a sensible generic
// size set per category — a real, honest simplification (sizing is a UI
// affordance here, not fetched data) rather than inventing fake per-item data.
const SIZE_SETS = {
  tops: ["XS", "S", "M", "L", "XL"],
  dresses: ["XS", "S", "M", "L", "XL"],
  shirts: ["S", "M", "L", "XL", "XXL"],
  shoes: ["6", "7", "8", "9", "10", "11"],
  bags: ["One Size"],
  jewelry: ["One Size"],
  watches: ["One Size"],
  sunglasses: ["One Size"],
};

const categoryLabel = (slug) => SITE_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

const normalizeProduct = (raw, source) => ({
  id: `${source.dummyCategory}-${raw.id}`,
  title: raw.title,
  brand: raw.brand || "Unbranded",
  description: raw.description,
  price: raw.price,
  discountPercentage: raw.discountPercentage || 0,
  rating: raw.rating ?? null,
  stock: raw.stock ?? null,
  availabilityStatus: raw.availabilityStatus || (raw.stock > 0 ? "In Stock" : "Out of Stock"),
  tags: raw.tags || [],
  category: source.slug,
  categoryLabel: categoryLabel(source.slug),
  gender: source.gender,
  thumbnail: raw.thumbnail,
  images: raw.images?.length ? raw.images : [raw.thumbnail].filter(Boolean),
  sizes: SIZE_SETS[source.slug] || ["One Size"],
  shippingInformation: raw.shippingInformation || "Ships in 3–5 business days.",
  warrantyInformation: raw.warrantyInformation || "1 year warranty.",
  returnPolicy: raw.returnPolicy || "30 days return policy.",
  reviews: (raw.reviews || []).map((r) => ({
    rating: r.rating,
    comment: r.comment,
    date: r.date,
    reviewerName: r.reviewerName,
  })),
});

/**
 * Fetches every source category in parallel and returns one normalized,
 * flat product list. Uses allSettled so a single failed category (or a
 * flaky connection) doesn't take down the whole catalogue — we only
 * throw if every request failed.
 */
export async function fetchAllProducts() {
  const settled = await Promise.allSettled(
    CATEGORY_SOURCES.map(async (source) => {
      const res = await fetch(`${BASE_URL}/products/category/${source.dummyCategory}?limit=0`);
      if (!res.ok) throw new Error(`Request failed for ${source.dummyCategory}`);
      const data = await res.json();
      return data.products.map((raw) => normalizeProduct(raw, source));
    })
  );

  const products = [];
  let failures = 0;
  for (const result of settled) {
    if (result.status === "fulfilled") products.push(...result.value);
    else failures++;
  }

  if (products.length === 0) {
    throw new Error(
      "Couldn't reach the product catalogue (dummyjson.com). Check your connection and try again."
    );
  }

  return { products, partial: failures > 0 };
}
