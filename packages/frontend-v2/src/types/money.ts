import { ICurrency } from './currency';
import { IUser } from './user';

export interface IMoneyRaw {
  idMoney: number;
  idCurrency: number | null;
  idUser: number;
  isEnabled: boolean;
  name: string;
  precision: number;
  sorting: number;
  symbol: number;
}

export interface IMoney {
  id: string;
  currency: ICurrency | null;
  user: IUser;
  isEnabled: boolean;
  name: string;
  precision: number;
  sorting: number;
  symbol: number;
}
