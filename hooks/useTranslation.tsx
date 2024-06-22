import React, { Dispatch, SetStateAction, useContext, useState } from "react";

import { ITranslate } from "@/shared/type/Utils.type";
import { getLocales } from "expo-localization";

export const TranslationContext = React.createContext<ITranslate | null>(null);

type TranslationLanguageProviderProps = {
  children: React.ReactNode;
  locale: string;
  setLocale: Dispatch<SetStateAction<string>>;
};

export const TranslationLanguageProvider = ({
  children,
  locale,
  setLocale,
}: TranslationLanguageProviderProps) => {
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
