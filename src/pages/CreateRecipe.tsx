import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCreateRecipe, useUploadCoverImage } from "../hooks/useRecipes";
import { useCategories } from "../hooks/useCategories";
import type { Category } from "../api/categories";
import { recipesApi } from "../api/recipes";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const UNITS = [
  { label: "g", value: "g" },
  { label: "kg", value: "kg" },
  { label: "ml", value: "ml" },
  { label: "l", value: "l" },
  { label: "tsp", value: "tsp" },
  { label: "tbsp", value: "tbsp" },
  { label: "cup", value: "cup" },
  { label: "piece", value: "piece" },
  { label: "pinch", value: "pinch" },
];

interface Ingredient {
  id: number;
  amount: string;
  unit: string;
  name: string;
  notes: string;
}

interface Step {
  id: number;
  text: string;
  textSr: string;
}

export default function CreateRecipe() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate: createRecipe, isPending, error } = useCreateRecipe();
  const { mutateAsync: uploadImage } = useUploadCoverImage();
  const { data: categoriesData } = useCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const [title, setTitle] = useState("");
  const [titleSr, setTitleSr] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionSr, setDescriptionSr] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [tags, setTags] = useState("");

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, amount: "", unit: "g", name: "", notes: "" },
  ]);

  const [steps, setSteps] = useState<Step[]>([{ id: 1, text: "", textSr: "" }]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addIngredient = () =>
    setIngredients((prev) => [
      ...prev,
      { id: Date.now(), amount: "", unit: "g", name: "", notes: "" },
    ]);

  const removeIngredient = (id: number) =>
    setIngredients((prev) => prev.filter((i) => i.id !== id));

  const updateIngredient = (
    id: number,
    field: keyof Ingredient,
    value: string,
  ) =>
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    );

  const addStep = () =>
    setSteps((prev) => [...prev, { id: Date.now(), text: "", textSr: "" }]);

  const removeStep = (id: number) =>
    setSteps((prev) => prev.filter((s) => s.id !== id));

  const updateStep = (id: number, field: "text" | "textSr", value: string) =>
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const buildPayload = () => ({
    title: { en: title, sr: titleSr },
    description: { en: description, sr: descriptionSr },
    prepTimeMinutes: parseInt(prepTime) || 0,
    cookTimeMinutes: parseInt(cookTime) || 0,
    servings: parseInt(servings) || 1,
    difficulty: difficulty.toLowerCase() as "easy" | "medium" | "hard",
    categoryId: category || undefined,
    ingredients: ingredients
      .filter((i) => i.name.trim())
      .map((i, index) => ({
        name: i.name,
        quantity: parseFloat(i.amount) || 0,
        unit: i.unit,
        notes: i.notes || undefined,
        order: index + 1,
      })),
    steps: steps
      .filter((s) => s.text.trim())
      .map((s, index) => ({
        order: index + 1,
        instruction: s.text,
        instructionSr: s.textSr || undefined,
      })),
    tags: tags
      ? tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      : [],
  });

  const handlePublish = async () => {
    const payload = buildPayload();

    createRecipe(payload, {
      onSuccess: async (recipe) => {
        const imageInput = document.getElementById(
          "image-upload",
        ) as HTMLInputElement;
        const file = imageInput?.files?.[0];

        if (file) {
          await uploadImage({ id: recipe.id, file });
        }

        await recipesApi.publish(recipe.id);
        toast.success(t("createRecipe.publishRecipe"), {
          description: t("createRecipe.pageTag"),
        });
        navigate(`/recipes/${recipe.id}`);
      },
    });
  };

  const handleDraft = () => {
    const payload = buildPayload();
    createRecipe(payload, {
      onSuccess: () => {
        toast.success(t("createRecipe.saveAsDraft"));
        navigate("/my-recipes");
      },
    });
  };

  const canPublish =
    title.trim() &&
    description.trim() &&
    category &&
    difficulty &&
    cookTime &&
    servings &&
    ingredients.some((i) => i.name.trim()) &&
    steps.some((s) => s.text.trim());

  const inputClass =
    "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-green-500/50 transition-colors";

  const labelClass =
    "block text-xs uppercase tracking-widest text-white/35 font-medium mb-2";

  const selectClass =
    "bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors cursor-pointer";

  return (
    <div className="py-10 sm:py-16 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10 sm:mb-12">
        <p className="text-xs uppercase tracking-widest text-green-400 font-medium mb-3">
          {t("createRecipe.pageTag")}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
          {t("createRecipe.pageTitle")}
        </h1>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          {t("createRecipe.errorGeneric")}
        </div>
      )}

      <div className="space-y-10">
        {/* IMAGE UPLOAD */}
        <div>
          <label className={labelClass}>{t("createRecipe.coverPhoto")}</label>
          <label
            htmlFor="image-upload"
            className="block w-full h-48 sm:h-64 rounded-2xl border-2 border-dashed border-white/10 hover:border-green-500/40 transition-colors cursor-pointer overflow-hidden"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/25">
                <span className="text-4xl sm:text-5xl">📷</span>
                <p className="text-sm">{t("createRecipe.uploadPrompt")}</p>
                <p className="text-xs">{t("createRecipe.uploadHint")}</p>
              </div>
            )}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImage}
          />
        </div>

        {/* BASIC INFO */}
        <div className="space-y-5">
          <div>
            <label className={labelClass}>{t("createRecipe.labelTitle")}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${inputClass} w-full`}
              placeholder="e.g. Moroccan Lamb Tagine"
            />
            <input
              type="text"
              value={titleSr}
              onChange={(e) => setTitleSr(e.target.value)}
              className={`${inputClass} w-full mt-2`}
              placeholder="npr. Marokanski jagnjeći tažin (srpski)"
            />
          </div>
          <div>
            <label className={labelClass}>{t("createRecipe.labelDescription")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} w-full resize-none h-28`}
              placeholder={t("createRecipe.descriptionPlaceholder")}
            />
            <textarea
              value={descriptionSr}
              onChange={(e) => setDescriptionSr(e.target.value)}
              className={`${inputClass} w-full resize-none h-28 mt-2`}
              placeholder="Srpski opis jela (opciono)..."
            />
          </div>
        </div>

        {/* TIME + SERVINGS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{t("createRecipe.labelPrepTime")}</label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className={`${inputClass} w-full`}
              placeholder="e.g. 15"
              min={0}
            />
          </div>
          <div>
            <label className={labelClass}>{t("createRecipe.labelCookTime")}</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className={`${inputClass} w-full`}
              placeholder="e.g. 45"
              min={0}
            />
          </div>
          <div>
            <label className={labelClass}>{t("createRecipe.labelServings")}</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className={`${inputClass} w-full`}
              placeholder="e.g. 4"
              min={1}
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <label className={labelClass}>{t("createRecipe.labelCategory")}</label>
          {categories.length === 0 ? (
            <p className="text-white/25 text-sm">{t("createRecipe.loadingCategories")}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: Category) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors cursor-pointer ${
                    category === cat.id
                      ? "bg-green-500 text-black font-medium"
                      : "bg-white/5 border border-white/10 text-white/55 hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DIFFICULTY */}
        <div>
          <label className={labelClass}>{t("createRecipe.labelDifficulty")}</label>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`px-6 py-2 rounded-full text-sm transition-colors cursor-pointer ${
                  difficulty === d
                    ? "bg-green-500 text-black font-medium"
                    : "bg-white/5 border border-white/10 text-white/55 hover:text-white hover:border-white/20"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* TAGS */}
        <div>
          <label className={labelClass}>{t("createRecipe.labelTags")}</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={`${inputClass} w-full`}
            placeholder={t("createRecipe.tagsPlaceholder")}
          />
          <p className="text-xs text-white/20 mt-1.5">{t("createRecipe.tagsHint")}</p>
        </div>

        {/* INGREDIENTS */}
        <div>
          <label className={labelClass}>{t("createRecipe.labelIngredients")}</label>
          <div className="space-y-3">
            {ingredients.map((ing, index) => (
              <div key={ing.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white/20 text-sm w-5 text-right shrink-0">
                      {index + 1}
                    </span>
                    <input
                      type="number"
                      value={ing.amount}
                      onChange={(e) =>
                        updateIngredient(ing.id, "amount", e.target.value)
                      }
                      className={`${inputClass} w-20 shrink-0`}
                      placeholder="200"
                      min={0}
                    />
                    <select
                      value={ing.unit}
                      onChange={(e) =>
                        updateIngredient(ing.id, "unit", e.target.value)
                      }
                      className={`${selectClass} w-24 shrink-0`}
                    >
                      {UNITS.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 flex-1 pl-7 sm:pl-0">
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) =>
                        updateIngredient(ing.id, "name", e.target.value)
                      }
                      className={`${inputClass} flex-1 min-w-0`}
                      placeholder={t("createRecipe.ingredientNamePlaceholder")}
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(ing.id)}
                        className="text-white/20 hover:text-red-400 transition-colors text-lg shrink-0 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <div className="pl-7">
                  <input
                    type="text"
                    value={ing.notes}
                    onChange={(e) =>
                      updateIngredient(ing.id, "notes", e.target.value)
                    }
                    className={`${inputClass} w-full text-xs`}
                    placeholder={t("createRecipe.ingredientNotesPlaceholder")}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addIngredient}
            className="mt-4 text-sm text-green-400 hover:text-green-300 transition-colors cursor-pointer"
          >
            {t("createRecipe.addIngredient")}
          </button>
        </div>

        {/* STEPS */}
        <div>
          <label className={labelClass}>{t("createRecipe.labelSteps")}</label>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex gap-3 items-start">
                <span className="mt-3 text-green-400 font-medium text-sm w-5 shrink-0 text-right">
                  {index + 1}
                </span>
                <div className="flex-1 flex flex-col gap-2">
                  <textarea
                    value={step.text}
                    onChange={(e) => updateStep(step.id, "text", e.target.value)}
                    className={`${inputClass} w-full resize-none h-20`}
                    placeholder={t("createRecipe.stepPlaceholder", { num: index + 1 })}
                  />
                  <textarea
                    value={step.textSr}
                    onChange={(e) => updateStep(step.id, "textSr", e.target.value)}
                    className={`${inputClass} w-full resize-none h-20`}
                    placeholder={`Korak ${index + 1} — srpski prevod (opciono)...`}
                  />
                </div>
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="mt-3 text-white/20 hover:text-red-400 transition-colors text-lg shrink-0 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="mt-4 text-sm text-green-400 hover:text-green-300 transition-colors cursor-pointer"
          >
            {t("createRecipe.addStep")}
          </button>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-white/8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-white/35 hover:text-white transition-colors cursor-pointer text-center sm:text-left"
          >
            {t("createRecipe.cancel")}
          </button>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleDraft}
              disabled={!title.trim() || isPending}
              className="px-5 py-2.5 rounded-full text-sm border border-white/10 text-white/55 hover:text-white hover:border-white/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t("createRecipe.saveAsDraft")}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={!canPublish || isPending}
              className="px-6 py-2.5 rounded-full text-sm bg-green-500 hover:bg-green-400 text-black font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isPending ? t("createRecipe.publishing") : t("createRecipe.publishRecipe")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
