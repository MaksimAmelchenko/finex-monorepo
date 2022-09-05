import * as isEmpty from 'lodash.isempty';
import { AccessDeniedError, InternalError, InvalidParametersError, NotFoundError } from '../../libs/errors';
import { IRequestContext, Permit } from '../../types/app';

import {
  CreateTransferServiceData,
  FindTransfersRepositoryQuery,
  FindTransfersServiceResponse,
  ITransfer,
  TransferRepository,
  TransferService,
  UpdateTransferServiceChanges,
} from './types';
import { CashFlowItemRepository, ICashFlowItemDAO } from '../cahsflow-item/types';
import { CashFlowRepository, CashFlowType } from '../cahsflow/types';
import { CategoryGateway } from '../../services/category/gateway';
import { cashFlowItemRepository } from '../cahsflow-item/cashflow-item.repository';
import { cashFlowRepository } from '../cahsflow/cashflow.repository';
import { transferMapper } from './transfer.mapper';
import { transferRepository } from './transfer.repository';

class TransferServiceImpl implements TransferService {
  private transferRepository: TransferRepository;
  private cashFlowRepository: CashFlowRepository;
  private cashFlowItemRepository: CashFlowItemRepository;

  constructor({
    transferRepository,
    cashFlowRepository,
    cashFlowItemRepository,
  }: {
    transferRepository: TransferRepository;
    cashFlowRepository: CashFlowRepository;
    cashFlowItemRepository: CashFlowItemRepository;
  }) {
    this.transferRepository = transferRepository;
    this.cashFlowRepository = cashFlowRepository;
    this.cashFlowItemRepository = cashFlowItemRepository;
  }

  async createTransfer(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateTransferServiceData
  ): Promise<ITransfer> {
    const {
      amount,
      moneyId,
      accountFromId,
      accountToId,
      fee,
      moneyFeeId,
      accountFeeId,
      transferDate,
      reportPeriod,
      tags,
      note,
    } = data;

    if (
      (ctx.permissions.accounts[accountFromId] & Permit.Update) !== Permit.Update ||
      (ctx.permissions.accounts[accountToId] & Permit.Update) !== Permit.Update ||
      (accountFeeId && (ctx.permissions.accounts[accountFeeId] & Permit.Update) !== Permit.Update)
    ) {
      throw new AccessDeniedError();
    }

    const [transferCategoryId, transferFeeCategoryId] = await Promise.all([
      TransferServiceImpl.getTransferCategoryId(ctx, projectId),
      TransferServiceImpl.getTransferFeeCategoryId(ctx, projectId),
    ]);

    const cashFlow = await this.cashFlowRepository.createCashFlow(ctx, projectId, userId, {
      cashFlowTypeId: CashFlowType.Transfer,
      tags,
      note,
    });

    const transferId = String(cashFlow.id);

    await Promise.all([
      this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, transferId, {
        sign: -1,
        amount,
        moneyId,
        accountId: accountFromId,
        categoryId: transferCategoryId,
        cashFlowItemDate: transferDate,
        reportPeriod,
      }),
      this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, transferId, {
        sign: 1,
        amount,
        moneyId,
        accountId: accountToId,
        categoryId: transferCategoryId,
        cashFlowItemDate: transferDate,
        reportPeriod,
      }),
    ]);

    if (fee && moneyFeeId && accountFeeId) {
      await this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, transferId, {
        sign: -1,
        amount: fee,
        moneyId: moneyFeeId,
        accountId: accountFeeId,
        categoryId: transferFeeCategoryId,
        cashFlowItemDate: transferDate,
        reportPeriod,
      });
    }

    return this.getTransfer(ctx, projectId, userId, transferId);
  }

  async getTransfer(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    transferId: string
  ): Promise<ITransfer> {
    const [cashFlowDAO, cashFlowItemDAOs] = await Promise.all([
      this.cashFlowRepository.getCashFlow(ctx, projectId, transferId),
      this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, [transferId]),
    ]);

    if (!cashFlowDAO) {
      throw new NotFoundError();
    }

    const [transferCategoryId, transferFeeCategoryId] = await Promise.all([
      TransferServiceImpl.getTransferCategoryId(ctx, projectId),
      TransferServiceImpl.getTransferFeeCategoryId(ctx, projectId),
    ]);

    const transfer: ITransfer = transferMapper.toDomain(
      cashFlowDAO,
      cashFlowItemDAOs,
      transferCategoryId,
      transferFeeCategoryId
    );

    const { accounts } = ctx.permissions;
    if (
      (accounts[transfer.accountFromId] & Permit.Read) !== Permit.Read ||
      (accounts[transfer.accountToId] & Permit.Read) !== Permit.Read ||
      (transfer.accountFeeId && (accounts[transfer.accountFeeId] & Permit.Read) !== Permit.Read)
    ) {
      throw new NotFoundError();
    }

    return transfer;
  }

  async findTransfers(
    ctx: IRequestContext<any, true>,
    projectId: string,
    userId: string,
    query: FindTransfersRepositoryQuery
  ): Promise<FindTransfersServiceResponse> {
    const { transfers: transferDAOs, metadata } = await this.transferRepository.findTransfers(
      ctx,
      projectId,
      userId,
      query
    );

    const transferIds = transferDAOs.map(({ id }) => String(id));
    const cashFlowItems = await this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, transferIds);

    const cashFlowItemsByCashFlowId = cashFlowItems.reduce<Record<string, ICashFlowItemDAO[]>>((acc, cashFlowItem) => {
      acc[cashFlowItem.cashflowId] = acc[cashFlowItem.cashflowId] || [];
      acc[cashFlowItem.cashflowId].push(cashFlowItem);
      return acc;
    }, {});

    const [transferCategoryId, transferFeeCategoryId] = await Promise.all([
      TransferServiceImpl.getTransferCategoryId(ctx, projectId),
      TransferServiceImpl.getTransferFeeCategoryId(ctx, projectId),
    ]);

    const transfers = transferDAOs.map(transferDAO =>
      transferMapper.toDomain(
        transferDAO,
        cashFlowItemsByCashFlowId[String(transferDAO.id)] || [],
        transferCategoryId,
        transferFeeCategoryId
      )
    );

    return {
      metadata,
      transfers,
    };
  }

  async updateTransfer(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    transferId: string,
    changes: UpdateTransferServiceChanges
  ): Promise<ITransfer> {
    const {
      amount,
      moneyId,
      accountFromId,
      accountToId,
      transferDate,
      reportPeriod,
      isFee,
      fee,
      moneyFeeId,
      accountFeeId,
      note,
      tags,
    } = changes;

    const { accounts } = ctx.permissions;
    if (
      (accountFromId && (accounts[accountFromId] & Permit.Update) !== Permit.Update) ||
      (accountToId && (accounts[accountToId] & Permit.Update) !== Permit.Update) ||
      (accountFeeId && (accounts[accountFeeId] & Permit.Update) !== Permit.Update)
    ) {
      throw new AccessDeniedError();
    }

    const transfer = await this.getTransfer(ctx, projectId, userId, transferId);

    if (
      (accounts[transfer.accountFromId] & Permit.Update) !== Permit.Update ||
      (accounts[transfer.accountToId] & Permit.Update) !== Permit.Update ||
      (transfer.accountFeeId && (accounts[transfer.accountFeeId] & Permit.Update) !== Permit.Update)
    ) {
      throw new AccessDeniedError();
    }

    const cashFlowChanges = {
      note,
      tags,
    };
    if (!isEmpty(cashFlowChanges)) {
      await this.cashFlowRepository.updateCashFlow(ctx, projectId, transferId, cashFlowChanges);
    }

    const [transferCategoryId, transferFeeCategoryId] = await Promise.all([
      TransferServiceImpl.getTransferCategoryId(ctx, projectId),
      TransferServiceImpl.getTransferFeeCategoryId(ctx, projectId),
    ]);

    const transferItems = await this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, [transferId]);
    let isFeeUpdated = false;
    let transferFromItem: ICashFlowItemDAO | undefined;

    for await (const transferItem of transferItems) {
      if (String(transferItem.categoryId) === transferCategoryId && transferItem.sign === -1) {
        transferFromItem = await this.cashFlowItemRepository.updateCashFlowItem(
          ctx,
          projectId,
          String(transferItem.id),
          {
            amount,
            moneyId,
            accountId: accountFromId,
            cashFlowItemDate: transferDate,
            reportPeriod,
          }
        );
      }
      if (String(transferItem.categoryId) === transferCategoryId && transferItem.sign === 1) {
        await this.cashFlowItemRepository.updateCashFlowItem(ctx, projectId, String(transferItem.id), {
          amount,
          moneyId,
          accountId: accountToId,
          cashFlowItemDate: transferDate,
          reportPeriod,
        });
      }
      if (String(transferItem.categoryId) === transferFeeCategoryId) {
        if (isFee === false) {
          await this.cashFlowItemRepository.deleteCashFlowItem(ctx, projectId, String(transferItem.id));
        } else {
          isFeeUpdated = true;
          await this.cashFlowItemRepository.updateCashFlowItem(ctx, projectId, String(transferItem.id), {
            amount: fee,
            moneyId: moneyFeeId,
            accountId: accountFeeId,
            cashFlowItemDate: transferDate,
            reportPeriod,
          });
        }
      }
    }

    if (!transferFromItem) {
      throw new InternalError('Transfer record is corrupted');
    }

    if (!isFeeUpdated && isFee !== false) {
      if (fee || moneyFeeId || accountFeeId) {
        if (!fee || !moneyFeeId || !accountFeeId) {
          throw new InvalidParametersError('Fields fee, moneyFeeId and accountFeeId are required');
        }
        await this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, transferId, {
          sign: -1,
          amount: fee,
          moneyId: moneyFeeId,
          accountId: accountFeeId,
          categoryId: transferFeeCategoryId,
          cashFlowItemDate: transferFromItem.cashflowItemDate,
          reportPeriod: transferFromItem.reportPeriod,
        });
      }
    }

    return this.getTransfer(ctx, projectId, userId, transferId);
  }

  async deleteTransfer(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    transferId: string
  ): Promise<void> {
    const transfer = await this.getTransfer(ctx, projectId, userId, transferId);
    const { accounts } = ctx.permissions;

    if (
      (accounts[transfer.accountFromId] & Permit.Update) !== Permit.Update ||
      (accounts[transfer.accountToId] & Permit.Update) !== Permit.Update ||
      (transfer.accountFeeId && (accounts[transfer.accountFeeId] & Permit.Update) !== Permit.Update)
    ) {
      throw new AccessDeniedError();
    }

    const transferItems = await this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, [transferId]);
    for await (const transferItem of transferItems) {
      await this.cashFlowItemRepository.deleteCashFlowItem(ctx, projectId, String(transferItem.id));
    }

    await this.cashFlowRepository.deleteCashFlow(ctx, projectId, transferId);
  }

  private static async getTransferCategoryId(ctx: IRequestContext, projectId: string): Promise<string> {
    const category = await CategoryGateway.getCategoryByPrototype(ctx, projectId, '11');
    if (!category) {
      throw new InternalError('Transfer category not found', { categoryPrototype: 11 });
    }
    return String(category.idCategory);
  }

  private static async getTransferFeeCategoryId(ctx: IRequestContext, projectId: string): Promise<string> {
    const category = await CategoryGateway.getCategoryByPrototype(ctx, projectId, '12');
    if (!category) {
      throw new InternalError('Transfer category not found', { categoryPrototype: 12 });
    }
    return String(category.idCategory);
  }
}

export const transferService = new TransferServiceImpl({
  transferRepository,
  cashFlowRepository,
  cashFlowItemRepository,
});
