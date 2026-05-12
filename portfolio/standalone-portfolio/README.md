# Cinematic Developer Portfolio — Standalone

A fully-owned, production-ready developer portfolio:

- **Frontend**: React 18 + Vite + Tailwind + GSAP/ScrollTrigger + Framer Motion + React Router + Zustand + Axios + Recharts.
- **Backend**: Node.js + Express + Mongoose (MongoDB) + JWT + bcrypt + Helmet + rate limiting + Cloudinary uploads + Nodemailer.
- **Database**: MongoDB (local or Atlas).
- **Deployable** to any VPS, Docker, Vercel (frontend), Render/Railway (backend).

> No Lovable / Bolt / v0 / Firebase / Supabase lock-in. Plain React + Express. You own everything.

---

## 1. Folder structure

```
standalone-portfolio/
├── backend/                 # Express + Mongo API
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/          # User, Project, Blog, Testimonial, Message, Analytics
│   │   ├── routes/
│   │   ├── utils/
│   │   └── seed.js
│   ├── server.js
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/                # React + Vite app
│   ├── src/
│   │   ├── components/      # Navbar, CursorFollower, ParticlesBg, MagneticButton…
│   │   ├── hooks/           # useGsap, useMagnetic
│   │   ├── pages/           # Home + sections, Projects, Blog, Contact, Login, admin/*
│   │   ├── services/        # api, auth, content, analytics
│   │   ├── store/           # zustand stores
│   │   └── utils/animations.js
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── Dockerfile + nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 2. Local development

### Prerequisites
- Node.js 20+
- MongoDB running locally **OR** a MongoDB Atlas connection string

### Backend
```bash
cd backend
cp .env.example .env        # edit MONGO_URI, JWT_SECRET, etc.
npm install
npm run seed                # creates admin@example.com / admin1234 + sample data
npm run dev                 # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

Visit:
- `/` — cinematic homepage (hero, about, skills, horizontal-scroll projects, experience, testimonials)
- `/projects`, `/blog`, `/contact`
- `/login` — sign in with seeded admin
- `/admin` — analytics, projects/blogs/messages CMS

---

## 3. Environment variables

### `backend/.env`
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=change_me_to_a_long_random_string
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173

# Optional
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Portfolio <noreply@example.com>"
NOTIFY_EMAIL=you@example.com
```

### `frontend/.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## 4. API surface

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me                (auth)

GET    /api/projects
GET    /api/projects/:idOrSlug
POST   /api/projects               (admin)
PUT    /api/projects/:id           (admin)
DELETE /api/projects/:id           (admin)

GET    /api/blogs
GET    /api/blogs/:idOrSlug
POST   /api/blogs                  (admin)
PUT    /api/blogs/:id              (admin)
DELETE /api/blogs/:id              (admin)

GET    /api/testimonials
POST/PUT/DELETE /api/testimonials  (admin)

POST   /api/messages               (public, rate-limited)
GET    /api/messages               (admin)
PATCH  /api/messages/:id/read      (admin)
DELETE /api/messages/:id           (admin)

POST   /api/analytics/track        (public)
GET    /api/analytics/summary      (admin)

POST   /api/upload/image           (admin, Cloudinary)
GET    /api/health
```

---

## 5. Auth model

- Passwords hashed with **bcryptjs** (cost 12).
- **JWT** in `Authorization: Bearer <token>` header (also accepts cookie).
- First user to register automatically becomes `admin`. Subsequent registrations are `user`.
- Role gate via `requireRole('admin')` middleware.
- Token persisted in `localStorage` and rehydrated on app boot via Zustand `useAuthStore.hydrate()`.

---

## 6. GSAP architecture

All reusable animation primitives live in `frontend/src/utils/animations.js`:
- `revealText(el)` — character split + reveal
- `fadeUpOnScroll(targets)` — ScrollTrigger fade-up
- `pinSection(trigger)` — pinning helper

Hooks:
- `useGsap(cb, deps)` — scoped GSAP context (auto-cleanup)
- `useMagnetic(strength)` — magnetic pointer attraction for buttons

Section-specific timelines live next to the section component (Hero intro timeline, horizontal scroll in `FeaturedProjects.jsx`, skill bars in `SkillBar.jsx`).

---

## 7. Docker (everything in one command)

```bash
cd standalone-portfolio
cp backend/.env.example backend/.env   # edit JWT_SECRET
docker compose up -d --build
docker compose exec backend npm run seed
```
- Frontend → http://localhost:8080
- API     → http://localhost:5000
- Mongo   → localhost:27017 (volume `mongo_data`)

---

## 8. Production deployment

### Frontend (Vercel)
1. Push repo to GitHub.
2. Import in Vercel, root = `frontend`.
3. Build command `npm run build`, output `dist`.
4. Env: `VITE_API_URL=https://your-api.example.com/api`.

### Backend (Render / Railway / Fly / VPS)
1. Service root = `backend`, build `npm install`, start `node server.js`.
2. Add env vars from `.env.example`.
3. Use **MongoDB Atlas** for `MONGO_URI` (free tier works).
4. Set `CORS_ORIGIN` to your frontend URL.

### VPS (Ubuntu)
```bash
# Install Node, Mongo (or use Atlas), Nginx
git clone <your-repo>
cd standalone-portfolio/backend && npm i && npm run seed && pm2 start server.js
cd ../frontend && npm i && npm run build
# Serve dist/ via nginx, reverse-proxy /api to localhost:5000
```

---

## 9. Customization map

| You want to…              | Edit…                                             |
|--------------------------|---------------------------------------------------|
| Change color palette     | `frontend/tailwind.config.js` + `src/index.css`   |
| Replace hero copy        | `frontend/src/pages/sections/Hero.jsx`            |
| Add a section            | Create `pages/sections/X.jsx`, mount in `Home.jsx`|
| Add a model              | `backend/src/models/X.js` + routes/controllers    |
| Tweak animation timing   | `frontend/src/utils/animations.js`                |
| Disable cursor follower  | Remove `<CursorFollower />` from `App.jsx`        |

---

## 10. Notes & roadmap stubs

The architecture leaves clean room for the following (intentionally not bundled to keep the base small and dependency-free):
- AI chatbot widget — drop a component into `App.jsx` calling your LLM provider.
- Spotify / Discord status — add a backend route polling their public APIs and a small frontend card.
- GitHub contribution graph — fetch from GitHub GraphQL in a server route, render heatmap.
- PWA / offline — add `vite-plugin-pwa` and a manifest in `frontend/public/`.
- i18n — add `react-i18next` and a `locales/` folder.
- CI/CD — add `.github/workflows/ci.yml` running `npm run build` on both folders.

Everything here is plain JavaScript with standard tooling. Rename, refactor, replace freely — the codebase is yours.
