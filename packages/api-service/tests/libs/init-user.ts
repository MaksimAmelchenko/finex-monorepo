import { Account } from '../../services/account/model/account';
import { AccountGateway } from '../../services/account/gateway';
import { CreateUser, createUser } from './create-user';
import { IRequestContext } from '../../types/app';
import { Money } from '../../services/money/model/money';
import { MoneyGateway } from '../../services/money/gateway';
import { User } from '../../services/user/model/user';

export interface UserData {
  user: User;
  accounts: Account[];
  moneys: Money[];
}
export async function initUser(
  ctx: IRequestContext<never, false>,
  { username, password }: CreateUser
): Promise<UserData> {
  const user = await createUser(ctx, {
    username,
    password,
  });

  const projectId: string = String(user.idProject);
  const userId: string = String(user.idUser);

  const accountFixtures = [
    {
      name: 'Test account 1',
      accountTypeId: '1',
      isEnabled: true,
    },
    {
      name: 'Test account 2',
      accountTypeId: '1',
      isEnabled: true,
    },
  ];
  const accounts = await Promise.all(
    accountFixtures.map(accountFixture => AccountGateway.createAccount(ctx, projectId, userId, accountFixture))
  );

  const moneyFixtures = [
    {
      name: 'Test money 1',
      symbol: 'M1',
      isEnabled: true,
    },
    {
      name: 'Test money 2',
      symbol: 'M2',
      isEnabled: true,
    },
  ];
  const moneys = await Promise.all(
    moneyFixtures.map(moneyFixture => MoneyGateway.createMoney(ctx, projectId, userId, moneyFixture))
  );

  return {
    user,
    accounts,
    moneys,
  };
}
