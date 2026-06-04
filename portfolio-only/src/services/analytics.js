// ─────────────────────────────────────────────────────────────────────────────
//  analytics.js  ·  Frontend-only analytics (localStorage-backed)
// ─────────────────────────────────────────────────────────────────────────────
import { db } from './api.js';

function track(type, extra = {}) {
  try {
    db.analytics.create({ type, ...extra, userAgent: navigator.userAgent });
  } catch { /* ignore */ }
  return Promise.resolve({ ok: true });
}

export const trackPageView   = (path)  => track('page_view',    { path, referrer: document.referrer });
export const trackProjectClick = (refId) => {
  // also increment the project's click counter
  try {
    const p = db.projects.find(refId);
    if (p) db.projects.update(p._id, { clicks: (p.clicks || 0) + 1 });
  } catch {}
  return track('project_click', { refId });
};
export const trackBlogView   = (refId) => track('blog_view',    { refId });

export const fetchAnalyticsSummary = () => {
  const since = new Date(Date.now() - 30 * 86400 * 1000);
  const all   = db.analytics.all().filter((a) => new Date(a.createdAt) >= since);

  const count = (type) => all.filter((a) => a.type === type).length;

  // Group by date + type
  const map = {};
  for (const a of all) {
    const d = a.createdAt.slice(0, 10);
    map[d] ??= { day: d };
    map[d][a.type] = (map[d][a.type] || 0) + 1;
  }
  const byDay = Object.values(map).sort((a, b) => a.day.localeCompare(b.day));

  return Promise.resolve({
    pageViews:     count('page_view'),
    projectClicks: count('project_click'),
    blogViews:     count('blog_view'),
    contacts:      count('contact_submit'),
    byDay,
  });
};
