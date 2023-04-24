import { Currency } from '../stores/models/currency';
import { User } from '../stores/models/user';

export type moneyId = string;

export interface IMoneyDTO {
  id: string;
  currencyCode: string | null;
  name: string;
  symbol: string;
  precision: number | null;
  isEnabled: boolean;
  sorting: number | null;
  userId: string;
}

export interface IMoney {
  id: string;
  currencyCode: string | null;
  name: string;
  symbol: string;
  precision?: number;
  isEnabled: boolean;
  sorting: number | null;
  user: User;
}

export interface GetMoneysResponse {
  moneys: IMoneyDTO[];
}

export interface CreateMoneyData {
  currencyCode: string | null;
  name: string;
  symbol: string;
  precision: number | null;
  isEnabled: boolean;
  sorting: number | null;
}

export interface CreateMoneyResponse {
  money: IMoneyDTO;
}

export type UpdateMoneyChanges = Partial<{
  currencyCode: string | null;
  name: string;
  symbol: string;
  precision: number | null;
  isEnabled: boolean;
  sorting: number | null;
}>;

export interface UpdateMoneyResponse {
  money: IMoneyDTO;
}
