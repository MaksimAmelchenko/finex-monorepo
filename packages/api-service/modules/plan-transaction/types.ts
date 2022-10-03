import { IPlanDAO } from '../plan/types';
import { IRequestContext, Permissions, Permit, Sign, TDate } from '../../types/app';

export interface IPlanTransactionDAO {
  projectId: number;
  planId: number;
  sign: Sign;
  amount: number;
  moneyId: number;
  categoryId: number;
  accountId: number;
  contractorId: number | null;
  quantity: number | null;
  unitId: number | null;

  plan: IPlanDAO;
}

export interface IPlanTransactionEntity {
  projectId: string;
  planId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string;
  accountId: string;
  contractorId: string | null;
  quantity: number | null;
  unitId: string | null;

  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;
  repetitionDays: number[] | null;
  terminationType: number | null;
  repetitionCount: number | null;
  endDate: TDate | null;
  note: string;
  operationNote: string;
  operationTags: string[];
  markerColor: string | null;
  userId: string;
  permit: Permit;
}

export interface IPlanTransactionDTO {
  planId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string;
  accountId: string;
  contractorId: string | null;
  quantity: number | null;
  unitId: string | null;

  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;
  repetitionDays: number[] | null;
  terminationType: number | null;
  repetitionCount: number | null;
  endDate: TDate | null;
  note: string;
  operationNote: string;
  operationTags: string[];
  markerColor: string | null;
  userId: string;
  permit: Permit;
}

export interface IPlanTransaction extends IPlanTransactionEntity {}

export interface CreatePlanTransactionRepositoryData {
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string;
  accountId: string;
  contractorId?: string | null;
  quantity?: number | null;
  unitId?: string | null;

  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;
  repetitionDays?: number[] | null;
  terminationType?: number | null;
  repetitionCount?: number | null;
  endDate?: TDate | null;
  note?: string;
  operationNote?: string;
  operationTags?: string[];
  markerColor?: string | null;
}

export type CreatePlanTransactionServiceData = CreatePlanTransactionRepositoryData;

export type CreatePlanTransactionAPIData = CreatePlanTransactionServiceData;

export type UpdatePlanTransactionRepositoryChanges = Partial<{
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string;
  accountId: string;
  contractorId: string | null;
  quantity: number | null;
  unitId: string | null;
  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;
  repetitionDays: number[] | null;
  terminationType: number | null;
  repetitionCount: number | null;
  endDate: TDate | null;
  note: string;
  operationNote: string;
  operationTags: string[];
  markerColor: string | null;
}>;

export type UpdatePlanTransactionServiceChanges = UpdatePlanTransactionRepositoryChanges;

export interface PlanTransactionRepository {
  createPlanTransaction(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreatePlanTransactionRepositoryData
  ): Promise<IPlanTransactionDAO>;

  getPlanTransaction(ctx: IRequestContext, projectId: string, planId: string): Promise<IPlanTransactionDAO | undefined>;

  getPlanTransactions(ctx: IRequestContext<never>, projectId: string): Promise<IPlanTransactionDAO[]>;

  updatePlanTransaction(
    ctx: IRequestContext,
    projectId: string,
    planId: string,
    changes: UpdatePlanTransactionRepositoryChanges
  ): Promise<IPlanTransactionDAO>;

  deletePlanTransaction(ctx: IRequestContext, projectId: string, planId: string): Promise<void>;
}

export interface PlanTransactionService {
  createPlanTransaction(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreatePlanTransactionServiceData
  ): Promise<IPlanTransaction>;

  getPlanTransaction(ctx: IRequestContext, projectId: string, planId: string): Promise<IPlanTransaction>;

  getPlanTransactions(ctx: IRequestContext<never, true>, projectId: string): Promise<IPlanTransaction[]>;

  updatePlanTransaction(
    ctx: IRequestContext,
    projectId: string,
    planId: string,
    changes: UpdatePlanTransactionServiceChanges
  ): Promise<IPlanTransaction>;

  deletePlanTransaction(ctx: IRequestContext, projectId: string, planId: string): Promise<void>;
}

export interface PlanTransactionMapper {
  toDomain(planTransaction: IPlanTransactionDAO, permission: Permissions): IPlanTransaction;
  toDTO(planTransaction: IPlanTransaction): IPlanTransactionDTO;
}
