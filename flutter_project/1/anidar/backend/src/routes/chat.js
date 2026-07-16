const router = require('express').Router();
const pool = require('../db/pool');
const { verifyToken } = require('../middleware/auth');

router.get('/:nestId/messages', verifyToken, async (req, res) => {
  const { nestId } = req.params;
  const { before, limit = 50 } = req.query;
  let query = 'SELECT cm.*, u.username, u.avatar_url FROM chat_messages cm JOIN users u ON cm.sender_id = u.id WHERE cm.nest_id = $1';
  const params = [nestId];
  if (before) {
    query += ' AND cm.created_at < $2';
    params.push(before);
  }
  query += ' ORDER BY cm.created_at DESC LIMIT $' + (params.length + 1);
  params.push(limit);
  const result = await pool.query(query, params);
  res.json(result.rows.reverse());
});

module.exports = { chatRouter: router };