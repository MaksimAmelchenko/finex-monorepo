import { Account } from '../../services/account/model/account';
import { AccountGateway } from '../../services/account/gateway';
import { Category } from '../../services/category/model/category';
import { CategoryService } from '../../services/category';
import { CreateUser, createUser } from './create-user';
import { IRequestContext } from '../../types/app';
import { IUser } from '../../modules/user/types';
import { Money } from '../../modules/money/models/money';
import { moneyRepository } from '../../modules/money/money.repository';
import { moneyMapper } from '../../modules/money/money.mapper';

export interface UserData {
  user: IUser;
  accounts: Account[];
  moneys: Money[];
  categories: Category[];
}

export async function initUser(ctx: IRequestContext, { username, password }: CreateUser): Promise<UserData> {
  const user = await createUser(ctx, {
    username,
    password,
  });

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
    accountFixtures.map(accountFixture => AccountGateway.createAccount(ctx, user.projectId!, user.id, accountFixture))
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
  const moneysDAOs = await Promise.all(
    moneyFixtures.map(moneyFixture => moneyRepository.createMoney(ctx, user.projectId!, user.id, moneyFixture))
  );

  const categories = await CategoryService.getCategories(ctx, user.projectId!);

  return {
    user,
    accounts,
    moneys: moneysDAOs.map(moneyMapper.toDomain),
    categories,
  };
}
