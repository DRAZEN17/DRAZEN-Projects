# Portfolio — Frontend Only

A complete portfolio site with admin panel, **no backend required**.  
Everything runs in the browser using **localStorage as the database** and **EmailJS** for email delivery.

---

## How it works

| Original (backend)               | Replacement (frontend-only)              |
|----------------------------------|------------------------------------------|
| MongoDB via Mongoose             | `localStorage` JSON collections          |
| Express REST API (`/api/…`)      | Synchronous JS functions in `services/`  |
| JWT authentication               | Base64 session token in `localStorage`   |
| Multer / Cloudinary image upload | FileReader → base64 stored in localStorage |
| Nodemailer SMTP email            | EmailJS browser SDK                      |
| Server-side analytics aggregation | In-memory localStorage aggregation      |

---

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` — sample projects, blogs, and testimonials are seeded automatically on first load.

### Admin login (default)
- **Email:** `admin@portfolio.dev`
- **Password:** `admin1234`

> Change the seed in `src/services/seed.js` before deploying.

---

## Email setup (optional)

Contact form messages are always saved to localStorage.  
To also receive an email when someone contacts you:

1. Create a free account at [emailjs.com](https://www.emailjs.com/)
2. Create a service, a template, and copy your credentials
3. Set in `.env`:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Your EmailJS template should use variables: `from_name`, `from_email`, `subject`, `message`.

---

## Deploying

This is a pure static site — deploy to **Vercel**, **Netlify**, **Cloudflare Pages**, or any CDN:

```bash
npm run build      # outputs to dist/
```

Then upload `dist/` or connect your repo.

---

## Architecture

```
src/
├── services/
│   ├── api.js          ← localStorage collection abstraction (create/read/update/delete)
│   ├── seed.js         ← Seeds sample data into localStorage on first load
│   ├── auth.js         ← Login / register / session (no JWT, base64 token)
│   ├── content.js      ← Projects, Blogs, Testimonials, Messages
│   └── analytics.js    ← Page views, project clicks, blog views
├── store/
│   ├── authStore.js    ← Zustand auth store (same API as before)
│   └── themeStore.js
├── pages/
│   ├── admin/          ← Full CRUD admin for all content types
│   └── …
└── components/
```

---

## Limitations vs. the backend version

- **Data is per-device / per-browser** — localStorage is not shared across devices.
  → For a real multi-device admin, use Supabase, Firebase, or PocketBase instead.
- **Image upload** stores base64 in localStorage (~1–2 MB limit per image).
  → For larger images, use a CDN URL in the "coverImage URL" field instead.
- **No server-side rate limiting or validation** — fine for a personal portfolio.
