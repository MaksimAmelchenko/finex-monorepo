import { snakeCaseMappers } from 'objection';

import { CashFlowDAO } from '../cash-flow/models/cash-flow-dao';
import { FindTransfersRepositoryResponse, FindTransfersServiceQuery, TransferRepository } from './types';
import { IRequestContext } from '../../types/app';

const { parse } = snakeCaseMappers();

class TransferRepositoryImpl implements TransferRepository {
  async findTransfers(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    params: FindTransfersServiceQuery
  ): Promise<FindTransfersRepositoryResponse> {
    ctx.log.trace({ params }, 'try to find transfers');

    const {
      limit = 50,
      offset = 0,
      searchText = null,
      startDate = null,
      endDate = null,
      accountsFrom,
      accountsTo,
      tags = null,
    } = params;

    const knex = CashFlowDAO.knex();

    let query = knex.raw(
      `
            with params as
                   (select (select c.id_category
                              from cf$.category c
                             where c.id_project = :projectId::int
                               and c.id_category_prototype = 11) as category_transfer_id,
                           (select c.id_category
                              from cf$.category c
                             where c.id_project = :projectId::int
                               and c.id_category_prototype = 12) as category_transfer_free_id),
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
                 t_s as
                   (select array(select t.Id_tag
                                   from cf$.tag t
                                  where :searchText::text is not null
                                    and t.id_project = :projectId::int
                                    and upper(t.name) like upper('%' || :searchText::text || '%')
                             ) as tags),
                 t as
                   (select cf.user_id,
                           cf.id,
                           cfd_from.account_id account_from_id,
                           cfd_to.account_id as account_to_id,
                           cfd_from.cashflow_item_date as transfer_date,
                           cfd_fee.account_id as account_fee_id,
                           cf.note,
                           cf.tags,
                           cf.updated_at
                      from params
                             join cf$.v_cashflow_v2 cf
                                  on (cf.project_id = :projectId
                                    and cf.cashflow_type_id = 3)
                             join cf$.v_cashflow_item cfd_from
                                  on (cfd_from.project_id = cf.project_id
                                    and cfd_from.cashflow_id = cf.id
                                    and cfd_from.category_id = params.category_transfer_id
                                    and cfd_from.sign = -1)
                             join cf$.v_cashflow_item cfd_to
                                  on (cfd_to.project_id = cf.project_id
                                    and cfd_to.cashflow_id = cf.id
                                    and cfd_to.category_id = params.category_transfer_id
                                    and cfd_to.sign = 1)
                             left join cf$.v_cashflow_item cfd_fee
                                       on (cfd_fee.project_id = cf.project_id
                                         and cfd_fee.cashflow_id = cf.id
                                         and cfd_fee.category_id = params.category_transfer_free_id)
                     where cfd_from.account_id in (select permit.account_id from permit)
                       and cfd_To.account_id in (select permit.account_id from permit)
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
           where (:startDate::date is null or t.transfer_date >= :startDate::date)
             and (:endDate::date is null or t.transfer_date <= :endDate::date)
             and (:accountsFrom::int[] is null or t.account_from_id in (select unnest(:accountsFrom::int[])))
             and (:accountsTo::int[] is null or t.account_to_id in (select unnest(:accountsTo::int[])))
             and (:tags::int[] is null or t.tags && :tags::int[])
             and (
               :searchText::text is null
               or upper(t.note) like upper('%' || :searchText::text || '%')
               or t.tags && (select t_s.tags from t_s)
             )
           order by t.transfer_date desc,
                    t.id desc
           limit :limit::int offset :offset::int
        `,
      {
        projectId: Number(projectId),
        userId: Number(userId),
        searchText,
        startDate,
        endDate,
        accountsFrom: accountsFrom ? accountsFrom.map(Number) : null,
        accountsTo: accountsTo ? accountsTo.map(Number) : null,
        tags: tags ? tags.map(Number) : null,
        limit,
        offset,
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const { rows: transferRows } = await query;

    if (!transferRows.length) {
      return {
        metadata: {
          limit,
          offset,
          total: 0,
        },
        transfers: [],
      };
    }
    const { total } = transferRows[0];

    const transfers: CashFlowDAO[] = transferRows.map(transfer => CashFlowDAO.fromDatabaseJson(parse(transfer)));

    return {
      metadata: {
        offset,
        limit,
        total,
      },
      transfers,
    };
  }
}

export const transferRepository = new TransferRepositoryImpl();
