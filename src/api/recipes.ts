import { api } from "../lib/axios";

export interface CreateRecipePayload {
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  categoryId?: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    order: number;
  }[];
  steps: {
    order: number;
    instruction: string;
  }[];
  tags?: string[];
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  status: string;
  averageRating: number;
  ratingCount: number;
  viewCount: number;
  tags: string[];
  ingredients: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    order: number;
  }[];
  steps: { order: number; instruction: string }[];
  author: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: string;
}

export const recipesApi = {
  getAll: async (params?: {
    search?: string;
    categoryId?: string;
    difficulty?: string;
    authorId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }): Promise<{
    data: Recipe[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const res = await api.get("/recipes", { params });
    return res.data;
  },

  getOne: async (id: string): Promise<Recipe> => {
    const res = await api.get(`/recipes/${id}`);
    return res.data;
  },

  create: async (payload: CreateRecipePayload): Promise<Recipe> => {
    const res = await api.post("/recipes", payload);
    return res.data;
  },

  uploadCoverImage: async (id: string, file: File): Promise<Recipe> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post(`/recipes/${id}/cover-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  publish: async (id: string): Promise<Recipe> => {
    const res = await api.patch(`/recipes/${id}/publish`);
    return res.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateRecipePayload>,
  ): Promise<Recipe> => {
    const res = await api.patch(`/recipes/${id}`, payload);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/recipes/${id}`);
  },
};
