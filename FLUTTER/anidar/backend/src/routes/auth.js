const router = require('express').Router();
const crypto = require('crypto');
const pool = require('../db/pool');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');


const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// POST /auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'Username, email and password are required' });
  try {
    const password_hash = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1,$2,$3) RETURNING id, username, email, avatar_url, bio, created_at',
      [username.trim(), email.trim().toLowerCase(), password_hash]
    );
    const user = result.rows[0];

    // Auto-login
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1,$2,$3)',
      [user.id, tokenHash, expiresAt]
    );
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      accessToken,
      user: { id: user.id, username: user.username, email: user.email, avatar_url: user.avatar_url, bio: user.bio },
    });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Username or email already taken' });
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });
    const user = result.rows[0];
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1,$2,$3)',
      [user.id, tokenHash, expiresAt]
    );
    setRefreshCookie(res, refreshToken);

    res.json({
      accessToken,
      user: { id: user.id, username: user.username, email: user.email, avatar_url: user.avatar_url, bio: user.bio },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /auth/refresh
router.post('/refresh', async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ error: 'Refresh token missing' });
  try {
    const decoded = verifyRefreshToken(token);
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const result = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token_hash = $1 AND expires_at > NOW() AND revoked = false',
      [tokenHash]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid refresh token' });
    const newAccessToken = signAccessToken(decoded.sub);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// POST /auth/logout
router.post('/logout', async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await pool.query('UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1', [tokenHash]).catch(() => {});
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

module.exports = { authRouter: router };
