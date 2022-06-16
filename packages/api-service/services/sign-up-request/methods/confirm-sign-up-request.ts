import { IRequestContext } from '../../../types/app';
import { ISignUpRequest } from '../../../types/sign-up-request';
import { SignUpRequestGateway } from '../gateway';
import { UserGateway } from '../../user/gateway';
import { ConflictError, GoneError, NotFoundError } from '../../../libs/errors';
import { IHousehold } from '../../../types/household';
import { Household } from '../../household';
import { UserService } from '../../user';
import { ProjectService } from '../../project';
import { CurrencyRateSource } from '../../../types/currency-rate-source';
import { User } from '../../user/model/user';
import { Project } from '../../project/model/project';

export async function confirmSignUpRequest(ctx: IRequestContext, token: string): Promise<void> {
  const signUpRequest: ISignUpRequest | undefined = await SignUpRequestGateway.getByToken(ctx, token);
  if (!signUpRequest) {
    throw new NotFoundError('Token not found');
  }

  if (signUpRequest.confirmedAt) {
    throw new GoneError(`The registration has already been confirmed`);
  }

  // checks
  const userCheck = await UserGateway.getUserByUsername(ctx, signUpRequest.email);

  if (userCheck) {
    throw new ConflictError('This email already registered');
  }

  const household: IHousehold = await Household.create(ctx);

  const user: User = await UserService.createUser(ctx, {
    name: signUpRequest.name,
    email: signUpRequest.email,
    password: signUpRequest.password,
    householdId: String(household.id),
    currencyRateSourceId: String(CurrencyRateSource.OpenExchangeRates),
  });

  const userId: string = String(user.idUser);
  const project: Project = await ProjectService.createProject(ctx, userId, { name: 'Моя бухгалтерия' });

  await UserService.updateUser(ctx, userId, { projectId: String(project.idProject) });

  await SignUpRequestGateway.update(ctx, signUpRequest.id, {
    confirmed_at: new Date().toISOString(),
  });
}
