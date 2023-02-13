import { CashFlowDAO } from './models/cash-flow-dao';
import { snakeCaseMappers } from 'objection';

import {
  CashFlowRepository,
  CashFlowType,
  CreateCashFlowRepositoryData,
  FindCashFlowsRepositoryResponse,
  FindCashFlowsServiceQuery,
  ICashFlowDAO,
  UpdateCashFlowRepositoryChanges,
} from './types';
import { IRequestContext } from '../../types/app';
import { knex } from '../../knex';

const { parse } = snakeCaseMappers();

class CashFlowRepositoryImpl implements CashFlowRepository {
  async createCashFlow(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreateCashFlowRepositoryData
  ): Promise<ICashFlowDAO> {
    ctx.log.trace({ data }, 'try to create cash flow');

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

    ctx.log.info({ cashFlowId }, 'created cash flow');

    return (await this.getCashFlow(ctx, projectId, cashFlowId)) as ICashFlowDAO;
  }

  async getCashFlow(
    ctx: IRequestContext,
    projectId: string,
    cashFlowId: string,
    cashFlowTypeId?: CashFlowType
  ): Promise<ICashFlowDAO | undefined> {
    ctx.log.trace({ cashFlowId }, 'try to get cash flow');

    let query = CashFlowDAO.query(ctx.trx).findById([Number(projectId), Number(cashFlowId)]);

    if (cashFlowTypeId) {
      query = query.where({ cashflowTypeId: cashFlowTypeId });
    }
    return query;
  }

  async findCashFlows(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    params: FindCashFlowsServiceQuery
  ): Promise<FindCashFlowsRepositoryResponse> {
    ctx.log.trace({ params }, 'try to find cash flows');

    const {
      limit,
      offset,
      searchText = null,
      startDate = null,
      endDate = null,
      accounts = [],
      contractors = [],
      tags = [],
    } = params;

    let query = knex.raw(
      `
          with permit as
                 (select project_id,
                         account_id,
                         permit
                    from cf$_account.permit(:projectId::int, :userId::int)),
               cfi as (
                 select cfi.cashflow_id,
                        max(cfi.cashflow_item_date) as last_transaction_date
                   from cf$.v_cashflow_v2 cf
                          join cf$.v_cashflow_item cfi
                               on (cfi.project_id = cf.project_id
                                 and cfi.cashflow_id = cf.id)
                          join permit p
                               on (p.project_id = cfi.project_id
                                 and p.account_id = cfi.account_id)
                  where cf.cashflow_type_id = 1
                    and (:startDate::date is null or cfi.cashflow_item_date >= :startDate::date)
                    and (:endDate::date is null or cfi.cashflow_item_date <= :endDate::date)
                    and (:accounts::int[] is null or cfi.account_id in (select unnest(:accounts::int[])))
                  group by cfi.cashflow_id
               ),
               c_s(contractor_id) as
                 (select contractor_id
                    from cf$_contractor.get_contractors(:projectId::int, :searchText::text)
                 ),
               t_s (tags) as
                 (select array(select tag_id
                                 from cf$_tag.get_tags(:projectId::int, :searchText::text)
                           ) as tags
                 )
        select cf.project_id,
               cf.user_id,
               cf.id,
               cf.contractor_id,
               cf.note,
               cf.tags,
               cf.updated_at,
               cf.cashflow_type_id,
               count(*) over () as total
          from cf$.v_cashflow_v2 cf
                 left join cfi
                           on (cfi.cashflow_id = cf.id)
         where cf.project_id = :projectId::int
           and cf.cashflow_type_id = 1
           and (
             (cfi.cashflow_id is null
               and cf.user_id = :userId::int
               and :startDate::date is null
               and :endDate::date is null)
             or cfi.cashflow_id is not null
           )
           and (:contractors::int[] is null or cf.contractor_id in (select unnest(:contractors::int[])))
           and (:tags::int[] is null or cf.tags && :tags::int[])
           and (
             :searchText::text is null
             or cf.contractor_id in (select c_s.contractor_id from c_s)
             or upper(cf.note) like upper('%' || :searchText::text || '%')
             or cf.tags && (select t_s.tags from t_s)
           )
         order by coalesce(cfi.last_transaction_date, cf.updated_at) desc,
                  cf.id desc
         limit :limit::int offset :offset::int
      `,
      {
        projectId: Number(projectId),
        userId: Number(userId),
        searchText,
        startDate,
        endDate,
        accounts: accounts.length ? accounts.map(Number) : null,
        contractors: contractors.length ? contractors.map(Number) : null,
        tags: tags.length ? tags.map(Number) : null,
        limit,
        offset,
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const { rows: cashFlowRows } = await query;

    if (!cashFlowRows.length) {
      return {
        metadata: {
          limit,
          offset,
          total: 0,
        },
        cashFlows: [],
      };
    }
    const { total } = cashFlowRows[0];

    const cashFlows: ICashFlowDAO[] = cashFlowRows.map(({ total, ...cashFlow }) =>
      CashFlowDAO.fromDatabaseJson(parse(cashFlow))
    );

    return {
      metadata: {
        offset,
        limit,
        total,
      },
      cashFlows,
    };
  }

  async updateCashFlow(
    ctx: IRequestContext,
    projectId: string,
    cashFlowId: string,
    changes: UpdateCashFlowRepositoryChanges
  ): Promise<ICashFlowDAO> {
    ctx.log.trace({ cashFlowId, changes }, 'try to update cash flow');
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

    ctx.log.info({ cashFlowId }, 'updated cash flow');

    return (await this.getCashFlow(ctx, projectId, cashFlowId)) as ICashFlowDAO;
  }

  async deleteCashFlow(ctx: IRequestContext, projectId: string, cashFlowId: string): Promise<void> {
    ctx.log.trace({ cashFlowId }, 'try to delete cash flow');

    await CashFlowDAO.query(ctx.trx).deleteById([Number(projectId), Number(cashFlowId)]);

    ctx.log.info({ cashFlowId }, 'deleted cash flow');
  }
}

export const cashFlowRepository = new CashFlowRepositoryImpl();
