import { snakeCaseMappers } from 'objection';

import { CashFlowDAO } from '../cash-flow/models/cash-flow-dao';
import {
  DebtRepository,
  FindDebtsRepositoryResponse,
  FindDebtsServiceQuery,
  IDebtBalances,
  IDebtsBalancesParams,
} from './types';
import { IRequestContext } from '../../types/app';
import { knex } from '../../knex';

const { parse } = snakeCaseMappers();

class DebtRepositoryImpl implements DebtRepository {
  async findDebts(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    params: FindDebtsServiceQuery
  ): Promise<FindDebtsRepositoryResponse> {
    ctx.log.trace({ params }, 'try to find debts');

    const {
      limit = 50,
      offset = 0,
      searchText = null,
      startDate = null,
      endDate = null,
      contractors = null,
      tags = null,
      isOnlyNotPaid = false,
    } = params;

    const knex = CashFlowDAO.knex();

    let query = knex.raw(
      `
          with permit as
                 (select project_id,
                         account_id,
                         permit
                    from cf$_account.permit(:projectId::int, :userId::int)),
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
             or cf.contractor_id in (select c_s.contractor_id from c_s)
             or upper(cf.note) like upper('%' || :searchText::text || '%')
             or cf.tags && (select t_s.tags from t_s)
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
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const { rows: debtRows } = await query;

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

    const debts: CashFlowDAO[] = debtRows.map(debt => CashFlowDAO.fromDatabaseJson(parse(debt)));

    return {
      metadata: {
        offset,
        limit,
        total,
      },
      debts,
    };
  }

  async getBalances(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    params: IDebtsBalancesParams
  ): Promise<IDebtBalances[]> {
    ctx.log.trace({ params }, 'try to get debts balances');

    const { balanceDate, moneyId } = params;

    let query = knex.raw(
      `
          with --
               params as (
                 select u.id_currency_rate_source as currency_rate_source_id,
                        cf$_category.get_category_by_prototype(2) as principal_amount_category_id,
                        cf$_category.get_category_by_prototype(3) as principal_repayment_category_id
                   from core$.user u
                  where u.id_user = :userId::int
               ),
               permit as (
                 select project_id,
                        account_id,
                        permit
                   from cf$_account.permit(:projectId::int, :userId::int)
               ),
               d as (
                 select cf.contractor_id,
                        cfi.money_id,
                        sum(cfi.sign * cfi.amount) as amount
                   from params
                          join permit p
                               on (true)
                          join cf$.v_cashflow_v2 cf
                               using (project_id)
                          join cf$.v_cashflow_item cfi
                               on (cfi.project_id = cf.project_id
                                 and cfi.cashflow_id = cf.id
                                 and cfi.account_id = p.account_id)
                  where cf.cashflow_type_id = 2
                    and cfi.cashflow_item_date <= :balanceDate::date
                    and cfi.category_id in (params.principal_amount_category_id, params.principal_repayment_category_id)
                  group by cf.id,
                           cf.contractor_id,
                           cfi.money_id
                 having sum(cfi.sign * cfi.amount) != 0
               ),
               b as (
                 select contractor_id,
                        money_id,
                        sum(d.amount) as amount
                   from d
                  group by d.contractor_id,
                           d.money_id,
                           sign(d.amount)
               ),
               cb as (
                 select b.contractor_id::text,
                        b.money_id::text,
                        b.amount
                   from b
                  where :moneyId::int is null
                  union all
                 select b.contractor_id::text,
                        :moneyId::text,
                        sum(cf$_money.exchange(p_project_id => :projectId::int,
                                               p_amount => b.amount,
                                               p_from_money_id => b.money_id,
                                               p_to_money_id => :moneyId::int,
                                               p_rate_date => :balanceDate::date,
                                               p_currency_rate_source_id => params.currency_rate_source_id,
                                               p_is_round => true)) as amount
                   from b,
                        params
                  where :moneyId::int is not null
                  group by b.contractor_id,
                           :moneyId::int)
        select json_build_object('contractorId', cb.contractor_id,
                                 'debtType', case when sign(amount) = -1 then 1 else 2 end,
                                 'balances', json_agg(
                                   json_build_object(
                                     'moneyId', money_id,
                                     'amount', amount
                                     ))) as "debtBalances"
          from cb
         group by contractor_id, sign(amount)
      `,
      {
        projectId: Number(projectId),
        userId: Number(userId),
        balanceDate,
        moneyId: moneyId ? Number(moneyId) : null,
      }
    );

    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const { rows } = await query;

    return rows.map(row => row.debtBalances);
  }
}

export const debtRepository = new DebtRepositoryImpl();
