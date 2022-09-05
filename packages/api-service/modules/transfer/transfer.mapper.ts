import { ICashFlowDAO } from '../cahsflow/types';
import { ICashFlowItemDAO } from '../cahsflow-item/types';
import { InternalError } from '../../libs/errors';
import { Transfer } from './model/transfer';
import { TransferMapper, ITransfer, ITransferDTO } from './types';

class TransferMapperImpl implements TransferMapper {
  toDTO({
    userId,
    id,
    amount,
    moneyId,
    accountFromId,
    accountToId,
    transferDate,
    reportPeriod,
    fee,
    moneyFeeId,
    accountFeeId,
    note,
    tags,
    updatedAt,
  }: ITransfer): ITransferDTO {
    return {
      id,
      amount,
      moneyId,
      accountFromId,
      accountToId,
      transferDate,
      reportPeriod,
      fee,
      moneyFeeId,
      accountFeeId,
      note,
      tags,
      updatedAt,
      userId,
    };
  }

  toDomain(
    { userId, id, note, tags, updatedAt }: ICashFlowDAO,
    cashFlowItems: ICashFlowItemDAO[],
    transferCategoryId: string,
    transferFeeCategoryId: string
  ): ITransfer {
    let amount: number | undefined;
    let moneyId: string | undefined;
    let accountFromId: string | undefined;
    let accountToId: string | undefined;
    let fee: number | null = null;
    let moneyFeeId: string | null = null;
    let accountFeeId: string | null = null;
    let transferDate: string | undefined;
    let reportPeriod: string | undefined;

    for (const cashFlowItem of cashFlowItems) {
      if (String(cashFlowItem.categoryId) === transferCategoryId && cashFlowItem.sign === -1) {
        amount = cashFlowItem.amount;
        moneyId = String(cashFlowItem.moneyId);
        accountFromId = String(cashFlowItem.accountId);
        transferDate = cashFlowItem.cashflowItemDate;
        reportPeriod = cashFlowItem.reportPeriod;
      }

      if (String(cashFlowItem.categoryId) === transferCategoryId && cashFlowItem.sign === 1) {
        accountToId = String(cashFlowItem.accountId);
      }

      if (String(cashFlowItem.categoryId) === transferFeeCategoryId) {
        fee = cashFlowItem.amount;
        moneyFeeId = String(cashFlowItem.moneyId);
        accountFeeId = String(cashFlowItem.accountId);
      }
    }

    if (!amount || !moneyId || !accountFromId || !accountToId || !transferDate || !reportPeriod) {
      throw new InternalError('Transfer record is corrupted');
    }

    return new Transfer({
      userId: String(userId),
      id: String(id),
      amount,
      moneyId,
      accountFromId,
      accountToId,
      fee,
      moneyFeeId,
      accountFeeId,
      transferDate,
      reportPeriod,
      note: note || '',
      tags: tags ? tags.map(String) : [],
      updatedAt,
    });
  }
}

export const transferMapper = new TransferMapperImpl();
