import { ConflictError } from '../../../libs/errors';

import { IRequestContext } from '../../../types/app';
import { ICreateParams, ISignUpRequest } from '../../../types/sign-up-request';
import { SignUpRequestGateway } from '../gateway';
import { UserGateway } from '../../user/gateway';
import { TransactionalEmail } from '../../transactional-email';
import { getSignUpConfirmationUrl } from './get-sign-up-confirmation-url';
import { hashPassword } from '../../auth/methods/hash-password';
import { Template } from '../../../types/transactional-email';

export async function createSignUpRequest(ctx: IRequestContext, params: ICreateParams): Promise<ISignUpRequest> {
  const { name, email, password } = params;

  const user = await UserGateway.getByUsername(ctx, email);

  if (user) {
    throw new ConflictError('This email already registered');
  }

  const hashedPassword: string = await hashPassword(password);

  const signUpRequest: ISignUpRequest = await SignUpRequestGateway.create(ctx, {
    name,
    email,
    password: hashedPassword,
  });

  TransactionalEmail.send(ctx, {
    template: Template.SignUpConfirmation,
    email,
    locals: {
      name,
      url: getSignUpConfirmationUrl(signUpRequest.token),
    },
  }).catch(err => ctx.log.fatal({ err }));

  return signUpRequest;
}
