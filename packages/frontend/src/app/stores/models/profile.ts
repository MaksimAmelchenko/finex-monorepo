import { IProfile } from '../../types/profile';
import { Project } from './project';
import { User } from './user';

export class Profile implements IProfile {
  readonly user: User;
  // currencyRateSource: ICurrencyRateSource;
  project: Project | null;

  constructor({ user, project }: IProfile) {
    this.user = user;
    // this.currencyRateSource = currencyRateSource;
    this.project = project;
  }
}
