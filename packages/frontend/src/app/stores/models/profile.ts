import { IProfile } from '../../types/profile';
import { Project } from './project';
import { User } from './user';

export class Profile implements IProfile {
  readonly user: User;
  // currencyRateSource: ICurrencyRateSource;
  project: Project | null;
  name: string;
  email: string;
  timeout: string;

  constructor({ user, name, email, project, timeout }: IProfile) {
    this.user = user;
    this.name = name;
    this.email = email;
    // this.currencyRateSource = currencyRateSource;
    this.project = project;
    this.timeout = timeout;
  }
}
