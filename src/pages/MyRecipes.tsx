import { useState } from "react";
import { Link } from "react-router-dom";
import { RecipeCard } from "../components";

const TABS = ["My Recipes", "Bookmarked"];
const FILTERS = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Vegan",
  "Desserts",
  "Quick < 30min",
];

export default function MyRecipes() {
  const [activeTab, setActiveTab] = useState("My Recipes");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <div className="py-10 sm:py-16">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-green-400 font-medium mb-3">
            Your kitchen
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">My Recipes</h1>
        </div>
        <Link
          to="/create"
          className="self-start bg-green-500 hover:bg-green-400 text-black font-medium px-5 py-2.5 rounded-full text-sm transition-colors sm:mt-4"
        >
          + New Recipe
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { num: "12", label: "Recipes Created" },
          { num: "8", label: "Bookmarked" },
          { num: "4.7", label: "Avg. Rating" },
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
        {TABS.map((tab) => (
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

      {/* FILTERS + SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-1 flex-wrap">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors cursor-pointer select-none ${
                activeFilter === filter
                  ? "bg-green-500 text-black font-medium"
                  : "text-white/45 hover:text-white hover:bg-white/8"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 text-white/75 rounded-full w-full sm:w-56 text-sm placeholder:text-white/25 focus:outline-none focus:border-green-500/50 transition-colors sm:shrink-0"
          placeholder="Search your recipes..."
        />
      </div>

      {/* EMPTY STATE */}
      {activeTab === "My Recipes" && (
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <RecipeCard key={i} />
            ))}
          </div>
        </section>
      )}

      {activeTab === "Bookmarked" && (
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <RecipeCard key={i} saved />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
