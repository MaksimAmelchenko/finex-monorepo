import I18n, { ToCurrencyOptions } from 'i18n-js';
import get from 'lodash.get';
import dateFormat from 'date-fns/format';
import dateParseISO from 'date-fns/parseISO';
import deepmerge from 'deepmerge';
import enLocale from 'date-fns/locale/en-US';
import ruLocale from 'date-fns/locale/ru';

import { TDate } from '../../types';

const scopeSeparator = '.';

function normalizeKey(text: string): string {
  return text.replace(/\./g, '_');
}

const locales = {
  en: enLocale,
  ru: ruLocale,
};

interface TParams {
  count?: number;

  [key: string]: any;
}

export type TFunction = (phrase: string, params?: TParams) => string;

/**
 * Initialize global I18n with translations
 */
export function initializeI18n(
  translations: { [key: string]: any },
  currentLocale: string,
  defaultLocale: string,
  pluralization?: any
): void {
  I18n.fallbacks = true;
  I18n.translations = translations;
  I18n.pluralization = pluralization;
  // I18n.defaultSeparator = scopeSeparator;
  I18n.locale = currentLocale;
  I18n.defaultLocale = defaultLocale;
}

export function injectTranslations(translations: Record<string, Record<string, string>>): void {
  I18n.translations[I18n.locale] = deepmerge(I18n.translations[I18n.locale], translations);
}

export function toCurrency(num: number, options?: ToCurrencyOptions): string {
  return I18n.toCurrency(num, options);
}

export function formatDate(value: TDate, formatPath = 'date.formats.short'): string {
  if (!value) {
    return '';
  }
  const locale = currentLocale() as keyof typeof locales;
  const format = get(I18n.translations[locale], formatPath);
  return dateFormat(dateParseISO(value), format, { locale: locales[locale] });
}

export function currentLocale(): string {
  if (I18n.locale) {
    return I18n.locale;
  }

  throw new Error('Please, initialize translator with initializeI18n before using');
}

export function defaultLocale(): string {
  if (I18n.locale) {
    return I18n.defaultLocale;
  }

  throw new Error('Please, initialize translator with initializeI18n before using');
}

export function getWeek(): string[] {
  return get(I18n.translations[currentLocale()], 'date.week.short');
}

/**
 * Initialize with scope and get t() function
 * This function should be called in every file you need translator like this:
 * const t = getT('scope');
 * @param scope
 */
export function getT(scope: string): TFunction {
  return function (phrase: string, params?: TParams) {
    const translatorParams = { defaultValue: process.env.NODE_ENV === 'development' ? `{${phrase}}` : `${phrase}` };

    if (params) {
      Object.assign(translatorParams, params);
    }

    return I18n.translate(`${scope}${scopeSeparator}${normalizeKey(phrase)}`, translatorParams);
  };
}
