require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { authRouter } = require('./routes/auth');
const { nestsRouter } = require('./routes/nests');
const { postsRouter } = require('./routes/posts');
const { commentsRouter } = require('./routes/comments');
const { chatRouter } = require('./routes/chat');
const { usersRouter } = require('./routes/users');
const { feedRouter } = require('./routes/feed');
const { notificationsRouter } = require('./routes/notifications');
const { initializeChat } = require('./socket/chatHandler');
const { directChatRouter } = require('./routes/directChat');

const app = express();
const server = http.createServer(app);

// --- Temporarily allow all origins for local development ---
app.use(cors({
  origin: (origin, callback) => callback(null, true),   // allow all
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Routes
app.use('/auth', authRouter);
app.use('/nests', nestsRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/chat', chatRouter);
app.use('/users', usersRouter);
app.use('/feed', feedRouter);
app.use('/notifications', notificationsRouter);
app.use('/direct', directChatRouter);

// --- Socket.IO with the same permissive CORS ---
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST'],
    credentials: true
  }
});

initializeChat(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Anidar API running on port ${PORT}`);
});