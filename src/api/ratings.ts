import { api } from "../lib/axios";

export interface Rating {
  id: string;
  score: number;
}

export const ratingsApi = {
  rate: async (recipeId: string, score: number): Promise<Rating> => {
    const res = await api.post(`/recipes/${recipeId}/ratings`, { score });
    return (res.data?.data ?? res.data) as Rating;
  },

  getMyRating: async (recipeId: string): Promise<Rating | null> => {
    try {
      const res = await api.get(`/recipes/${recipeId}/ratings/me`);
      return (res.data?.data ?? res.data) as Rating;
    } catch {
      return null;
    }
  },
};
