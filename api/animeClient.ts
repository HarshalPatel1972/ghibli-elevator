import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

// Jikan API Client
// Note: Jikan has a rate limit (approx 3 requests per second).
// For a production app, we would cache this aggressively.

const client = axios.create({
  baseURL: BASE_URL,
});

export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
    webp: {
        image_url: string;
        large_image_url: string;
    }
  };
  score: number;
  synopsis: string;
  year: number;
  genres: { name: string }[];
}

export const animeClient = {
  // Floor 1: Trending (Currently Airing)
  getTrending: async (): Promise<Anime[]> => {
    try {
      const response = await client.get('/seasons/now?sfw&limit=24');
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch trending anime", error);
      return [];
    }
  },

  // Floor 2: Top Rated
  getTopRated: async (): Promise<Anime[]> => {
    try {
      const response = await client.get('/top/anime?filter=bypopularity&sfw&limit=24');
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch top anime", error);
      return [];
    }
  },

  // Floor 3: Movies
  getMovies: async (): Promise<Anime[]> => {
    try {
      const response = await client.get('/top/anime?type=movie&sfw&limit=24');
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch movies", error);
      return [];
    }
  },

  search: async (query: string): Promise<Anime[]> => {
    try {
        const response = await client.get(`/anime?q=${query}&sfw&limit=24`);
        return response.data.data;
    } catch(error) {
        console.error("Search failed", error);
        return [];
    }
  },

  getAnimeById: async (id: string): Promise<Anime | null> => {
    try {
      const response = await client.get(`/anime/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch anime ${id}`, error);
      return null;
    }
  }
};
