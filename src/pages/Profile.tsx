import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RecipeCard } from "../components";
import { useAuth } from "../hooks/useAuth";
import { useMyRecipes, useDeleteRecipe } from "../hooks/useRecipes";
import { toast } from "sonner";
import { useBookmarks } from "../hooks/useBookmarks";
import { useUser } from "../hooks/useUsers";
import type { Recipe } from "../api/recipes";
import { RecipeCardSkeleton } from "../components/RecipeCardSkeleton";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState("recipes");
  const { toggle, isBookmarked, bookmarks } = useBookmarks();

  console.log("activeTab", activeTab);

  const TABS = [
    {
      label: t("profile.tabRecipes"),
      key: "recipes",
    },
    {
      label: t("profile.tabBookmarked"),
      key: "bookmarked",
    },
    {
      label: t("profile.tabAbout"),
      key: "about",
    },
  ];

  const isOwnProfile = authUser?.id === id;

  const { data: profileUser, isLoading: userLoading } = useUser(id);

  const { data: myRecipesData, isLoading: recipesLoading } = useMyRecipes(id);
  const { mutate: deleteRecipe, isPending: deletingId } = useDeleteRecipe(id);
  const myRecipes: Recipe[] = Array.isArray(myRecipesData)
    ? myRecipesData
    : ((myRecipesData as { data?: Recipe[] })?.data ?? []);

  const bookmarkedRecipes = bookmarks.map((b) => b.recipe);

  const joinedDate = profileUser?.createdAt
    ? new Date(profileUser.createdAt).toLocaleDateString(
        i18n.language === "sr" ? "sr-RS" : "en-US",
        { month: "long", year: "numeric" },
      )
    : "—";

  const averageRating =
    myRecipes.length > 0
      ? (
          myRecipes.reduce((sum, r) => sum + r.averageRating, 0) /
          myRecipes.length
        ).toFixed(1)
      : "—";

  if (userLoading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <p className="text-white/30 text-sm">{t("profile.loading")}</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="py-16 flex items-center justify-center">
        <p className="text-white/30 text-sm">{t("profile.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16">
      {/* PROFILE HEADER */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-10 mb-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/8 border border-white/10 overflow-hidden flex items-center justify-center text-5xl sm:text-6xl shrink-0">
            {profileUser.avatarUrl ? (
              <img
                src={profileUser.avatarUrl}
                alt={profileUser.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              "👨‍🍳"
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-semibold mb-1">
              {profileUser.firstName} {profileUser.lastName}
            </h1>
            <p className="text-white/35 text-sm mb-3">
              @{profileUser.username}
            </p>
            {profileUser.role === "chef" && (
              <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs bg-green-500/15 border border-green-500/30 text-green-400 font-medium">
                {t("profile.verifiedChef")}
              </span>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-x-4 text-xs text-white/30">
              <span>
                📅 {t("profile.joined")} {joinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isOwnProfile ? (
          <Link
            to="/settings"
            className="px-5 py-2.5 rounded-full text-sm border border-white/10 text-white/55 hover:text-white hover:border-white/20 transition-colors shrink-0 sm:mt-2"
          >
            {t("profile.editProfile")}
          </Link>
        ) : (
          <button className="px-5 py-2.5 rounded-full text-sm bg-green-500 hover:bg-green-400 text-black font-medium transition-colors shrink-0 sm:mt-2 cursor-pointer">
            {t("profile.follow")}
          </button>
        )}
      </div>

      {/* STATS */}
      <div
        className={`grid gap-4 mb-10 ${isOwnProfile ? "grid-cols-3" : "grid-cols-2"}`}
      >
        {[
          { num: myRecipes.length, label: t("profile.recipesPublished") },
          ...(isOwnProfile
            ? [{ num: bookmarks.length, label: t("profile.bookmarked") }]
            : []),
          { num: averageRating, label: t("profile.averageRating") },
        ].map(({ num, label }) => (
          <div
            key={label}
            className="bg-white/5 border border-white/8 rounded-2xl p-2 py-4 text-center sm:text-start sm:p-6"
          >
            <p className="text-4xl font-semibold text-green-400 mb-1">{num}</p>
            <p className="text-white/40 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-1 border-b border-white/8 mb-8">
        {TABS.filter((tab) => isOwnProfile || tab.key !== "bookmarked").map(
          (tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-green-400 text-white"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ),
        )}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "recipes" && (
        <>
          {recipesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : myRecipes.length === 0 ? (
            <p className="text-white/30 text-sm">{t("profile.noRecipes")}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {myRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="relative group/card isolate overflow-hidden rounded-2xl"
                >
                  <RecipeCard
                    {...recipe}
                    saved={isBookmarked(recipe.id)}
                    onBookmarkToggle={toggle}
                    linkState={{
                      fromName: `${profileUser.firstName} ${profileUser.lastName}`,
                    }}
                  />
                  {isOwnProfile && (
                    <button
                      onClick={() => {
                        if (!window.confirm(t("profile.confirmDelete"))) return;
                        deleteRecipe(recipe.id, {
                          onSuccess: () =>
                            toast.success(t("profile.deleteSuccess")),
                        });
                      }}
                      disabled={deletingId}
                      className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-500/80 disabled:cursor-not-allowed cursor-pointer"
                      title={t("profile.deleteRecipe")}
                    >
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "bookmarked" && isOwnProfile && (
        <>
          {bookmarkedRecipes.length === 0 ? (
            <p className="text-white/30 text-sm">{t("profile.noBookmarked")}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {bookmarkedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  {...recipe}
                  saved={true}
                  onBookmarkToggle={toggle}
                  linkState={{
                    fromName: `${profileUser.firstName} ${profileUser.lastName}`,
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "about" && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white/5 border border-white/8 rounded-2xl p-8">
            <p className="text-xs uppercase tracking-widest text-white/30 font-medium mb-5">
              {t("profile.detailsTitle")}
            </p>
            <div className="space-y-4">
              {[
                {
                  label: t("profile.detailUsername"),
                  value: `@${profileUser.username}`,
                },
                { label: t("profile.detailMemberSince"), value: joinedDate },
                {
                  label: t("profile.detailRole"),
                  value:
                    profileUser.role.charAt(0).toUpperCase() +
                    profileUser.role.slice(1),
                },
                {
                  label: t("profile.detailRecipesPublished"),
                  value: t("profile.recipesCount", { count: myRecipes.length }),
                },
                ...(isOwnProfile
                  ? [
                      {
                        label: t("profile.detailBookmarked"),
                        value: t("profile.recipesCount", {
                          count: bookmarks.length,
                        }),
                      },
                    ]
                  : []),
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0"
                >
                  <span className="text-xs uppercase tracking-widest text-white/30 font-medium">
                    {label}
                  </span>
                  <span className="text-sm text-white/60">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
