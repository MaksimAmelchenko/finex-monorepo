import { Project } from '../stores/models/project';
import { User } from '../stores/models/user';

export interface IApiProfile {
  id: string;
  name: string;
  email: string;
  projectId: string;
  tz: string;
  timeout: string;
  currencyRateSourceId: string;
}

export interface IProfile {
  user: User;
  // currencyRateSource: CurrencyRateSource;
  project: Project | null;
}
