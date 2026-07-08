import { type Translation } from './translation';
import { en } from './translations/en';
import { fr } from './translations/fr';

export const defaultLocale = 'en';
export const locales = ['en', 'fr'];
export const ogLocales: Record<string, string> = {
  en: 'en_US',
  fr: 'fr_FR',
};
export const prefixDefaultLocale = false;

const base = import.meta.env.BASE_URL;
const translations: Record<string, Translation> = { en, fr };

export function getStaticPaths() {
  return locales.map((lang) => ({
    params: { lang: lang === defaultLocale && !prefixDefaultLocale ? undefined : lang },
  }));
}

export function getLabels<K extends keyof Translation>(currentLocale: string | undefined, key: K): Translation[K] {
  const lang = currentLocale || defaultLocale;
  return translations[lang]?.[key] || translations[defaultLocale][key];
}

export function getRelativePath(pathname: string, locale: string): string {
  return pathname.replace(base, '/').replace(new RegExp(`^/${locale}(/|$)`), '/');
}
