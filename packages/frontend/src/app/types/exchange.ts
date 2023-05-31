import { Account } from '../stores/models/account';
import { Metadata, TDate, TDateTime } from './index';
import { Money } from '../stores/models/money';
import { Tag } from '../stores/models/tag';
import { User } from '../stores/models/user';

export type IExchangeDTO = {
  userId: string;
  id: string;
  sellAmount: number;
  sellMoneyId: string;
  buyAmount: number;
  buyMoneyId: string;
  sellAccountId: string;
  buyAccountId: string;
  exchangeDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  feeMoneyId: string | null;
  feeAccountId: string | null;
  note: string;
  tags: string[];
  updatedAt: TDateTime;
};

export interface IExchange {
  user: User;
  id: string;
  sellAmount: number;
  sellMoney: Money;
  buyAmount: number;
  buyMoney: Money;
  sellAccount: Account;
  buyAccount: Account;
  exchangeDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  feeMoney: Money | null;
  feeAccount: Account | null;
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
  sellAccounts?: string;
  buyAccounts?: string;
  tags?: string;
}

export interface GetExchangesResponse {
  exchanges: IExchangeDTO[];
  metadata: Metadata;
}

export interface CreateExchangeData {
  sellAmount: number;
  sellMoneyId: string;
  buyAmount: number;
  buyMoneyId: string;
  sellAccountId: string;
  buyAccountId: string;
  exchangeDate: TDate;
  reportPeriod: TDate;
  fee?: number;
  feeMoneyId?: string;
  feeAccountId?: string;
  note?: string;
  tags?: string[];
}

export interface CreateExchangeResponse {
  exchange: IExchangeDTO;
}

export type UpdateExchangeChanges = Partial<{
  sellAmount: number;
  sellMoneyId: string;
  buyAmount: number;
  buyMoneyId: string;
  sellAccountId: string;
  buyAccountId: string;
  isFee: false;
  fee: number;
  feeMoneyId: string;
  feeAccountId: string;
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
