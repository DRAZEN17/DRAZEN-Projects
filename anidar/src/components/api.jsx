const API_BASE = "https://api.jikan.moe/v4";
const detailCache = new Map();

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const retriable = [429, 500, 502, 503, 504].includes(res.status);
        if (!retriable || i === retries - 1) {
          throw new Error(`HTTP ${res.status}`);
        }
        await new Promise((r) => setTimeout(r, delay * (i + 1)));
        continue;
      }
      return res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay * (i + 1)));
    }
  }
}

export async function fetchContent(view = "anime", search = "") {
  let endpoint = "";
  const params = new URLSearchParams();

  if (search) {
    endpoint = view === "anime" ? "/anime" : "/manga";
    params.append("q", search);
    if (view === "manhwa") params.append("type", "manhwa");
    params.append("limit", "24");
  } else {
    if (view === "anime") endpoint = "/top/anime";
    else if (view === "manga") endpoint = "/top/manga";
    else if (view === "manhwa") {
      endpoint = "/manga";
      params.append("order_by", "popularity");
      params.append("type", "manhwa");
      params.append("limit", "24");
    }
  }

  const query = params.toString();
  const url = `${API_BASE}${endpoint}${query ? `?${query}` : ''}`;

  try {
    const res = await fetchWithRetry(url);
    return res.data || [];
  } catch (error) {
    if (view === "manhwa" && !search) {
      const fallbackUrl = `${API_BASE}/top/manga?limit=50`;
      try {
        const fallbackRes = await fetchWithRetry(fallbackUrl);
        return (fallbackRes.data || []).filter((item) => item.type && item.type.toLowerCase().includes("manhwa"));
      } catch (fallbackError) {
        console.warn("Manhwa fallback also failed:", fallbackError);
      }
    }
    throw error;
  }
}

export async function fetchById(type = "anime", id) {
  if (!id) throw new Error("id required");
  const key = `${type}:${id}`;

  if (detailCache.has(key)) {
    return detailCache.get(key);
  }

  const p = (async () => {
    const url = `${API_BASE}/${type}/${encodeURIComponent(id)}`;
    const res = await fetchWithRetry(url);
    return res.data || null;
  })();


  detailCache.set(key, p);


  p.catch(() => detailCache.delete(key));

  return p;
}

export default { fetchContent, fetchById };
