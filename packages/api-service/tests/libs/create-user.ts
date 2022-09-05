import { CurrencyRateSource } from '../../types/currency-rate-source';
import { Household } from '../../services/household';
import { IHousehold } from '../../types/household';
import { IRequestContext } from '../../types/app';
import { ProjectService } from '../../services/project';
import { User } from '../../services/user/model/user';
import { UserGateway } from '../../services/user/gateway';
import { UserService } from '../../services/user';
import { hashPassword } from '../../services/auth/methods/hash-password';

export interface CreateUser {
  username: string;
  password: string;
}

export async function createUser(
  ctx: IRequestContext<never, false>,
  { username, password }: CreateUser
): Promise<User> {
  const household: IHousehold = await Household.create(ctx);
  const hashedPassword = await hashPassword(password);

  let user = await UserGateway.createUser(ctx, {
    name: username,
    email: username,
    password: hashedPassword,
    householdId: String(household.id),
    currencyRateSourceId: String(CurrencyRateSource.OpenExchangeRates),
  });

  const userId: string = String(user.idUser);
  const project = await ProjectService.createProject(ctx, userId, { name: 'Моя бухгалтерия' });

  return UserService.updateUser(ctx, userId, { projectId: String(project.idProject) });
}
