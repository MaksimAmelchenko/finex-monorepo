import { Permit, TDate } from './index';
import { IUser } from './user';
import { accountsSchema } from '../../../api-service/api/v1/projects/use-project/accounts.schema';
import { contractorsSchema } from '../../../api-service/api/v1/projects/use-project/contractors.schema';
import { categoriesSchema } from '../../../api-service/api/v1/projects/use-project/categories.schema';
import { unitsSchema } from '../../../api-service/api/v1/projects/use-project/units.schema';
import { tagsSchema } from '../../../api-service/api/v1/projects/use-project/tags.schema';
import { moneysSchema } from '../../../api-service/api/v1/projects/use-project/moneys.schema';
import { date } from '../../../api-service/common/schemas/fields/date';
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
