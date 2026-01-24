"use client";

import { useLanguage } from "@/contexts/language-context";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const label = language === "en" ? "አማ" : "EN";

  return (
    <button className="btn-outline" onClick={toggleLanguage} type="button">
      {label}
    </button>
  );
}
