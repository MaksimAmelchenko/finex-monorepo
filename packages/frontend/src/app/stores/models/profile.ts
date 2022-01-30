import { IUser } from '../../types/user';
import { IProfile } from '../../types/profile';
import { IProject } from '../../types/project';
import { ICurrencyRateSource } from '../../types/currencies-rate-source';

export class Profile implements IProfile {
  readonly user: IUser;
  currencyRateSource: ICurrencyRateSource;
  project: IProject;

  constructor({ user, currencyRateSource, project }: IProfile) {
    this.user = user;
    this.currencyRateSource = currencyRateSource;
    this.project = project;
  }
}
