import { snakeCaseMappers } from 'objection';

import { DebtItemDAO } from './models/debt-item-dao';
import { IRequestContext } from '../../types/app';

import {
  CreateDebtItemRepositoryData,
  DebtItemRepository,
  IDebtItemDAO,
  UpdateDebtItemRepositoryChanges,
} from './types';

const { parse } = snakeCaseMappers();

class DebtItemRepositoryImpl implements DebtItemRepository {
  async createDebtItem(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    debtId: string,
    data: CreateDebtItemRepositoryData
  ): Promise<IDebtItemDAO> {
    ctx.log.trace({ data }, 'try to create debt item');

    const { sign, amount, moneyId, accountId, categoryId, debtItemDate, reportPeriod, note, tags } = data;

    const debtItemDAO = await DebtItemDAO.query(ctx.trx).insertAndFetch({
      projectId: Number(projectId),
      cashflowId: Number(debtId),
      userId: Number(userId),
      sign,
      amount,
      moneyId: Number(moneyId),
      accountId: Number(accountId),
      categoryId: Number(categoryId),
      cashflowItemDate: debtItemDate,
      reportPeriod: reportPeriod,
      note,
      tags: tags ? tags.map(Number) : undefined,
    });

    const debtItemId = String(debtItemDAO.id);

    ctx.log.info({ debtItemId }, 'created debt item');

    return (await this.getDebtItem(ctx, projectId, debtItemId)) as IDebtItemDAO;
  }

  async getDebtItem(ctx: IRequestContext, projectId: string, debtItemId: string): Promise<IDebtItemDAO | undefined> {
    ctx.log.trace({ debtItemId }, 'try to get debt item');

    const knex = DebtItemDAO.knex();

    const { rows: debtItemRows } = await knex
      .raw(
        `
          select cfi.user_id,
                 cfi.id,
                 cfi.cashflow_id,
                 cfi.sign,
                 cfi.amount,
                 cfi.money_id,
                 cfi.account_id,
                 cfi.category_id,
                 to_char(cfi.cashflow_item_date, 'YYYY-MM-DD') as cashflow_item_date,
                 to_char(cfi.report_period, 'YYYY-MM-01') as report_period,
                 cfi.note,
                 cfi.tags
            from cf$.v_cashflow_item cfi
                   join cf$.v_cashflow_v2 cf
                        on (cf.project_id = cfi.project_id and cf.id = cfi.cashflow_id)
           where cfi.project_id = :projectId::int
             and cfi.id = :debtItemId::int
             and cf.cashflow_type_id = 2
        `,
        {
          projectId: String(projectId),
          debtItemId: String(debtItemId),
        }
      )
      .transacting(ctx.trx);

    if (debtItemRows.length === 0) {
      return undefined;
    }

    return DebtItemDAO.fromDatabaseJson(parse(debtItemRows[0]));
  }

  async getDebtItems(ctx: IRequestContext, projectId: string, debtIds: string[]): Promise<IDebtItemDAO[]> {
    ctx.log.trace({ debtIds }, 'try to get debt items');

    const knex = DebtItemDAO.knex();

    const { rows: debtItemRows } = await knex
      .raw(
        `
          select cfi.user_id,
                 cfi.id,
                 cfi.cashflow_id,
                 cfi.sign,
                 cfi.amount,
                 cfi.money_id,
                 cfi.account_id,
                 cfi.category_id,
                 to_char(cfi.cashflow_item_date, 'YYYY-MM-DD') as cashflow_item_date,
                 to_char(cfi.report_period, 'YYYY-MM-01') as report_period,
                 cfi.note,
                 cfi.tags
            from cf$.v_cashflow_v2 cf
                   join cf$.v_cashflow_item cfi
                        on (cfi.project_id = cf.project_id and cfi.cashflow_id = cf.id)
           where cf.project_id = :projectId::int
             and cf.id in (select unnest(:debtIds::int[]))
             and cf.cashflow_type_id = 2
           order by cfi.cashflow_id,
                    cfi.cashflow_item_date desc,
                    cfi.id desc
        `,
        {
          projectId: Number(projectId),
          userId: Number(projectId),
          debtIds: debtIds.map(Number),
        }
      )
      .transacting(ctx.trx);

    return debtItemRows.map(debtItemRow => DebtItemDAO.fromDatabaseJson(parse(debtItemRow)));
  }

  async updateDebtItem(
    ctx: IRequestContext,
    projectId: string,
    debtItemId: string,
    changes: UpdateDebtItemRepositoryChanges
  ): Promise<IDebtItemDAO> {
    ctx.log.trace({ debtItemId, changes }, 'try to update debt item');
    const { sign, amount, moneyId, accountId, categoryId, debtItemDate, reportPeriod, note, tags } = changes;

    await DebtItemDAO.query(ctx.trx)
      .patch({
        sign,
        amount,
        moneyId: moneyId ? Number(moneyId): undefined,
        cashflowItemDate: debtItemDate,
        reportPeriod,
        accountId: accountId ? Number(accountId) : undefined,
        categoryId: categoryId ? Number(categoryId): undefined,
        note,
        tags: tags ? tags.map(Number) : undefined,
      })
      .where({
        projectId: Number(projectId),
        id: Number(debtItemId),
      });

    ctx.log.info({ debtItemId }, 'updated debt item');

    return (await this.getDebtItem(ctx, projectId, debtItemId)) as IDebtItemDAO;
  }

  async deleteDebtItem(ctx: IRequestContext, projectId: string, debtItemId: string): Promise<void> {
    ctx.log.trace({ debtItemId }, 'try to delete debt item');

    await DebtItemDAO.query(ctx.trx).deleteById([Number(projectId), Number(debtItemId)]);

    ctx.log.info({ debtItemId }, 'deleted debt item');
  }
}

export const debtItemRepository = new DebtItemRepositoryImpl();
