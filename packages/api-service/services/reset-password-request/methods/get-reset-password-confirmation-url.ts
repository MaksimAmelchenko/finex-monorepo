import config from '../../../libs/config';

const appDomain = config.get('appDomain');

export function getResetPasswordConfirmationUrl(token: string): string {
  // return `https://${appDomain}/reset-password/${token}/confirm`;
  return `https://${appDomain}/reset-password/confirmation?token=${token}`;
}
