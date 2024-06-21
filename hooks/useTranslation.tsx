import React, { useContext, useState } from "react";

import { ITranslate } from "@/shared/type/Utils.type";
import { getLocales } from "expo-localization";

export const TranslationContext = React.createContext<ITranslate | null>(null);

export const TranslationLanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState<string>(
    getLocales()[0].languageCode ?? "en"
  );

  const contextValue = {
    locale,
    setLocale,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () =>
  useContext(TranslationContext) as ITranslate;
