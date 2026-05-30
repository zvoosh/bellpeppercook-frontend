import { useEffect, useState } from "react";
import { RecipeCard } from "../components";
import { useRecipes } from "../hooks/useRecipes";
import { useCategories } from "../hooks/useCategories";
import { useBookmarks } from "../hooks/useBookmarks";
import type { Category } from "../api/categories";
import type { Recipe } from "../api/recipes";
import { RecipeCardSkeleton } from "../components/RecipeCardSkeleton";

const LIMIT = 30;

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function Explore() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [limit, setLimit] = useState(LIMIT);

  const debouncedSearch = useDebounce(searchInput, 400);

  const { data: categoriesData } = useCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const { toggle, isBookmarked } = useBookmarks();

  const selectedCategory = categories.find(
    (c: Category) => c.name === activeFilter,
  );

  // instead of pagination, just increase the limit
  // this avoids all accumulation/reset complexity
  const { data, isFetching, isLoading } = useRecipes({
    search: debouncedSearch || undefined,
    categoryId: selectedCategory?.id,
    page: 1,
    limit,
    sortBy: "createdAt",
    order: "DESC",
  });

  const response = data as
    | {
        data: Recipe[];
        meta: { total: number; totalPages: number };
      }
    | undefined;

  const meta = response?.meta;
  const recipes = response?.data ?? [];

  const displayedRecipes =
    activeFilter === "Bookmarked"
      ? recipes.filter((r) => isBookmarked(r.id))
      : recipes;

  const hasMore = meta ? recipes.length < meta.total : false;

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setLimit(LIMIT); // reset limit when filter changes
    setSearchInput("");
  };

  const handleLoadMore = () => {
    setLimit((prev) => prev + LIMIT);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setLimit(LIMIT);
  };

  const FILTERS = [
    "All",
    ...categories.map((c: Category) => c.name),
    "Bookmarked",
  ];

  const isSearching = isFetching && debouncedSearch.length > 0;

  return (
    <div className="py-10">
      {/* Header */}
      <div className="max-w-2xl mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug mb-3">
          Explore our catalogue of recipes gathered from all around the world
        </h2>
        <p className="text-white/45 text-sm sm:text-base leading-relaxed">
          {meta
            ? debouncedSearch
              ? `${meta.total} results for "${debouncedSearch}"`
              : `${meta.total} recipes`
            : "Recipes"}{" "}
          crafted by home cooks, chefs and masters of the craft
        </p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-sm text-white/35 mr-2">Filters</span>
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors cursor-pointer select-none ${
                activeFilter === filter
                  ? "bg-green-500 text-black font-medium"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative sm:shrink-0">
          <input
            type="input"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setLimit(LIMIT); // reset limit on new search
            }}
            className="px-4 py-2 bg-white/8 border border-white/10 text-white/75 rounded-full w-full sm:w-64 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/25 transition-colors pr-10"
            placeholder="Search recipes..."
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-green-400 rounded-full animate-spin" />
            </div>
          )}
          {searchInput && !isSearching && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors text-lg leading-none cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Active search chip */}
      {debouncedSearch && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-white/40">Searching for:</span>
          <span className="px-3 py-1 rounded-full text-xs bg-green-500/15 border border-green-500/30 text-green-400 flex items-center gap-2">
            {debouncedSearch}
            <button
              onClick={handleClearSearch}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 10 }).map(() => (
            <RecipeCardSkeleton/>
          ))}
        </div>
      ) : displayedRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <span className="text-5xl">🍽️</span>
          <p className="text-white/30 text-sm">
            {activeFilter === "Bookmarked"
              ? "No bookmarked recipes yet."
              : debouncedSearch
                ? `No recipes found for "${debouncedSearch}".`
                : "No recipes found."}
          </p>
          {debouncedSearch && (
            <button
              onClick={handleClearSearch}
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {displayedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              {...recipe}
              saved={isBookmarked(recipe.id)}
              onBookmarkToggle={toggle}
            />
          ))}
        </section>
      )}

      {/* Load more */}
      {hasMore && activeFilter !== "Bookmarked" && (
        <div className="flex justify-center mt-10 mb-6">
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="py-2.5 px-6 text-sm font-medium bg-green-500 hover:bg-green-400 text-black rounded-full transition-colors cursor-pointer select-none disabled:opacity-50"
          >
            {isFetching ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
