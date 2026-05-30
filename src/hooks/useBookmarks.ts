import { useState, useCallback } from "react";

const STORAGE_KEY = "bookmarked_recipes";

function getBookmarks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(getBookmarks);

  const toggle = useCallback((recipeId: string) => {
    setBookmarks((prev) => {
      const updated = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isBookmarked = useCallback(
    (recipeId: string) => bookmarks.includes(recipeId),
    [bookmarks],
  );

  return { bookmarks, toggle, isBookmarked };
}
