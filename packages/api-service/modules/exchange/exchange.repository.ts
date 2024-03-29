import { snakeCaseMappers } from 'objection';

import { CashFlowDAO } from '../cash-flow/models/cash-flow-dao';
import { FindExchangesRepositoryResponse, FindExchangesServiceQuery, ExchangeRepository } from './types';
import { IRequestContext } from '../../types/app';

const { parse } = snakeCaseMappers();

class ExchangeRepositoryImpl implements ExchangeRepository {
  async findExchanges(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    params: FindExchangesServiceQuery
  ): Promise<FindExchangesRepositoryResponse> {
    ctx.log.trace({ params }, 'try to find exchanges');

    const {
      limit = 50,
      offset = 0,
      searchText = null,
      startDate = null,
      endDate = null,
      sellAccounts,
      buyAccounts,
      tags = null,
    } = params;

    const knex = CashFlowDAO.knex();

    let query = knex.raw(
      `
          with params as
                 (select (select c.id_category
                            from cf$.category c
                           where c.id_project = :projectId::int
                             and c.id_category_prototype = 21) as category_exchange_id,
                         (select c.id_category
                            from cf$.category c
                           where c.id_project = :projectId::int
                             and c.id_category_prototype = 22) as category_exchange_free_id),
               permit as
                 (select project_id,
                         account_id,
                         permit
                    from cf$_account.permit(:projectId::int, :userId::int)),
               t_s (tags) as
                 (select array(select tag_id
                                 from cf$_tag.get_tags(:projectId::int, :searchText::text)
                           ) as tags
                 ),
               t as
                 (select cf.user_id,
                         cf.id,
                         cfd_sell.account_id sell_account_id,
                         cfd_buy.account_id as buy_account_id,
                         cfd_sell.cashflow_item_date as exchange_date,
                         cfd_fee.account_id as fee_account_id,
                         cf.note,
                         cf.tags,
                         cf.updated_at
                    from params
                           join cf$.v_cashflow_v2 cf
                                on (cf.project_id = :projectId
                                  and cf.cashflow_type_id = 4)
                           join cf$.v_cashflow_item cfd_sell
                                on (cfd_sell.project_id = cf.project_id
                                  and cfd_sell.cashflow_id = cf.id
                                  and cfd_sell.category_id = params.category_exchange_id
                                  and cfd_sell.sign = -1)
                           join cf$.v_cashflow_item cfd_buy
                                on (cfd_buy.project_id = cf.project_id
                                  and cfd_buy.cashflow_id = cf.id
                                  and cfd_buy.category_id = params.category_exchange_id
                                  and cfd_buy.sign = 1)
                           left join cf$.v_cashflow_item cfd_fee
                                     on (cfd_fee.project_id = cf.project_id
                                       and cfd_fee.cashflow_id = cf.id
                                       and cfd_fee.category_id = params.category_exchange_free_id)
                   where cfd_sell.account_id in (select permit.account_id from permit)
                     and cfd_buy.account_id in (select permit.account_id from permit)
                     and (cfd_fee.account_id is null or
                          cfd_fee.account_id in (select permit.account_id from permit))
                 )
        select t.user_id,
               t.id,
               t.note,
               t.tags,
               t.updated_at,
               count(*) over () as total
          from t
         where (:startDate::date is null or t.exchange_date >= :startDate::date)
           and (:endDate::date is null or t.exchange_date <= :endDate::date)
           and (:sellAccounts::int[] is null or t.sell_account_id in (select unnest(:sellAccounts::int[])))
           and (:buyAccounts::int[] is null or t.buy_account_id in (select unnest(:buyAccounts::int[])))
           and (:tags::int[] is null or t.tags && :tags::int[])
           and (
             :searchText::text is null
             or upper(t.note) like upper('%' || :searchText::text || '%')
             or t.tags && (select t_s.tags from t_s)
           )
         order by t.exchange_date desc,
                  t.id desc
         limit :limit::int offset :offset::int
      `,
      {
        projectId: Number(projectId),
        userId: Number(userId),
        searchText,
        startDate,
        endDate,
        sellAccounts: sellAccounts ? sellAccounts.map(Number) : null,
        buyAccounts: buyAccounts ? buyAccounts.map(Number) : null,
        tags: tags ? tags.map(Number) : null,
        limit,
        offset,
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const { rows: exchangeRows } = await query;

    if (!exchangeRows.length) {
      return {
        metadata: {
          limit,
          offset,
          total: 0,
        },
        exchanges: [],
      };
    }
    const { total } = exchangeRows[0];

    const exchanges: CashFlowDAO[] = exchangeRows.map(exchange => CashFlowDAO.fromDatabaseJson(parse(exchange)));

    return {
      metadata: {
        offset,
        limit,
        total,
      },
      exchanges,
    };
  }
}

export const exchangeRepository = new ExchangeRepositoryImpl();
