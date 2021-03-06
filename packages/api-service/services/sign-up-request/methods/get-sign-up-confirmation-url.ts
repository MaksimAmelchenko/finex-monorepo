import config from '../../../libs/config';

const appDomain = config.get('appDomain');

export function getSignUpConfirmationUrl(token: string): string {
  return `https://${appDomain}/signup/confirm?token=${token}`;
}
