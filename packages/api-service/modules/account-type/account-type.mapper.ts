import { AccountType } from './models/account-type';
import { AccountTypeMapper, IAccountType, IAccountTypeDAO, IAccountTypeDTO } from './types';
import { Locale } from '../../types/app';
import { t } from '../../libs/t';

class AccountTypeMapperImpl implements AccountTypeMapper {
  toDomain(accountTypeDAO: IAccountTypeDAO): IAccountType {
    const { id, name } = accountTypeDAO;

    return new AccountType({
      id: String(id),
      name,
    });
  }

  toDTO(accountType: IAccountType, locale: Locale): IAccountTypeDTO {
    const { id, name } = accountType;

    return {
      id,
      name: t(name, locale),
    };
  }
}

export const accountTypeMapper = new AccountTypeMapperImpl();
