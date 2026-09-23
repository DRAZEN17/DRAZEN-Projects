const router = require('express').Router();
const pool = require('../db/pool');
const { verifyToken } = require('../middleware/auth');

// Nest slugs that are "general" — show all posts
const GENERAL_SLUGS = ['general'];

router.get('/:slug/posts', async (req, res) => {
  const { slug } = req.params;
  const { sort = 'hot' } = req.query;

  let orderClause;
  if (sort === 'new') orderClause = 'ORDER BY p.created_at DESC';
  else if (sort === 'top') orderClause = 'ORDER BY p.score DESC';
  else orderClause = 'ORDER BY (p.score - EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600) DESC';

  try {
    let result;
    if (GENERAL_SLUGS.includes(slug)) {
      // General
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
      // Specific nest
      const nest = await pool.query('SELECT id FROM nests WHERE slug = $1', [slug]);
      if (nest.rows.length === 0) return res.status(404).json({ error: 'Nest not found' });
      const nestId = nest.rows[0].id;
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
      `, [nestId]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Posts error:', err.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/:slug/posts', verifyToken, async (req, res) => {
  const { slug } = req.params;
  const { title, body, type = 'text', url } = req.body;
  const nest = await pool.query('SELECT id FROM nests WHERE slug = $1', [slug]);
  if (nest.rows.length === 0) return res.status(404).json({ error: 'Nest not found' });
  const nestId = nest.rows[0].id;
  const result = await pool.query(
    'INSERT INTO posts (nest_id, author_id, title, body, type, url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [nestId, req.userId, title, body, type, url]
  );
  res.status(201).json(result.rows[0]);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`
    SELECT p.*, u.username AS author_username, u.avatar_url
    FROM posts p JOIN users u ON p.author_id = u.id
    WHERE p.id = $1
  `, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Post not found' });
  res.json(result.rows[0]);
});

router.post('/:id/vote', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(
      'SELECT * FROM votes WHERE user_id = $1 AND post_id = $2', [req.userId, id]);
    if (existing.rows.length > 0) {
      const prev = existing.rows[0].value;
      if (prev === value) {
        await client.query('DELETE FROM votes WHERE user_id = $1 AND post_id = $2', [req.userId, id]);
        await client.query('UPDATE posts SET score = score - $1 WHERE id = $2', [value, id]);
      } else {
        await client.query('UPDATE votes SET value = $1 WHERE user_id = $2 AND post_id = $3', [value, req.userId, id]);
        await client.query('UPDATE posts SET score = score + $1 WHERE id = $2', [value * 2, id]);
      }
    } else {
      await client.query('INSERT INTO votes (user_id, post_id, value) VALUES ($1,$2,$3)', [req.userId, id, value]);
      await client.query('UPDATE posts SET score = score + $1 WHERE id = $2', [value, id]);
    }
    await client.query('COMMIT');
    const post = await pool.query('SELECT score FROM posts WHERE id = $1', [id]);
    res.json({ score: post.rows[0].score });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Vote failed' });
  } finally {
    client.release();
  }
});

module.exports = { postsRouter: router };
