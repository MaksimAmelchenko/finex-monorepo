import { Permit, Sign, TDate, Permissions, IRequestContext } from '../../types/app';

export interface ICashFlowItemDAO {
  projectId: number;
  cashflowId: number;
  id: number;
  userId: number;
  sign: Sign;
  amount: number;
  moneyId: number;
  accountId: number;
  categoryId: number | null;
  cashflowItemDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: number | null;
  isNotConfirmed: boolean;
  note: string | null;
  tags: number[] | null;
  contractorId: string | null;
}

export interface ICashFlowItemEntity {
  id: string;
  cashFlowId: string;
  userId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string | null;
  cashFlowItemDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
  permit: Permit;
  contractorId: string | null;
}

export interface ICashFlowItem extends ICashFlowItemEntity {}

export interface CreateCashFlowItemRepositoryData {
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId?: string | null;
  cashFlowItemDate: TDate;
  reportPeriod: TDate;
  quantity?: number | null;
  unitId?: string | null;
  isNotConfirmed?: boolean;
  note?: string;
  tags?: string[];
}

export type CreateCashFlowItemServiceData = CreateCashFlowItemRepositoryData;

export type UpdateCashFlowItemRepositoryChanges = Partial<{
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string | null;
  cashFlowItemDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
}>;

export type UpdateCashFlowItemServiceChanges = UpdateCashFlowItemRepositoryChanges;

export interface CashFlowItemRepository {
  createCashFlowItem(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    cashFlowId: string,
    data: CreateCashFlowItemRepositoryData
  ): Promise<ICashFlowItemDAO>;

  getCashFlowItem(
    ctx: IRequestContext,
    projectId: string,
    cashFlowItemId: string
  ): Promise<ICashFlowItemDAO | undefined>;

  getCashFlowItems(ctx: IRequestContext, projectId: string, cashFlowIds: string[]): Promise<ICashFlowItemDAO[]>;

  updateCashFlowItem(
    ctx: IRequestContext,
    projectId: string,
    cashFlowItemId: string,
    changes: UpdateCashFlowItemRepositoryChanges
  ): Promise<ICashFlowItemDAO>;

  deleteCashFlowItem(ctx: IRequestContext, projectId: string, cashFlowItemId: string): Promise<void>;
}

export interface CashFlowItemService {
  createCashFlowItem(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    cashFlowId: string,
    data: CreateCashFlowItemServiceData
  ): Promise<ICashFlowItem>;

  getCashFlowItem(ctx: IRequestContext, projectId: string, cashFlowItemId: string): Promise<ICashFlowItem>;

  getCashFlowItems(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    cashFlowIds: string[]
  ): Promise<ICashFlowItem[]>;

  updateCashFlowItem(
    ctx: IRequestContext,
    projectId: string,
    cashFlowItemId: string,
    changes: UpdateCashFlowItemServiceChanges
  ): Promise<ICashFlowItem>;

  deleteCashFlowItem(ctx: IRequestContext, projectId: string, cashFlowItemId: string): Promise<void>;
}

export interface CashFlowItemMapper {
  toDomain(cashFlowItem: ICashFlowItemDAO, permission: Permissions): ICashFlowItem;
}
