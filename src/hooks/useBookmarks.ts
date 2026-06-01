import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarksApi } from "../api/bookmarks";
import { useAuth } from "./useAuth";

export function useBookmarks() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // povuci sve bookmarkovane recepte
  const { data: bookmarks = [] } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: bookmarksApi.getAll,
    enabled: isAuthenticated,
  });

  // deriviramo ID-eve iz responsa, nema posebnog API poziva
  const bookmarkIds = bookmarks.map((b) => b.recipe.id);

  const addMutation = useMutation({
    mutationFn: bookmarksApi.add,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: bookmarksApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const isBookmarked = (recipeId: string): boolean => {
    return bookmarkIds.includes(recipeId);
  };

  const toggle = (recipeId: string) => {
    if (!isAuthenticated) {
      window.location.href = "/signin";
      return;
    }
    if (isBookmarked(recipeId)) {
      removeMutation.mutate(recipeId);
    } else {
      addMutation.mutate(recipeId);
    }
  };

  return {
    bookmarks,
    bookmarkIds,
    isBookmarked,
    toggle,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
}
