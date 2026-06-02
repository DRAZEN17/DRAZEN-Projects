// Minimal in-browser mock of the backend API using localStorage.
// Purpose: allow the frontend to run without the backend. Not secure for production.

const KEY_PREFIX = 'drazfolio:';
const TOKENS_KEY = KEY_PREFIX + 'tokens';

function getKey(name) { return KEY_PREFIX + name; }

function read(name) {
  return JSON.parse(localStorage.getItem(getKey(name)) || 'null') || [];
}
function write(name, v) { localStorage.setItem(getKey(name), JSON.stringify(v)); }

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

function findById(list, id) { return list.find((i) => i._id === id); }

function ensureStructure() {
  if (!localStorage.getItem(getKey('users'))) write('users', []);
  if (!localStorage.getItem(getKey('projects'))) write('projects', []);
  if (!localStorage.getItem(getKey('blogs'))) write('blogs', []);
  if (!localStorage.getItem(getKey('testimonials'))) write('testimonials', []);
  if (!localStorage.getItem(getKey('messages'))) write('messages', []);
  if (!localStorage.getItem(getKey('analytics'))) write('analytics', []);
  if (!localStorage.getItem(TOKENS_KEY)) localStorage.setItem(TOKENS_KEY, JSON.stringify({}));
}

function getTokens() { return JSON.parse(localStorage.getItem(TOKENS_KEY) || '{}'); }
function saveTokens(t) { localStorage.setItem(TOKENS_KEY, JSON.stringify(t)); }

function hash(p) { try { return btoa(String(p)); } catch { return String(p); } }

// Basic handlers for endpoints
const handlers = {
  'GET /api/health': async () => ({ ok: true, time: Date.now() }),

  // Auth
  'POST /api/auth/register': async ({ body }) => {
    const users = read('users');
    const { name, email, password } = body || {};
    if (!name || !email || !password) throw { status: 400, message: 'Missing fields' };
    if (users.find((u) => u.email === email.toLowerCase())) throw { status: 409, message: 'Email already registered' };
    const role = users.length === 0 ? 'admin' : 'user';
    const user = { _id: genId(), name, email: email.toLowerCase(), password: hash(password), role };
    users.push(user); write('users', users);
    const token = genId(); const tokens = getTokens(); tokens[token] = user._id; saveTokens(tokens);
    return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
  },

  'POST /api/auth/login': async ({ body }) => {
    const users = read('users');
    const { email, password } = body || {};
    const user = users.find((u) => u.email === (email || '').toLowerCase());
    if (!user || user.password !== hash(password)) throw { status: 401, message: 'Invalid credentials' };
    const token = genId(); const tokens = getTokens(); tokens[token] = user._id; saveTokens(tokens);
    return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
  },

  'POST /api/auth/logout': async () => ({ ok: true }),

  'GET /api/auth/me': async ({ headers }) => {
    const auth = (headers?.Authorization || headers?.authorization || '') || '';
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
    if (!token) throw { status: 401, message: 'Not authorized' };
    const tokens = getTokens(); const userId = tokens[token];
    if (!userId) throw { status: 401, message: 'Token invalid or expired' };
    const users = read('users'); const user = users.find((u) => u._id === userId);
    if (!user) throw { status: 401, message: 'User not found' };
    return { user: { id: user._id, name: user.name, email: user.email, role: user.role } };
  },

  // Generic CRUD for projects, blogs, testimonials
  'GET /api/projects': async ({ query }) => {
    const list = read('projects'); return { data: list, total: list.length, page: 1 };
  },
  'GET /api/projects/:id': async ({ params }) => {
    const list = read('projects'); const doc = findById(list, params.id) || list.find((d) => d.slug === params.id);
    if (!doc) throw { status: 404, message: 'Not found' }; return doc;
  },
  'POST /api/projects': async ({ body }) => { const list = read('projects'); const doc = { _id: genId(), ...body, createdAt: new Date().toISOString() }; list.unshift(doc); write('projects', list); return doc; },
  'PUT /api/projects/:id': async ({ params, body }) => { const list = read('projects'); const doc = findById(list, params.id); if (!doc) throw { status: 404 }; Object.assign(doc, body); write('projects', list); return doc; },
  'DELETE /api/projects/:id': async ({ params }) => { let list = read('projects'); const idx = list.findIndex((p) => p._id === params.id); if (idx === -1) throw { status: 404 }; list.splice(idx, 1); write('projects', list); return { ok: true }; },

  'GET /api/blogs': async ({ query }) => { const list = read('blogs'); return { data: list, total: list.length, page: 1 }; },
  'GET /api/blogs/:id': async ({ params }) => { const list = read('blogs'); const doc = findById(list, params.id) || list.find((d) => d.slug === params.id); if (!doc) throw { status: 404 }; return doc; },
  'POST /api/blogs': async ({ body }) => { const list = read('blogs'); const doc = { _id: genId(), ...body, createdAt: new Date().toISOString() }; list.unshift(doc); write('blogs', list); return doc; },
  'PUT /api/blogs/:id': async ({ params, body }) => { const list = read('blogs'); const doc = findById(list, params.id); if (!doc) throw { status: 404 }; Object.assign(doc, body); write('blogs', list); return doc; },
  'DELETE /api/blogs/:id': async ({ params }) => { let list = read('blogs'); const idx = list.findIndex((p) => p._id === params.id); if (idx === -1) throw { status: 404 }; list.splice(idx, 1); write('blogs', list); return { ok: true }; },

  'GET /api/testimonials': async () => ({ data: read('testimonials') }),
  'POST /api/testimonials': async ({ body }) => { const list = read('testimonials'); const doc = { _id: genId(), ...body, createdAt: new Date().toISOString() }; list.unshift(doc); write('testimonials', list); return doc; },

  // Messages (contact form)
  'POST /api/messages': async ({ body }) => {
    const { name, email, subject, message } = body || {};
    if (!name || !email || !message) throw { status: 400, message: 'Missing fields' };
    const list = read('messages'); const doc = { _id: genId(), name, email, subject, message, read: false, createdAt: new Date().toISOString() };
    list.unshift(doc); write('messages', list);
    // track analytics
    const analytics = read('analytics'); analytics.unshift({ _id: genId(), type: 'contact_submit', refId: String(doc._id), createdAt: new Date().toISOString() }); write('analytics', analytics);
    return { ok: true, id: doc._id };
  },
  'GET /api/messages': async () => ({ data: read('messages') }),
  'PATCH /api/messages/:id/read': async ({ params }) => { const list = read('messages'); const m = findById(list, params.id); if (!m) throw { status: 404 }; m.read = true; write('messages', list); return m; },
  'DELETE /api/messages/:id': async ({ params }) => { let list = read('messages'); const idx = list.findIndex((m) => m._id === params.id); if (idx === -1) throw { status: 404 }; list.splice(idx,1); write('messages', list); return { ok: true }; },

  // Analytics
  'POST /api/analytics/track': async ({ body }) => {
    const { type, path, refId, referrer } = body || {};
    const allowed = ['page_view', 'project_click', 'contact_submit', 'blog_view'];
    if (!allowed.includes(type)) throw { status: 400, message: 'Invalid type' };
    const analytics = read('analytics'); const entry = { _id: genId(), type, path: path||'', refId: refId||'', referrer: referrer||'', userAgent: navigator.userAgent, createdAt: new Date().toISOString() };
    analytics.unshift(entry); write('analytics', analytics);
    if (type === 'project_click' && refId) { const projects = read('projects'); const p = findById(projects, refId); if (p) { p.clicks = (p.clicks||0)+1; write('projects', projects); } }
    if (type === 'blog_view' && refId) { const blogs = read('blogs'); const b = findById(blogs, refId); if (b) { b.views = (b.views||0)+1; write('blogs', blogs); } }
    return { ok: true };
  },
  'GET /api/analytics/summary': async () => {
    const since = Date.now() - 30 * 86400 * 1000;
    const analytics = read('analytics');
    const recent = analytics.filter((a) => new Date(a.createdAt).getTime() >= since);
    const pageViews = recent.filter((r) => r.type === 'page_view').length;
    const projectClicks = recent.filter((r) => r.type === 'project_click').length;
    const contacts = recent.filter((r) => r.type === 'contact_submit').length;
    const blogViews = recent.filter((r) => r.type === 'blog_view').length;
    const byDay = [];
    const map = {};
    recent.forEach((r) => {
      const d = r.createdAt.slice(0,10);
      const key = `${d}:${r.type}`;
      map[key] = (map[key]||0)+1;
    });
    for (const k of Object.keys(map)) { const [d,t] = k.split(':'); byDay.push({ _id: { d, t }, n: map[k] }); }
    byDay.sort((a,b) => a._id.d.localeCompare(b._id.d));
    return { pageViews, projectClicks, contacts, blogViews, byDay };
  },

  // Upload (client-side object URL or Cloudinary unsigned could be implemented separately)
  'POST /api/upload/image': async ({ body, config }) => {
    // Expecting FormData with an `image` file
    const file = body?.get ? body.get('image') : null;
    if (!file) throw { status: 400, message: 'No file' };
    // simulate upload progress
    if (config && typeof config.onUploadProgress === 'function') {
      let loaded = 0; const total = file.size || 100000;
      const tick = () => { loaded = Math.min(loaded + total / 6, total); config.onUploadProgress({ loaded, total }); if (loaded < total) setTimeout(tick, 80); };
      tick();
    }
    const url = URL.createObjectURL(file);
    return { url, publicId: file.name };
  },
};

function parseUrl(url) {
  // normalize: accept '/api/xxx' or '/api/xxx/:id'
  const u = url.replace(/^https?:\/\/[\w.:-]+/, '');
  const parts = u.split('?')[0].split('/').filter(Boolean);
  return '/' + parts.join('/');
}

export async function handleRequest(method, url, options = {}) {
  ensureStructure();
  const parsed = parseUrl(url);
  const methodKey = `${method.toUpperCase()} ${parsed}`;
  // support paramized ids for routes like /api/projects/:id
  const paramMatch = Object.keys(handlers).find((k) => {
    if (!k.startsWith(method.toUpperCase())) return false;
    const pattern = k.replace(method.toUpperCase() + ' ', '');
    if (pattern === parsed) return true;
    // match param styles
    const pParts = pattern.split('/').filter(Boolean);
    const tParts = parsed.split('/').filter(Boolean);
    if (pParts.length !== tParts.length) return false;
    return pParts.every((pp, i) => pp.startsWith(':') || pp === tParts[i]);
  });
  const handlerKey = paramMatch || methodKey;
  const handler = handlers[handlerKey];
  if (!handler) throw { status: 404, message: 'Not found: ' + methodKey };
  // build params
  const params = {};
  if (paramMatch) {
    const pattern = paramMatch.replace(method.toUpperCase() + ' ', '');
    const pParts = pattern.split('/').filter(Boolean);
    const tParts = parsed.split('/').filter(Boolean);
    pParts.forEach((pp, i) => { if (pp.startsWith(':')) params[pp.slice(1)] = tParts[i]; });
  }
  try {
    const result = await handler({ body: options.data, query: options.params, headers: options.headers, params, config: options.config });
    return { data: result };
  } catch (err) {
    const e = err || {}; const status = e.status || 500; const message = e.message || 'Server error';
    const error = { response: { status, data: { message } } };
    throw error;
  }
}
