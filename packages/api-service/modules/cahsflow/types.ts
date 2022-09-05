import { Permissions, IRequestContext, TDateTime } from '../../types/app';

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
  note: string;
  tags: string[];
  updatedAt: TDateTime;
}

export interface ICashFlow extends ICashFlowEntity {}

export interface CreateCashFlowRepositoryData {
  contractorId?: string;
  cashFlowTypeId: CashFlowType;
  note?: string;
  tags?: string[];
}

export type CreateCashFlowServiceData = CreateCashFlowRepositoryData;

export type UpdateCashFlowRepositoryChanges = Partial<{
  contractorId: string;
  note: string;
  tags: string[];
}>;

export type UpdateCashFlowServiceChanges = UpdateCashFlowRepositoryChanges;

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

  updateCashFlow(
    ctx: IRequestContext,
    projectId: string,
    cashFlowId: string,
    changes: UpdateCashFlowRepositoryChanges
  ): Promise<ICashFlowDAO>;

  deleteCashFlow(ctx: IRequestContext, projectId: string, cashFlowId: string): Promise<void>;
}

export interface CashFlowMapper {
  toDomain(cashFlow: ICashFlowDAO, permission: Permissions): ICashFlow;
}

export enum CashFlowType {
  IncomeExpense = 1,
  Debt = 2,
  Transfer = 3,
  Exchange = 4,
}
