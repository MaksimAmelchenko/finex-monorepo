import { CashFlowItemRepository } from '../cahsflow-item/types';
import { CashFlowRepository, CashFlowType } from '../cahsflow/types';
import {
  CreateDebtServiceData,
  DebtRepository,
  DebtService,
  FindDebtsRepositoryQuery,
  FindDebtsServiceResponse,
  IDebt,
  UpdateDebtServiceChanges,
} from './types';
import { DebtItemService, IDebtItem } from '../debt-item/types';
import { IRequestContext, Permit } from '../../types/app';
import { NotFoundError } from '../../libs/errors';
import { cashFlowItemRepository } from '../cahsflow-item/cashflow-item.repository';
import { cashFlowRepository } from '../cahsflow/cashflow.repository';
import { debtItemService } from '../debt-item/debt-item.service';
import { debtMapper } from './debt.mapper';
import { debtRepository } from './debt.repository';

class DebtServiceImpl implements DebtService {
  private cashFlowItemRepository: CashFlowItemRepository;
  private cashFlowRepository: CashFlowRepository;
  private debtItemService: DebtItemService;
  private debtRepository: DebtRepository;

  constructor({
    cashFlowItemRepository,
    cashFlowRepository,
    debtItemService,
    debtRepository,
  }: {
    cashFlowItemRepository: CashFlowItemRepository;
    cashFlowRepository: CashFlowRepository;
    debtItemService: DebtItemService;
    debtRepository: DebtRepository;
  }) {
    this.cashFlowItemRepository = cashFlowItemRepository;
    this.cashFlowRepository = cashFlowRepository;
    this.debtItemService = debtItemService;
    this.debtRepository = debtRepository;
  }

  async createDebt(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateDebtServiceData
  ): Promise<IDebt> {
    const { items = [], ...params } = data;
    const debtDAO = await this.cashFlowRepository.createCashFlow(ctx, projectId, userId, {
      ...params,
      cashFlowTypeId: CashFlowType.Debt,
    });

    await Promise.all(
      items.map(item => this.debtItemService.createDebtItem(ctx, projectId, userId, String(debtDAO.id), item))
    );

    return this.getDebt(ctx, projectId, userId, String(debtDAO.id));
  }

  async getDebt(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    debtId: string
  ): Promise<IDebt> {
    const cashFlowDAO = await this.cashFlowRepository.getCashFlow(ctx, projectId, debtId, CashFlowType.Debt);
    if (!cashFlowDAO) {
      throw new NotFoundError();
    }
    const debtItems = await this.debtItemService.getDebtItems(ctx, projectId, userId, [debtId]);

    // the current user is not owner and there are no items (no permissions)
    if (String(cashFlowDAO.userId) !== userId && !debtItems.length) {
      throw new NotFoundError();
    }

    return debtMapper.toDomain(cashFlowDAO, debtItems, ctx.permissions);
  }

  async findDebts(
    ctx: IRequestContext<any, true>,
    projectId: string,
    userId: string,
    query: FindDebtsRepositoryQuery
  ): Promise<FindDebtsServiceResponse> {
    const { debts: debtDAOs, metadata } = await this.debtRepository.findDebts(ctx, projectId, userId, query);

    const debtIds = debtDAOs.map(({ id }) => String(id));
    const debtItems = await this.debtItemService.getDebtItems(ctx, projectId, userId, debtIds);

    const debtItemsByDebtId = debtItems.reduce<Record<string, IDebtItem[]>>((acc, debtItem) => {
      acc[debtItem.debtId] = acc[debtItem.debtId] || [];
      acc[debtItem.debtId].push(debtItem);
      return acc;
    }, {});

    const debts = debtDAOs.map(debtDAO =>
      debtMapper.toDomain(debtDAO, debtItemsByDebtId[String(debtDAO.id)] || [], ctx.permissions)
    );

    return {
      metadata,
      debts,
    };
  }

  async updateDebt(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    debtId: string,
    changes: UpdateDebtServiceChanges
  ): Promise<IDebt> {
    const { items = [], ...params } = changes;

    await this.getDebt(ctx, projectId, userId, debtId);

    const debtDOA = await this.cashFlowRepository.updateCashFlow(ctx, projectId, debtId, params);

    await Promise.all(
      items.map(({ id, ...changes }) => this.debtItemService.updateDebtItem(ctx, projectId, id, changes))
    );

    return this.getDebt(ctx, projectId, userId, String(debtDOA.id));
  }

  async deleteDebt(ctx: IRequestContext, projectId: string, userId: string, debtId: string): Promise<void> {
    const debtItems = await this.debtItemService.getDebtItems(ctx, projectId, userId, [debtId]);

    for await (const debtItem of debtItems) {
      if ((debtItem.permit & Permit.Update) === Permit.Update) {
        await this.cashFlowItemRepository.deleteCashFlowItem(ctx, projectId, debtItem.id);
      }
    }

    const cashFlowItemDOAs = await this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, [debtId]);

    if (!cashFlowItemDOAs.length) {
      await this.cashFlowRepository.deleteCashFlow(ctx, projectId, debtId);
    }
  }
}

export const debtService = new DebtServiceImpl({
  cashFlowItemRepository,
  cashFlowRepository,
  debtItemService,
  debtRepository,
});
