import {
  AccountRepository,
  AccountService,
  IAccountBalances,
  IAccountDailyBalance,
  IAccountsBalancesParams,
  IAccountsDailyBalancesParams,
} from './types';
import { IRequestContext } from '../../types/app';
import { accountRepository } from './account.repository';

class AccountServiceImpl implements AccountService {
  private accountRepository: AccountRepository;

  constructor({ accountRepository }: { accountRepository: AccountRepository }) {
    this.accountRepository = accountRepository;
  }

  getBalances(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    params: IAccountsBalancesParams
  ): Promise<IAccountBalances[]> {
    return this.accountRepository.getBalances(ctx, projectId, userId, params);
  }

  getDailyBalances(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    params: IAccountsDailyBalancesParams
  ): Promise<IAccountDailyBalance[]> {
    return this.accountRepository.getDailyBalances(ctx, projectId, userId, params);
  }
}

export const accountService = new AccountServiceImpl({
  accountRepository,
});
