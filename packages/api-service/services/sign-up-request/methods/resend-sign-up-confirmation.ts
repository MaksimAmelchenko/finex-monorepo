import { IRequestContext } from '../../../types/app';
import { ISignUpRequest } from '../../../types/sign-up-request';
import { SignUpRequestGateway } from '../gateway';
import { NotFoundError, InvalidParametersError } from '../../../libs/errors';
import { TransactionalEmail } from '../../transactional-email';
import { Template } from '../../../types/transactional-email';
import { getSignUpConfirmationUrl } from './get-sign-up-confirmation-url';

export async function resendSignUpConfirmation(ctx: IRequestContext, id: string): Promise<void> {
  const signUpRequest: ISignUpRequest = await SignUpRequestGateway.get(ctx, id);
  if (!signUpRequest) {
    throw new NotFoundError();
  }

  // if (signUpRequest.confirmedAt) {
  //   throw new InvalidParametersError(`The username ${signUpRequest.name} has already been activated`);
  // }

  TransactionalEmail.send(ctx, {
    template: Template.SignUpConfirmation,
    email: signUpRequest.email,
    locals: {
      name: signUpRequest.name,
      url: getSignUpConfirmationUrl(signUpRequest.token),
    },
  }).catch(err => ctx.log.fatal({ err }));
}
