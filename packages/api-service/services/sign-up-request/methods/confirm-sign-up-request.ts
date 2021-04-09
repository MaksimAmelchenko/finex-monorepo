import * as moment from 'moment';
import { IRequestContext } from '../../../types/app';
import { ISignUpRequest } from '../../../types/sign-up-request';
import { SignUpRequestGateway } from '../gateway';
import { UserGateway } from '../../user/gateway';
import { ConflictError, GoneError, NotFoundError } from '../../../libs/errors';
import { IHousehold } from '../../../types/household';
import { Household } from '../../household';
import { IUser } from '../../../types/user';
import { User } from '../../user';
import { Project } from '../../project';
import { IProject } from '../../../types/project';
import { CurrencyRateSource } from '../../../types/currency-rate-source';

export async function confirmSignUpRequest(ctx: IRequestContext, token: string): Promise<void> {
  const signUpRequest: ISignUpRequest | undefined = await SignUpRequestGateway.getByToken(ctx, token);
  if (!signUpRequest) {
    throw new NotFoundError('Token not found');
  }

  if (signUpRequest.confirmedAt) {
    throw new GoneError(`The registration has already been confirmed`);
  }

  // checks
  const userCheck = await UserGateway.getByUsername(ctx, signUpRequest.email);

  if (userCheck) {
    throw new ConflictError('This email already registered');
  }

  const household: IHousehold = await Household.create(ctx);

  const user: IUser = await User.create(ctx, {
    name: signUpRequest.name,
    email: signUpRequest.email,
    password: signUpRequest.password,
    id_household: household.id,
    id_currency_rate_source: CurrencyRateSource.OpenExchangeRates,
  });

  const project: IProject = await Project.create(ctx, { id_user: user.id, name: 'Моя бухгалтерия' });

  await User.update(ctx, user.id, { id_project: project.id });

  await SignUpRequestGateway.update(ctx, signUpRequest.id, {
    confirmed_at: moment.utc().format(),
  });
}
