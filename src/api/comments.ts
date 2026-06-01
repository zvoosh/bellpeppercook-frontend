import { api } from "../lib/axios";

export interface Comment {
  id: string;
  content: string;
  isApproved: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

export const commentsApi = {
  getByRecipe: async (recipeId: string): Promise<Comment[]> => {
    const res = await api.get(`/recipes/${recipeId}/comments`);
    return (res.data?.data ?? res.data) as Comment[];
  },

  create: async (recipeId: string, content: string): Promise<Comment> => {
    const res = await api.post(`/recipes/${recipeId}/comments`, { content });
    return (res.data?.data ?? res.data) as Comment;
  },
};
