import { AccountTypeService, IAccountType } from './types';
import { IRequestContext } from '../../types/app';
import { NotFoundError } from '../../libs/errors';
import { accountTypeMapper } from './account-type.mapper';
import { accountTypeRepository } from './account-type.repository';

class AccountTypeServiceImpl implements AccountTypeService {
  async getAccountType(ctx: IRequestContext, accountTypeId: string): Promise<IAccountType> {
    const accountTypeDAO = await accountTypeRepository.getAccountType(ctx, accountTypeId);

    if (!accountTypeDAO) {
      throw new NotFoundError('AccountType not found');
    }

    return accountTypeMapper.toDomain(accountTypeDAO);
  }

  async getAccountTypes(ctx: IRequestContext<unknown, true>): Promise<IAccountType[]> {
    const accountTypeDAOs = await accountTypeRepository.getAccountTypes(ctx);

    return accountTypeDAOs.map(accountTypeMapper.toDomain);
  }
}

export const accountTypeService = new AccountTypeServiceImpl();
