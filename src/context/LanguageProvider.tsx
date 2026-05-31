import { useTranslation } from "react-i18next";
import { LanguageContext, type Language } from "./LanguageContext";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  const lang = (i18n.language === "sr" ? "sr" : "en") as Language;

  const setLang = (newLang: Language) => {
    void i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = (text: { en: string; sr: string } | string): string => {
    if (typeof text === "object") return text[lang] || text.en;
    // backend ponekad vrati stringifikovani JSON: '{"en":"...","sr":"..."}'
    try {
      const parsed = JSON.parse(text) as { en: string; sr: string };
      if (parsed && typeof parsed === "object" && "en" in parsed) {
        return parsed[lang] || parsed.en;
      }
    } catch {
      // nije JSON, vrati kao string
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
