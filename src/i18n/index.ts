import { en, type Translations } from './en';
import { pt } from './pt';
import { nl } from './nl';

export type Lang = 'en' | 'pt' | 'nl';

export const languages: Record<Lang, { label: string; flag: string }> = {
  en: { label: 'English', flag: '🇬🇧' },
  pt: { label: 'Português', flag: '🇧🇷' },
  nl: { label: 'Nederlands', flag: '🇳🇱' },
};

const translations: Record<Lang, Translations> = { en, pt, nl };

export function getTranslations(lang: Lang): Translations {
  return translations[lang] || en;
}

export type { Translations };
