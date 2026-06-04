// ─────────────────────────────────────────────────────────────────────────────
//  api.js  ·  Frontend-only "API" layer using localStorage as the database
// ─────────────────────────────────────────────────────────────────────────────
//  All data is persisted in localStorage under namespaced keys.
//  IDs are random hex strings.  Timestamps are ISO strings.

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function now() {
  return new Date().toISOString();
}

// ── Generic localStorage collection ──────────────────────────────────────────
function collection(key) {
  const read = () => JSON.parse(localStorage.getItem(key) || '[]');
  const write = (arr) => localStorage.setItem(key, JSON.stringify(arr));

  return {
    all() { return read(); },
    find(id) { return read().find((d) => d._id === id || d.slug === id); },
    query(fn) { return read().filter(fn); },
    create(data) {
      const doc = { _id: uid(), createdAt: now(), updatedAt: now(), ...data };
      const arr = read();
      arr.push(doc);
      write(arr);
      return doc;
    },
    update(id, data) {
      const arr = read();
      const idx = arr.findIndex((d) => d._id === id);
      if (idx === -1) return null;
      arr[idx] = { ...arr[idx], ...data, updatedAt: now() };
      write(arr);
      return arr[idx];
    },
    remove(id) {
      const arr = read().filter((d) => d._id !== id);
      write(arr);
      return true;
    },
    seed(docs) {
      if (read().length === 0) write(docs.map((d) => ({ _id: uid(), createdAt: now(), updatedAt: now(), ...d })));
    },
  };
}

export const db = {
  projects:     collection('db_projects'),
  blogs:        collection('db_blogs'),
  testimonials: collection('db_testimonials'),
  messages:     collection('db_messages'),
  users:        collection('db_users'),
  analytics:    collection('db_analytics'),
};
