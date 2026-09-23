const router = require('express').Router();
const pool = require('../db/pool');
const { verifyToken } = require('../middleware/auth');

router.get('/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const result = await pool.query(`
    SELECT c.*, u.username, u.avatar_url
    FROM comments c
    JOIN users u ON c.author_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
  `, [postId]);
  res.json(result.rows);
});

router.post('/:postId/comments', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { body, parent_id } = req.body;
  const result = await pool.query(
    'INSERT INTO comments (post_id, author_id, parent_id, body) VALUES ($1,$2,$3,$4) RETURNING *',
    [postId, req.userId, parent_id || null, body]
  );
  res.status(201).json(result.rows[0]);
});

router.post('/:id/vote', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query('SELECT * FROM comment_votes WHERE user_id = $1 AND comment_id = $2', [req.userId, id]);
    if (existing.rows.length > 0) {
      await client.query('UPDATE comment_votes SET value = $1 WHERE user_id = $2 AND comment_id = $3', [value, req.userId, id]);
    } else {
      await client.query('INSERT INTO comment_votes (user_id, comment_id, value) VALUES ($1,$2,$3)', [req.userId, id, value]);
    }
    await client.query('UPDATE comments SET score = (SELECT COALESCE(SUM(value),0) FROM comment_votes WHERE comment_id = $1) WHERE id = $1', [id]);
    await client.query('COMMIT');
    res.json({ message: 'Vote recorded' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Vote failed' });
  } finally {
    client.release();
  }
});

module.exports = { commentsRouter: router };