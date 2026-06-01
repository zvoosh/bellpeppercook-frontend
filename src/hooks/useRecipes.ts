import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recipesApi, type CreateRecipePayload } from "../api/recipes";

export function useRecipes(params?: {
  search?: string;
  categoryId?: string;
  authorId?: string; // dodaj
  difficulty?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
  maxCookTime?: number;
  minCookTime?: number;
  ingredient?: string;
}) {
  return useQuery({
    queryKey: ["recipes", params],
    queryFn: () => recipesApi.getAll(params),
  });
}
export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => recipesApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRecipePayload) => recipesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function useUploadCoverImage() {
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      recipesApi.uploadCoverImage(id, file),
  });
}
export function useMyRecipes(userId: string | undefined) {
  return useQuery({
    queryKey: ["recipes", "mine", userId],
    queryFn: () => recipesApi.getAll({ authorId: userId, limit: 50 }),
    enabled: !!userId,
  });
}
