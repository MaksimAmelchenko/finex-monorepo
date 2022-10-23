import { CurrencyRateSource } from '../../types/currency-rate-source';
import { Household } from '../../services/household';
import { IHousehold } from '../../types/household';
import { IRequestContext } from '../../types/app';
import { IUser } from '../../modules/user/types';
import { ProjectService } from '../../services/project';
import { hashPassword } from '../../services/auth/methods/hash-password';
import { userRepository } from '../../modules/user/user.repository';
import { userService } from '../../modules/user/user.service';
import { userMapper } from '../../modules/user/user.mapper';

export interface CreateUser {
  username: string;
  password: string;
}

export async function createUser(ctx: IRequestContext, { username, password }: CreateUser): Promise<IUser> {
  const household: IHousehold = await Household.create(ctx);
  const hashedPassword = await hashPassword(password);

  let user = await userRepository.createUser(ctx, {
    name: username,
    email: username,
    password: hashedPassword,
    householdId: String(household.id),
    currencyRateSourceId: String(CurrencyRateSource.OpenExchangeRates),
  });

  const userId: string = String(user.idUser);
  const project = await ProjectService.createProject(ctx, userId, { name: 'Моя бухгалтерия' });

  user = await userRepository.updateUser(ctx, userId, { projectId: String(project.idProject) });
  return userMapper.toDomain(user);
}
