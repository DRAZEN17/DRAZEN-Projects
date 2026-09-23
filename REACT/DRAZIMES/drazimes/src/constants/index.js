// Central content/data store — mirrors the source template's convention of
// keeping all copy here so components stay presentational. Product data
// itself no longer lives here: it's fetched live from DummyJSON (see
// src/lib/dummyjson.js + src/context/ProductsContext.jsx). This file keeps
// the site's own taxonomy plus everything that isn't product data.

export { SITE_CATEGORIES as navCategories } from "../lib/dummyjson";

export const quickFilters = [
  { label: "All", slug: "all" },
  { label: "Clothing", slug: "clothing" },
  { label: "Shoes", slug: "shoes" },
  { label: "Bags", slug: "bags" },
  { label: "Jewelry", slug: "jewelry" },
];

// Maps a quick-filter slug to the real product categories it should match.
export const CLOTHING_CATEGORIES = ["tops", "shirts", "dresses"];

// Home page collection banners — categorySlug picks a real fetched product
// from that category to use as the banner image once the catalogue loads.
export const collections = [
  { title: "October", label: "Collection", categorySlug: "shirts", dark: true },
  { title: "Autumn", label: "Collection", categorySlug: "dresses", dark: false },
];

export const editorialMentions = [
  "MAISON NORD",
  "VELURA",
  "ATELIER ROUX",
  "NOIRELLE",
  "CASA LINEA",
  "GRANITE & CO.",
];

export const trendingTags = [
  "#newseason",
  "#capsulewardrobe",
  "#collection",
  "#fallstyle",
  "#dress",
  "#autumncollection",
  "#DRAZIMESnation",
];

export const footerFeatures = [
  {
    icon: "truck",
    title: "Free flat-rate shipping",
    description: "Free on every order over $25, delivered in 3–5 business days.",
  },
  {
    icon: "refresh",
    title: "Sustainable process",
    description: "Considered materials and monitored production, start to finish.",
  },
  {
    icon: "shield",
    title: "Unique designs",
    description: "Small-batch pieces made from high-quality materials.",
  },
  {
    icon: "bag",
    title: "Easy returns",
    description: "30 days to return or exchange, no questions asked.",
  },
];

export const instaHandles = ["@mia", "@_jihyn", "@mia", "@_jihyn"];

export const blogPosts = [
  {
    id: "fall-style-guide",
    tag: "Fashion",
    title: "The Fall Style Guide: This Season's Biggest Trends",
    excerpt:
      "The excitement of fall fashion is here, and we've already gone through the season's runway shows to bring you the trends worth investing in.",
    date: "2 days ago",
  },
  {
    id: "denim-pairings",
    tag: "Lookbook",
    title: "5 Denim Pairings We Can't Stop Wearing",
    excerpt:
      "From wide-leg trousers to raw selvedge jackets, here are five ways we're styling denim this season, straight from our own closets.",
    date: "4 days ago",
  },
  {
    id: "fall-layering-looks",
    tag: "Fashion",
    title: "Fall Layering: 5 Looks We're Loving Right Now",
    excerpt:
      "Layering is the easiest way to stretch a capsule wardrobe through the colder months. Here are five combinations our editors keep repeating.",
    date: "6 days ago",
  },
  {
    id: "boot-edit",
    tag: "Sale",
    title: "The Boot Edit: 5 Styles Worth The Investment",
    excerpt:
      "A good boot outlasts a trend cycle. We rounded up five silhouettes that earn their place in a considered, slow-fashion wardrobe.",
    date: "1 week ago",
  },
  {
    id: "style-guide-refresh",
    tag: "Policy",
    title: "How We Choose Our Materials",
    excerpt:
      "A look inside our sourcing process, from recycled wool to vegetable-tanned leather, and why it takes longer to do it properly.",
    date: "2 weeks ago",
  },
  {
    id: "denim-2",
    tag: "Fashion",
    title: "Three Pairs Of Denim You Won't Believe",
    excerpt:
      "We tried a season's worth of new denim so you don't have to. These are the three pairs that made it into permanent rotation.",
    date: "3 weeks ago",
  },
];

export const blogTabs = ["Fashion", "Promo", "Policy", "Lookbook", "Sale"];

export const contactInfo = {
   email: "drazen90sea@gmail.com",
  phone: "+9161907676",
  hours: "08:00 – 22:00, Everyday",
};

export const siteInfo = {
  developer: "Code-Drazen",
};
