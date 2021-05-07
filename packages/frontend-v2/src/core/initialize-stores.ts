import { MainStore } from './main-store';
import { AccountTypesStore } from '../stores/account-types-store';
import { CommonStorageStore } from './other-stores/common-storage-store';
import { AuthApi } from './other-stores/auth-api';
import { AuthRepository } from './other-stores/auth-repository';
import { BootstrapStore } from '../stores/bootstrap-store';
import { BootstrapApi } from '../stores/api/bootstrap-api';
import { AccountsRepository } from '../stores/accounts-repository';
import { AccountsApi } from '../stores/api/accounts-api';
import { UnitsRepository } from '../stores/units-repository';
import { UnitsApi } from '../stores/api/units-api';
import { UsersRepository } from '../stores/users-repository';
import { UsersApi } from '../stores/api/users-api';
import { ContractorsRepository } from '../stores/contractors-repository';
import { ContractorsApi } from '../stores/api/contractors-api';
import { CategoryPrototypesRepository } from '../stores/category-prototypes-repository';
import { CategoriesApi } from '../stores/api/categories-api';
import { CategoriesRepository } from '../stores/categories-repository';
import { TagsRepository } from '../stores/tags-repository';
import { TagsApi } from '../stores/api/tags-api';
import { ProjectsRepository } from '../stores/projects-repository';
import { ProjectsApi } from '../stores/api/projects-api';
import { CurrenciesRepository } from '../stores/currency-repository';
import { MoneysRepository } from '../stores/moneys-repository';
import { MoneysApi } from '../stores/api/moneys-api';
import { ProfileRepository } from '../stores/profile-repository';
import { ProfileApi } from '../stores/api/profile-api';
import { CurrenciesRateSourceStore } from '../stores/currencies-rate-source-store';

/**
 * Helper to initialize DI
 * @param {string} uri
 * @return {MainStore}
 */

export function initializeMainStore(): MainStore {
  const mainStore = new MainStore();
  new CommonStorageStore(mainStore);

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

  (window as any).mainStore = mainStore;
  return mainStore;
}
