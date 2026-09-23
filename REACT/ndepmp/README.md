# NDEPMP

An independent property + electricity registry for Nigeria.


**Stack:** React (Vite SPA), React Router, Tailwind CSS, GSAP, React Hook Form,
Leaflet/OpenStreetMap, qrcode.react.

## Running it
```bash
cd frontend
npm install
npm run dev
```
Visit http://localhost:5173.

## Trying it out
- **Sign up** with any email, or use the demo buttons on the login page for
  instant Admin or Field Agent access.
- Verification and reset codes are shown on-screen ("Demo mode") since
  there's no real backend to email them.
- Register a property (with a real map picker) → an admin approves or
  rejects it → link a meter → pay the auto-generated bill → file a
  complaint or support ticket → watch notifications land as it all happens.
- The floating chat bubble (bottom-right) is a scripted demo bot.
- Log in as the demo Admin to reach **System** pages: manage states, utility
  companies, tariffs (these feed the public Tariffs page and the
  registration/meter forms live), staff, role permissions, and a running
  audit log of every action taken.
- Toggle **Maintenance mode** in Admin → Settings for a real site-wide
  banner; toggle off **Allow registrations** to see signup itself disable.
- All data lives in your browser's `localStorage` under `ndepmp-mock-db` —
  clear it (or use an incognito window) to reset the demo.

## Structure
```
frontend/src/
├── lib/mockBackend.jsx   the mock "backend" — auth, data, every action
├── components/           shared UI, layout, map, auth guard
├── pages/                one file per route, incl. admin/, agent/, auth/
└── data/                 Nigeria states, DISCOs, tariff bands, seed content
```
