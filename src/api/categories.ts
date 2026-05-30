import { api } from "../lib/axios";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get("/categories");
    return res.data;
  },
};
