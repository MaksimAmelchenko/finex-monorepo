import { Permit, TDate } from './index';
import { IUser } from './user';
import { IAccountRaw } from './account';
import { IContractorRaw } from './contractor';
import { ICategoryRaw } from './category';
import { IUnitRaw } from './unit';
import { ITagRaw } from './tag';
import { IMoneyRaw } from './money';

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
  accounts: IAccountRaw[];
  contractors: IContractorRaw[];
  categories: ICategoryRaw[];
  units: IUnitRaw[];
  tags: ITagRaw[];
  moneys: IMoneyRaw[];
  params: {
    dashboard: {
      dBegin: TDate;
      dEnd: TDate;
    };
  };
}
