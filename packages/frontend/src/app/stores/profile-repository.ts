import { action, makeObservable, observable } from 'mobx';

import { CurrenciesRateSourceStore } from './currencies-rate-source-store';
import { IApiProfile, IProfile } from '../types/profile';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { Profile } from './models/profile';
import { ProjectsRepository } from './projects-repository';
import { UsersRepository } from './users-repository';
import { useStore } from '../core/hooks/use-store';

export interface IProfileApi {}

export class ProfileRepository extends ManageableStore {
  static storeName = 'ProfileRepository';

  profile: Profile | null = null;

  constructor(mainStore: MainStore, private api: IProfileApi) {
    super(mainStore);
    makeObservable(this, {
      profile: observable,
      consume: action,
      clear: action,
    });
  }

  consume({ id, projectId }: IApiProfile): void {
    const usersRepository = this.getStore(UsersRepository);
    const currenciesRateSourceStore = this.getStore(CurrenciesRateSourceStore);
    const projectsRepository = this.getStore(ProjectsRepository);

    const user = usersRepository.get(id);
    if (!user) {
      console.warn('User is not found', { id });
      throw new Error('User is not found');
    }

    // const currencyRateSource = currenciesRateSourceStore.get(String(profile.idCurrencyRateSource));
    // if (!currencyRateSource) {
    //   console.warn('CurrencyRateSource is not found', { profile });
    //   throw new Error('CurrencyRateSource is not found');
    // }

    const project = projectsRepository.get(projectId);
    if (!project) {
      console.warn('Project is not found', { projectId });
      throw new Error('Project');
    }

    this.profile = new Profile({
      user,
      // currencyRateSource,
      project,
    });
  }

  clear(): void {
    this.profile = null;
  }
}

export function useProfile(): Profile | null {
  const profileRepository = useStore(ProfileRepository);
  return profileRepository.profile;
}
