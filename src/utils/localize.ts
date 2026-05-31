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
