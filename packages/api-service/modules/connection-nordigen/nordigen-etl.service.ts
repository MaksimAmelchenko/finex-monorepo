import { IAccount, IConnection, INormalizedTransaction } from '../connection/types';
import { ILogger } from '../../types/app';
import { INordigenTransactions, NordigenETL, TransformationFunction } from './types';

import { N26Transformation } from './transformations/N26_NTSBDEB1';
import { defaultTransformation } from './transformations/default';

const institutionHandlerMap: Record<string, TransformationFunction> = {
  N26_NTSBDEB1: N26Transformation,
};

class NordigenETLImpl implements NordigenETL {
  transform(
    log: ILogger,
    connection: IConnection,
    account: IAccount,
    transactions: INordigenTransactions,
    options: {
      accounts: Array<{
        id: string;
        name: string;
        accountType: number;
        iban: string;
      }>;
    }
  ): INormalizedTransaction[] {
    const handler = institutionHandlerMap[connection.institutionId] || defaultTransformation;

    return handler(log, account, transactions, {
      accounts: options.accounts,
      connectionAccounts: connection.accounts
        .filter(({ accountId }) => accountId)
        .map(({ accountId, providerAccountName }) => ({
          accountId: accountId!,
          providerAccountName,
        })),
    });
  }
}

export const nordigenETL = new NordigenETLImpl();
