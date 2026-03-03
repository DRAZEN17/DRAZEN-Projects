const API_BASE = "https://api.jikan.moe/v4";

// Simple in-memory cache for detailed fetches (keyed by `${type}:${id}`).
// Stores the in-flight Promise so concurrent requests share the same network call.
const detailCache = new Map();

async function fetchWithRetry(url, retries = 3, backoff = 1000) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 429 && retries > 0) {
        await new Promise((r) => setTimeout(r, backoff));
        return fetchWithRetry(url, retries - 1, backoff * 2);
      }
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, backoff));
      return fetchWithRetry(url, retries - 1, backoff * 2);
    }
    throw err;
  }
}

export async function fetchContent(view = "anime", search = "") {
  let endpoint = "";
  const params = new URLSearchParams();

  if (search) {
    endpoint = view === "anime" ? "/anime" : "/manga";
    params.append("q", search);
    if (view === "manhwa") params.append("type", "manhwa");
  } else {
    if (view === "anime") endpoint = "/top/anime";
    else if (view === "manga") endpoint = "/top/manga";
    else if (view === "manhwa") {
      endpoint = "/manga";
      params.append("order_by", "popularity");
      params.append("type", "manhwa");
    }
  }

  const url = `${API_BASE}${endpoint}?${params.toString()}`;
  const res = await fetchWithRetry(url);
  return res.data || [];
}

export async function fetchById(type = "anime", id) {
  if (!id) throw new Error("id required");
  const key = `${type}:${id}`;

  // Return cached promise/result when available
  if (detailCache.has(key)) {
    return detailCache.get(key);
  }

  const p = (async () => {
    const url = `${API_BASE}/${type}/${encodeURIComponent(id)}`;
    const res = await fetchWithRetry(url);
    return res.data || null;
  })();

  // Cache the in-flight promise so concurrent callers reuse it
  detailCache.set(key, p);

  // If the promise rejects, remove from cache so caller can retry later
  p.catch(() => detailCache.delete(key));

  return p;
}

export default { fetchContent, fetchById };
