import Analytics from '../models/Analytics.js';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';

export const track = async (req, res) => {
  const { type, path, refId, referrer } = req.body;
  if (!['page_view', 'project_click', 'contact_submit', 'blog_view'].includes(type)) {
    return res.status(400).json({ message: 'Invalid type' });
  }
  await Analytics.create({
    type, path, refId, referrer,
    userAgent: req.headers['user-agent'],
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
  });
  if (type === 'project_click' && refId) await Project.findByIdAndUpdate(refId, { $inc: { clicks: 1 } });
  if (type === 'blog_view' && refId) await Blog.findByIdAndUpdate(refId, { $inc: { views: 1 } });
  res.json({ ok: true });
};

export const summary = async (_req, res) => {
  const since = new Date(Date.now() - 30 * 86400 * 1000);
  const [pageViews, projectClicks, contacts, blogViews, byDay] = await Promise.all([
    Analytics.countDocuments({ type: 'page_view', createdAt: { $gte: since } }),
    Analytics.countDocuments({ type: 'project_click', createdAt: { $gte: since } }),
    Analytics.countDocuments({ type: 'contact_submit', createdAt: { $gte: since } }),
    Analytics.countDocuments({ type: 'blog_view', createdAt: { $gte: since } }),
    Analytics.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { d: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, t: '$type' },
          n: { $sum: 1 },
        },
      },
      { $sort: { '_id.d': 1 } },
    ]),
  ]);
  res.json({ pageViews, projectClicks, contacts, blogViews, byDay });
};
