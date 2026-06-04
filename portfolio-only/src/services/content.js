// ─────────────────────────────────────────────────────────────────────────────
//  content.js  ·  Frontend-only content services (replaces the backend API)
// ─────────────────────────────────────────────────────────────────────────────
import { db } from './api.js';

// ── Projects ──────────────────────────────────────────────────────────────────
export const projectsService = {
  list({ limit = 50, page = 1, q } = {}) {
    let data = db.projects.all().sort((a, b) => a.order - b.order);
    if (q) data = data.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
    const total = data.length;
    data = data.slice((page - 1) * limit, page * limit);
    return Promise.resolve({ data, total, page });
  },
  get(idOrSlug) {
    const doc = db.projects.find(idOrSlug);
    if (!doc) return Promise.reject(new Error('Not found'));
    return Promise.resolve(doc);
  },
  create(data) {
    const doc = db.projects.create(data);
    return Promise.resolve(doc);
  },
  update(id, data) {
    const doc = db.projects.update(id, data);
    if (!doc) return Promise.reject(new Error('Not found'));
    return Promise.resolve(doc);
  },
  remove(id) {
    db.projects.remove(id);
    return Promise.resolve({ ok: true });
  },
};

// ── Blogs ─────────────────────────────────────────────────────────────────────
export const blogsService = {
  list({ limit = 50, page = 1 } = {}) {
    let data = db.blogs.all().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = data.length;
    data = data.slice((page - 1) * limit, page * limit);
    return Promise.resolve({ data, total, page });
  },
  get(idOrSlug) {
    const doc = db.blogs.find(idOrSlug);
    if (!doc) return Promise.reject(new Error('Not found'));
    // increment views
    db.blogs.update(doc._id, { views: (doc.views || 0) + 1 });
    return Promise.resolve(doc);
  },
  create(data) {
    const doc = db.blogs.create(data);
    return Promise.resolve(doc);
  },
  update(id, data) {
    const doc = db.blogs.update(id, data);
    if (!doc) return Promise.reject(new Error('Not found'));
    return Promise.resolve(doc);
  },
  remove(id) {
    db.blogs.remove(id);
    return Promise.resolve({ ok: true });
  },
};

// ── Testimonials ──────────────────────────────────────────────────────────────
export const testimonialsService = {
  list() {
    const data = db.testimonials.query((t) => t.approved);
    return Promise.resolve({ data });
  },
};

// ── Messages ──────────────────────────────────────────────────────────────────
export const messagesService = {
  send(data) {
    const doc = db.messages.create({ ...data, read: false });
    return Promise.resolve({ ok: true, id: doc._id });
  },
  list() {
    const data = db.messages.all().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return Promise.resolve({ data });
  },
  markRead(id) {
    const doc = db.messages.update(id, { read: true });
    return Promise.resolve(doc);
  },
  remove(id) {
    db.messages.remove(id);
    return Promise.resolve({ ok: true });
  },
};
