# DRAZIME'S — Luxury Fashion & Accessories

A fashion e-commerce front end built from a Figma-style mockup, using  GSAP,React  + Vite  + Tailwind CSS—
 wired up to a **live product API**.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint      # eslint
```

Requires Node 18+ and an internet connection (the catalogue is fetched
live — see below).

## Live product data

Every product — clothing, shoes, bags, and jewelry — is fetched at
runtime from [DummyJSON](https://dummyjson.com/docs/products), a free,
keyless, CORS-enabled REST API built specifically for this kind of
frontend prototyping. No backend, API key, or local database needed.

`src/lib/dummyjson.js` pulls from DummyJSON's real categories in
parallel and normalizes them into one shape the UI understands:

| Our category | DummyJSON source(s)                    |
| ------------- | --------------------------------------- |
| Tops          | `tops`                                  |
| Shirts        | `mens-shirts`                           |
| Dresses       | `womens-dresses`                        |
| Shoes         | `womens-shoes` + `mens-shoes`           |
| Bags          | `womens-bags`                           |
| Jewelry       | `womens-jewellery`                      |
| Watches       | `womens-watches` + `mens-watches`       |
| Sunglasses    | `sunglasses`                            |

`src/context/ProductsContext.jsx` fetches the whole catalogue once at
app start (`ProductsProvider`), and every page reads from it via
`useProducts()` — no per-page refetching, one shared loading/error
state. `Promise.allSettled` means one flaky category doesn't take the
whole catalogue down: the app only shows an error if *every* category
fails.

**What's real vs. what's ours:** titles, brands, prices, descriptions,
ratings, stock, discount %, and real photography all come straight from
the API. DummyJSON doesn't model size or color options, so sizes are a
sensible generic set per category (e.g. XS–XL for tops, 6–11 for shoes,
"One Size" for bags/jewelry) — an honest UI affordance rather than
invented per-product data. Color swatches were dropped for the same
reason (no real basis for them anymore).

## What's here

- **Home** — animated hero (SplitText headline reveal + parallax) featuring
  a real, highly-rated product photo, a **Recently Viewed** strip for
  returning visitors (nothing shown until you've actually viewed
  something), New Arrivals with quick filters, an editorial mentions
  strip, Collections banners, a Just For You carousel, and Trending — the
  4 highest-rated items across the whole catalogue, plus hashtags.
- **Shop** (`/shop`) — filterable, sortable, paginated product grid, with
  a **Filters panel** (price range, minimum rating) on top of category,
  gender, and search. Supports `?category=`, `?gender=`, and `?q=` search
  params, so the nav menu and the nav-bar search both deep-link into it.
  Unisex categories (tops, sunglasses) always show regardless of the
  gender filter. The search box also understands gender words directly —
  searching "men", "women's", "ladies", etc. filters to that gender
  instead of doing a text match (word-boundaried, so "women" never
  false-matches "men").
- **Product Detail** (`/product/:id`) — breadcrumbs, a real multi-image
  gallery with a click-to-enlarge **lightbox** (arrow-key/swipe-free,
  button-navigated between images), rating, stock/availability badge,
  discount pricing, tag chips, size selection, a quantity stepper,
  add-to-basket, a working wishlist toggle, and an accordion for
  Description / Shipping & Returns / Details / real customer **Reviews**
  pulled straight from the API. Single-option categories (bags, jewelry,
  watches, sunglasses only ever have "One Size") auto-select that size so
  Add to Basket works without an extra, easy-to-miss click. Viewing a
  product adds it to Recently Viewed.
- **Wishlist** (`/wishlist`) — the heart button on any product card or
  the product page saves it here, persisted to `localStorage` so it
  survives a refresh. Opened from its own nav icon (with a live count
  badge, same pattern as the cart).
- **Account** (`/account`) — a **demo session**, not real authentication:
  signing in just saves a name (and optional email) locally so the site
  can greet you and keep an order history for this browser — there's no
  password and nothing is verified anywhere, and the page says so.
  Placing an order in Checkout records a lightweight entry here
  regardless of whether you're signed in; you just need to sign in to
  see the history.
- **Blog** (`/blog`) — category tabs + "Load More" pagination. Posts are
  static site copy, but thumbnails borrow real product photography.
- **About** / **Contact** — supporting pages so the footer links resolve
  to something (not shown in the mockup crop, kept intentionally simple).
- **404** — any unmatched route (typo'd URL, stale link) gets an
  on-brand not-found page instead of rendering blank.
- **Cart drawer** and **mobile-style menu overlay** — global, opened from
  the nav, built as GSAP-animated overlays (slide via `xPercent` + fade
  via `autoAlpha`, and a clip-path reveal for the menu) rather than plain
  CSS transitions, matching the source template's motion language. Both
  establish their hidden state via `gsap.set()` on mount rather than a
  static inline `style` prop — see the note below on why that matters.
- **Cart** (`/cart`) → **Checkout** (`/checkout`) → **Order Confirmation**
  (`/order-confirmation`) — the full purchase flow. Cart is a full-page,
  editable version of the drawer, and — like the wishlist — persists to
  `localStorage`, so refreshing mid-shop doesn't empty it. Checkout
  collects shipping + a (clearly labeled, non-functional) payment form
  and shows a live order summary with shipping method and estimated tax;
  placing an order records it to Account order history, clears the cart,
  and hands the summary to the confirmation page via router state
  (`navigate(path, { state })`). Visiting `/order-confirmation` directly
  (without having just checked out) shows a graceful "no recent order"
  state instead of a blank page.

## Accessibility

The cart drawer and menu overlay trap Tab focus while open (can't tab to
content behind them), move focus into the panel on open, restore it to
whatever triggered them on close, and close on Escape — via a shared
`useFocusTrap` hook (`src/hooks/useFocusTrap.js`), also used by the
image lightbox. This matters most for exactly the elements GSAP animates
open/closed, which is also why they're covered in the note below.

## Structure

```
src/
  lib/          dummyjson.js — API client + category mapping + the
                 normalizer that turns raw API data into our shape;
                 storage.js — tiny localStorage wrapper (cart, wishlist,
                 account/orders, recently viewed)
  context/      ProductsContext (live catalogue, loading/error state),
                 CartContext (cart + menu/drawer open state, persisted),
                 WishlistContext (saved product ids, persisted),
                 AccountContext (demo session + order history, persisted),
                 RecentlyViewedContext (last-viewed product ids, persisted)
  components/   reusable UI: NavBar, MenuOverlay, CartDrawer, ProductCard,
                 ProductImage (real photo w/ line-art fallback), FormField,
                 Breadcrumbs, Lightbox, Icon, ProductArt (fallback-only now),
                 RevealTag, Accordion, Footer
  sections/     Home-page sections (Hero, RecentlyViewed, NewArrivals, …)
  pages/        one file per route, including NotFound (404), Wishlist,
                 and Account
  hooks/        useScrollReveal (shared GSAP scroll-in motion),
                 useFocusTrap (modal/drawer keyboard accessibility)
```

`components/` vs `sections/` vs `pages/` mirrors the source template
(App.jsx assembling section components); `lib/`, `context/`, `pages/`,
and `hooks/` are additions needed to turn a single-page scroller into a
routed, API-backed storefront.

## Design system

Colors, type, and layout were sampled directly from the mockup (dusty
blush hero, warm ink, cream paper, rust price/accent) and set up as
Tailwind v4 `@theme` tokens plus nested `@layer components` classes, the
same pattern the source template uses. The signature motion element —
a small pill label that unfurls via `clip-path` on scroll — is a direct
port of the source's `ClipPathTitle` technique, reused here as
`<RevealTag>` for every section eyebrow.

## Fallback imagery

Every visible image on the site — hero, product cards, product detail
gallery, blog thumbnails, and the footer's "Follow Us" grid — is real
photography pulled from the live catalogue. `ProductImage` quietly falls
back to an original minimalist line-art illustration
(`src/components/ProductArt.jsx`) only if a specific image URL fails to
load; that's the one remaining use of hand-drawn art, and it's invisible
unless a photo genuinely breaks.

## Notes on the GSAP setup

`ScrollSmoother` is created once at the app root and left running across
navigations; each route change resets scroll position and calls
`ScrollTrigger.refresh()` on the next frame so trigger positions stay
correct against the new page's content height. Because product data
arrives asynchronously, the scroll-reveal hook (`useScrollReveal`) is
re-run once loading finishes on every page that shows product grids —
otherwise the reveal animation would bind to the loading skeletons
instead of the real cards that replace them.

Every element GSAP animates open/closed (the cart drawer, the menu
overlay, the image lightbox, accordion panels) establishes its *initial*
state via `gsap.set()` in a mount-only effect, never via a static inline
`style` prop. A hardcoded style object in JSX gets reconciled by React on
every re-render of that component regardless of the actual open/closed
state — which, with GSAP also directly animating those same properties,
means an unrelated re-render could silently reset the element back to
"closed" mid-animation or after it settled. Letting GSAP own the
property from mount onward (`autoAlpha`, `xPercent`, rather than raw
`display`/`transform`/`opacity`) avoids that fight entirely.

## Not included

Checkout is a complete front-end flow, but there's no real backend
behind it — placing an order clears the cart and shows a confirmation,
nothing is actually charged, and `/order-confirmation` only has an order
to show via that specific navigation's router state (refreshing it, or
landing on it directly, shows a graceful empty state instead — though
the order itself is saved to Account order history, so it's not lost).
The Contact page's form doesn't send anywhere either. Cart, wishlist,
recently-viewed, and the demo account/order-history *are* persisted
client-side (`localStorage`), so — unlike the confirmation page itself —
they survive a refresh. To take this further: wire the Checkout submit
handler to a real payment processor (Stripe, etc.) and order API, swap
the demo Account session for real authentication, and point the Contact
form at an email/API endpoint.
