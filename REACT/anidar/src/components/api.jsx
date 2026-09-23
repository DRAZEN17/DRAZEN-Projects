const API_BASE = "https://api.jikan.moe/v4";
const detailCache = new Map();

const FALLBACK_LIBRARY = {
  anime: [
    {
      mal_id: 51009,
      title: 'Frieren: Beyond Journey\'s End',
      title_english: 'Frieren: Beyond Journey\'s End',
      type: 'TV',
      score: 9.2,
      url: 'https://myanimelist.net/anime/51009/Frieren__Beyond_Journeys_End',
      status: 'Finished Airing',
      synopsis: 'After the great heroes defeat the demon king, a mage named Frieren begins a new journey after a long adventure.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 1, name: 'Adventure' },
        { mal_id: 2, name: 'Fantasy' },
        { mal_id: 3, name: 'Drama' }
      ]
    },
    {
      mal_id: 5114,
      title: 'Fullmetal Alchemist: Brotherhood',
      title_english: 'Fullmetal Alchemist: Brotherhood',
      type: 'TV',
      score: 9.1,
      url: 'https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood',
      status: 'Finished Airing',
      synopsis: 'Two brothers search for the Philosopher\'s Stone to restore their bodies after a failed alchemical experiment.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 1, name: 'Action' },
        { mal_id: 2, name: 'Adventure' },
        { mal_id: 3, name: 'Fantasy' }
      ]
    },
    {
      mal_id: 9253,
      title: 'Steins;Gate',
      title_english: 'Steins;Gate',
      type: 'TV',
      score: 9.1,
      url: 'https://myanimelist.net/anime/9253/Steins_Gate',
      status: 'Finished Airing',
      synopsis: 'A self-proclaimed mad scientist and his friends launch a time machine and unravel a conspiracy.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 4, name: 'Sci-Fi' },
        { mal_id: 5, name: 'Thriller' },
        { mal_id: 6, name: 'Drama' }
      ]
    },
    {
      mal_id: 21,
      title: 'One Piece',
      title_english: 'One Piece',
      type: 'TV',
      score: 8.7,
      url: 'https://myanimelist.net/anime/21/One_Piece',
      status: 'Currently Airing',
      synopsis: 'Monkey D. Luffy and his crew set sail to find the One Piece treasure and become the Pirate King.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 7, name: 'Adventure' },
        { mal_id: 8, name: 'Comedy' },
        { mal_id: 9, name: 'Fantasy' }
      ]
    },
    {
      mal_id: 1575,
      title: 'Code Geass: Lelouch of the Rebellion',
      title_english: 'Code Geass',
      type: 'TV',
      score: 8.7,
      url: 'https://myanimelist.net/anime/1575/Code_Geass__Lelouch_of_the_Rebellion',
      status: 'Finished Airing',
      synopsis: 'Lelouch gains a powerful ability and wages a war against an empire with a hidden agenda.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 10, name: 'Action' },
        { mal_id: 11, name: 'Military' },
        { mal_id: 12, name: 'Drama' }
      ]
    },
    {
      mal_id: 16498,
      title: 'Attack on Titan',
      title_english: 'Attack on Titan',
      type: 'TV',
      score: 9.0,
      url: 'https://myanimelist.net/anime/16498/Shingeki_no_Kyojin',
      status: 'Finished Airing',
      synopsis: 'Humanity fights for survival as towering Titans threaten the last remnants of civilization.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 13, name: 'Action' },
        { mal_id: 14, name: 'Drama' },
        { mal_id: 15, name: 'Fantasy' }
      ]
    },
    {
      mal_id: 2904,
      title: 'Death Note',
      title_english: 'Death Note',
      type: 'TV',
      score: 8.6,
      url: 'https://myanimelist.net/anime/1535/Death_Note',
      status: 'Finished Airing',
      synopsis: 'A genius student finds a notebook that can kill anyone whose name is written in it.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 16, name: 'Mystery' },
        { mal_id: 17, name: 'Psychological' },
        { mal_id: 18, name: 'Thriller' }
      ]
    }
  ],
  manga: [
    {
      mal_id: 2,
      title: 'Berserk',
      title_english: 'Berserk',
      type: 'Manga',
      score: 9.0,
      url: 'https://myanimelist.net/manga/2/Berserk',
      status: 'Publishing',
      synopsis: 'A lone mercenary named Guts fights through a brutal, dark fantasy world shaped by fate and horror.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 19, name: 'Action' },
        { mal_id: 20, name: 'Drama' },
        { mal_id: 21, name: 'Horror' }
      ]
    },
    {
      mal_id: 11,
      title: 'Naruto',
      title_english: 'Naruto',
      type: 'Manga',
      score: 8.3,
      url: 'https://myanimelist.net/manga/11/Naruto',
      status: 'Finished',
      synopsis: 'A young ninja with a fierce dream seeks recognition while training to protect his village.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 22, name: 'Action' },
        { mal_id: 23, name: 'Adventure' },
        { mal_id: 24, name: 'Comedy' }
      ]
    },
    {
      mal_id: 1706,
      title: 'Vinland Saga',
      title_english: 'Vinland Saga',
      type: 'Manga',
      score: 8.9,
      url: 'https://myanimelist.net/manga/1706/Vinland_Saga',
      status: 'Finished',
      synopsis: 'A young warrior struggles to find meaning beyond violence in a brutal medieval world.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 25, name: 'Historical' },
        { mal_id: 26, name: 'Drama' },
        { mal_id: 27, name: 'Action' }
      ]
    },
    {
      mal_id: 19,
      title: 'Monster',
      title_english: 'Monster',
      type: 'Manga',
      score: 8.8,
      url: 'https://myanimelist.net/manga/19/Monster',
      status: 'Finished',
      synopsis: 'A gifted neurosurgeon becomes entangled in a chilling case that reaches into the heart of a city.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 28, name: 'Mystery' },
        { mal_id: 29, name: 'Drama' },
        { mal_id: 30, name: 'Psychological' }
      ]
    }
  ],
  manhwa: [
    {
      mal_id: 1001,
      title: 'Solo Leveling',
      title_english: 'Solo Leveling',
      type: 'Manhwa',
      score: 8.7,
      url: 'https://myanimelist.net/manga/1001/Solo_Leveling',
      status: 'Publishing',
      synopsis: 'A weak hunter gets a second chance after a mysterious system grants him supernatural power.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 31, name: 'Action' },
        { mal_id: 32, name: 'Fantasy' },
        { mal_id: 33, name: 'Adventure' }
      ]
    },
    {
      mal_id: 1002,
      title: 'The Beginning After the End',
      title_english: 'The Beginning After the End',
      type: 'Manhwa',
      score: 8.5,
      url: 'https://myanimelist.net/manga/1002/The_Beginning_After_the_End',
      status: 'Publishing',
      synopsis: 'A king reborn into a new world fights to protect those he loves while mastering magical power.',
      images: {
        webp: {
          large_image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'
        }
      },
      genres: [
        { mal_id: 34, name: 'Fantasy' },
        { mal_id: 35, name: 'Adventure' },
        { mal_id: 36, name: 'Drama' }
      ]
    }
  ]
};

function getFallbackItems(view = 'anime', search = '') {
  const normalizedView = view === 'manhwa' ? 'manhwa' : view === 'manga' ? 'manga' : 'anime';
  const source = FALLBACK_LIBRARY[normalizedView] || FALLBACK_LIBRARY.anime;

  if (!search) return source;

  const query = search.trim().toLowerCase();
  const matches = source.filter((item) => {
    const haystack = `${item.title} ${item.title_english || ''}`.toLowerCase();
    return haystack.includes(query);
  });

  return matches.length ? matches : source;
}

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
    console.warn('Falling back to local dataset because Jikan is unavailable:', error);

    if (view === "manhwa" && !search) {
      const fallbackUrl = `${API_BASE}/top/manga?limit=50`;
      try {
        const fallbackRes = await fetchWithRetry(fallbackUrl);
        const data = (fallbackRes.data || []).filter((item) => item.type && item.type.toLowerCase().includes("manhwa"));
        if (data.length) return data;
      } catch (fallbackError) {
        console.warn('Manhwa fallback also failed:', fallbackError);
      }
    }

    return getFallbackItems(view, search);
  }
}

export async function fetchById(type = "anime", id) {
  if (!id) throw new Error("id required");
  const key = `${type}:${id}`;

  if (detailCache.has(key)) {
    return detailCache.get(key);
  }

  const p = (async () => {
    try {
      const url = `${API_BASE}/${type}/${encodeURIComponent(id)}`;
      const res = await fetchWithRetry(url);
      return res.data || null;
    } catch (error) {
      const list = getFallbackItems(type === 'manga' ? 'manga' : 'anime', '');
      const match = list.find((item) => Number(item.mal_id) === Number(id));
      return match || null;
    }
  })();

  detailCache.set(key, p);
  p.catch(() => detailCache.delete(key));

  return p;
}

export default { fetchContent, fetchById };
