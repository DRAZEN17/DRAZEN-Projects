const API_BASE = "https://graphql.anilist.co";
const detailCache = new Map();

function normalizeAnimeItem(item) {
  return {
    mal_id: item.id,
    title: item.title?.romaji || item.title?.english || 'Untitled',
    title_english: item.title?.english || item.title?.romaji || 'Untitled',
    type: item.type || 'TV',
    score: item.averageScore ? item.averageScore / 10 : 0,
    url: item.siteUrl || '#',
    status: item.status || 'Unknown',
    synopsis: item.description ? item.description.replace(/<[^>]+>/g, '') : 'No description available.',
    images: {
      webp: {
        large_image_url: item.coverImage?.extraLarge || item.coverImage?.large || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80'
      }
    },
    genres: (item.genres || []).map((name, index) => ({ mal_id: index + 1, name }))
  };
}

async function gqlRequest(query, variables = {}) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables })
  });

  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status}`);
  }

  const payload = await res.json();
  if (payload.errors && payload.errors.length) {
    throw new Error(payload.errors[0].message || 'GraphQL request failed');
  }

  return payload.data;
}

export async function fetchContent(view = 'anime', search = '') {
  const isAnime = view === 'anime';
  const query = `
    query ($search: String) {
      Page(perPage: 30) {
        media(search: $search, type: ${isAnime ? 'ANIME' : 'MANGA'}, isAdult: false, sort: POPULARITY_DESC) {
          id
          title { romaji english }
          type
          status
          description
          siteUrl
          averageScore
          coverImage { extraLarge large }
          genres
        }
      }
    }
  `;

  try {
    const trimmedSearch = search.trim();
    const data = await gqlRequest(query, { search: trimmedSearch || null });
    const items = (data?.Page?.media || []).map(normalizeAnimeItem);
    return items.slice(0, 30);
  } catch (error) {
    console.warn('AniList fetch failed, using empty fallback:', error);
    return [];
  }
}

export async function fetchById(type = 'anime', id) {
  if (!id) throw new Error('id required');
  const key = `${type}:${id}`;
  if (detailCache.has(key)) return detailCache.get(key);

  const query = `
    query ($id: Int) {
      Media(id: $id, type: ${type === 'anime' ? 'ANIME' : 'MANGA'}) {
        id
        title { romaji english }
        type
        status
        description
        siteUrl
        averageScore
        coverImage { extraLarge large }
        genres
      }
    }
  `;

  const promise = gqlRequest(query, { id: Number(id) })
    .then((data) => normalizeAnimeItem(data?.Media))
    .catch(() => null);

  detailCache.set(key, promise);
  promise.catch(() => detailCache.delete(key));
  return promise;
}

export default { fetchContent, fetchById };
