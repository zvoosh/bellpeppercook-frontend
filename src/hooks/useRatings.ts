import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { ratingsApi } from "../api/ratings";

export function useMyRating(recipeId: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["rating", recipeId],
    queryFn: () => ratingsApi.getMyRating(recipeId),
    enabled: !!recipeId && isAuthenticated,
  });
}

export function useRateRecipe(recipeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (score: number) => ratingsApi.rate(recipeId, score),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["rating", recipeId] });
      void queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
    },
  });
}
