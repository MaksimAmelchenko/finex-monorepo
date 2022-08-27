import { DebtItemRepository, DebtItemService, IDebtItem } from '../debt-item/types';
import { IRequestContext, Permit } from '../../types/app';
import { NotFoundError } from '../../libs/errors';
import { debtItemRepository } from '../debt-item/debt-item.repository';
import { debtItemService } from '../debt-item/debt-item.service';
import { debtMapper } from './debt.mapper';
import { debtRepository } from './debt.repository';

import {
  CreateDebtServiceData,
  DebtRepository,
  DebtService,
  FindDebtsRepositoryQuery,
  FindDebtsServiceResponse,
  IDebt,
  UpdateDebtServiceChanges,
} from './types';

class DebtServiceImpl implements DebtService {
  private debtRepository: DebtRepository;
  private debtItemRepository: DebtItemRepository;
  private debtItemService: DebtItemService;

  constructor({
    debtRepository,
    debtItemRepository,
    debtItemService,
  }: {
    debtRepository: DebtRepository;
    debtItemRepository: DebtItemRepository;
    debtItemService: DebtItemService;
  }) {
    this.debtRepository = debtRepository;
    this.debtItemRepository = debtItemRepository;
    this.debtItemService = debtItemService;
  }

  async createDebt(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreateDebtServiceData
  ): Promise<IDebt> {
    const { items = [], ...params } = data;
    const debtDAO = await this.debtRepository.createDebt(ctx, projectId, userId, params);

    await Promise.all(
      items.map(item => this.debtItemService.createDebtItem(ctx, projectId, userId, String(debtDAO.id), item))
    );

    return this.getDebt(ctx, projectId, userId, String(debtDAO.id));
  }

  async getDebt(ctx: IRequestContext, projectId: string, userId: string, debtId: string): Promise<IDebt> {
    const debtDAO = await this.debtRepository.getDebt(ctx, projectId, debtId);
    if (!debtDAO) {
      throw new NotFoundError();
    }
    const debtItems = await this.debtItemService.getDebtItems(ctx, projectId, userId, [debtId]);

    // the current user is not owner and there are no items (no permissions)
    if (String(debtDAO.userId) !== userId && !debtItems.length) {
      throw new NotFoundError();
    }

    return debtMapper.toDomain(debtDAO, debtItems, ctx.permissions);
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
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    debtId: string,
    changes: UpdateDebtServiceChanges
  ): Promise<IDebt> {
    const { items = [], ...params } = changes;

    await this.getDebt(ctx, projectId, userId, debtId);

    const debtDOA = await this.debtRepository.updateDebt(ctx, projectId, debtId, params);

    await Promise.all(
      items.map(({ id, ...changes }) => this.debtItemService.updateDebtItem(ctx, projectId, id, changes))
    );

    return this.getDebt(ctx, projectId, userId, String(debtDOA.id));
  }

  async deleteDebt(ctx: IRequestContext, projectId: string, userId: string, debtId: string): Promise<void> {
    const debtItems = await this.debtItemService.getDebtItems(ctx, projectId, userId, [debtId]);

    for await (const debtItem of debtItems) {
      if ((debtItem.permit & Permit.Update) === Permit.Update) {
        await this.debtItemRepository.deleteDebtItem(ctx, projectId, debtItem.id);
      }
    }

    const debtItemDOAs = await this.debtItemRepository.getDebtItems(ctx, projectId, [debtId]);

    if (!debtItemDOAs.length) {
      await this.debtRepository.deleteDebt(ctx, projectId, debtId);
    }
  }
}

export const debtService = new DebtServiceImpl({ debtRepository, debtItemRepository, debtItemService });
