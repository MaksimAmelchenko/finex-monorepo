import { snakeCaseMappers } from 'objection';

import { CashFlowDAO } from '../cash-flow/models/cash-flow-dao';
import {
  CreateTransferServiceData,
  FindTransfersRepositoryResponse,
  FindTransfersServiceQuery,
  ITransferDAO,
  TransferRepository,
} from './types';
import { CashFlowType } from '../cash-flow/types';
import { CategoryGateway } from '../../services/category/gateway';
import { IRequestContext } from '../../types/app';
import { InternalError, InvalidParametersError, NotFoundError } from '../../libs/errors';
import { cashFlowItemRepository } from '../cash-flow-item/cash-flow-item.repository';
import { cashFlowRepository } from '../cash-flow/cash-flow.repository';
import { transferMapper } from './transfer.mapper';

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
      fromAccounts,
      toAccounts,
      tags = null,
    } = params;

    const knex = CashFlowDAO.knex();

    let query = knex.raw(
      `
          with params as
                 (select (select c.id_category
                            from cf$.category c
                           where c.id_project = :projectId::int
                             and c.id_category_prototype = 11) as transfer_category_id,
                         (select c.id_category
                            from cf$.category c
                           where c.id_project = :projectId::int
                             and c.id_category_prototype = 12) as transfer_fee_category_id),
               permit as
                 (select project_id,
                         account_id,
                         permit
                    from cf$_account.permit(:projectId::int, :userId::int)),
               t_s (tags) as
                 (select array(select tag_id
                                 from cf$_tag.get_tags(:projectId::int, :searchText::text)
                           ) as tags),
               t as
                 (select cf.user_id,
                         cf.id,
                         cfd_from.account_id from_account_id,
                         cfd_to.account_id as to_account_id,
                         cfd_from.cashflow_item_date as transfer_date,
                         cfd_fee.account_id as fee_account_id,
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
                                  and cfd_from.category_id = params.transfer_category_id
                                  and cfd_from.sign = -1)
                           join cf$.v_cashflow_item cfd_to
                                on (cfd_to.project_id = cf.project_id
                                  and cfd_to.cashflow_id = cf.id
                                  and cfd_to.category_id = params.transfer_category_id
                                  and cfd_to.sign = 1)
                           left join cf$.v_cashflow_item cfd_fee
                                     on (cfd_fee.project_id = cf.project_id
                                       and cfd_fee.cashflow_id = cf.id
                                       and cfd_fee.category_id = params.transfer_fee_category_id)
                   where cfd_from.account_id in (select permit.account_id from permit)
                     and cfd_to.account_id in (select permit.account_id from permit)
                     and (cfd_fee.account_id is null or
                          cfd_fee.account_id in (select permit.account_id from permit)))
        select t.user_id,
               t.id,
               t.note,
               t.tags,
               t.updated_at,
               count(*) over () as total
          from t
         where (:startDate::date is null or t.transfer_date >= :startDate::date)
           and (:endDate::date is null or t.transfer_date <= :endDate::date)
           and (:fromAccounts::int[] is null or t.from_account_id in (select unnest(:fromAccounts::int[])))
           and (:toAccounts::int[] is null or t.to_account_id in (select unnest(:toAccounts::int[])))
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
        fromAccounts: fromAccounts ? fromAccounts.map(Number) : null,
        toAccounts: toAccounts ? toAccounts.map(Number) : null,
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

  async createTransfer(
    ctx: IRequestContext<unknown, false>,
    projectId: string,
    userId: string,
    data: CreateTransferServiceData
  ): Promise<ITransferDAO> {
    const {
      amount,
      moneyId,
      fromAccountId,
      toAccountId,
      fee,
      feeMoneyId,
      feeAccountId,
      transferDate,
      reportPeriod,
      tags,
      note,
    } = data;

    if (fromAccountId === toAccountId) {
      throw new InvalidParametersError('The same accounts for transfer are used');
    }

    const [transferCategoryId, transferFeeCategoryId] = await Promise.all([
      this.getTransferCategoryId(ctx, projectId),
      this.getTransferFeeCategoryId(ctx, projectId),
    ]);

    const cashFlow = await cashFlowRepository.createCashFlow(ctx, projectId, userId, {
      cashFlowTypeId: CashFlowType.Transfer,
      tags,
      note,
    });

    const transferId = String(cashFlow.id);

    await Promise.all([
      cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, transferId, {
        sign: -1,
        amount,
        moneyId,
        accountId: fromAccountId,
        categoryId: transferCategoryId,
        cashFlowItemDate: transferDate,
        reportPeriod,
      }),
      cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, transferId, {
        sign: 1,
        amount,
        moneyId,
        accountId: toAccountId,
        categoryId: transferCategoryId,
        cashFlowItemDate: transferDate,
        reportPeriod,
      }),
    ]);

    if (fee && feeMoneyId && feeAccountId) {
      await cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, transferId, {
        sign: -1,
        amount: fee,
        moneyId: feeMoneyId,
        accountId: feeAccountId,
        categoryId: transferFeeCategoryId,
        cashFlowItemDate: transferDate,
        reportPeriod,
      });
    }

    return this.getTransfer(ctx, projectId, userId, transferId);
  }

  async getTransfer(
    ctx: IRequestContext<unknown, false>,
    projectId: string,
    userId: string,
    transferId: string
  ): Promise<ITransferDAO> {
    const [cashFlowDAO, cashFlowItemDAOs] = await Promise.all([
      cashFlowRepository.getCashFlow(ctx, projectId, transferId),
      cashFlowItemRepository.getCashFlowItems(ctx, projectId, [transferId]),
    ]);

    if (!cashFlowDAO) {
      throw new NotFoundError();
    }

    if (cashFlowItemDAOs.length !== 2 && cashFlowItemDAOs.length !== 3) {
      throw new InternalError('Corrupted transfer record');
    }

    const [transferCategoryId, transferFeeCategoryId] = await Promise.all([
      this.getTransferCategoryId(ctx, projectId),
      this.getTransferFeeCategoryId(ctx, projectId),
    ]);

    return transferMapper.toDAO(cashFlowDAO, cashFlowItemDAOs, transferCategoryId, transferFeeCategoryId);
  }

  async getTransferCategoryId(ctx: IRequestContext, projectId: string): Promise<string> {
    const categories = await CategoryGateway.getCategoriesByPrototype(ctx, projectId, '11');
    if (categories.length !== 1) {
      throw new InternalError('Transfer category not found', { categoryPrototype: 11 });
    }
    return String(categories[0].idCategory);
  }

  async getTransferFeeCategoryId(ctx: IRequestContext, projectId: string): Promise<string> {
    const categories = await CategoryGateway.getCategoriesByPrototype(ctx, projectId, '12');
    if (categories.length !== 1) {
      throw new InternalError('Transfer category not found', { categoryPrototype: 12 });
    }
    return String(categories[0].idCategory);
  }
}

export const transferRepository = new TransferRepositoryImpl();
