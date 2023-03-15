import { Currency } from '../stores/models/currency';
import { User } from '../stores/models/user';

export type moneyId = string;

export interface IApiMoney {
  id: string;
  currencyId: string | null;
  name: string;
  symbol: string;
  precision: number | null;
  isEnabled: boolean;
  sorting: number | null;
  userId: string;
}

export interface IMoney {
  id: string;
  currency: Currency | null;
  name: string;
  symbol: string;
  precision?: number;
  isEnabled: boolean;
  sorting: number | null;
  user: User;
}

export interface GetMoneysResponse {
  moneys: IApiMoney[];
}

export interface CreateMoneyData {
  currencyId: string | null;
  name: string;
  symbol: string;
  precision: number | null;
  isEnabled: boolean;
  sorting: number | null;
}

export interface CreateMoneyResponse {
  money: IApiMoney;
}

export type UpdateMoneyChanges = Partial<{
  currencyId: string | null;
  name: string;
  symbol: string;
  precision: number | null;
  isEnabled: boolean;
  sorting: number | null;
}>;

export interface UpdateMoneyResponse {
  money: IApiMoney;
}
