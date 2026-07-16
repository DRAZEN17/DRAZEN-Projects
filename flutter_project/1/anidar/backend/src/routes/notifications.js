const router = require('express').Router();
const pool = require('../db/pool');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 30',
    [req.userId]
  );
  res.json(result.rows);
});

router.put('/seen', verifyToken, async (req, res) => {
  await pool.query('UPDATE notifications SET seen = true WHERE user_id = $1 AND seen = false', [req.userId]);
  res.json({ message: 'Notifications marked as seen' });
});

module.exports = { notificationsRouter: router };