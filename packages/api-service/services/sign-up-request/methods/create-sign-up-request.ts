import { ConflictError } from '../../../libs/errors';
import { ICreateSingUpRequestServiceParams, ISignUpRequest } from '../../../types/sign-up-request';
import { IRequestContext } from '../../../types/app';
import { SignUpRequestGateway } from '../gateway';
import { Template } from '../../../types/transactional-email';
import { TransactionalEmail } from '../../transactional-email';
import { getSignUpConfirmationUrl } from './get-sign-up-confirmation-url';
import { hashPassword } from '../../auth/methods/hash-password';
import { userRepository } from '../../../modules/user/user.repository';

export async function createSignUpRequest(
  ctx: IRequestContext,
  params: ICreateSingUpRequestServiceParams
): Promise<ISignUpRequest> {
  const { name, email, password, origin } = params;

  const user = await userRepository.getUserByUsername(ctx, email);

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
      url: getSignUpConfirmationUrl(signUpRequest.token, { origin, locale: ctx.params.locale }),
    },
  }).catch(err => ctx.log.fatal({ err }));

  return signUpRequest;
}
