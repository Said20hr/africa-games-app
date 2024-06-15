import { I18n } from "i18n-js";
import { storage } from "@/shared/util/mmkv";
import React, { useCallback, useContext, useEffect, useState } from "react";

import translations from "@/constants/translations/";
import { ITranslate, LanguageOptions } from "@/shared/type/Utils.type";
import { PREFERRED_LANGUAGE } from "@/constants/Keys";
import { getLocales } from "expo-localization";

export const TranslationContext = React.createContext<ITranslate | null>(null);

const i18n = new I18n(translations);
i18n.locale = getLocales()[0].languageCode ?? "en";
i18n.translations = translations;
i18n.enableFallback = true;

export const TranslationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState<LanguageOptions>(LanguageOptions.FRENCH);

  console.log("LOCALE", i18n.t);

  useEffect(() => {
    i18n.locale = locale;
    storage.setItem(PREFERRED_LANGUAGE, locale);
    if (
      locale &&
      Object.values(LanguageOptions).includes(locale as LanguageOptions)
    )
      // @ts-ignore
      setLocale(locale);
  }, [locale]);

  const contextValue = {
    t: i18n.t,
    locale,
    setLocale,
    translate: i18n.t,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

/*
 * useTranslation hook based on i18n-js
 * Source: https://github.com/fnando/i18n-js
 */
export const useTranslation = () =>
  useContext(TranslationContext) as ITranslate;
