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
