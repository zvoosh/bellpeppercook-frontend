const CATEGORY_MAP: Record<string, { en: string; sr: string }> = {
  Breakfast:    { en: "Breakfast",   sr: "Doručak" },
  Desserts:     { en: "Desserts",    sr: "Deserti" },
  Dinner:       { en: "Dinner",      sr: "Večera" },
  Lunch:        { en: "Lunch",       sr: "Ručak" },
  "Quick Meals":{ en: "Quick Meals", sr: "Brzi obroci" },
  Vegan:        { en: "Vegan",       sr: "Veganski" },
};

export function localizeCategory(name: string, lang: "en" | "sr"): string {
  return CATEGORY_MAP[name]?.[lang] ?? name;
}

export function localize(field: unknown, lang: "en" | "sr"): string {
  if (field && typeof field === "object" && "en" in (field as object)) {
    const obj = field as { en: string; sr: string };
    return obj[lang] || obj.en || "";
  }
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field) as unknown;
      if (parsed && typeof parsed === "object" && "en" in (parsed as object)) {
        const obj = parsed as { en: string; sr: string };
        return obj[lang] || obj.en || "";
      }
    } catch {
      // nije JSON
    }
    return field;
  }
  return "";
}
