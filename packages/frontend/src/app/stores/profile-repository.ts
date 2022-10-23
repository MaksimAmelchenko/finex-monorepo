import { action, makeObservable, observable } from 'mobx';

import { AuthRepository } from '../core/other-stores/auth-repository';
import { CurrenciesRateSourceStore } from './currencies-rate-source-store';
import { DeleteProfileParams, IProfileApi, IProfileDTO, UpdateProfileChanges } from '../types/profile';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { Profile } from './models/profile';
import { ProjectsRepository } from './projects-repository';
import { UsersRepository } from './users-repository';
import { useStore } from '../core/hooks/use-store';

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

  consume({ id, name, email, projectId, timeout }: IProfileDTO): void {
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
      name,
      email,
      // currencyRateSource,
      project,
      timeout,
    });
  }

  async updateProfile(changes: UpdateProfileChanges): Promise<void> {
    return this.api.update(changes).then(({ profile }) => {
      this.consume(profile);
    });
  }

  async removeProfile(params: DeleteProfileParams): Promise<void> {
    return this.api.remove(params).then(() => {
      this.getStore(AuthRepository).clearAuth();
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
