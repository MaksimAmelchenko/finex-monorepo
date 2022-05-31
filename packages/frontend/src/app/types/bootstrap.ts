import { TDate } from './index';
import { IAPIAccount } from './account';
import { IAPIContractor } from './contractor';
import { IUnitRaw } from './unit';
import { IUserRaw } from './user';
import { IAPICategoryPrototype, IAPICategory } from './category';
import { IAccountTypeRaw } from './account-type';
import { ITagRaw } from './tag';
import { IProjectRaw } from './project';
import { ICurrencyRaw } from './currency';
import { ICurrencyRateSourceRaw } from './currencies-rate-source';
import { IInvitationRaw } from './invitation';
import { IMoneyRaw } from './money';
import { IProfileRaw } from './profile';

export interface IBootstrapRaw {
  accountTypes: IAccountTypeRaw[];
  accounts: IAPIAccount[];
  badges: IBadgeRaw[];
  categories: IAPICategory[];
  categoryPrototypes: IAPICategoryPrototype[];
  contractors: IAPIContractor[];
  currencies: ICurrencyRaw[];
  currencyRateSources: ICurrencyRateSourceRaw[];
  invitations: IInvitationRaw[];
  messages: Record<string, any>;
  moneys: IMoneyRaw[];
  params: {
    dashboard: {
      dBegin: TDate;
      dEnd: TDate;
    };
  };
  profile: IProfileRaw;
  projects: IProjectRaw[];
  session: {
    idProject: number;
  };
  tags: ITagRaw[];
  units: IUnitRaw[];
  users: IUserRaw[];
}

export interface IBadgeRaw {
  menuItem: string;
  title: string;
  value: string;
}
