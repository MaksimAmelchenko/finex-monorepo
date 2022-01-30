import { IUser } from './user';
import { ICurrencyRateSource } from './currencies-rate-source';
import { IProject } from './project';

export interface IProfileRaw {
  idUser: number;
  idProject: number;
  email: string;
  name: string;
  idCurrencyRateSource: number;
}

export interface IProfile {
  user: IUser;
  currencyRateSource: ICurrencyRateSource;
  project: IProject;
}
