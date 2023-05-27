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
import { CashFlowItemRepository, ICashFlowItemDAO } from '../cash-flow-item/types';
import { CashFlowRepository } from '../cash-flow/types';
import { cashFlowItemRepository } from '../cash-flow-item/cash-flow-item.repository';
import { cashFlowRepository } from '../cash-flow/cash-flow.repository';
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
    const { fromAccountId, toAccountId, feeAccountId } = data;

    const { accounts } = ctx.permissions;
    if (
      (accounts[fromAccountId] & Permit.Update) !== Permit.Update ||
      (accounts[toAccountId] & Permit.Update) !== Permit.Update ||
      (feeAccountId && (accounts[feeAccountId] & Permit.Update) !== Permit.Update)
    ) {
      throw new AccessDeniedError();
    }

    const transferDAO = await this.transferRepository.createTransfer(ctx, projectId, userId, data);
    return transferMapper.toDomain(transferDAO);
  }

  async getTransfer(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    transferId: string
  ): Promise<ITransfer> {
    const transfer = await this.transferRepository
      .getTransfer(ctx, projectId, userId, transferId)
      .then(transfer => transferMapper.toDomain(transfer));

    const { accounts } = ctx.permissions;
    if (
      (accounts[transfer.fromAccountId] & Permit.Read) !== Permit.Read ||
      (accounts[transfer.toAccountId] & Permit.Read) !== Permit.Read ||
      (transfer.feeAccountId && (accounts[transfer.feeAccountId] & Permit.Read) !== Permit.Read)
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
      this.transferRepository.getTransferCategoryId(ctx, projectId),
      this.transferRepository.getTransferFeeCategoryId(ctx, projectId),
    ]);

    const transfers = transferDAOs.map(transferDAO =>
      transferMapper.toDomain(
        transferMapper.toDAO(
          transferDAO,
          cashFlowItemsByCashFlowId[String(transferDAO.id)] || [],
          transferCategoryId,
          transferFeeCategoryId
        )
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
      fromAccountId,
      toAccountId,
      transferDate,
      reportPeriod,
      isFee,
      fee,
      feeMoneyId,
      feeAccountId,
      note,
      tags,
    } = changes;

    if (fromAccountId && toAccountId && fromAccountId === toAccountId) {
      throw new InvalidParametersError('The same accounts for transfer are used');
    }

    const { accounts } = ctx.permissions;
    if (
      (fromAccountId && (accounts[fromAccountId] & Permit.Update) !== Permit.Update) ||
      (toAccountId && (accounts[toAccountId] & Permit.Update) !== Permit.Update) ||
      (feeAccountId && (accounts[feeAccountId] & Permit.Update) !== Permit.Update)
    ) {
      throw new AccessDeniedError();
    }

    const transfer = await this.getTransfer(ctx, projectId, userId, transferId);

    if ((fromAccountId ?? transfer.fromAccountId) === (toAccountId ?? transfer.toAccountId)) {
      throw new InvalidParametersError('The same accounts for transfer are used');
    }

    if (
      (accounts[transfer.fromAccountId] & Permit.Update) !== Permit.Update ||
      (accounts[transfer.toAccountId] & Permit.Update) !== Permit.Update ||
      (transfer.feeAccountId && (accounts[transfer.feeAccountId] & Permit.Update) !== Permit.Update)
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
      this.transferRepository.getTransferCategoryId(ctx, projectId),
      this.transferRepository.getTransferFeeCategoryId(ctx, projectId),
    ]);

    const transferItems = await this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, [transferId]);
    let isFeeUpdated = false;
    let transferFromItem: ICashFlowItemDAO | undefined;

    for (const transferItem of transferItems) {
      if (String(transferItem.categoryId) === transferCategoryId && transferItem.sign === -1) {
        transferFromItem = await this.cashFlowItemRepository.updateCashFlowItem(
          ctx,
          projectId,
          String(transferItem.id),
          {
            amount,
            moneyId,
            accountId: fromAccountId,
            cashFlowItemDate: transferDate,
            reportPeriod,
          }
        );
      }

      if (String(transferItem.categoryId) === transferCategoryId && transferItem.sign === 1) {
        await this.cashFlowItemRepository.updateCashFlowItem(ctx, projectId, String(transferItem.id), {
          amount,
          moneyId,
          accountId: toAccountId,
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
            moneyId: feeMoneyId,
            accountId: feeAccountId,
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
      if (fee || feeMoneyId || feeAccountId) {
        if (!fee || !feeMoneyId || !feeAccountId) {
          throw new InvalidParametersError('Fields fee, feeMoneyId and feeAccountId are required');
        }
        await this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, transferId, {
          sign: -1,
          amount: fee,
          moneyId: feeMoneyId,
          accountId: feeAccountId,
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
      (accounts[transfer.fromAccountId] & Permit.Update) !== Permit.Update ||
      (accounts[transfer.toAccountId] & Permit.Update) !== Permit.Update ||
      (transfer.feeAccountId && (accounts[transfer.feeAccountId] & Permit.Update) !== Permit.Update)
    ) {
      throw new AccessDeniedError();
    }

    const transferItems = await this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, [transferId]);
    for (const transferItem of transferItems) {
      await this.cashFlowItemRepository.deleteCashFlowItem(ctx, projectId, String(transferItem.id));
    }

    await this.cashFlowRepository.deleteCashFlow(ctx, projectId, transferId);
  }
}

export const transferService = new TransferServiceImpl({
  transferRepository,
  cashFlowRepository,
  cashFlowItemRepository,
});
