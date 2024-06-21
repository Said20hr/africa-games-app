import { Locale } from "expo-localization";
import i18n from "i18n-js";

export enum LanguageOptions {
  ENGLISH = "en",
  FRENCH = "fr",
}

export interface ITranslate {
  locale: string;
  setLocale: (locale: string) => void;
}

/*"casino": {
            "id": 23,
            "name": "WAREHOUSE",
            "shift": "06h00 - 14h00",
            "initial_amount": "3960.02",
            "hasRoulette": boolean,
            "last_operation": Date
            "roulettes": [{
              id,
              name,
              lastKeyInStart -> maybe (if null then input is editable)
              lastKeyOutStart -> maybe (if null then input is editable)
            }, {}, {}]
        }
        */
