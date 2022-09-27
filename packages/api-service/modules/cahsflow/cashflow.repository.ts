import { CashFlowDAO } from './models/cahsflow-dao';
import { IRequestContext } from '../../types/app';

import {
  CreateCashFlowRepositoryData,
  CashFlowRepository,
  ICashFlowDAO,
  UpdateCashFlowRepositoryChanges,
  CashFlowType,
} from './types';

class CashFlowRepositoryImpl implements CashFlowRepository {
  async createCashFlow(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreateCashFlowRepositoryData
  ): Promise<ICashFlowDAO> {
    ctx.log.trace({ data }, 'try to create cashflow');

    const { cashFlowTypeId, contractorId, note, tags } = data;

    const cashFlowDAO = await CashFlowDAO.query(ctx.trx).insertAndFetch({
      projectId: Number(projectId),
      cashflowTypeId: cashFlowTypeId,
      contractorId: contractorId ? Number(contractorId) : undefined,
      userId: Number(userId),
      note,
      tags: tags ? tags.map(Number) : null,
    });

    const cashFlowId = String(cashFlowDAO.id);

    ctx.log.info({ cashFlowId }, 'created cashflow');

    return (await this.getCashFlow(ctx, projectId, cashFlowId)) as ICashFlowDAO;
  }

  async getCashFlow(
    ctx: IRequestContext,
    projectId: string,
    cashFlowId: string,
    cashFlowTypeId?: CashFlowType
  ): Promise<ICashFlowDAO | undefined> {
    ctx.log.trace({ cashFlowId }, 'try to get cashflow');

    let query = CashFlowDAO.query(ctx.trx).findById([Number(projectId), Number(cashFlowId)]);

    if (cashFlowTypeId) {
      query = query.where({ cashflowTypeId: cashFlowTypeId });
    }
    return query;
  }

  async updateCashFlow(
    ctx: IRequestContext,
    projectId: string,
    cashFlowId: string,
    changes: UpdateCashFlowRepositoryChanges
  ): Promise<ICashFlowDAO> {
    ctx.log.trace({ cashFlowId, changes }, 'try to update cashflow');
    const { contractorId, note, tags } = changes;

    await CashFlowDAO.query(ctx.trx)
      .patch({
        contractorId: contractorId ? Number(contractorId) : undefined,
        note,
        tags: tags ? tags.map(Number) : undefined,
      })
      .where({
        projectId: Number(projectId),
        id: Number(cashFlowId),
      });

    ctx.log.info({ cashFlowId }, 'updated cashflow');

    return (await this.getCashFlow(ctx, projectId, cashFlowId)) as ICashFlowDAO;
  }

  async deleteCashFlow(ctx: IRequestContext, projectId: string, cashFlowId: string): Promise<void> {
    ctx.log.trace({ cashFlowId }, 'try to delete cashflow');

    await CashFlowDAO.query(ctx.trx).deleteById([Number(projectId), Number(cashFlowId)]);

    ctx.log.info({ cashFlowId }, 'deleted cashflow');
  }
}

export const cashFlowRepository = new CashFlowRepositoryImpl();
