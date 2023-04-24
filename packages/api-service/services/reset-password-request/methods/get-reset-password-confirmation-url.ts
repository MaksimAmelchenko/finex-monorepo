import { Locale } from '../../../types/app';

interface IOptions {
  origin: string;
  locale: Locale;
}

export function getResetPasswordConfirmationUrl(token: string, { origin, locale }: IOptions): string {
  return `${origin}/reset-password/confirmation?token=${token}&locale=${locale}`;
}
