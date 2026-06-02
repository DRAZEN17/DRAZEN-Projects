Migration notes — converting project to frontend-only

Overview
 - Backend removed. The frontend now includes an in-browser mock API (localStorage) so the app can run without a server.

Uploads
 - For persistent image hosting use Cloudinary unsigned uploads.
 - Configure these env vars in `frontend/.env`:
   - `VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/<cloud_name>/upload`
   - `VITE_CLOUDINARY_UPLOAD_PRESET=<unsigned_preset>`
 - If not configured, uploads fall back to an in-browser mock storing object URLs (session-only).

Auth
 - The app currently uses a local mock auth stored in `localStorage` (first registered user becomes admin).
 - For production, enable Firebase Auth or Auth0. See `frontend/README` for integration steps. The codebase includes optional hooks but you must provide credentials and install the SDK.

Analytics
 - The app will send events to `window.gtag` if available (Google Analytics). It also stores analytics in localStorage as a fallback.

How to enable Cloudinary unsigned uploads
 1. Create an upload preset in Cloudinary and set it to "unsigned".
 2. Add the two env vars listed above to `frontend/.env`.
 3. Restart the dev server.

How to enable Firebase Auth (outline)
 1. Create a Firebase project and enable Email/Password sign-in.
 2. In `frontend/.env` add your Firebase config prefixed with `VITE_FIREBASE_` (see Firebase docs).
 3. Install Firebase SDK in `frontend`: `npm install firebase`.
 4. Update the auth service to use Firebase tokens (the codebase includes a starting point; you may need to adapt admin role mapping).

Concrete env vars required (add to `frontend/.env`):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET` (optional)
- `VITE_FIREBASE_MESSAGING_SENDER_ID` (optional)
- `VITE_FIREBASE_APP_ID` (optional)

After adding the env vars, install the Firebase SDK and restart the dev server:

```powershell
cd C:\Users\Dazen17\Documents\projectreact\drazfolio\frontend
npm install firebase
npm run dev
```

Behavior notes:
- When Firebase is enabled, the frontend will use Firebase for register/login and store the returned Firebase ID token in `localStorage` as `token` for compatibility with existing API headers used by other services.
- The mock admin behavior (first registered user becomes admin) remains in place unless you add server-side role mapping or a Cloud Function.

Admin role mapping (Firestore)
- When Firebase is enabled, the frontend will create a Firestore collection `admins` and will automatically grant admin to the first registered Firebase user.
- To grant additional admins, call the `grantAdminByUid(uid, email)` function exported by `src/services/firebase.js` (or use `authService.grantAdmin(uid, email)`).
- The app determines admin status by checking for a document at `admins/{uid}`. This is a simple mapping approach suitable for small teams.

Example: in the browser console (as an existing admin) you can run:

```js
import { authService } from './src/services/auth.js';
await authService.grantAdmin('<uid_of_user>', 'their@example.com');
```

Restart the app after changes to env vars.


Notes
 - This frontend-only approach is for demos and lightweight deployments. It is not a secure replacement for a backend when you need server-side data validation, secure file storage, or protected APIs.

How to run locally (smoke test)

1. Open a terminal and run these commands from the project root:

```powershell
cd c:\Users\Dazen17\Documents\projectreact\drazfolio\frontend
npm install
npm run dev
```

2. Vite will start and report a local URL (e.g. `http://localhost:5173/` or `http://localhost:5174/`). Open that URL in your browser.

Quick verification checklist
- Visit the public site pages (Home, Projects, Blog) and confirm content loads.
- Open Admin > Projects. Try creating a project with an image: drag & drop or pick a file. If `VITE_CLOUDINARY_URL` and `VITE_CLOUDINARY_UPLOAD_PRESET` are set, the image will upload to Cloudinary; otherwise it will use an in-browser mock and show a preview using an object URL.
- Send a message via Contact form and check Admin > Messages shows it (stored in localStorage in mock mode).
- Register/login in Admin to create an admin user. The first registered user becomes admin in mock mode.

Notes about the dev server
- If port 5173 is in use Vite will choose the next available port (e.g. 5174). Use the Local URL from the terminal output.

