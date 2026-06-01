import { api } from "../lib/axios";
import { mapRecipe, type Recipe } from "./recipes";

export interface Bookmark {
  id: string;
  recipe: Recipe;
  createdAt: string;
}

export const bookmarksApi = {
  getAll: async (): Promise<Bookmark[]> => {
    const res = await api.get("/bookmarks/me");
    const raw = (res.data?.data ?? res.data) as Bookmark[];
    return raw.map((b) => ({ ...b, recipe: mapRecipe(b.recipe) }));
  },

  getIds: async (): Promise<string[]> => {
    const res = await api.get("/bookmarks/me/ids");
    return (res.data?.data ?? res.data) as string[];
  },

  add: async (recipeId: string): Promise<Bookmark> => {
    const res = await api.post(`/bookmarks/${recipeId}`);
    return (res.data?.data ?? res.data) as Bookmark;
  },

  remove: async (recipeId: string): Promise<void> => {
    await api.delete(`/bookmarks/${recipeId}`);
  },

  check: async (recipeId: string): Promise<boolean> => {
    const res = await api.get(`/bookmarks/${recipeId}/check`);
    return res.data?.data ?? res.data;
  },
};
