import { snakeCaseMappers } from 'objection';
import {
  FindTransactionsRepositoryResponse,
  FindTransactionsServiceQuery,
  ITransactionDAO,
  ITransactionEntity,
  TransactionRepository,
} from './types';
import { IRequestContext } from '../../types/app';
import { knex } from '../../knex';

const { parse } = snakeCaseMappers();

class TransactionRepositoryImpl implements TransactionRepository {
  async findTransactions(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    params: FindTransactionsServiceQuery
  ): Promise<FindTransactionsRepositoryResponse> {
    ctx.log.trace({ params }, 'try to find transactions');

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
          with recursive
            ct (id_category) as (
              select c.id_category
                from cf$.category c
               where c.id_project = :projectId::int
                 and c.id_category in (select unnest(:categories::int[]))
               union all
              select c.id_category
                from ct,
                     cf$.category c
               where c.id_project = :projectId::int
                 and c.parent = ct.id_category
            ),
            ct_s (id_category) as (
              select c.id_category
                from cf$.category c
               where c.id_project = :projectId::int
                 and :searchText::text is not null
                 and upper(c.name) like upper('%' || :searchText::text || '%')
               union all
              select c.id_category
                from ct_s,
                     cf$.category c
               where c.id_project = :projectId::int
                 and c.parent = ct_s.id_category
            ),
            permit as
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
              ),
            cfi as (select cfi.cashflow_id,
                           cfi.id,
                           cfi.user_id,
                           cf.contractor_id,
                           cfi.sign,
                           cfi.amount,
                           cfi.money_id,
                           cfi.account_id,
                           cfi.category_id,
                           cfi.cashflow_item_date,
                           cfi.report_period,
                           cfi.unit_id,
                           cfi.quantity,
                           cfi.is_not_confirmed,
                           cfi.note,
                           cfi.tags,
                           p.permit
                      from cf$.v_cashflow_item cfi
                             join permit p
                                  on (p.project_id = cfi.project_id and p.account_id = cfi.account_id)
                             join cf$.v_cashflow_v2 cf
                                  on (cf.project_id = cfi.project_id and cf.id = cfi.cashflow_id)
                     where cfi.project_id = :projectId
                       and cf.cashflow_type_id = 1
            )
        select cfi.id,
               cfi.cashflow_id,
               cfi.user_id,
               cfi.sign,
               cfi.amount,
               cfi.money_id,
               cfi.account_id,
               cfi.contractor_id,
               cfi.category_id,
               to_char(cfi.cashflow_item_date, 'YYYY-MM-DD') as transaction_date,
               to_char(cfi.report_period, 'YYYY-MM-01') as report_period,
               cfi.quantity,
               cfi.unit_id,
               cfi.is_not_confirmed,
               cfi.note,
               cfi.tags,
               cfi.permit,
               count(*) over () as total
          from cfi
         where (:startDate::date is null or cfi.cashflow_item_date >= :startDate::date)
           and (:endDate::date is null or cfi.cashflow_item_date <= :endDate::date)
           and (:sign::int is null or cfi.sign = :sign::int)
           and (:accounts::int[] is null or cfi.account_id in (select unnest(:accounts::int[])))
           and (:categories::int[] is null or cfi.category_id in (select ct.id_category from ct))
           and (:contractors::int[] is null or cfi.contractor_id in (select unnest(:contractors::int[])))
           and (:tags::int[] is null or cfi.tags && :tags::int[])
           and (
             :searchText::text is null
             or upper(cfi.note) like upper('%' || :searchText::text || '%')
             or cfi.category_id in (select ct_s.id_category from ct_s)
             or cfi.contractor_id in (select c_s.id_contractor from c_s)
             or cfi.tags && (select t_s.id_tag from t_s)
           )
         order by cfi.cashflow_item_date desc,
                  cfi.cashflow_id desc,
                  cfi.id desc
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

    const transactions: ITransactionDAO[] = transactionRows.map(({ total, ...transaction }) => parse(transaction));

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

export const transactionRepository = new TransactionRepositoryImpl();
