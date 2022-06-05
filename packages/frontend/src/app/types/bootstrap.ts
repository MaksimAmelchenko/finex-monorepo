import { TDate } from './index';
import { IAPIAccount } from './account';
import { IAPIContractor } from './contractor';
import { IAPIUnit } from './unit';
import { IUserRaw } from './user';
import { IAPICategoryPrototype, IAPICategory } from './category';
import { IAccountTypeRaw } from './account-type';
import { IAPITag } from './tag';
import { IProjectRaw } from './project';
import { IApiCurrency } from './currency';
import { ICurrencyRateSourceRaw } from './currencies-rate-source';
import { IInvitationRaw } from './invitation';
import { IApiMoney } from './money';
import { IProfileRaw } from './profile';

export interface IBootstrapRaw {
  accountTypes: IAccountTypeRaw[];
  accounts: IAPIAccount[];
  badges: IBadgeRaw[];
  categories: IAPICategory[];
  categoryPrototypes: IAPICategoryPrototype[];
  contractors: IAPIContractor[];
  currencies: IApiCurrency[];
  currencyRateSources: ICurrencyRateSourceRaw[];
  invitations: IInvitationRaw[];
  messages: Record<string, any>;
  moneys: IApiMoney[];
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
  tags: IAPITag[];
  units: IAPIUnit[];
  users: IUserRaw[];
}

export interface IBadgeRaw {
  menuItem: string;
  title: string;
  value: string;
}
