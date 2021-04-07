import got from 'got';

import { IRequestContext, TDateTime } from '../../../../types/app';
import { SignUpRequest } from '../../../../services/sign-up-request';
import { ISignUpRequest } from '../../../../types/sign-up-request';
import config from '../../../../libs/config';
import { IResponse } from '../../../../libs/rest-api/types';

const { secret } = config.get('captcha');

interface IRecaptchaResponse {
  success: boolean;
  challenge_ts: TDateTime; // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  hostname: string; // the hostname of the site where the reCAPTCHA was solved
  'error-codes': string[]; // optional
}

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const { name, email, password, isAcceptTerms, recaptcha } = ctx.params;
  const { ip } = ctx.additionalParams;

  const response: IRecaptchaResponse = await got(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&remoteip=${ip}&response=${recaptcha}`
  ).json();

  // if (!response.success) {
  //   throw new InvalidParametersError('Invalid reCAPTCHA');
  // }

  const signUpRequest: ISignUpRequest = await SignUpRequest.create(ctx, {
    name,
    email,
    password,
  });

  return {
    body: {
      signUpRequest: {
        id: signUpRequest.id,
      },
    },
  };
}
