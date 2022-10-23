import { ConflictError, GoneError, NotFoundError } from '../../../libs/errors';
import { CurrencyRateSource } from '../../../types/currency-rate-source';
import { Household } from '../../household';
import { IHousehold } from '../../../types/household';
import { IRequestContext } from '../../../types/app';
import { ISignUpRequest } from '../../../types/sign-up-request';
import { Project } from '../../project/model/project';
import { ProjectService } from '../../project';
import { SignUpRequestGateway } from '../gateway';
import { userRepository } from '../../../modules/user/user.repository';

export async function confirmSignUpRequest(ctx: IRequestContext<unknown, true>, token: string): Promise<void> {
  const signUpRequest: ISignUpRequest | undefined = await SignUpRequestGateway.getByToken(ctx, token);
  if (!signUpRequest) {
    throw new NotFoundError('Token not found');
  }

  if (signUpRequest.confirmedAt) {
    throw new GoneError(`The registration has already been confirmed`);
  }

  // checks
  const userCheck = await userRepository.getUserByUsername(ctx, signUpRequest.email);

  if (userCheck) {
    throw new ConflictError('This email already registered');
  }

  const household: IHousehold = await Household.create(ctx);

  const user = await userRepository.createUser(ctx, {
    name: signUpRequest.name,
    email: signUpRequest.email,
    password: signUpRequest.password,
    householdId: String(household.id),
    currencyRateSourceId: String(CurrencyRateSource.OpenExchangeRates),
  });

  const userId: string = String(user.idUser);
  const project: Project = await ProjectService.createProject(ctx, userId, { name: 'Моя бухгалтерия' });

  await userRepository.updateUser(ctx, userId, { projectId: String(project.idProject) });

  await SignUpRequestGateway.update(ctx, signUpRequest.id, {
    confirmed_at: new Date().toISOString(),
  });
}
