import { snakeCaseMappers } from 'objection';

import { DebtDAO } from './model/debt-dao';
import { IRequestContext } from '../../types/app';
import {
  CreateDebtRepositoryData,
  DebtRepository,
  FindDebtsRepositoryResponse,
  FindDebtsServiceQuery,
  IDebtDAO,
  UpdateDebtRepositoryChanges,
} from './types';

const { parse } = snakeCaseMappers();

class DebtRepositoryImpl implements DebtRepository {
  async createDebt(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreateDebtRepositoryData
  ): Promise<IDebtDAO> {
    ctx.log.trace({ data }, 'try to create debt');

    const { contractorId, note, tags } = data;

    const debtDAO = await DebtDAO.query(ctx.trx).insertAndFetch({
      projectId: Number(projectId),
      userId: Number(userId),
      contractorId: Number(contractorId),
      note,
      tags: tags ? tags.map(Number) : undefined,
      cashflowTypeId: 2,
    });

    ctx.log.info({ debtId: debtDAO.id }, 'created debt');

    return (await this.getDebt(ctx, projectId, String(debtDAO.id))) as IDebtDAO;
  }

  async getDebt(ctx: IRequestContext, projectId: string, debtId: string): Promise<IDebtDAO | undefined> {
    ctx.log.trace({ debtId }, 'try to get debt');

    return DebtDAO.query(ctx.trx)
      .findById([Number(projectId), Number(debtId)])
      .where({
        cashflowTypeId: 2,
      });
  }

  async findDebts(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindDebtsServiceQuery
  ): Promise<FindDebtsRepositoryResponse> {
    ctx.log.trace({ query }, 'try to find debts');

    const {
      limit = 50,
      offset = 0,
      searchText = null,
      startDate = null,
      endDate = null,
      contractors = null,
      tags = null,
      isOnlyNotPaid = false,
    } = query;

    const knex = DebtDAO.knex();

    const { rows: debtRows } = await knex
      .raw(
        `with permit as
                (select a.id_project as project_id,
                        a.id_account as account_id,
                        7 as permit
                   from cf$.account a
                  where a.id_project = :projectId::int
                    and a.id_user = :userId::int
                  union all
                 select ap.id_project,
                        ap.id_account,
                        ap.permit
                   from cf$.account_permit ap
                  where ap.id_project = :projectId::int
                    and ap.id_user = :userId::int
                ),
              cfi as
                (select cfi.cashflow_id,
                        max(cfi.cashflow_item_date) as last_debt_item_date
                   from cf$.v_cashflow_v2 cf
                          join cf$.v_cashflow_item cfi
                               on (cfi.project_id = cf.project_id
                                 and cfi.cashflow_id = cf.id)
                          join permit p
                               on (p.project_id = cfi.project_id
                                 and p.account_id = cfi.account_id)
                  where cf.cashflow_type_id = 2
                    and (:startDate::date is null or cfi.cashflow_item_date >= :startDate::date)
                    and (:endDate::date is null or cfi.cashflow_item_date <= :endDate::date)
                  group by cfi.cashflow_id),
              cf_notPaid as
                (select cfi.cashflow_id
                   from cf$.category c
                          join cf$.v_cashflow_item cfi
                               on (cfi.project_id = c.id_project
                                 and cfi.category_id = c.id_category)
                  where :isOnlyNotPaid::boolean is true
                    and c.id_project = :projectId::int
                    and c.id_category_prototype in (2, 3)
                  group by cfi.cashflow_id
                 having sum(cfi.sign * cfi.amount) != 0),
              c_s(id_contractor) as
                (select c.id_contractor
                   from cf$.contractor c
                  where c.id_project = :projectId::int
                    and :searchText::text is not null
                    and upper(c.name) like upper('%' || :searchText::text || '%')
                ),
              t_s (id_tag) as
                (select array(select t.id_tag
                                from cf$.tag t
                               where t.id_project = :projectId::int
                                 and :searchText::text is not null
                                 and upper(t.name) like upper('%' || :searchText::text || '%')
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
          and cf.cashflow_type_id = 2
          and (
            (cfi.cashflow_id is null
              and cf.user_id = :userId::int
              and :startDate::date is null
              and :endDate::date is null)
            or cfi.cashflow_id is not null
          )
          and (not :isOnlyNotPaid::boolean or cf.id in (select cf_notPaid.cashflow_id from cf_notPaid))
          and (:contractors::int[] is null or cf.contractor_id in (select unnest(:contractors::int[])))
          and (:tags::int[] is null or cf.tags && :tags::int[])
          and (
            :searchText::text is null
            or cf.contractor_id in (select c_s.id_contractor from c_s)
            or upper(cf.note) like upper('%' || :searchText::text || '%')
            or cf.tags && (select t_s.id_tag from t_s)
          )
        order by coalesce(cfi.last_debt_item_date, cf.updated_at) desc,
                 cf.id desc
        limit :limit::int offset :offset::int
        `,
        {
          projectId: Number(projectId),
          userId: Number(userId),
          searchText,
          startDate,
          endDate,
          contractors: contractors ? contractors.split(',').map(Number) : null,
          tags: tags ? tags.split(',').map(Number) : null,
          limit,
          offset,
          isOnlyNotPaid,
        }
      )
      .transacting(ctx.trx);

    if (!debtRows.length) {
      return {
        metadata: {
          limit,
          offset,
          total: 0,
        },
        debts: [],
      };
    }
    const { total } = debtRows[0];

    const debts: DebtDAO[] = debtRows.map(debt => DebtDAO.fromDatabaseJson(parse(debt)));

    return {
      metadata: {
        offset,
        limit,
        total,
      },
      debts,
    };
  }

  async updateDebt(
    ctx: IRequestContext,
    projectId: string,
    debtId: string,
    changes: UpdateDebtRepositoryChanges
  ): Promise<IDebtDAO> {
    ctx.log.trace({ debtId, changes }, 'try to update debt');
    const { contractorId, tags, note } = changes;

    await DebtDAO.query(ctx.trx)
      .patch({
        contractorId: contractorId ? Number(contractorId) : undefined,
        tags: tags ? tags.map(Number) : undefined,
        note,
      })
      .where({
        projectId: Number(projectId),
        id: Number(debtId),
        cashflowTypeId: 2,
      });

    return (await this.getDebt(ctx, projectId, String(debtId))) as IDebtDAO;
  }

  async deleteDebt(ctx: IRequestContext, projectId: string, debtId: string): Promise<void> {
    ctx.log.trace({ debtId }, 'try to delete debt');

    await DebtDAO.query(ctx.trx)
      .deleteById([Number(projectId), Number(debtId)])
      .where({
        cashflowTypeId: 2,
      });

    ctx.log.info({ debtId }, 'deleted debt');
  }
}

export const debtRepository = new DebtRepositoryImpl();
