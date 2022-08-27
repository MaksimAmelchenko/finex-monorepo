import { AccessDeniedError, NotFoundError } from '../../libs/errors';
import { IRequestContext, Permit } from '../../types/app';
import { debtItemMapper } from './debt-item.mapper';
import { debtItemRepository } from './debt-item.repository';

import {
  CreateDebtItemServiceData,
  DebtItemRepository,
  DebtItemService,
  IDebtItem,
  UpdateDebtItemServiceChanges,
} from './types';

class DebtItemServiceImpl implements DebtItemService {
  private debtItemRepository: DebtItemRepository;

  constructor({ debtItemRepository }: { debtItemRepository: DebtItemRepository }) {
    this.debtItemRepository = debtItemRepository;
  }

  async createDebtItem(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    debtId: string,
    data: CreateDebtItemServiceData
  ): Promise<IDebtItem> {
    if ((ctx.permissions.accounts[data.accountId] & Permit.Update) !== Permit.Update) {
      throw new AccessDeniedError();
    }

    const debtItem = await this.debtItemRepository.createDebtItem(ctx, projectId, userId, debtId, data);

    return this.getDebtItem(ctx, projectId, String(debtItem.id));
  }

  async getDebtItem(ctx: IRequestContext, projectId: string, debtItemId: string): Promise<IDebtItem> {
    const debtItemDAO = await this.debtItemRepository.getDebtItem(ctx, projectId, debtItemId);
    if (!debtItemDAO) {
      throw new NotFoundError();
    }

    if ((ctx.permissions.accounts[debtItemDAO.accountId] & Permit.Read) !== Permit.Read) {
      throw new NotFoundError();
    }

    return debtItemMapper.toDomain(debtItemDAO, ctx.permissions);
  }

  async getDebtItems(ctx: IRequestContext, projectId: string, userId: string, debtIds: string[]): Promise<IDebtItem[]> {
    const debtItemDOAs = await this.debtItemRepository.getDebtItems(ctx, projectId, debtIds);

    return debtItemDOAs
      .map(debtItem => debtItemMapper.toDomain(debtItem, ctx.permissions))
      .filter(({ permit }) => (permit & Permit.Read) === Permit.Read);
  }

  async updateDebtItem(
    ctx: IRequestContext,
    projectId: string,
    debtItemId: string,
    changes: UpdateDebtItemServiceChanges
  ): Promise<IDebtItem> {
    const debtItem = await this.getDebtItem(ctx, projectId, debtItemId);

    if ((debtItem.permit & Permit.Update) !== Permit.Update) {
      throw new AccessDeniedError();
    }

    const debtItemDAO = await this.debtItemRepository.updateDebtItem(ctx, projectId, debtItemId, changes);

    return this.getDebtItem(ctx, projectId, String(debtItemDAO.id));
  }

  async deleteDebtItem(ctx: IRequestContext, projectId: string, debtItemId: string): Promise<void> {
    const debtItem = await this.getDebtItem(ctx, projectId, debtItemId);

    if ((debtItem.permit & Permit.Update) !== Permit.Update) {
      throw new AccessDeniedError();
    }

    return this.debtItemRepository.deleteDebtItem(ctx, projectId, debtItemId);
  }
}

export const debtItemService = new DebtItemServiceImpl({ debtItemRepository });
