import { IRequestContext, Permissions, TDate, TDateTime } from '../../types/app';
import { ICashFlowDAO } from '../cahsflow/types';
import { ICashFlowItemDAO } from '../cahsflow-item/types';

export interface IExchangeDAO {
  projectId: number;
  userId: number;
  id: number;
  amountSell: number;
  moneyIdSell: number;
  amountBuy: number;
  moneyIdBuy: number;
  accountSellId: number;
  accountBuyId: number;
  fee: number | null;
  moneyFeeId: number | null;
  accountFeeId: number | null;
  exchangeDate: TDate;
  reportPeriod: TDate;
  note: string | null;
  tags: number[] | null;
  updatedAt: TDateTime;
  cashflowTypeId: number;
}

export type IExchangeEntity = {
  userId: string;
  id: string;
  amountSell: number;
  moneySellId: string;
  amountBuy: number;
  moneyBuyId: string;
  accountSellId: string;
  accountBuyId: string;
  fee: number | null;
  moneyFeeId: string | null;
  accountFeeId: string | null;
  exchangeDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
  updatedAt: TDateTime;
};

export type IExchange = IExchangeEntity;

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

export interface FindExchangesRepositoryQuery {
  limit?: number;
  offset?: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  accountsSell?: string[];
  accountsBuy?: string[];
  tags?: string[];
}

export type FindExchangesServiceQuery = FindExchangesRepositoryQuery;

export interface FindExchangesRepositoryResponse {
  exchanges: ICashFlowDAO[];
  metadata: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface FindExchangesServiceResponse {
  exchanges: IExchange[];
  metadata: {
    offset: number;
    limit: number;
    total: number;
  };
}

export type CreateExchangeRepositoryData = {
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
};

export type CreateExchangeServiceData = CreateExchangeRepositoryData;

export type UpdateExchangeRepositoryChanges = Partial<{
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

export type UpdateExchangeServiceChanges = UpdateExchangeRepositoryChanges;

export interface ExchangeRepository {
  findExchanges(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindExchangesServiceQuery
  ): Promise<FindExchangesRepositoryResponse>;
}

export interface ExchangeService {
  createExchange(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreateExchangeServiceData
  ): Promise<IExchange>;

  getExchange(ctx: IRequestContext, projectId: string, userId: string, exchangeId: string): Promise<IExchange>;

  findExchanges(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindExchangesServiceQuery
  ): Promise<FindExchangesServiceResponse>;

  updateExchange(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    exchangeId: string,
    changes: UpdateExchangeServiceChanges
  ): Promise<IExchange>;

  deleteExchange(ctx: IRequestContext, projectId: string, userId: string, exchangeId: string): Promise<void>;
}

export interface ExchangeMapper {
  toDTO(exchange: IExchange): IExchangeDTO;
  toDomain(
    cashFlow: ICashFlowDAO,
    cashFlowItems: ICashFlowItemDAO[],
    exchangeCategoryId: string,
    exchangeFeeCategoryId: string
  ): IExchange;
}
