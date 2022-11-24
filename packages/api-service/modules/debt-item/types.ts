import { Permit, Sign, TDate, IRequestContext, Permissions } from '../../types/app';
import { ICashFlowItem, ICashFlowItemDAO } from '../cash-flow-item/types';

export interface IDebtItemEntity {
  id: string;
  debtId: string;
  userId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  debtItemDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
  permit: Permit;
}

export interface IDebtItem extends IDebtItemEntity {}

export type IDebtItemDTO = {
  userId: string;
  debtId: string;
  id: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  debtItemDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
  permit: Permit;
};

export interface CreateDebtItemRepositoryData {
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  debtItemDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
}

export type CreateDebtItemServiceData = CreateDebtItemRepositoryData;

export type UpdateDebtItemRepositoryChanges = Partial<{
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  debtItemDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
}>;

export type UpdateDebtItemServiceChanges = UpdateDebtItemRepositoryChanges;

export interface DebtItemService {
  createDebtItem(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    debtId: string,
    data: CreateDebtItemServiceData
  ): Promise<IDebtItem>;

  getDebtItem(ctx: IRequestContext, projectId: string, debtItemId: string): Promise<IDebtItem>;

  getDebtItems(ctx: IRequestContext, projectId: string, userId: string, debtIds: string[]): Promise<IDebtItem[]>;

  updateDebtItem(
    ctx: IRequestContext,
    projectId: string,
    debtItemId: string,
    changes: UpdateDebtItemServiceChanges
  ): Promise<IDebtItem>;

  deleteDebtItem(ctx: IRequestContext, projectId: string, debtItemId: string): Promise<void>;
}

export interface DebtItemMapper {
  toDTO(debtItem: IDebtItem): IDebtItemDTO;
  toDomain(cashFlowItem: ICashFlowItem): IDebtItem;
}
