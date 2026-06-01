import { useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaRegBookmark, FaBookmark, FaStar, FaRegStar } from "react-icons/fa";
import coverImg from "/homepage/eggsveggies.jpg";
import { useRecipe } from "../hooks/useRecipes";
import { useBookmarks } from "../hooks/useBookmarks";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context";
import { localize, localizeCategory } from "../utils/localize";
import { useComments, useCreateComment } from "../hooks/useComments";
import { useMyRating, useRateRecipe } from "../hooks/useRatings";
import type { Comment } from "../api/comments";

export default function RecipeDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isBookmarked, toggle } = useBookmarks();
  const { lang } = useLanguage();

  const state = location.state as { from?: string; fromName?: string } | null;
  const from = state?.from ?? "/explore";
  const fromLabel = from.startsWith("/profile")
    ? (state?.fromName ?? t("nav.profile"))
    : from === "/"
      ? t("nav.home")
      : t("nav.explore");

  const { data: recipeData, isLoading, error } = useRecipe(id ?? "");
  const recipe = recipeData;

  const [servings, setServings] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"ingredients" | "steps">(
    "ingredients",
  );
  const { data: myRating } = useMyRating(id ?? "");

  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(myRating?.score ?? 0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const { data: commentsData, isLoading: commentsLoading } = useComments(
    id ?? "",
  );
  const comments: Comment[] = Array.isArray(commentsData) ? commentsData : [];

  const { mutateAsync: createComment, isPending: submittingComment } =
    useCreateComment(id ?? "");
  const { mutateAsync: rateRecipe } = useRateRecipe(id ?? "");

  const ratingLabels =
    lang === "sr"
      ? ["", "Loše", "Solidno", "Dobro", "Odlično", "Izvrsno"]
      : ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  if (isLoading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <p className="text-white/30 text-sm">{t("recipeDetails.loading")}</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-4">
        <p className="text-white/30 text-sm">{t("recipeDetails.notFound")}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-green-400 hover:text-green-300 transition-colors"
        >
          {t("recipeDetails.goBack")}
        </button>
      </div>
    );
  }

  const currentServings = servings ?? recipe.servings;
  const scale = currentServings / recipe.servings;

  const scaleAmount = (quantity: number) => {
    if (!quantity) return "";
    const scaled = quantity * scale;
    return scaled % 1 === 0 ? String(scaled) : scaled.toFixed(1);
  };

  const saved = isBookmarked(recipe.id);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || commentRating === 0) return;

    if (!user) {
      navigate("/signin");
      return;
    }

    try {
      await createComment(commentText.trim());
      await rateRecipe(commentRating);
      setCommentText("");
      setCommentRating(0);
    } catch {
      navigate("/signin");
    }
  };

  return (
    <div className="py-8 md:py-16">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-white/30 mb-8 md:mb-10">
        <Link to="/" className="hover:text-white transition-colors">
          {t("nav.home")}
        </Link>
        {from !== "/" && (
          <>
            <span>/</span>
            <Link to={from} className="hover:text-white transition-colors">
              {fromLabel}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-white/55 truncate">
          {localize(recipe.title, lang)}
        </span>
      </div>

      {/* HERO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16 items-start">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <img
            src={recipe.coverImageUrl ?? coverImg}
            alt={localize(recipe.title, lang)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          {recipe.category && (
            <span className="absolute top-4 left-4 bg-green-500 text-black text-xs font-medium px-3 py-1 rounded-full">
              {localizeCategory(recipe.category.name, lang)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
              {localize(recipe.title, lang)}
            </h1>
            <button
              onClick={() => toggle(recipe.id)}
              className="mt-1 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors shrink-0 cursor-pointer"
            >
              {saved ? (
                <FaBookmark className="text-green-400 text-sm" />
              ) : (
                <FaRegBookmark className="text-white/50 text-sm" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) =>
                i < Math.round(recipe.averageRating) ? (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ) : (
                  <FaRegStar key={i} className="text-white/20 text-sm" />
                ),
              )}
            </div>
            <span className="text-white/40 text-sm">
              {recipe.ratingCount} {t("recipeDetails.reviews")}
            </span>
          </div>

          <p className="text-white/50 text-sm leading-relaxed">
            {localize(recipe.description, lang)}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: t("recipeDetails.prepTime"),
                value:
                  recipe.prepTimeMinutes > 0
                    ? `${recipe.prepTimeMinutes} ${t("recipeDetails.min")}`
                    : "—",
              },
              {
                label: t("recipeDetails.cookTime"),
                value: `${recipe.cookTimeMinutes} ${t("recipeDetails.min")}`,
              },
              {
                label: t("recipeDetails.difficulty"),
                value: t(`common.${recipe.difficulty}`),
              },
              {
                label: t("recipeDetails.servings"),
                value: `${currentServings} ${t("recipeDetails.people")}`,
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white/5 border border-white/8 rounded-xl p-4"
              >
                <p className="text-xs uppercase tracking-widest text-white/30 font-medium mb-1">
                  {label}
                </p>
                <p className="text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs border border-white/10 text-white/45"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author */}
          <div className="flex items-center gap-4 border-t border-white/8 pt-6">
            <div className="w-12 h-12 rounded-full bg-white/8 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
              {recipe.author.avatarUrl ? (
                <img
                  src={recipe.author.avatarUrl}
                  alt={recipe.author.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                "👨‍🍳"
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {recipe.author.firstName} {recipe.author.lastName}
              </p>
              <p className="text-xs text-white/35">@{recipe.author.username}</p>
            </div>
            <Link
              to={`/profile/${recipe.author.id}`}
              className="ml-auto text-xs border border-white/10 hover:border-white/25 text-white/45 hover:text-white px-4 py-2 rounded-full transition-colors shrink-0"
            >
              {t("recipeDetails.viewProfile")}
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE TAB SWITCHER */}
      <div className="flex md:hidden gap-1 mb-6 border-b border-white/8">
        {(["ingredients", "steps"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-green-400 text-white"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            {tab === "ingredients"
              ? t("recipeDetails.ingredients")
              : t("recipeDetails.instructions")}
          </button>
        ))}
      </div>

      {/* INGREDIENTS + STEPS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
        <div
          className={`col-span-1 ${activeTab !== "ingredients" ? "hidden md:block" : ""}`}
        >
          <div className="bg-white/5 border border-white/8 rounded-2xl p-5 mb-6">
            <p className="text-xs uppercase tracking-widest text-white/30 font-medium mb-4">
              {t("recipeDetails.adjustServings")}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setServings((s) => Math.max(1, (s ?? recipe.servings) - 1))
                }
                className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/12 text-white transition-colors cursor-pointer text-lg flex items-center justify-center"
              >
                −
              </button>
              <span className="text-2xl font-semibold text-green-400 w-8 text-center">
                {currentServings}
              </span>
              <button
                onClick={() => setServings((s) => (s ?? recipe.servings) + 1)}
                className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/12 text-white transition-colors cursor-pointer text-lg flex items-center justify-center"
              >
                +
              </button>
              <span className="text-sm text-white/35">
                {t("recipeDetails.people")}
              </span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-white/30 font-medium mb-5">
              {t("recipeDetails.ingredients")}
            </p>
            <ul className="space-y-3">
              {recipe.ingredients
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((ing) => (
                  <li
                    key={ing.id}
                    className="flex items-baseline justify-between gap-4 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-white/75">
                      {lang === "sr" && ing.nameSr ? ing.nameSr : ing.name}
                    </span>
                    <span className="text-white/35 shrink-0">
                      {scaleAmount(ing.quantity)} {ing.unit}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div
          className={`col-span-1 md:col-span-2 ${activeTab !== "steps" ? "hidden md:block" : ""}`}
        >
          <p className="text-xs uppercase tracking-widest text-white/30 font-medium mb-6">
            {t("recipeDetails.instructions")}
          </p>
          <ol className="space-y-6">
            {recipe.steps
              ?.slice()
              .sort((a, b) => a.order - b.order)
              .map((step) => (
                <li key={step.order} className="flex gap-5 items-start">
                  <span className="text-green-400 font-semibold text-lg w-6 shrink-0 mt-0.5">
                    {step.order}
                  </span>
                  <div className="bg-white/5 border border-white/8 rounded-2xl p-5 flex-1 hover:border-white/14 transition-colors">
                    <p className="text-sm text-white/70 leading-relaxed">
                      {lang === "sr" && step.instructionSr
                        ? step.instructionSr
                        : step.instruction}
                    </p>
                  </div>
                </li>
              ))}
          </ol>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="border-t border-white/8 pt-12">
        <p className="text-xs uppercase tracking-widest text-white/30 font-medium mb-2">
          {t("recipeDetails.community")}
        </p>
        <h2 className="text-2xl font-semibold mb-10">
          {t("recipeDetails.comments")}{" "}
          <span className="text-white/25 text-lg font-normal">
            ({comments.length})
          </span>
        </h2>

        {/* Leave a comment */}
        <form
          onSubmit={handleCommentSubmit}
          className="bg-white/5 border border-white/8 rounded-2xl p-6 mb-10"
        >
          <p className="text-sm font-medium text-white mb-4">
            {user
              ? t("recipeDetails.leaveComment")
              : t("recipeDetails.signInToComment")}
          </p>

          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCommentRating(i + 1)}
                onMouseEnter={() => setHoveredStar(i + 1)}
                onMouseLeave={() => setHoveredStar(0)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                {i < (hoveredStar || commentRating) ? (
                  <FaStar className="text-yellow-400 text-lg" />
                ) : (
                  <FaRegStar className="text-white/20 text-lg" />
                )}
              </button>
            ))}
            {commentRating > 0 && (
              <span className="text-xs text-white/30 ml-2">
                {ratingLabels[commentRating]}
              </span>
            )}
          </div>

          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t("recipeDetails.commentPlaceholder")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-green-500/50 transition-colors resize-none h-24 mb-4"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                !commentText.trim() || commentRating === 0 || submittingComment
              }
              className="px-5 py-2.5 rounded-full text-sm font-medium bg-green-500 hover:bg-green-400 text-black transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {submittingComment
                ? t("recipeDetails.posting")
                : t("recipeDetails.postComment")}
            </button>
          </div>
        </form>

        {/* Comments list */}
        {commentsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/8 rounded-2xl p-6 animate-pulse h-24"
              />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-white/30 text-sm">
            {t("recipeDetails.noComments")}
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white/5 border border-white/8 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                      {comment.user.avatarUrl ? (
                        <img
                          src={comment.user.avatarUrl}
                          alt={comment.user.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        "🙂"
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {comment.user.firstName} {comment.user.lastName}
                      </p>
                      <p className="text-xs text-white/30">
                        {new Date(comment.createdAt).toLocaleDateString(
                          lang === "sr" ? "sr-RS" : "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
