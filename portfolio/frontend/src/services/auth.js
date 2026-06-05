const ADMIN_EMAIL    = 'drazen90sea@gmail.com';
const ADMIN_PASSWORD = 'draxly170';

const ADMIN_USER = {
  id:    'drazen-admin',
  name:  'Drazen',
  email: ADMIN_EMAIL,
  role:  'admin',
};

function makeToken() {
  return btoa(JSON.stringify({ admin: true, exp: Date.now() + 7 * 86_400_000 }));
}

function parseToken(token) {
  try { return JSON.parse(atob(token)); } catch { return null; }
}

export const authService = {
  login({ email, password }) {
    const emailMatch    = email.trim().toLowerCase() === ADMIN_EMAIL;
    const passwordMatch = password === ADMIN_PASSWORD;

    if (!emailMatch || !passwordMatch) {
      return Promise.reject({ response: { data: { message: 'Invalid credentials.' } } });
    }

    localStorage.setItem('token', makeToken());
    return Promise.resolve({ token: localStorage.getItem('token'), user: ADMIN_USER });
  },

  me() {
    const token  = localStorage.getItem('token');
    const parsed = parseToken(token);

    if (!parsed || !parsed.admin || parsed.exp < Date.now()) {
      return Promise.reject(new Error('Not authenticated'));
    }

    return Promise.resolve({ user: ADMIN_USER });
  },

  logout() {
    return Promise.resolve({ ok: true });
  },
};
