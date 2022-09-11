import { Account } from '../stores/models/account';
import { Metadata, TDate, TDateTime } from './index';
import { Money } from '../stores/models/money';
import { Tag } from '../stores/models/tag';
import { User } from '../stores/models/user';

export type IExchangeDTO = {
  userId: string;
  id: string;
  amountSell: number;
  moneySellId: string;
  amountBuy: number;
  moneyBuyId: string;
  accountSellId: string;
  accountBuyId: string;
  exchangeDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  moneyFeeId: string | null;
  accountFeeId: string | null;
  note: string;
  tags: string[];
  updatedAt: TDateTime;
};

export interface IExchange {
  user: User;
  id: string;
  amountSell: number;
  moneySell: Money;
  amountBuy: number;
  moneyBuy: Money;
  accountSell: Account;
  accountBuy: Account;
  exchangeDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  moneyFee: Money | null;
  accountFee: Account | null;
  note: string;
  tags: Tag[];
  updatedAt: TDateTime;
}

export interface GetExchangesQuery {
  limit: number;
  offset: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  accountsSell?: string;
  accountsBuy?: string;
  tags?: string;
}

export interface GetExchangesResponse {
  exchanges: IExchangeDTO[];
  metadata: Metadata;
}

export interface CreateExchangeData {
  amountSell: number;
  moneySellId: string;
  amountBuy: number;
  moneyBuyId: string;
  accountSellId: string;
  accountBuyId: string;
  exchangeDate: TDate;
  reportPeriod: TDate;
  fee?: number;
  moneyFeeId?: string;
  accountFeeId?: string;
  note?: string;
  tags?: string[];
}

export interface CreateExchangeResponse {
  exchange: IExchangeDTO;
}

export type UpdateExchangeChanges = Partial<{
  amountSell: number;
  moneySellId: string;
  amountBuy: number;
  moneyBuyId: string;
  accountSellId: string;
  accountBuyId: string;
  isFee: false;
  fee: number;
  moneyFeeId: string;
  accountFeeId: string;
  exchangeDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
}>;

export interface UpdateExchangeResponse {
  exchange: IExchangeDTO;
}

export interface IExchangesApi {
  getExchanges: (query: GetExchangesQuery) => Promise<GetExchangesResponse>;
  createExchange: (data: CreateExchangeData) => Promise<CreateExchangeResponse>;
  updateExchange: (exchangeId: string, changes: UpdateExchangeChanges) => Promise<UpdateExchangeResponse>;
  deleteExchange: (exchangeId: string) => Promise<void>;
}
