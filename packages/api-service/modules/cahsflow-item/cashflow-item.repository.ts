import { snakeCaseMappers } from 'objection';

import { CashFlowItemDAO } from './models/cahsflow-item-dao';
import { IRequestContext } from '../../types/app';

import {
  CreateCashFlowItemRepositoryData,
  CashFlowItemRepository,
  ICashFlowItemDAO,
  UpdateCashFlowItemRepositoryChanges,
} from './types';

const { parse } = snakeCaseMappers();

class CashFlowItemRepositoryImpl implements CashFlowItemRepository {
  async createCashFlowItem(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    cashFlowId: string,
    data: CreateCashFlowItemRepositoryData
  ): Promise<ICashFlowItemDAO> {
    ctx.log.trace({ data }, 'try to create cashflow item');

    const { sign, amount, moneyId, accountId, categoryId, cashFlowItemDate, reportPeriod, note, tags } = data;

    const cashFlowItemDAO = await CashFlowItemDAO.query(ctx.trx).insertAndFetch({
      projectId: Number(projectId),
      cashflowId: Number(cashFlowId),
      userId: Number(userId),
      sign,
      amount,
      moneyId: Number(moneyId),
      accountId: Number(accountId),
      categoryId: Number(categoryId),
      cashflowItemDate: cashFlowItemDate,
      reportPeriod,
      note,
      tags: tags ? tags.map(Number) : null,
    });

    const cashFlowItemId = String(cashFlowItemDAO.id);

    ctx.log.info({ cashFlowItemId }, 'created cashflow item');

    return (await this.getCashFlowItem(ctx, projectId, cashFlowItemId)) as ICashFlowItemDAO;
  }

  async getCashFlowItem(
    ctx: IRequestContext,
    projectId: string,
    cashFlowItemId: string
  ): Promise<ICashFlowItemDAO | undefined> {
    ctx.log.trace({ cashFlowItemId }, 'try to get cashflow item');

    const knex = CashFlowItemDAO.knex();

    let query = knex.raw(
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
           where cfi.project_id = :projectId::int
             and cfi.id = :cashFlowItemId::int
        `,
      {
        projectId: String(projectId),
        cashFlowItemId: String(cashFlowItemId),
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const { rows: cashFlowItemRows } = await query;

    if (cashFlowItemRows.length === 0) {
      return undefined;
    }

    return CashFlowItemDAO.fromDatabaseJson(parse(cashFlowItemRows[0]));
  }

  async getCashFlowItems(ctx: IRequestContext, projectId: string, cashFlowIds: string[]): Promise<ICashFlowItemDAO[]> {
    ctx.log.trace({ cashFlowIds }, 'try to get cashflow items');

    const knex = CashFlowItemDAO.knex();

    let query = knex.raw(
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
           where cfi.project_id = :projectId::int
             and cfi.cashflow_id in (select unnest(:cashFlowIds::int[]))
           order by cfi.cashflow_id,
                    cfi.cashflow_item_date desc,
                    cfi.id desc
        `,
      {
        projectId: Number(projectId),
        userId: Number(projectId),
        cashFlowIds: cashFlowIds.map(Number),
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const { rows: cashFlowItemRows } = await query;

    return cashFlowItemRows.map(cashFlowItemRow => CashFlowItemDAO.fromDatabaseJson(parse(cashFlowItemRow)));
  }

  async updateCashFlowItem(
    ctx: IRequestContext,
    projectId: string,
    cashFlowItemId: string,
    changes: UpdateCashFlowItemRepositoryChanges
  ): Promise<ICashFlowItemDAO> {
    ctx.log.trace({ cashFlowItemId, changes }, 'try to update cashflow item');
    const { sign, amount, moneyId, accountId, categoryId, cashFlowItemDate, reportPeriod, note, tags } = changes;

    await CashFlowItemDAO.query(ctx.trx)
      .patch({
        sign,
        amount,
        moneyId: moneyId ? Number(moneyId) : undefined,
        cashflowItemDate: cashFlowItemDate,
        reportPeriod,
        accountId: accountId ? Number(accountId) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        note,
        tags: tags ? tags.map(Number) : undefined,
      })
      .where({
        projectId: Number(projectId),
        id: Number(cashFlowItemId),
      });

    ctx.log.info({ cashFlowItemId }, 'updated cashflow item');

    return (await this.getCashFlowItem(ctx, projectId, cashFlowItemId)) as ICashFlowItemDAO;
  }

  async deleteCashFlowItem(ctx: IRequestContext, projectId: string, cashFlowItemId: string): Promise<void> {
    ctx.log.trace({ cashFlowItemId }, 'try to delete cashflow item');

    await CashFlowItemDAO.query(ctx.trx).deleteById([Number(projectId), Number(cashFlowItemId)]);

    ctx.log.info({ cashFlowItemId }, 'deleted cashflow item');
  }
}

export const cashFlowItemRepository = new CashFlowItemRepositoryImpl();
