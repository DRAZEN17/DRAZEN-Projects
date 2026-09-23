const router = require('express').Router();
const pool = require('../db/pool');
const { verifyToken } = require('../middleware/auth');

const GENERAL_SLUGS = ['general'];

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM nests ORDER BY member_count DESC LIMIT 20');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nests' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { name, description } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  try {
    const result = await pool.query(
      'INSERT INTO nests (slug, name, description, creator_id) VALUES ($1,$2,$3,$4) RETURNING *',
      [slug, name, description, req.userId]
    );
    const nest = result.rows[0];
    await pool.query(
      'INSERT INTO nest_members (user_id, nest_id, role) VALUES ($1,$2,$3)',
      [req.userId, nest.id, 'admin']
    );
    res.status(201).json(nest);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Nest slug already exists' });
    res.status(500).json({ error: 'Failed to create nest' });
  }
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query('SELECT * FROM nests WHERE slug = $1', [slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Nest not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nest' });
  }
});

// GET /nests/:slug/posts 
router.get('/:slug/posts', async (req, res) => {
  const { slug } = req.params;
  const { sort = 'hot' } = req.query;

  let orderClause;
  if (sort === 'new') orderClause = 'ORDER BY p.created_at DESC';
  else if (sort === 'top') orderClause = 'ORDER BY p.score DESC';
  else orderClause = 'ORDER BY (p.score - EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600) DESC';

  try {
    let result;
    if (GENERAL_SLUGS.includes(slug)) {
      // General = all posts from every nest
      result = await pool.query(`
        SELECT p.*, u.username AS author_username, u.avatar_url,
          n.slug AS nest_slug, n.name AS nest_name,
          (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
        FROM posts p
        JOIN users u ON p.author_id = u.id
        JOIN nests n ON p.nest_id = n.id
        ${orderClause}
        LIMIT 100
      `);
    } else {
      const nest = await pool.query('SELECT id FROM nests WHERE slug = $1', [slug]);
      if (nest.rows.length === 0) return res.status(404).json({ error: 'Nest not found' });
      result = await pool.query(`
        SELECT p.*, u.username AS author_username, u.avatar_url,
          n.slug AS nest_slug, n.name AS nest_name,
          (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
        FROM posts p
        JOIN users u ON p.author_id = u.id
        JOIN nests n ON p.nest_id = n.id
        WHERE p.nest_id = $1
        ${orderClause}
        LIMIT 50
      `, [nest.rows[0].id]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Nest posts error:', err.message);
    res.status(500).json({ error: 'Failed to fetch posts', detail: err.message });
  }
});

// POST /nests/:slug/posts
router.post('/:slug/posts', verifyToken, async (req, res) => {
  const { slug } = req.params;
  const { title, body, type = 'text', url } = req.body;
  try {
    const nest = await pool.query('SELECT id FROM nests WHERE slug = $1', [slug]);
    if (nest.rows.length === 0) return res.status(404).json({ error: 'Nest not found' });
    const result = await pool.query(
      'INSERT INTO posts (nest_id, author_id, title, body, type, url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [nest.rows[0].id, req.userId, title, body, type, url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.post('/:slug/join', verifyToken, async (req, res) => {
  const { slug } = req.params;
  try {
    const nest = await pool.query('SELECT id FROM nests WHERE slug = $1', [slug]);
    if (nest.rows.length === 0) return res.status(404).json({ error: 'Nest not found' });
    const nestId = nest.rows[0].id;
    await pool.query(
      'INSERT INTO nest_members (user_id, nest_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [req.userId, nestId]
    );
    await pool.query(
      'UPDATE nests SET member_count = (SELECT COUNT(*) FROM nest_members WHERE nest_id = $1) WHERE id = $1',
      [nestId]
    );
    res.json({ message: 'Joined nest' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join nest' });
  }
});

router.delete('/:slug/join', verifyToken, async (req, res) => {
  const { slug } = req.params;
  try {
    const nest = await pool.query('SELECT id FROM nests WHERE slug = $1', [slug]);
    if (nest.rows.length === 0) return res.status(404).json({ error: 'Nest not found' });
    const nestId = nest.rows[0].id;
    await pool.query('DELETE FROM nest_members WHERE user_id = $1 AND nest_id = $2', [req.userId, nestId]);
    await pool.query(
      'UPDATE nests SET member_count = (SELECT COUNT(*) FROM nest_members WHERE nest_id = $1) WHERE id = $1',
      [nestId]
    );
    res.json({ message: 'Left nest' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to leave nest' });
  }
});

module.exports = { nestsRouter: router };
