import config from './config';
import { TI18nField, Locale } from '../types/app';

const [defaultLocale] = config.get('locales') as Locale[];

export function t<T>(field: TI18nField<T>, locale: Locale): T {
  return field[locale] || field[defaultLocale];
}
