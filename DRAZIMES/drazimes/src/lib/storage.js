// Tiny localStorage wrapper used by CartContext and WishlistContext. Wrapped
// in try/catch since localStorage can throw in private browsing / when
// quota is exceeded — persistence is a nice-to-have, never worth crashing
// the app over.
const PREFIX = "drazimes:";

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Private browsing, quota exceeded, storage disabled — ignore.
  }
}
