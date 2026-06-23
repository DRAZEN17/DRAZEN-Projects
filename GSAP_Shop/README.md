# Index No. 9

A demo storefront catalog built with React, Vite, Tailwind CSS v4, and GSAP.
Browse five numbered departments (Electronics, Fashion, Home & Living,
Sport, Toys & Hobby), search the index, and add items to a cart drawer with
live subtotal/tax/total calculation.

## Stack

- **React 19** + **Vite 7** — app shell and dev server
- **Tailwind CSS v4** — utility styling, theme tokens defined in `src/index.css`
- **GSAP** — entrance and hover animations, scoped per-component with `gsap.context`
- **lucide-react** — icon set

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run lint      # run eslint
```

## Project structure

```
src/
  Home.jsx              orchestrates state: cart, filters, pagination
  data.jsx              catalog generation (deterministic, seeded)
  components/
    NavBar.jsx          search + cart trigger
    Hero.jsx            catalog cover + department index
    MainContent.jsx      product grid + pagination
    ProductCard.jsx      individual catalog entry
    CartDrawer.jsx       slide-over cart with quantity controls
    Footer.jsx
  hooks/
    useGsap.jsx          shared gsap instance + scoped animation helper
```

## Notes

- Catalog data is generated with a seeded PRNG so the same 100 items and
  prices appear on every load instead of reshuffling on each page refresh.
- Product photos are served from `picsum.photos` with a deterministic seed
  per item; a fallback state is shown if an image fails to load.
