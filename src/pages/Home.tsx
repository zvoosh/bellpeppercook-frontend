import { Link } from "react-router-dom";
import { RecipeCard } from "../components";
import pizzaHero from "/homepage/pizza.jpg";
import pasta from "/homepage/pasta.jpg";
import type { Recipe } from "../api/recipes";
import { RecipeCardSkeleton } from "../components/RecipeCardSkeleton";
import { useRecipes } from "../hooks/useRecipes";
import { useBookmarks } from "../hooks/useBookmarks";
import { useLanguage } from "../context";

export default function Home() {
  const { t } = useLanguage();
  const { data: latest, isLoading: latestLoading } = useRecipes({
    limit: 8,
    sortBy: "createdAt",
    order: "DESC",
  });
  const { toggle, isBookmarked } = useBookmarks();

  return (
    <div>
      {/* HERO */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 h-64 sm:h-80 md:h-120 overflow-hidden">
        <img src={pizzaHero} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 sm:px-12 md:px-16">
          <div className="max-w-md">
            <p className="text-green-400 text-xs sm:text-sm font-medium uppercase tracking-widest mb-2 sm:mb-3">
              {t({ en: "Over 200+ recipes", sr: "Preko 200+ recepata" })}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white mb-3 sm:mb-4">
              {t({ en: "Easy Home Cooking", sr: "Lako kuvanje kod kuće" })}
            </h1>
            <p className="text-white/60 text-sm sm:text-base mb-5 sm:mb-8 leading-relaxed hidden sm:block">
              {t({
                en: "Discover delicious recipes from home cooks and chefs around the world.",
                sr: "Otkrijte ukusne recepte kućnih kuvara i šefova kuhinje iz celog sveta.",
              })}
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-colors text-sm"
            >
              {t({ en: "Explore Recipes →", sr: "Istraži recepte →" })}
            </Link>
          </div>
        </div>
      </div>

      {/* LATEST RECIPES */}
      <section className="mt-10 sm:mt-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">
            {t({ en: "Latest Recipes", sr: "Najnoviji recepti" })}
          </h2>
          <Link to="/explore" className="text-sm text-white/45 hover:text-white transition-colors">
            {t({ en: "See all →", sr: "Vidi sve →" })}
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {latestLoading
            ? Array.from({ length: 5 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            : latest?.data?.length
              ? latest.data.map((recipe: Recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    {...recipe}
                    saved={isBookmarked(recipe.id)}
                    onBookmarkToggle={toggle}
                  />
                ))
              : (
                <p className="col-span-full text-white/30 text-sm py-8 text-center">
                  {t({ en: "No recipes yet.", sr: "Još nema recepata." })}
                </p>
              )}
        </div>
      </section>

      {/* MID BANNER */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 h-48 sm:h-60 md:h-72 overflow-hidden mt-14 sm:mt-20">
        <img src={pasta} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 sm:px-12 md:px-16">
          <div>
            <p className="text-green-400 text-xs sm:text-sm font-medium uppercase tracking-widest mb-2">
              {t({ en: "Easy home cooking", sr: "Lako kuvanje kod kuće" })}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              {t({ en: "Over 200+ Recipes", sr: "Preko 200+ recepata" })}
            </h2>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors text-sm"
            >
              {t({ en: "Explore more recipes →", sr: "Istraži više recepata →" })}
            </Link>
          </div>
        </div>
      </div>

      {/* TRENDING RECIPES */}
      <section className="mt-10 sm:mt-16 mb-16 sm:mb-20">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">
            {t({ en: "Trending Recipes", sr: "Popularni recepti" })}
          </h2>
          <Link to="/explore" className="text-sm text-white/45 hover:text-white transition-colors">
            {t({ en: "See all →", sr: "Vidi sve →" })}
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {latestLoading
            ? Array.from({ length: 5 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            : latest?.data?.length
              ? latest.data.map((recipe: Recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    {...recipe}
                    saved={isBookmarked(recipe.id)}
                    onBookmarkToggle={toggle}
                  />
                ))
              : (
                <p className="col-span-full text-white/30 text-sm py-8 text-center">
                  {t({ en: "No recipes yet.", sr: "Još nema recepata." })}
                </p>
              )}
        </div>
      </section>
    </div>
  );
}
