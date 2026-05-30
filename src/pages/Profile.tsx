import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RecipeCard } from "../components";
import { useAuth } from "../hooks/useAuth";
import { useMyRecipes } from "../hooks/useRecipes";
import { useBookmarks } from "../hooks/useBookmarks";
import { useUser } from "../hooks/useUsers";
import type { Recipe } from "../api/recipes";
import { RecipeCardSkeleton } from "../components/RecipeCardSkeleton";

const TABS = ["Recipes", "Bookmarked", "About"];

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState("Recipes");
  const { toggle, isBookmarked, bookmarks } = useBookmarks();

  const isOwnProfile = authUser?.id === id;

  // uvek fetchujemo korisnika po id-u iz URL-a
  const { data: profileUser, isLoading: userLoading } = useUser(id);

  const { data: myRecipesData, isLoading: recipesLoading } = useMyRecipes(id);
  const myRecipes: Recipe[] = Array.isArray(myRecipesData)
    ? myRecipesData
    : ((myRecipesData as { data?: Recipe[] })?.data ?? []);

  const bookmarkedRecipes = myRecipes.filter((r) => isBookmarked(r.id));

  const joinedDate = profileUser?.createdAt
    ? new Date(profileUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
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
        <p className="text-white/30 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="py-16 flex items-center justify-center">
        <p className="text-white/30 text-sm">User not found.</p>
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
                ✓ Verified Chef
              </span>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-x-4 text-xs text-white/30">
              <span>📅 Joined {joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isOwnProfile ? (
          <Link
            to="/settings"
            className="px-5 py-2.5 rounded-full text-sm border border-white/10 text-white/55 hover:text-white hover:border-white/20 transition-colors shrink-0 sm:mt-2"
          >
            Edit Profile
          </Link>
        ) : (
          <button className="px-5 py-2.5 rounded-full text-sm bg-green-500 hover:bg-green-400 text-black font-medium transition-colors shrink-0 sm:mt-2 cursor-pointer">
            Follow
          </button>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { num: myRecipes.length, label: "Recipes Published" },
          { num: isOwnProfile ? bookmarks.length : "—", label: "Bookmarked" },
          { num: averageRating, label: "Average Rating" },
        ].map(({ num, label }) => (
          <div
            key={label}
            className="bg-white/5 border border-white/8 rounded-2xl p-6"
          >
            <p className="text-4xl font-semibold text-green-400 mb-1">{num}</p>
            <p className="text-white/40 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-1 border-b border-white/8 mb-8">
        {TABS.filter((t) => isOwnProfile || t !== "Bookmarked").map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === tab
                ? "border-green-400 text-white"
                : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "Recipes" && (
        <>
          {recipesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 5 }).map(() => (
                <RecipeCardSkeleton />
              ))}
            </div>
          ) : myRecipes.length === 0 ? (
            <p className="text-white/30 text-sm">No recipes yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {myRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  {...recipe}
                  saved={isBookmarked(recipe.id)}
                  onBookmarkToggle={toggle}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "Bookmarked" && isOwnProfile && (
        <>
          {bookmarkedRecipes.length === 0 ? (
            <p className="text-white/30 text-sm">No bookmarked recipes yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {bookmarkedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  {...recipe}
                  saved={true}
                  onBookmarkToggle={toggle}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "About" && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white/5 border border-white/8 rounded-2xl p-8">
            <p className="text-xs uppercase tracking-widest text-white/30 font-medium mb-5">
              Details
            </p>
            <div className="space-y-4">
              {[
                { label: "Username", value: `@${profileUser.username}` },
                { label: "Member since", value: joinedDate },
                {
                  label: "Role",
                  value:
                    profileUser.role.charAt(0).toUpperCase() +
                    profileUser.role.slice(1),
                },
                {
                  label: "Recipes published",
                  value: `${myRecipes.length} recipes`,
                },
                ...(isOwnProfile
                  ? [
                      {
                        label: "Bookmarked",
                        value: `${bookmarks.length} recipes`,
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
