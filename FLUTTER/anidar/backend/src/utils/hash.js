const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  return bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };