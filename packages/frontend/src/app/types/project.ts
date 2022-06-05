import { Permit, TDate } from './index';
import { IUser } from './user';
import { IAPIAccount } from './account';
import { IAPIContractor } from './contractor';
import { IAPICategory } from './category';
import { IAPIUnit } from './unit';
import { IAPITag } from './tag';
import { IApiMoney } from './money';

export interface IProjectRaw {
  idProject: number;
  idUser: number;
  name: string;
  note: string;
  permit: Permit;
  writers: number[];
}

export interface IProject {
  id: string;
  user: IUser;
  name: string;
  note: string;
  permit: Permit;
  writers: IUser[];
}

export interface IUseProjectResponse {
  accounts: IAPIAccount[];
  contractors: IAPIContractor[];
  categories: IAPICategory[];
  units: IAPIUnit[];
  tags: IAPITag[];
  moneys: IApiMoney[];
  params: {
    dashboard: {
      dBegin: TDate;
      dEnd: TDate;
    };
  };
}
