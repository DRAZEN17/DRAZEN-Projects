const pool = require('../db/pool');
const { verifyAccessToken } = require('../utils/jwt');

const initializeChat = (io) => {
  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = verifyAccessToken(token);
      socket.userId = String(decoded.sub); 
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User ${socket.userId} connected`);

    // ── Nest group chat ───
    socket.on('join_room', (nestId) => {
      socket.join(`nest_${nestId}`);
    });

    socket.on('leave_room', (nestId) => {
      socket.leave(`nest_${nestId}`);
    });

    socket.on('send_message', async ({ nestId, body }) => {
      if (!body || !body.trim()) return;
      try {
        const result = await pool.query(
          'INSERT INTO chat_messages (nest_id, sender_id, body) VALUES ($1,$2,$3) RETURNING *',
          [nestId, socket.userId, body.trim()]
        );
        const sender = await pool.query(
          'SELECT username, avatar_url FROM users WHERE id = $1', [socket.userId]);
        io.to(`nest_${nestId}`).emit('new_message', {
          ...result.rows[0],
          username: sender.rows[0].username,
          avatar_url: sender.rows[0].avatar_url,
        });
      } catch (err) {
        console.error('[Socket] send_message error:', err.message);
      }
    });

    // ── Direct messaging ──
    socket.on('join_dm', (otherUserId) => {
      // Sort IDs so both sides get the same room name
      const room = [String(socket.userId), String(otherUserId)].sort().join('-');
      socket.join(room);
      console.log(`[Socket] User ${socket.userId} joined DM room: ${room}`);
    });

    socket.on('send_dm', async ({ to, body }) => {
      if (!body || !body.trim()) return;
      const room = [String(socket.userId), String(to)].sort().join('-');
      try {
        const result = await pool.query(
          'INSERT INTO direct_messages (sender_id, receiver_id, body) VALUES ($1,$2,$3) RETURNING *',
          [socket.userId, to, body.trim()]
        );
        const sender = await pool.query(
          'SELECT username, avatar_url FROM users WHERE id = $1', [socket.userId]);

        const msg = {
          ...result.rows[0],
          username: sender.rows[0].username,
          avatar_url: sender.rows[0].avatar_url,
        };

      
        io.to(room).emit('new_dm', msg);
        console.log(`[Socket] DM sent in room ${room}:`, msg.body);
      } catch (err) {
        console.error('[Socket] send_dm error:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User ${socket.userId} disconnected`);
    });
  });
};

module.exports = { initializeChat };
