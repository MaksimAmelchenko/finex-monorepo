import { IRequestContext, Permit } from '../../types/app';

import { AccessDeniedError, NotFoundError } from '../../libs/errors';
import {
  CreatePlanTransactionServiceData,
  IPlanTransaction,
  PlanTransactionService,
  UpdatePlanTransactionServiceChanges,
} from './types';
import { planTransactionMapper } from './plan-transaction.mapper';
import { planTransactionRepository } from './plan-transaction.repository';

class PlanTransactionServiceImpl implements PlanTransactionService {
  async createPlanTransaction(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreatePlanTransactionServiceData
  ): Promise<IPlanTransaction> {
    if ((ctx.permissions.accounts[data.accountId] & Permit.Update) !== Permit.Update) {
      throw new AccessDeniedError();
    }

    const { planId } = await planTransactionRepository.createPlanTransaction(ctx, projectId, userId, data);

    return (await this.getPlanTransaction(ctx, projectId, String(planId))) as IPlanTransaction;
  }

  async getPlanTransaction(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    planId: string
  ): Promise<IPlanTransaction> {
    const planTransaction = await planTransactionRepository.getPlanTransaction(ctx, projectId, planId);
    if (!planTransaction) {
      throw new NotFoundError('PlanTransaction not found');
    }

    if ((ctx.permissions.accounts[String(planTransaction.accountId)] & Permit.Read) !== Permit.Read) {
      throw new NotFoundError();
    }

    return planTransactionMapper.toDomain(planTransaction, ctx.permissions);
  }

  async getPlanTransactions(ctx: IRequestContext<never, true>, projectId: string): Promise<IPlanTransaction[]> {
    const planTransactions = await planTransactionRepository.getPlanTransactions(ctx, projectId);

    return planTransactions
      .filter(({ accountId }) => (ctx.permissions.accounts[String(accountId)] & Permit.Read) === Permit.Read)
      .map(planTransaction => planTransactionMapper.toDomain(planTransaction, ctx.permissions));
  }

  async updatePlanTransaction(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    planId: string,
    changes: UpdatePlanTransactionServiceChanges
  ): Promise<IPlanTransaction> {
    // need to get the schedule fields to make a model validation
    const { accountId, startDate, repetitionType, repetitionDays, terminationType, repetitionCount, endDate } =
      await this.getPlanTransaction(ctx, projectId, planId);

    if ((ctx.permissions.accounts[accountId] & Permit.Update) !== Permit.Update) {
      throw new AccessDeniedError();
    }

    if (changes.accountId && (ctx.permissions.accounts[changes.accountId] & Permit.Update) !== Permit.Update) {
      throw new AccessDeniedError();
    }

    await planTransactionRepository.updatePlanTransaction(ctx, projectId, planId, {
      startDate,
      repetitionType,
      repetitionDays,
      terminationType,
      repetitionCount,
      endDate,
      ...changes,
    });

    return (await this.getPlanTransaction(ctx, projectId, planId)) as IPlanTransaction;
  }

  async deletePlanTransaction(ctx: IRequestContext<unknown, true>, projectId: string, planId: string): Promise<void> {
    const { accountId } = await this.getPlanTransaction(ctx, projectId, planId);

    if ((ctx.permissions.accounts[accountId] & Permit.Update) !== Permit.Update) {
      throw new AccessDeniedError();
    }

    await planTransactionRepository.deletePlanTransaction(ctx, projectId, planId);
  }
}

export const planTransactionService = new PlanTransactionServiceImpl();
