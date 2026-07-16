const router = require('express').Router();
const pool = require('../db/pool');
const { verifyToken } = require('../middleware/auth');

// GET /users/search
router.get('/search', verifyToken, async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 1) return res.json([]);
  try {
    const result = await pool.query(
      `SELECT id, username, avatar_url FROM users
       WHERE username ILIKE $1 AND id != $2
       ORDER BY username LIMIT 20`,
      [`%${q.trim()}%`, req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /users/me
router.get('/me', verifyToken, async (req, res) => {
  const result = await pool.query(
    'SELECT id, username, email, avatar_url, bio, created_at FROM users WHERE id = $1',
    [req.userId]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
  res.json(result.rows[0]);
});

// GET /users/:username
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  const result = await pool.query(
    'SELECT id, username, avatar_url, bio, created_at FROM users WHERE username = $1',
    [username]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
  res.json(result.rows[0]);
});

// PUT /users/me
router.put('/me', verifyToken, async (req, res) => {
  const { bio, avatar_url, email } = req.body;
  const updates = [];
  const values = [];
  if (bio !== undefined) { updates.push(`bio = $${updates.length + 1}`); values.push(bio); }
  if (avatar_url !== undefined) { updates.push(`avatar_url = $${updates.length + 1}`); values.push(avatar_url); }
  if (email !== undefined) { updates.push(`email = $${updates.length + 1}`); values.push(email); }
  if (updates.length === 0) return res.status(400).json({ error: 'No updates provided' });
  values.push(req.userId);
  await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length}`, values);
  const updated = await pool.query(
    'SELECT id, username, email, avatar_url, bio FROM users WHERE id = $1', [req.userId]
  );
  res.json(updated.rows[0]);
});

module.exports = { usersRouter: router };
