export enum LanguageOptions {
  English = "en",
  French = "fr",
  Espagnol = "es",
  Portugais = "pt",
  Allemand = "de",
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
