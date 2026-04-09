import { createContext, useContext, useCallback, ReactNode } from "react";
import salesTranslations, { SalesLang } from "@/i18n/sales-translations";

interface SalesLanguageContextType {
  lang: SalesLang;
  t: (key: string) => string;
}

const SalesLanguageContext = createContext<SalesLanguageContextType>({
  lang: "en",
  t: (key) => key,
});

export function SalesLanguageProvider({ lang, children }: { lang: SalesLang; children: ReactNode }) {
  const t = useCallback(
    (key: string): string => {
      const dict = salesTranslations[lang] as Record<string, string>;
      return key in dict ? dict[key] : key;
    },
    [lang]
  );

  return (
    <SalesLanguageContext.Provider value={{ lang, t }}>
      {children}
    </SalesLanguageContext.Provider>
  );
}

export function useSalesT() {
  return useContext(SalesLanguageContext);
}
