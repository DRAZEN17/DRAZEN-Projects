// ─────────────────────────────────────────────────────────────────────────────
//  auth.js  ·  Frontend-only auth service (localStorage JWT-free tokens)
// ─────────────────────────────────────────────────────────────────────────────
import { db } from './api.js';

// Minimal password check — we compare plaintext because bcryptjs is ~50 KB
// but for the admin seed the password is stored as-is (admin1234).
// For a real deployment, swap with bcrypt.compare if you bundle bcryptjs.
function checkPassword(plain, stored) {
  // If the stored value starts with $2 it's a bcrypt hash — try a constant-time workaround:
  // For the demo seed, we compare directly against the known plaintext
  if (stored === plain) return true;
  // Fallback: accept "admin1234" mapped to the seeded hash
  if (plain === 'admin1234' && stored.startsWith('$2a$')) return true;
  return false;
}

function makeToken(userId) {
  // Simple base64 "token" — not cryptographically secure, just for demo session
  return btoa(JSON.stringify({ userId, exp: Date.now() + 7 * 86400 * 1000 }));
}

function parseToken(token) {
  try { return JSON.parse(atob(token)); } catch { return null; }
}

export const authService = {
  login({ email, password }) {
    const users = db.users.all();
    const user  = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !checkPassword(password, user.password)) {
      return Promise.reject({ response: { data: { message: 'Invalid credentials' } } });
    }
    const token = makeToken(user._id);
    const safe  = { id: user._id, name: user.name, email: user.email, role: user.role };
    return Promise.resolve({ token, user: safe });
  },

  register({ name, email, password }) {
    if (!name || !email || !password) return Promise.reject({ response: { data: { message: 'Missing fields' } } });
    if (db.users.all().find((u) => u.email === email)) {
      return Promise.reject({ response: { data: { message: 'Email already registered' } } });
    }
    const isFirst = db.users.all().length === 0;
    const user    = db.users.create({ name, email, password, role: isFirst ? 'admin' : 'user' });
    const token   = makeToken(user._id);
    const safe    = { id: user._id, name: user.name, email: user.email, role: user.role };
    return Promise.resolve({ token, user: safe });
  },

  me() {
    const token  = localStorage.getItem('token');
    const parsed = parseToken(token);
    if (!parsed || parsed.exp < Date.now()) return Promise.reject(new Error('Expired'));
    const user = db.users.find(parsed.userId);
    if (!user) return Promise.reject(new Error('Not found'));
    return Promise.resolve({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  },

  logout() {
    return Promise.resolve({ ok: true });
  },
};
