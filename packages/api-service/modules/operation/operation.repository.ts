import { snakeCaseMappers } from 'objection';

import {
  FindOperationsRepositoryResponse,
  FindOperationsServiceQuery,
  IOperationDAO,
  OperationRepository,
} from './types';
import { IRequestContext } from '../../types/app';
import { knex } from '../../knex';

const { parse } = snakeCaseMappers();

class OperationRepositoryImpl implements OperationRepository {
  async findOperations(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    params: FindOperationsServiceQuery
  ): Promise<FindOperationsRepositoryResponse> {
    ctx.log.trace({ params }, 'try to find operations');

    const {
      limit,
      offset,
      sign = null,
      accounts = [],
      categories = [],
      startDate = null,
      endDate = null,
      searchText = null,
      contractors = [],
      tags = [],
    } = params;

    let query = knex.raw(
      `
          with --
               ct (category_id) as (
                 select category_id
                   from cf$_category.get_categories_recursive(:projectId::int, :categories::int[])),
               ct_s (category_id) as (
                 select category_id
                   from cf$_category.get_categories_recursive(:projectId::int, :searchText::text)),
               permit as
                 (select project_id,
                         account_id,
                         permit
                    from cf$_account.permit(:projectId::int, :userId::int)),
               c_s(contractor_id) as
                 (select contractor_id
                    from cf$_contractor.get_contractors(:projectId::int, :searchText::text)
                 ),
               t_s (tags) as
                 (select array(select tag_id
                                 from cf$_tag.get_tags(:projectId::int, :searchText::text)
                           ) as tags
                 ),
               cfi as (select cf.contractor_id,
                              cf.cashflow_type_id,
                              cfi.*,
                              p.permit
                         from permit p
                                join cf$.v_cashflow_item cfi
                                     on (cfi.project_id = p.project_id and cfi.account_id = p.account_id)
                                join cf$.v_cashflow_v2 cf
                                     on (cf.project_id = cfi.project_id and cf.id = cfi.cashflow_id)
                        where cf.cashflow_type_id in (1, 2)),
               transfer as
                 (
                     with transfer_params as
                            (select (select c.id_category
                                       from cf$.category c
                                      where c.id_project = :projectId::int
                                        and c.id_category_prototype = 11) as transfer_category_id,
                                    (select c.id_category
                                       from cf$.category c
                                      where c.id_project = :projectId::int
                                        and c.id_category_prototype = 12) as transfer_free_category_id)
                   select cfi_from.cashflow_item_date as raw_operation_date,
                          cf.id,
                          cf.user_id,
                          cfi_from.amount amount,
                          cfi_from.money_id money_id,
                          cfi_from.account_id from_account_id,
                          cfi_to.account_id as to_account_id,
                          cfi_from.cashflow_item_date as transfer_date,
                          cfi_from.report_period as report_period,
                          cfi_fee.amount as fee,
                          cfi_fee.money_id as fee_money_id,
                          cfi_fee.account_id as fee_account_id,
                          cf.note,
                          cf.tags
                     from transfer_params
                            join cf$.v_cashflow_v2 cf
                                 on (cf.project_id = :projectId
                                   and cf.cashflow_type_id = 3)
                            join cf$.v_cashflow_item cfi_from
                                 on (cfi_from.project_id = cf.project_id
                                   and cfi_from.cashflow_id = cf.id
                                   and cfi_from.category_id = transfer_params.transfer_category_id
                                   and cfi_from.sign = -1)
                            join cf$.v_cashflow_item cfi_to
                                 on (cfi_to.project_id = cf.project_id
                                   and cfi_to.cashflow_id = cf.id
                                   and cfi_to.category_id = transfer_params.transfer_category_id
                                   and cfi_to.sign = 1)
                            left join cf$.v_cashflow_item cfi_fee
                                      on (cfi_fee.project_id = cf.project_id
                                        and cfi_fee.cashflow_id = cf.id
                                        and cfi_fee.category_id = transfer_params.transfer_free_category_id)
                    where cfi_from.account_id in (select permit.account_id from permit)
                      and cfi_to.account_id in (select permit.account_id from permit)
                      and (cfi_fee.account_id is null or
                           cfi_fee.account_id in (select permit.account_id from permit))),
               exchange as
                 (with exchange_params as
                         (select (select c.id_category
                                    from cf$.category c
                                   where c.id_project = :projectId::int
                                     and c.id_category_prototype = 21) as category_exchange_id,
                                 (select c.id_category
                                    from cf$.category c
                                   where c.id_project = :projectId::int
                                     and c.id_category_prototype = 22) as category_exchange_free_id)
                select cfi_sell.cashflow_item_date as raw_operation_date,
                       cf.id,
                       cfi_sell.amount as sell_amount,
                       cfi_sell.money_id as sell_money_id,
                       cfi_sell.account_id as sell_account_id,
                       cfi_buy.amount as buy_amount,
                       cfi_buy.money_id as buy_money_id,
                       cfi_buy.account_id as buy_account_id,
                       cfi_sell.cashflow_item_date as exchange_date,
                       cfi_sell.report_period as report_period,
                       cfi_fee.amount as fee,
                       cfi_fee.money_id as fee_money_id,
                       cfi_fee.account_id as fee_account_id,
                       cf.note,
                       cf.tags,
                       cf.user_id
                  from exchange_params
                         join cf$.v_cashflow_v2 cf
                              on (cf.project_id = :projectId
                                and cf.cashflow_type_id = 4)
                         join cf$.v_cashflow_item cfi_sell
                              on (cfi_sell.project_id = cf.project_id
                                and cfi_sell.cashflow_id = cf.id
                                and cfi_sell.category_id = exchange_params.category_exchange_id
                                and cfi_sell.sign = -1)
                         join cf$.v_cashflow_item cfi_buy
                              on (cfi_buy.project_id = cf.project_id
                                and cfi_buy.cashflow_id = cf.id
                                and cfi_buy.category_id = exchange_params.category_exchange_id
                                and cfi_buy.sign = 1)
                         left join cf$.v_cashflow_item cfi_fee
                                   on (cfi_fee.project_id = cf.project_id
                                     and cfi_fee.cashflow_id = cf.id
                                     and cfi_fee.category_id = exchange_params.category_exchange_free_id)
                 where cfi_sell.account_id in (select permit.account_id from permit)
                   and cfi_buy.account_id in (select permit.account_id from permit)
                   and (cfi_fee.account_id is null or
                        cfi_fee.account_id in (select permit.account_id from permit))
                 )
        select a.*,
               count(*) over () as total
          from (
                 select case
                          when cfi.cashflow_type_id = 1
                            then 'transaction'
                          else 'debtItem'
                          end as operation_type,
                        cfi.cashflow_item_date as raw_operation_date,
                        cfi.id,
                        cfi.cashflow_id,
                        cfi.sign,
                        cfi.amount,
                        cfi.money_id,
                        cfi.account_id,
                        cfi.category_id,
                        to_char(cfi.cashflow_item_date, 'YYYY-MM-DD') as operation_date,
                        to_char(cfi.report_period, 'YYYY-MM-01') as report_period,
                        cfi.quantity,
                        cfi.unit_id,
                        cfi.is_not_confirmed,
                        cfi.note,
                        cfi.tags,
                        cfi.contractor_id,
                        cfi.user_id,
                        cfi.permit,
                        null::numeric sell_amount,
                        null::int sell_money_id,
                        null::int sell_account_id,

                        null::numeric buy_amount,
                        null::int buy_money_id,
                        null::int buy_account_id,

                        null::numeric fee,
                        null::int fee_money_id,
                        null::int fee_account_id,

                        null::int from_account_id,
                        null::int to_account_id
                   from cfi
                  where (:startDate::date is null or cfi.cashflow_item_date >= :startDate::date)
                    and (:endDate::date is null or cfi.cashflow_item_date <= :endDate::date)
                    and (:sign::int is null or cfi.sign = :sign::int)
                    and (:accounts::int[] is null or cfi.account_id in (select unnest(:accounts::int[])))
                    and (:categories::int[] is null or cfi.category_id in (select ct.category_id from ct))
                    and (:contractors::int[] is null or cfi.contractor_id in (select unnest(:contractors::int[])))
                    and (:tags::int[] is null or cfi.tags && :tags::int[])
                    and (
                      :searchText::text is null
                      or upper(cfi.note) like upper('%' || :searchText::text || '%')
                      or cfi.category_id in (select ct_s.category_id from ct_s)
                      or cfi.contractor_id in (select c_s.contractor_id from c_s)
                      or cfi.tags && (select t_s.tags from t_s)
                    )
                  union all
                 select 'transfer' as operation_type,
                        t.raw_operation_date as raw_operation_date,
                        t.id,
                        null cashflow_id,
                        null sign,
                        t.amount,
                        t.money_id,
                        null account_id,
                        null category_id,
                        to_char(t.transfer_date, 'YYYY-MM-DD') as operation_date,
                        to_char(t.report_period, 'YYYY-MM-01') as report_period,
                        null quantity,
                        null unit_id,
                        null is_not_confirmed,
                        t.note,
                        t.tags,
                        null contractor_id,
                        t.user_id,
                        null permit,

                        null sell_amount,
                        null sell_money_id,
                        null sell_account_id,

                        null buy_amount,
                        null buy_money_id,
                        null buy_account_id,

                        t.fee,
                        t.fee_money_id,
                        t.fee_account_id,

                        t.from_account_id,
                        t.to_account_id
                   from transfer t
                  where (:startDate::date is null or t.transfer_date >= :startDate::date)
                    and (:endDate::date is null or t.transfer_date <= :endDate::date)
                    and (:accounts::int[] is null or t.from_account_id in (select unnest(:accounts::int[])))
                    and (:accounts::int[] is null or t.to_account_id in (select unnest(:accounts::int[])))
                    and (:tags::int[] is null or t.tags && :tags::int[])
                    and (
                      :searchText::text is null
                      or upper(t.note) like upper('%' || :searchText::text || '%')
                      or t.tags && (select t_s.tags from t_s)
                    )
                  union all
                 select 'exchange' as operation_type,
                        e.raw_operation_date as raw_operation_date,
                        e.id,
                        null cashflow_id,
                        null sign,
                        null amount,
                        null money_id,
                        null account_id,
                        null category_id,
                        to_char(e.exchange_date, 'YYYY-MM-DD') as operation_date,
                        to_char(e.report_period, 'YYYY-MM-01') as report_period,
                        null quantity,
                        null unit_id,
                        null is_not_confirmed,
                        e.note,
                        e.tags,
                        null contractor_id,
                        e.user_id,
                        null permit,

                        e.sell_amount,
                        e.sell_money_id,
                        e.sell_account_id,

                        e.buy_amount,
                        e.buy_money_id,
                        e.buy_account_id,

                        e.fee,
                        e.fee_money_id,
                        e.fee_account_id,

                        null from_account_id,
                        null to_account_id
                   from exchange e
                  where (:startDate::date is null or e.exchange_date >= :startDate::date)
                    and (:endDate::date is null or e.exchange_date <= :endDate::date)
                    and (:accounts::int[] is null or e.sell_account_id in (select unnest(:accounts::int[])))
                    and (:accounts::int[] is null or e.buy_account_id in (select unnest(:accounts::int[])))
                    and (:tags::int[] is null or e.tags && :tags::int[])
                    and (
                      :searchText::text is null
                      or upper(e.note) like upper('%' || :searchText::text || '%')
                      or e.tags && (select t_s.tags from t_s)
                    )
               ) a
         order by raw_operation_date desc,
                  cashflow_id desc,
                  id desc
         limit :limit::int offset :offset::int
      `,
      {
        projectId: Number(projectId),
        userId: Number(userId),
        sign,
        searchText,
        startDate,
        endDate,
        contractors: contractors.length ? contractors.map(Number) : null,
        tags: tags.length ? tags.map(Number) : null,
        accounts: accounts.length ? accounts.map(Number) : null,
        categories: categories.length ? categories.map(Number) : null,
        limit,
        offset,
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const { rows: operationRows } = await query;

    if (!operationRows.length) {
      return {
        metadata: {
          limit,
          offset,
          total: 0,
        },
        operations: [],
      };
    }
    const { total } = operationRows[0];

    const operations: IOperationDAO[] = operationRows.map(({ raw_operation_date, total, ...operation }) =>
      parse(operation)
    );

    return {
      metadata: {
        offset,
        limit,
        total,
      },
      operations,
    };
  }
}

export const operationRepository = new OperationRepositoryImpl();
