import { Locale } from '../../../types/app';

interface IOptions {
  origin: string;
  locale: Locale;
}

export function getSignUpConfirmationUrl(token: string, { origin, locale }: IOptions): string {
  return `${origin}/sign-up/confirmation?token=${token}&locale=${locale}`;
}
