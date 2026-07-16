const router = require('express').Router();
const pool = require('../db/pool');
const { verifyToken } = require('../middleware/auth');

// GET /direct/conversations
router.get('/conversations', verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(`
      SELECT
        other_user_id,
        other_username,
        other_avatar_url,
        last_message,
        last_message_at,
        unread_count
      FROM (
        SELECT DISTINCT ON (
          CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END
        )
          CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS other_user_id,
          u.username AS other_username,
          u.avatar_url AS other_avatar_url,
          body AS last_message,
          created_at AS last_message_at,
          (
            SELECT COUNT(*) FROM direct_messages unread
            WHERE unread.receiver_id = $1
              AND unread.sender_id = CASE WHEN dm.sender_id = $1 THEN dm.receiver_id ELSE dm.sender_id END
              AND (unread.read_at IS NULL)
          ) AS unread_count
        FROM direct_messages dm
        JOIN users u ON u.id = CASE WHEN dm.sender_id = $1 THEN dm.receiver_id ELSE dm.sender_id END
        WHERE dm.sender_id = $1 OR dm.receiver_id = $1
        ORDER BY
          CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END,
          created_at DESC
      ) sub
      ORDER BY last_message_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Conversations SQL error:', err.message);
    res.status(500).json({ error: 'Failed to fetch conversations', detail: err.message });
  }
});

// GET /direct/:otherUserId/messages
router.get('/:otherUserId/messages', verifyToken, async (req, res) => {
  const currentUserId = req.userId;
  const { otherUserId } = req.params;
  const { limit = 50 } = req.query;
  try {
    const result = await pool.query(`
      SELECT dm.id, dm.sender_id, dm.receiver_id, dm.body, dm.created_at,
             u.username, u.avatar_url
      FROM direct_messages dm
      JOIN users u ON dm.sender_id = u.id
      WHERE (dm.sender_id = $1 AND dm.receiver_id = $2)
         OR (dm.sender_id = $2 AND dm.receiver_id = $1)
      ORDER BY dm.created_at ASC
      LIMIT $3
    `, [currentUserId, otherUserId, limit]);

    // Mark as read
    try {
      await pool.query(
        `UPDATE direct_messages SET read_at = NOW()
         WHERE sender_id = $1 AND receiver_id = $2 AND read_at IS NULL`,
        [otherUserId, currentUserId]
      );
    } catch (_) {}

    res.json(result.rows);
  } catch (err) {
    console.error('Messages error:', err.message);
    res.status(500).json({ error: 'Failed to fetch messages', detail: err.message });
  }
});

// POST /direct/:otherUserId/send  
router.post('/:otherUserId/send', verifyToken, async (req, res) => {
  const senderId = req.userId;
  const { otherUserId } = req.params;
  const { body } = req.body;
  if (!body || !body.trim()) return res.status(400).json({ error: 'Body required' });
  try {
    const result = await pool.query(
      `INSERT INTO direct_messages (sender_id, receiver_id, body)
       VALUES ($1, $2, $3) RETURNING *`,
      [senderId, otherUserId, body.trim()]
    );
    const msg = result.rows[0];
    const sender = await pool.query('SELECT username, avatar_url FROM users WHERE id = $1', [senderId]);
    res.status(201).json({
      ...msg,
      username: sender.rows[0].username,
      avatar_url: sender.rows[0].avatar_url,
    });
  } catch (err) {
    console.error('Send DM error:', err.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = { directChatRouter: router };
