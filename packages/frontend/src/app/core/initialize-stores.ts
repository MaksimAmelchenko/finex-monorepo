import { AccountTypesStore } from '../stores/account-types-store';
import { AccountsApi } from '../stores/api/accounts-api';
import { AccountsRepository } from '../stores/accounts-repository';
import { AuthApi } from './other-stores/auth-api';
import { AuthRepository } from './other-stores/auth-repository';
import { BalanceApi } from '../stores/api/balance-api';
import { BalanceRepository } from '../stores/balance-repository';
import { BillingApi } from '../stores/api/billing-api';
import { BillingRepository } from '../stores/billing-repository';
import { BootstrapApi } from '../stores/api/bootstrap-api';
import { BootstrapStore } from '../stores/bootstrap-store';
import { CashFlowsApi } from '../stores/api/cash-flows-api';
import { CashFlowsRepository } from '../stores/cash-flows-repository';
import { CategoriesApi } from '../stores/api/categories-api';
import { CategoriesRepository } from '../stores/categories-repository';
import { CategoryPrototypesRepository } from '../stores/category-prototypes-repository';
import { CommonStorageStore } from './other-stores/common-storage-store';
import { ContractorsApi } from '../stores/api/contractors-api';
import { ContractorsRepository } from '../stores/contractors-repository';
import { CurrenciesRateSourceStore } from '../stores/currencies-rate-source-store';
import { CurrenciesRepository } from '../stores/currency-repository';
import { DebtsApi } from '../stores/api/debts-api';
import { DebtsRepository } from '../stores/debts-repository';
import { ExchangesApi } from '../stores/api/exchanges-api';
import { ExchangesRepository } from '../stores/exchanges-repository';
import { MainStore } from './main-store';
import { MoneysApi } from '../stores/api/moneys-api';
import { MoneysRepository } from '../stores/moneys-repository';
import { ParamsStore } from '../stores/params-store';
import { PlanTransactionsApi } from '../stores/api/plan-transaction-api';
import { PlanTransactionsRepository } from '../stores/plan-transactions-repository';
import { PlansApi } from '../stores/api/plans-api';
import { PlansRepository } from '../stores/plans-repository';
import { ProfileApi } from '../stores/api/profile-api';
import { ProfileRepository } from '../stores/profile-repository';
import { ProjectsApi } from '../stores/api/projects-api';
import { ProjectsRepository } from '../stores/projects-repository';
import { ReportsApi } from '../stores/api/reports-api';
import { ReportsRepository } from '../stores/reports-store';
import { SessionStorageStore } from './other-stores/session-storage-store';
import { TagsApi } from '../stores/api/tags-api';
import { TagsRepository } from '../stores/tags-repository';
import { TransactionsApi } from '../stores/api/transaction-api';
import { TransactionsRepository } from '../stores/transactions-repository';
import { TransfersApi } from '../stores/api/transfers-api';
import { TransfersRepository } from '../stores/transfers-repository';
import { UnitsApi } from '../stores/api/units-api';
import { UnitsRepository } from '../stores/units-repository';
import { UsersApi } from '../stores/api/users-api';
import { UsersRepository } from '../stores/users-repository';

/**
 * Helper to initialize DI
 * @param {string} uri
 * @return {MainStore}
 */

export function initializeMainStore(): MainStore {
  const mainStore = new MainStore();
  new CommonStorageStore(mainStore);
  new SessionStorageStore(mainStore);

  new BootstrapStore(mainStore, new BootstrapApi(mainStore));

  new AuthRepository(mainStore, new AuthApi(mainStore));

  new UsersRepository(mainStore, new UsersApi(mainStore));
  new AccountTypesStore(mainStore);
  new AccountsRepository(mainStore, new AccountsApi(mainStore));
  new UnitsRepository(mainStore, new UnitsApi(mainStore));
  new ContractorsRepository(mainStore, new ContractorsApi(mainStore));
  new CategoryPrototypesRepository(mainStore);
  new CategoriesRepository(mainStore, new CategoriesApi(mainStore));
  new TagsRepository(mainStore, new TagsApi(mainStore));
  new ProjectsRepository(mainStore, new ProjectsApi(mainStore));
  new CurrenciesRepository(mainStore);
  new CurrenciesRateSourceStore(mainStore);
  new MoneysRepository(mainStore, new MoneysApi(mainStore));
  new ProfileRepository(mainStore, new ProfileApi(mainStore));

  new TransactionsRepository(mainStore, new TransactionsApi(mainStore));
  new PlansRepository(mainStore, new PlansApi(mainStore));
  new BalanceRepository(mainStore, new BalanceApi(mainStore));
  new ParamsStore(mainStore);

  new CashFlowsRepository(mainStore, new CashFlowsApi(mainStore));
  new DebtsRepository(mainStore, new DebtsApi(mainStore));
  new TransfersRepository(mainStore, new TransfersApi(mainStore));
  new ExchangesRepository(mainStore, new ExchangesApi(mainStore));
  new PlanTransactionsRepository(mainStore, new PlanTransactionsApi(mainStore));
  new ReportsRepository(mainStore, new ReportsApi(mainStore));

  new BillingRepository(mainStore, new BillingApi(mainStore));

  (window as any).mainStore = mainStore;
  return mainStore;
}
