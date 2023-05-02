import { AccountTypeDAO } from './models/account-type-dao';
import { IAccountTypeDAO, AccountTypeRepository } from './types';
import { IRequestContext } from '../../types/app';

class AccountTypeRepositoryImpl implements AccountTypeRepository {
  async getAccountType(ctx: IRequestContext, accountTypeId: string): Promise<IAccountTypeDAO | undefined> {
    ctx.log.trace({ accountTypeId }, 'try to get account type');

    return AccountTypeDAO.query(ctx.trx).findById(Number(accountTypeId));
  }

  async getAccountTypes(ctx: IRequestContext<unknown, true>): Promise<IAccountTypeDAO[]> {
    ctx.log.trace('try to get account types');

    return AccountTypeDAO.query(ctx.trx);
  }
}

export const accountTypeRepository = new AccountTypeRepositoryImpl();
