export function generateId(prefix) {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
