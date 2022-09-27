import { IRequestContext } from '../../types/app';
import { PlanTransactionDAO } from './models/plan-transaction-dao';

import {
  CreatePlanTransactionRepositoryData,
  IPlanTransactionDAO,
  PlanTransactionRepository,
  UpdatePlanTransactionRepositoryChanges,
} from './types';
import { PlanDAO } from '../plan/models/plan-dao';

class PlanTransactionRepositoryImpl implements PlanTransactionRepository {
  async createPlanTransaction(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreatePlanTransactionRepositoryData
  ): Promise<IPlanTransactionDAO> {
    ctx.log.trace({ data }, 'try to create plan-transaction');

    const {
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      contractorId,
      quantity,
      unitId,
      startDate,
      reportPeriod,
      repetitionType,
      repetitionDays = null,
      terminationType = null,
      repetitionCount = null,
      endDate = null,
      note = null,
      operationNote = null,
      operationTags = null,
      markerColor = null,
    } = data;

    const { id: planId } = await PlanDAO.query(ctx.trx).insert({
      projectId: Number(projectId),
      userId: Number(userId),
      startDate,
      reportPeriod,
      repetitionType,
      repetitionDays,
      terminationType,
      repetitionCount,
      endDate,
      note,
      operationNote,
      operationTags: operationTags ? operationTags.map(Number) : null,
      markerColor,
    });

    await PlanTransactionDAO.query(ctx.trx).insert({
      projectId: Number(projectId),
      planId: Number(planId),
      sign,
      amount,
      moneyId: Number(moneyId),
      categoryId: Number(categoryId),
      accountId: Number(accountId),
      contractorId: contractorId ? Number(contractorId) : null,
      quantity,
      unitId: unitId ? Number(unitId) : null,
    });

    ctx.log.info({ planId }, 'created plan-transaction');

    return (await this.getPlanTransaction(ctx, projectId, String(planId))) as IPlanTransactionDAO;
  }

  async getPlanTransaction(
    ctx: IRequestContext,
    projectId: string,
    planId: string
  ): Promise<IPlanTransactionDAO | undefined> {
    ctx.log.trace({ planId }, 'try to get plan-transaction');

    return PlanTransactionDAO.query(ctx.trx)
      .withGraphFetched('plan')
      .findById([Number(projectId), Number(planId)]);
  }

  async getPlanTransactions(ctx: IRequestContext<never>, projectId: string): Promise<IPlanTransactionDAO[]> {
    ctx.log.trace('try to get plan-transactions');

    return PlanTransactionDAO.query(ctx.trx)
      .withGraphFetched('plan')
      .where({ projectId: Number(projectId) });
  }

  async updatePlanTransaction(
    ctx: IRequestContext,
    projectId: string,
    planId: string,
    changes: UpdatePlanTransactionRepositoryChanges
  ): Promise<IPlanTransactionDAO> {
    ctx.log.trace({ planId, changes }, 'try to update plan-transaction');
    const {
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      contractorId,
      quantity,
      unitId,
      startDate,
      reportPeriod,
      repetitionType,
      repetitionDays,
      terminationType,
      repetitionCount,
      endDate,
      note,
      operationNote,
      operationTags,
      markerColor,
    } = changes;

    await PlanDAO.query(ctx.trx)
      .patch({
        startDate,
        reportPeriod,
        repetitionType,
        repetitionDays,
        terminationType,
        repetitionCount,
        endDate,
        note,
        operationNote,
        operationTags: operationTags === null ? null : operationTags ? operationTags.map(Number) : undefined,
        markerColor,
      })
      .where({
        projectId: Number(projectId),
        id: Number(planId),
      });

    await PlanTransactionDAO.query(ctx.trx)
      .patch({
        sign,
        amount,
        moneyId: moneyId ? Number(moneyId) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        accountId: accountId ? Number(accountId) : undefined,
        contractorId: contractorId === null ? null : contractorId ? Number(contractorId) : undefined,
        quantity,
        unitId: unitId === null ? null : unitId ? Number(unitId) : undefined,
      })
      .where({
        projectId: Number(projectId),
        planId: Number(planId),
      });

    ctx.log.info({ planId }, 'updated plan-transaction');

    return (await this.getPlanTransaction(ctx, projectId, planId)) as IPlanTransactionDAO;
  }

  async deletePlanTransaction(ctx: IRequestContext, projectId: string, planId: string): Promise<void> {
    ctx.log.trace({ planId }, 'try to delete plan-transaction');
    await PlanTransactionDAO.query(ctx.trx).deleteById([Number(projectId), Number(planId)]);
    await PlanDAO.query(ctx.trx).deleteById([Number(projectId), Number(planId)]);
    ctx.log.info({ planId }, 'deleted plan-transaction');
  }
}

export const planTransactionRepository = new PlanTransactionRepositoryImpl();
