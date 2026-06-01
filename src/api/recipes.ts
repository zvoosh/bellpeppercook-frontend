import { api } from "../lib/axios";

export interface CreateRecipePayload {
  title: { en: string; sr: string };
  description: { en: string; sr: string };
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
    instructionSr?: string;
  }[];
  tags?: string[];
}

export interface Recipe {
  id: string;
  title: { en: string; sr: string };
  description: { en: string; sr: string };
  slug: string;
  coverImageUrl: string | null;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  status: string;
  averageRating: number;
  ratingCount: number;
  viewCount: number;
  isFeatured: boolean;
  tags: string[];
  ingredients: {
    id: string;
    name: string;
    nameSr?: string;
    quantity: number;
    unit: string;
    notes: string | null;
    order: number;
    createdAt: string;
  }[];
  steps: {
    order: number;
    instruction: string;
    instructionSr?: string;
  }[];
  author: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    role: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  maxCookTime?: number;
  minCookTime?: number;
  ingredient?: string;
}

// Backend ponekad vraća title/description kao JSON string umesto objekta
function parseI18nField(value: string | { en: string; sr: string }): {
  en: string;
  sr: string;
} {
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return { en: value, sr: value };
  }
}

export function mapRecipe(raw: unknown): Recipe {
  const r = raw as Recipe & {
    title: string | { en: string; sr: string };
    description: string | { en: string; sr: string };
  };
  return {
    ...r,
    title: parseI18nField(r.title),
    description: parseI18nField(r.description),
  };
}

export const recipesApi = {
  getAll: async (params?: {
    search?: string;
    categoryId?: string;
    difficulty?: string;
    authorId?: string;
    maxCookTime?: number;
    ingredient?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: "ASC" | "DESC";
  }): Promise<{
    data: Recipe[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const res = await api.get("/recipes", { params });
    return {
      ...res.data,
      data: (res.data.data as unknown[]).map(mapRecipe),
    };
  },

  getOne: async (id: string): Promise<Recipe> => {
    const res = await api.get(`/recipes/${id}`);
    return mapRecipe(res.data);
  },

  create: async (payload: CreateRecipePayload): Promise<Recipe> => {
    const res = await api.post("/recipes", payload);
    return mapRecipe(res.data);
  },

  uploadCoverImage: async (id: string, file: File): Promise<Recipe> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post(`/recipes/${id}/cover-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapRecipe(res.data);
  },

  publish: async (id: string): Promise<Recipe> => {
    const res = await api.patch(`/recipes/${id}/publish`);
    return mapRecipe(res.data);
  },

  update: async (
    id: string,
    payload: Partial<CreateRecipePayload>,
  ): Promise<Recipe> => {
    const res = await api.patch(`/recipes/${id}`, payload);
    return mapRecipe(res.data);
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/recipes/${id}`);
  },
};
