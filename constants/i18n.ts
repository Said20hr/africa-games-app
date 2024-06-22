import { I18n } from "i18n-js";
import translations from "@/constants/translations/";
import { getLocales } from "expo-localization";
import { LanguageOptions } from "@/shared/type/Utils.type";

export const i18n = new I18n(translations);
i18n.enableFallback = true;

i18n.locale = getLocales()[0].languageCode ?? "en";

export const changeLanguage = (lang: LanguageOptions) => {
  console.log("CHANGING LANGUAGE FROM ", i18n.locale, " TO ", lang);
  i18n.locale = lang;
};
