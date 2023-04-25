import { TDate } from './index';
import { IAccountTypeDTO } from './account-type';
import { IApiAccount } from './account';
import { ICategoryPrototypeDTO, ICategoryDTO } from './category';
import { IApiContractor } from './contractor';
import { IMoneyDTO } from './money';
import { IApiProject } from './project';
import { IApiTag } from './tag';
import { IApiUnit } from './unit';
import { IApiUser } from './user';
import { ICurrencyRateSourceRaw } from './currencies-rate-source';
import { IInvitationRaw } from './invitation';
import { IProfileDTO } from './profile';
import { IParamsDTO } from './params';

export interface IApiBootstrap {
  accountTypes: IAccountTypeDTO[];
  accounts: IApiAccount[];
  badges: IBadgeRaw[];
  categories: ICategoryDTO[];
  categoryPrototypes: ICategoryPrototypeDTO[];
  contractors: IApiContractor[];
  // currencyRateSources: ICurrencyRateSourceRaw[];
  // invitations: IInvitationRaw[];
  // messages: Record<string, any>;
  moneys: IMoneyDTO[];
  params: IParamsDTO;
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
