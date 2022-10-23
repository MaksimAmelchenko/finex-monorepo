import { TDate } from './index';
import { IApiAccount } from './account';
import { IApiAccountType } from './account-type';
import { IApiCategoryPrototype, IApiCategory } from './category';
import { IApiContractor } from './contractor';
import { IApiCurrency } from './currency';
import { IApiMoney } from './money';
import { IApiProject } from './project';
import { IApiTag } from './tag';
import { IApiUnit } from './unit';
import { IApiUser } from './user';
import { ICurrencyRateSourceRaw } from './currencies-rate-source';
import { IInvitationRaw } from './invitation';
import { IProfileDTO } from './profile';

export interface IApiBootstrap {
  accountTypes: IApiAccountType[];
  accounts: IApiAccount[];
  badges: IBadgeRaw[];
  categories: IApiCategory[];
  categoryPrototypes: IApiCategoryPrototype[];
  contractors: IApiContractor[];
  currencies: IApiCurrency[];
  // currencyRateSources: ICurrencyRateSourceRaw[];
  // invitations: IInvitationRaw[];
  // messages: Record<string, any>;
  moneys: IApiMoney[];
  params: {
    dashboard: {
      dBegin: TDate;
      dEnd: TDate;
    };
  };
  profile: IProfileDTO;
  projects: IApiProject[];
  session: {
    projectId: string;
  };
  tags: IApiTag[];
  units: IApiUnit[];
  users: IApiUser[];
}

export interface IBadgeRaw {
  menuItem: string;
  title: string;
  value: string;
}
