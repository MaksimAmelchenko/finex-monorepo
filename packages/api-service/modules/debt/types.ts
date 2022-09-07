import { ICashFlowDAO } from '../cahsflow/types';
import { IRequestContext, Permissions, TDate, TDateTime } from '../../types/app';

import {
  CreateDebtItemServiceData,
  IDebtItem,
  IDebtItemDTO,
  IDebtItemEntity,
  UpdateDebtItemServiceChanges,
} from '../debt-item/types';

export interface IDebtEntity {
  userId: string;
  id: string;
  contractorId: string;
  note: string;
  tags: string[];
  items: IDebtItemEntity[];
  updatedAt: TDateTime;
}

export interface IDebt extends Omit<IDebtEntity, 'items'> {
  items: IDebtItem[];
}

export interface IDebtDTO {
  userId: string;
  id: string;
  contractorId: string;
  note: string;
  tags: string[];
  items: IDebtItemDTO[];
  updatedAt: TDateTime;
}

export interface FindDebtsRepositoryQuery {
  limit?: number;
  offset?: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  isOnlyNotPaid?: boolean;
  contractors?: string;
  tags?: string;
}

export type FindDebtsServiceQuery = FindDebtsRepositoryQuery;

export interface FindDebtsRepositoryResponse {
  debts: ICashFlowDAO[];
  metadata: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface FindDebtsServiceResponse {
  debts: IDebt[];
  metadata: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface CreateDebtRepositoryData {
  contractorId: string;
  note?: string;
  tags?: string[];
}

export type CreateDebtServiceData = CreateDebtRepositoryData & {
  items?: CreateDebtItemServiceData[];
};

export type UpdateDebtRepositoryChanges = Partial<{
  contractorId: string;
  note: string;
  tags: string[];
}>;

export type UpdateDebtServiceChanges = UpdateDebtRepositoryChanges & {
  items?: Array<{ id: string } & UpdateDebtItemServiceChanges>;
};

export interface DebtRepository {
  findDebts(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindDebtsServiceQuery
  ): Promise<FindDebtsRepositoryResponse>;
}

export interface DebtService {
  createDebt(ctx: IRequestContext, projectId: string, userId: string, data: CreateDebtServiceData): Promise<IDebt>;

  getDebt(ctx: IRequestContext, projectId: string, userId: string, debtId: string): Promise<IDebt>;

  findDebts(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindDebtsServiceQuery
  ): Promise<FindDebtsServiceResponse>;

  updateDebt(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    debtId: string,
    changes: UpdateDebtServiceChanges
  ): Promise<IDebt>;

  deleteDebt(ctx: IRequestContext, projectId: string, userId: string, debtId: string): Promise<void>;
}

export interface DebtMapper {
  toDTO(debt: IDebt): IDebtDTO;
  toDomain(cashFlow: ICashFlowDAO, debtItems: IDebtItem[], permission: Permissions): IDebt;
}