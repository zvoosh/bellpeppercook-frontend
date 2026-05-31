import {
  FaBookmark,
  FaRegBookmark,
  FaRegClock,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import coverImg from "/homepage/eggsveggies.jpg";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context";
import { localize, localizeCategory } from "../../utils/localize";

interface RecipeCardProps {
  id: string;
  title: { en: string; sr: string };
  category?: { id: string; name: string; slug: string } | null;
  cookTimeMinutes?: number;
  averageRating?: number;
  coverImageUrl?: string | null;
  saved?: boolean;
  onBookmarkToggle?: (id: string) => void;
  linkState?: Record<string, string>;
}

export const RecipeCard = ({
  id,
  title,
  category,
  cookTimeMinutes = 0,
  averageRating = 0,
  coverImageUrl,
  saved = false,
  onBookmarkToggle,
  linkState,
}: RecipeCardProps) => {
  const { lang } = useLanguage();
  const location = useLocation();
  const image = coverImageUrl ?? coverImg;
  const displayTitle = localize(title, lang) || (lang === "sr" ? "Recept bez naziva" : "Untitled Recipe");
  const cookTime = cookTimeMinutes > 0 ? `${cookTimeMinutes} min` : "—";
  const rating = Math.round(averageRating);

  return (
    <Link
      to={`/recipes/${id}`}
      state={{ from: location.pathname, ...linkState }}
      className="group w-full cursor-pointer bg-white/5 rounded-2xl overflow-hidden border border-white/8 hover:border-white/16 hover:bg-white/8 transition-all duration-200"
    >
      <div className="relative aspect-[10/9] overflow-hidden">
        <img
          src={image}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
        />
        <div className="absolute inset-0 bg-black/20" />
        <button
          onClick={(e) => {
            e.preventDefault();
            onBookmarkToggle?.(id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
        >
          {saved ? (
            <FaBookmark className="text-green-400 text-xs" />
          ) : (
            <FaRegBookmark className="text-white text-xs" />
          )}
        </button>
      </div>

      <div className="p-4">
        <span className="text-xs font-medium text-green-400 uppercase tracking-wide">
          {category ? localizeCategory(category.name, lang) : (lang === "sr" ? "Bez kategorije" : "Uncategorized")}
        </span>
        <h3 className="text-sm font-medium text-white mt-1 mb-3 leading-snug line-clamp-2">
          {displayTitle}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) =>
              i < rating ? (
                <FaStar key={i} className="text-yellow-400 text-xs" />
              ) : (
                <FaRegStar key={i} className="text-white/25 text-xs" />
              ),
            )}
          </div>
          <div className="flex items-center gap-1.5 text-white/45 text-xs">
            <FaRegClock className="text-xs" />
            {cookTime}
          </div>
        </div>
      </div>
    </Link>
  );
};
