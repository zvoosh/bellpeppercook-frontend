import { createContext, useContext } from "react";

export type Language = "en" | "sr";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (text: { en: string; sr: string } | string) => string;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
