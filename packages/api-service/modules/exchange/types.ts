import { IRequestContext, Permissions, TDate, TDateTime } from '../../types/app';
import { ICashFlowDAO } from '../cash-flow/types';
import { ICashFlowItemDAO } from '../cash-flow-item/types';

export interface IExchangeDAO {
  projectId: number;
  userId: number;
  id: number;
  sellAmount: number;
  moneyIdSell: number;
  buyAmount: number;
  moneyIdBuy: number;
  sellAccountId: number;
  buyAccountId: number;
  fee: number | null;
  feeMoneyId: number | null;
  feeAccountId: number | null;
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
  sellAmount: number;
  sellMoneyId: string;
  buyAmount: number;
  buyMoneyId: string;
  sellAccountId: string;
  buyAccountId: string;
  fee: number | null;
  feeMoneyId: string | null;
  feeAccountId: string | null;
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

export interface FindExchangesRepositoryQuery {
  limit?: number;
  offset?: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  sellAccounts?: string[];
  buyAccounts?: string[];
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
};

export type CreateExchangeServiceData = CreateExchangeRepositoryData;

export type UpdateExchangeRepositoryChanges = Partial<{
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
