import { AccessDeniedError, NotFoundError } from '../../libs/errors';
import { IRequestContext, Permit } from '../../types/app';
import { cashFlowItemMapper } from './cashflow-item.mapper';
import { cashFlowItemRepository } from './cashflow-item.repository';

import {
  CreateCashFlowItemServiceData,
  CashFlowItemRepository,
  CashFlowItemService,
  ICashFlowItem,
  UpdateCashFlowItemServiceChanges,
} from './types';

class CashFlowItemServiceImpl implements CashFlowItemService {
  private cashFlowItemRepository: CashFlowItemRepository;

  constructor({ cashFlowItemRepository }: { cashFlowItemRepository: CashFlowItemRepository }) {
    this.cashFlowItemRepository = cashFlowItemRepository;
  }

  async createCashFlowItem(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    cashFlowId: string,
    data: CreateCashFlowItemServiceData
  ): Promise<ICashFlowItem> {
    if ((ctx.permissions.accounts[data.accountId] & Permit.Update) !== Permit.Update) {
      throw new AccessDeniedError();
    }

    const cashFlowItem = await this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, cashFlowId, data);

    return this.getCashFlowItem(ctx, projectId, String(cashFlowItem.id));
  }

  async getCashFlowItem(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    cashFlowItemId: string
  ): Promise<ICashFlowItem> {
    const cashFlowItemDAO = await this.cashFlowItemRepository.getCashFlowItem(ctx, projectId, cashFlowItemId);
    if (!cashFlowItemDAO) {
      throw new NotFoundError();
    }

    if ((ctx.permissions.accounts[cashFlowItemDAO.accountId] & Permit.Read) !== Permit.Read) {
      throw new NotFoundError();
    }

    return cashFlowItemMapper.toDomain(cashFlowItemDAO, ctx.permissions);
  }

  async getCashFlowItems(
    ctx: IRequestContext<never, true>,
    projectId: string,
    userId: string,
    cashFlowIds: string[]
  ): Promise<ICashFlowItem[]> {
    const cashFlowItemDOAs = await this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, cashFlowIds);

    return cashFlowItemDOAs
      .map(cashFlowItem => cashFlowItemMapper.toDomain(cashFlowItem, ctx.permissions))
      .filter(({ permit }) => (permit & Permit.Read) === Permit.Read);
  }

  async updateCashFlowItem(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    cashFlowItemId: string,
    changes: UpdateCashFlowItemServiceChanges
  ): Promise<ICashFlowItem> {
    const cashFlowItem = await this.getCashFlowItem(ctx, projectId, cashFlowItemId);

    if ((cashFlowItem.permit & Permit.Update) !== Permit.Update) {
      throw new AccessDeniedError();
    }

    await this.cashFlowItemRepository.updateCashFlowItem(ctx, projectId, cashFlowItemId, changes);

    return this.getCashFlowItem(ctx, projectId, cashFlowItemId);
  }

  async deleteCashFlowItem(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    cashFlowItemId: string
  ): Promise<void> {
    const cashFlowItem = await this.getCashFlowItem(ctx, projectId, cashFlowItemId);

    if ((cashFlowItem.permit & Permit.Update) !== Permit.Update) {
      throw new AccessDeniedError();
    }

    return this.cashFlowItemRepository.deleteCashFlowItem(ctx, projectId, cashFlowItemId);
  }
}

export const cashFlowItemService = new CashFlowItemServiceImpl({ cashFlowItemRepository });
