const router = require('express').Router();
const pool = require('../db/pool');

// GET /feed?sort=hot|new|top 
router.get('/', async (req, res) => {
  const { sort = 'new' } = req.query;

  let orderClause;
  if (sort === 'new') orderClause = 'ORDER BY p.created_at DESC';
  else if (sort === 'top') orderClause = 'ORDER BY p.score DESC';
  else orderClause = 'ORDER BY (p.score - EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600) DESC';

  try {
    const result = await pool.query(`
      SELECT
        p.*,
        u.username   AS author_username,
        u.avatar_url,
        n.slug       AS nest_slug,
        n.name       AS nest_name,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
      FROM posts p
      JOIN users u ON p.author_id = u.id
      JOIN nests n ON p.nest_id   = n.id
      ${orderClause}
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Feed error:', err.message);
    res.status(500).json({ error: 'Failed to fetch feed', detail: err.message });
  }
});

module.exports = { feedRouter: router };
