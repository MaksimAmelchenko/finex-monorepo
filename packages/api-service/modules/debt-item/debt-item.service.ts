import { CashFlowItemService } from '../cash-flow-item/types';
import { CreateDebtItemServiceData, DebtItemService, IDebtItem, UpdateDebtItemServiceChanges } from './types';
import { IRequestContext } from '../../types/app';
import { cashFlowItemService } from '../cash-flow-item/cash-flow-item.service';
import { debtItemMapper } from './debt-item.mapper';

class DebtItemServiceImpl implements DebtItemService {
  private cashFlowItemService: CashFlowItemService;

  constructor({ cashFlowItemService }: { cashFlowItemService: CashFlowItemService }) {
    this.cashFlowItemService = cashFlowItemService;
  }

  async createDebtItem(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    debtId: string,
    data: CreateDebtItemServiceData
  ): Promise<IDebtItem> {
    const { sign, amount, moneyId, accountId, categoryId, debtItemDate, reportPeriod, note, tags } = data;

    const cashFlowItem = await this.cashFlowItemService.createCashFlowItem(ctx, projectId, userId, debtId, {
      sign,
      amount,
      moneyId,
      accountId,
      categoryId,
      cashFlowItemDate: debtItemDate,
      reportPeriod,
      note,
      tags,
    });

    return this.getDebtItem(ctx, projectId, cashFlowItem.id);
  }

  async getDebtItem(ctx: IRequestContext, projectId: string, debtItemId: string): Promise<IDebtItem> {
    const cashFlowItem = await this.cashFlowItemService.getCashFlowItem(ctx, projectId, debtItemId);
    return debtItemMapper.toDomain(cashFlowItem);
  }

  async getDebtItems(ctx: IRequestContext, projectId: string, userId: string, debtIds: string[]): Promise<IDebtItem[]> {
    const cashFlowItems = await this.cashFlowItemService.getCashFlowItems(ctx, projectId, userId, debtIds);
    return cashFlowItems.map(cashFlowItem => debtItemMapper.toDomain(cashFlowItem));
  }

  async updateDebtItem(
    ctx: IRequestContext,
    projectId: string,
    debtItemId: string,
    changes: UpdateDebtItemServiceChanges
  ): Promise<IDebtItem> {
    const { sign, amount, moneyId, accountId, categoryId, debtItemDate, reportPeriod, note, tags } = changes;

    await this.cashFlowItemService.updateCashFlowItem(ctx, projectId, debtItemId, {
      sign,
      amount,
      moneyId,
      accountId,
      categoryId,
      cashFlowItemDate: debtItemDate,
      reportPeriod,
      note,
      tags,
    });

    return this.getDebtItem(ctx, projectId, debtItemId);
  }

  async deleteDebtItem(ctx: IRequestContext, projectId: string, debtItemId: string): Promise<void> {
    return this.cashFlowItemService.deleteCashFlowItem(ctx, projectId, debtItemId);
  }
}

export const debtItemService = new DebtItemServiceImpl({
  cashFlowItemService,
});
