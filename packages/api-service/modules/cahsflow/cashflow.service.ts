import { CashFlowItemRepository, CashFlowItemService, ICashFlowItem } from '../cahsflow-item/types';

import {
  CashFlowRepository,
  CashFlowService,
  CashFlowType,
  CreateCashFlowServiceData,
  FindCashFlowsRepositoryQuery,
  FindCashFlowsServiceResponse,
  ICashFlow,
  UpdateCashFlowServiceChanges,
} from './types';

import { IRequestContext, Permit } from '../../types/app';
import { NotFoundError } from '../../libs/errors';
import { cashFlowItemRepository } from '../cahsflow-item/cashflow-item.repository';

import { cashFlowMapper } from './cashFlow.mapper';
import { cashFlowRepository } from './cashFlow.repository';
import { cashFlowItemService } from '../cahsflow-item/cashflow-item.service';

class CashFlowServiceImpl implements CashFlowService {
  private cashFlowItemRepository: CashFlowItemRepository;
  private cashFlowItemService: CashFlowItemService;
  private cashFlowRepository: CashFlowRepository;

  constructor({
    cashFlowItemRepository,
    cashFlowItemService,
    cashFlowRepository,
  }: {
    cashFlowItemRepository: CashFlowItemRepository;
    cashFlowItemService: CashFlowItemService;
    cashFlowRepository: CashFlowRepository;
  }) {
    this.cashFlowItemRepository = cashFlowItemRepository;
    this.cashFlowItemService = cashFlowItemService;
    this.cashFlowRepository = cashFlowRepository;
  }

  async createCashFlow(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateCashFlowServiceData
  ): Promise<ICashFlow> {
    const { items = [], ...params } = data;
    const cashFlowDAO = await this.cashFlowRepository.createCashFlow(ctx, projectId, userId, {
      ...params,
      cashFlowTypeId: CashFlowType.IncomeExpense,
    });

    await Promise.all(
      items.map(item =>
        this.cashFlowItemService.createCashFlowItem(ctx, projectId, userId, String(cashFlowDAO.id), item)
      )
    );

    return this.getCashFlow(ctx, projectId, userId, String(cashFlowDAO.id));
  }

  async getCashFlow(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    cashFlowId: string
  ): Promise<ICashFlow> {
    const cashFlowDAO = await this.cashFlowRepository.getCashFlow(
      ctx,
      projectId,
      cashFlowId,
      CashFlowType.IncomeExpense
    );
    if (!cashFlowDAO) {
      throw new NotFoundError('Cash flow not found');
    }
    const cashFlowItems = await this.cashFlowItemService.getCashFlowItems(ctx, projectId, userId, [cashFlowId]);

    // the current user is not owner and there are no items (no permissions)
    if (String(cashFlowDAO.userId) !== userId && !cashFlowItems.length) {
      throw new NotFoundError();
    }

    return cashFlowMapper.toDomain(cashFlowDAO, cashFlowItems, ctx.permissions);
  }

  async findCashFlows(
    ctx: IRequestContext<any, true>,
    projectId: string,
    userId: string,
    query: FindCashFlowsRepositoryQuery
  ): Promise<FindCashFlowsServiceResponse> {
    const { cashFlows: cashFlowDAOs, metadata } = await this.cashFlowRepository.findCashFlows(
      ctx,
      projectId,
      userId,
      query
    );

    const cashFlowIds = cashFlowDAOs.map(({ id }) => String(id));
    const cashFlowItems = await this.cashFlowItemService.getCashFlowItems(ctx, projectId, userId, cashFlowIds);

    const cashFlowItemsByCashFlowId = cashFlowItems.reduce<Record<string, ICashFlowItem[]>>((acc, cashFlowItem) => {
      acc[cashFlowItem.cashFlowId] = acc[cashFlowItem.cashFlowId] || [];
      acc[cashFlowItem.cashFlowId].push(cashFlowItem);
      return acc;
    }, {});

    const cashFlows = cashFlowDAOs.map(cashFlowDAO =>
      cashFlowMapper.toDomain(cashFlowDAO, cashFlowItemsByCashFlowId[String(cashFlowDAO.id)] || [], ctx.permissions)
    );

    return {
      metadata,
      cashFlows,
    };
  }

  async updateCashFlow(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    cashFlowId: string,
    changes: UpdateCashFlowServiceChanges
  ): Promise<ICashFlow> {
    const { items = [], ...params } = changes;

    await this.getCashFlow(ctx, projectId, userId, cashFlowId);

    const cashFlowDOA = await this.cashFlowRepository.updateCashFlow(ctx, projectId, cashFlowId, params);

    await Promise.all(
      items.map(({ id, ...changes }) => this.cashFlowItemService.updateCashFlowItem(ctx, projectId, id, changes))
    );

    return this.getCashFlow(ctx, projectId, userId, String(cashFlowDOA.id));
  }

  async deleteCashFlow(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    cashFlowId: string
  ): Promise<void> {
    await this.getCashFlow(ctx, projectId, userId, cashFlowId);

    const cashFlowItems = await this.cashFlowItemService.getCashFlowItems(ctx, projectId, userId, [cashFlowId]);

    for await (const cashFlowItem of cashFlowItems) {
      if ((cashFlowItem.permit & Permit.Update) === Permit.Update) {
        await this.cashFlowItemRepository.deleteCashFlowItem(ctx, projectId, cashFlowItem.id);
      }
    }

    const cashFlowItemDOAs = await this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, [cashFlowId]);

    if (!cashFlowItemDOAs.length) {
      await this.cashFlowRepository.deleteCashFlow(ctx, projectId, cashFlowId);
    }
  }
}

export const cashFlowService = new CashFlowServiceImpl({
  cashFlowItemRepository,
  cashFlowItemService,
  cashFlowRepository,
});
