import {
  ConnectionMapper,
  IAccount,
  IAccountDAO,
  IAccountDTO,
  IConnection,
  IConnectionDAO,
  IConnectionDTO,
  ICountry,
  ICountryDAO,
  ICountryDTO,
  ITransaction,
  ITransactionDAO,
} from './types';
import { Connection } from './models/connection';
import { Country } from './models/country';
import { Locale } from '../../types/app';
import { t } from '../../libs/t';

class ConnectionMapperImpl implements ConnectionMapper {
  toCountry(countryDAO: ICountryDAO): ICountry {
    const { code, name } = countryDAO;

    return new Country({
      code,
      name,
    });
  }

  toCountryDTO(country: ICountry, locale: Locale): ICountryDTO {
    const { code, name } = country;
    return {
      code,
      name: t(name, locale),
    };
  }

  toAccount(connectionAccountDAO: IAccountDAO): IAccount {
    const { projectId, userId, accountId, ...rest } = connectionAccountDAO;

    return {
      projectId: String(projectId),
      userId: String(userId),
      accountId: accountId ? String(accountId) : null,
      ...rest,
    };
  }

  toAccountDTO(account: IAccount): IAccountDTO {
    const { projectId, userId, connectionId, providerAccountProduct, createdAt, updatedAt, ...rest } = account;
    return {
      ...rest,
      providerAccountProduct: providerAccountProduct ?? '',
    };
  }

  toConnection(connectionDAO: IConnectionDAO, connectionAccount: IAccountDAO[]): IConnection {
    const { projectId, userId, id, provider, institutionId, institutionLogo, institutionName, createdAt, updatedAt } =
      connectionDAO;

    return new Connection({
      projectId: String(projectId),
      userId: String(userId),
      id,
      provider,
      institutionId,
      institutionLogo,
      institutionName,
      accounts: connectionAccount.map(account => this.toAccount(account)),
      createdAt,
      updatedAt,
    });
  }

  toConnectionDTO(connection: IConnection): IConnectionDTO {
    const { id, institutionName, institutionLogo, provider, accounts } = connection;

    return {
      id,
      institutionName,
      institutionLogo,
      provider,
      accounts: accounts.map(account => this.toAccountDTO(account)),
    };
  }

  toTransaction(transactionDAO: ITransactionDAO): ITransaction {
    const { projectId, userId, cashFlowId, ...rest } = transactionDAO;
    return {
      projectId: String(projectId),
      userId: String(userId),
      cashFlowId: String(cashFlowId),
      ...rest,
    };
  }
}

export const connectionMapper = new ConnectionMapperImpl();
