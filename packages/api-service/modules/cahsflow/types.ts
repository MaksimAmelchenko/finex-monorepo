import {
  CreateCashFlowItemServiceData,
  ICashFlowItem,
  ICashFlowItemEntity,
  UpdateCashFlowItemServiceChanges,
} from '../cahsflow-item/types';
import { IRequestContext, Permissions, Permit, Sign, TDate, TDateTime } from '../../types/app';

export interface ICashFlowDAO {
  projectId: number;
  id: number;
  userId: number;
  cashflowTypeId: CashFlowType;
  contractorId: number | null;
  note: string | null;
  tags: number[] | null;
  updatedAt: TDateTime;
}

export interface ICashFlowEntity {
  id: string;
  userId: string;
  cashFlowTypeId: CashFlowType;
  contractorId: string | null;
  items: ICashFlowItemEntity[];
  note: string;
  tags: string[];
  updatedAt: TDateTime;
}

export interface ICashFlow extends Omit<ICashFlowEntity, 'items'> {
  items: ICashFlowItem[];
}

export interface ICashFlowDTO {
  userId: string;
  id: string;
  contractorId: string | null;
  note: string;
  tags: string[];
  items: ICashFlowItemDTO[];
  updatedAt: TDateTime;
}

export interface ICashFlowItemDTO {
  userId: string;
  cashFlowId: string;
  id: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  cashFlowItemDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
  permit: Permit;
}

export interface CreateCashFlowRepositoryData {
  contractorId?: string | null;
  cashFlowTypeId: CashFlowType;
  note?: string;
  tags?: string[];
}

export type CreateCashFlowServiceData = CreateCashFlowRepositoryData & {
  items?: CreateCashFlowItemServiceData[];
};

export type UpdateCashFlowRepositoryChanges = Partial<{
  contractorId: string;
  note: string;
  tags: string[];
}>;

export type UpdateCashFlowServiceChanges = UpdateCashFlowRepositoryChanges & {
  items?: Array<{ id: string } & UpdateCashFlowItemServiceChanges>;
};

export interface FindCashFlowsAPIQuery {
  limit?: number;
  offset?: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  contractors?: string;
  accounts?: string;
  tags?: string;
}

export interface FindCashFlowsRepositoryQuery {
  limit: number;
  offset: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  contractors?: string[];
  accounts?: string[];
  tags?: string[];
}

export type FindCashFlowsServiceQuery = FindCashFlowsRepositoryQuery;

export interface FindCashFlowsRepositoryResponse {
  cashFlows: ICashFlowDAO[];
  metadata: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface FindCashFlowsServiceResponse {
  cashFlows: ICashFlow[];
  metadata: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface CashFlowRepository {
  createCashFlow(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreateCashFlowRepositoryData
  ): Promise<ICashFlowDAO>;

  getCashFlow(
    ctx: IRequestContext,
    projectId: string,
    cashFlowId: string,
    cashFlowTypeId?: CashFlowType
  ): Promise<ICashFlowDAO | undefined>;

  findCashFlows(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    params: FindCashFlowsServiceQuery
  ): Promise<FindCashFlowsRepositoryResponse>;

  updateCashFlow(
    ctx: IRequestContext,
    projectId: string,
    cashFlowId: string,
    changes: UpdateCashFlowRepositoryChanges
  ): Promise<ICashFlowDAO>;

  deleteCashFlow(ctx: IRequestContext, projectId: string, cashFlowId: string): Promise<void>;
}

export interface CashFlowService {
  createCashFlow(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreateCashFlowServiceData
  ): Promise<ICashFlow>;

  getCashFlow(ctx: IRequestContext, projectId: string, userId: string, cashFlowId: string): Promise<ICashFlow>;

  findCashFlows(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindCashFlowsServiceQuery
  ): Promise<FindCashFlowsServiceResponse>;

  updateCashFlow(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    cashFlowId: string,
    changes: UpdateCashFlowServiceChanges
  ): Promise<ICashFlow>;

  deleteCashFlow(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    cashFlowId: string
  ): Promise<void>;
}

export interface CashFlowMapper {
  toDomain(cashFlow: ICashFlowDAO, cashFlowItems: ICashFlowItem[], permission: Permissions): ICashFlow;
  toDTO(cashFlow: ICashFlow): ICashFlowDTO;
}

export enum CashFlowType {
  IncomeExpense = 1,
  Debt = 2,
  Transfer = 3,
  Exchange = 4,
}
