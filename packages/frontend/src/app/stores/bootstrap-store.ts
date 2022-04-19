import { AccountTypesStore } from './account-types-store';
import { AccountsRepository } from './accounts-repository';
import { CategoriesRepository } from './categories-repository';
import { CategoryPrototypesRepository } from './category-prototypes-repository';
import { ContractorsRepository } from './contractors-repository';
import { CurrenciesRateSourceStore } from './currencies-rate-source-store';
import { CurrenciesRepository } from './currency-repository';
import { IBootstrapRaw } from '../types/bootstrap';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { MoneysRepository } from './moneys-repository';
import { ParamsStore } from './params-store';
import { ProfileRepository } from './profile-repository';
import { ProjectsRepository } from './projects-repository';
import { TagsRepository } from './tags-repository';
import { UnitsRepository } from './units-repository';
import { UsersRepository } from './users-repository';

export interface IBootstrapApi {
  get: () => Promise<IBootstrapRaw>;
}

export class BootstrapStore extends ManageableStore {
  static storeName = 'BootstrapStore';

  constructor(mainStore: MainStore, private api: IBootstrapApi) {
    super(mainStore);
  }

  async get(): Promise<void> {
    const {
      accountTypes,
      accounts,
      badges,
      categories,
      categoryPrototypes,
      contractors,
      currencies,
      currencyRateSources,
      invitations,
      messages,
      moneys,
      params,
      profile,
      projects,
      session,
      tags,
      units,
      users,
    } = await this.api.get();

    console.time('consume bootstrap');
    this.getStore(UsersRepository).consume(users);
    this.getStore(AccountTypesStore).consume(accountTypes);
    this.getStore(AccountsRepository).consume(accounts);
    this.getStore(UnitsRepository).consume(units);
    this.getStore(ContractorsRepository).consume(contractors);
    this.getStore(CategoryPrototypesRepository).consume(categoryPrototypes);
    this.getStore(CategoriesRepository).consume(categories);
    this.getStore(TagsRepository).consume(tags);

    const projectsRepository = this.getStore(ProjectsRepository);
    projectsRepository.consume(projects);
    const project = projectsRepository.get(String(session.idProject));
    this.getStore(ProjectsRepository).setCurrentProject(project || projectsRepository.projects[0]);

    this.getStore(CurrenciesRepository).consume(currencies);
    this.getStore(CurrenciesRateSourceStore).consume(currencyRateSources);
    this.getStore(MoneysRepository).consume(moneys);
    this.getStore(ProfileRepository).consume(profile);
    this.getStore(ParamsStore).consume(params);

    console.timeEnd('consume bootstrap');
  }

  clear(): void {}
}
