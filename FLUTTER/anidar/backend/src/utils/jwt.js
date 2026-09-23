const jwt = require('jsonwebtoken');

const signAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const signRefreshToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };