import { snakeCaseMappers } from 'objection';
import {
  FindPlannedTransactionsRepositoryResponse,
  FindPlannedTransactionsServiceQuery,
  IPlannedTransactionDAO,
  PlannedTransactionRepository,
} from './types';
import { IRequestContext } from '../../types/app';
import { knex } from '../../knex';

const { parse } = snakeCaseMappers();

class PlannedTransactionRepositoryImpl implements PlannedTransactionRepository {
  async findTransactions(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    params: FindPlannedTransactionsServiceQuery
  ): Promise<FindPlannedTransactionsRepositoryResponse> {
    ctx.log.trace({ params }, 'try to find planned transactions');

    const {
      limit,
      offset,
      searchText = null,
      sign = null,
      startDate = null,
      endDate = null,
      accounts = [],
      categories = [],
      contractors = [],
      tags = [],
    } = params;

    let query = knex.raw(
      `
          with recursive
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
            pt as (
              select pcfi.id_plan as plan_id,
                     pcfi.id_contractor as contractor_id,
                     p.color_mark as marker_color,
                     s.nrepeat as repetition_number,
                     pcfi.sign,
                     pcfi.sum as amount,
                     pcfi.id_money as money_id,
                     pcfi.id_account as account_id,
                     pcfi.id_category as category_id,
                     s.dplan as transaction_date,
                     s.report_period,
                     pcfi.quantity,
                     pcfi.id_unit as unit_id,
                     p.operation_note as note,
                     p.operation_tags as tags,
                     :userId::int as user_id,
                     permit.permit
                from permit
                       join cf$.plan_cashflow_item pcfi
                            on (pcfi.id_project = permit.project_id and pcfi.id_account = permit.account_id)
                       join cf$.plan p
                            on (p.id_project = permit.project_id and p.id_plan = pcfi.id_plan)
                       join cf$_plan.schedule(pcfi.id_plan, p.dbegin, (now() + interval '1 day')::date) s
                            on (true)
            )
        select pt.plan_id::text as plan_id,
               pt.contractor_id::text as contractor_id,
               pt.marker_color,
               pt.repetition_number,
               pt.sign,
               pt.amount,
               pt.money_id::text as money_id,
               pt.account_id::text as account_id,
               pt.category_id::text as category_id,
               to_char(pt.transaction_date, 'YYYY-MM-DD') as transaction_date,
               to_char(pt.report_period, 'YYYY-MM-01') as report_period,
               pt.quantity,
               pt.unit_id::text as unit_id,
               pt.note,
               pt.tags,
               pt.user_id::text as user_id,
               pt.permit,
               count(*) over () as total
          from pt
         where (:startDate::date is null or pt.transaction_date >= :startDate::date)
           and (:endDate::date is null or pt.transaction_date <= :endDate::date)
           and (:sign::int is null or pt.sign = :sign::int)
           and (:accounts::int[] is null or pt.account_id in (select unnest(:accounts::int[])))
           and (:categories::int[] is null or pt.category_id in (select ct.category_id from ct))
           and (:contractors::int[] is null or pt.contractor_id in (select unnest(:contractors::int[])))
           and (:tags::int[] is null or pt.tags && :tags::int[])
           and (
             :searchText::text is null
             or upper(pt.note) like upper('%' || :searchText::text || '%')
             or pt.category_id in (select ct_s.category_id from ct_s)
             or pt.contractor_id in (select c_s.contractor_id from c_s)
             or pt.tags && (select t_s.tags from t_s)
           )
         order by pt.transaction_date desc
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
    const { rows: transactionRows } = await query;

    if (!transactionRows.length) {
      return {
        metadata: {
          limit,
          offset,
          total: 0,
        },
        transactions: [],
      };
    }
    const { total } = transactionRows[0];

    const transactions: IPlannedTransactionDAO[] = transactionRows.map(({ total, ...transaction }) =>
      parse(transaction)
    );

    return {
      metadata: {
        offset,
        limit,
        total,
      },
      transactions,
    };
  }
}

export const plannedTransactionRepository = new PlannedTransactionRepositoryImpl();
