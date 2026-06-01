import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../api/comments";

export function useComments(recipeId: string) {
  return useQuery({
    queryKey: ["comments", recipeId],
    queryFn: () => commentsApi.getByRecipe(recipeId),
    enabled: !!recipeId,
  });
}

export function useCreateComment(recipeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => commentsApi.create(recipeId, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments", recipeId] });
    },
  });
}
