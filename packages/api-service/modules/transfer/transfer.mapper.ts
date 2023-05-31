import { ICashFlowDAO } from '../cash-flow/types';
import { ICashFlowItemDAO } from '../cash-flow-item/types';
import { InternalError } from '../../libs/errors';
import { Transfer } from './model/transfer';
import { TransferMapper, ITransfer, ITransferDTO, ITransferDAO } from './types';

class TransferMapperImpl implements TransferMapper {
  toDAO(
    { userId, id, note, tags, updatedAt }: ICashFlowDAO,
    cashFlowItems: ICashFlowItemDAO[],
    transferCategoryId: string,
    transferFeeCategoryId: string
  ): ITransferDAO {
    let amount: number | undefined;
    let moneyId: number | undefined;
    let fromAccountId: number | undefined;
    let toAccountId: number | undefined;
    let fee: number | null = null;
    let feeMoneyId: number | null = null;
    let feeAccountId: number | null = null;
    let transferDate: string | undefined;
    let reportPeriod: string | undefined;

    for (const cashFlowItem of cashFlowItems) {
      if (String(cashFlowItem.categoryId) === transferCategoryId && cashFlowItem.sign === -1) {
        amount = cashFlowItem.amount;
        moneyId = cashFlowItem.moneyId;
        fromAccountId = cashFlowItem.accountId;
        transferDate = cashFlowItem.cashflowItemDate;
        reportPeriod = cashFlowItem.reportPeriod;
      }

      if (String(cashFlowItem.categoryId) === transferCategoryId && cashFlowItem.sign === 1) {
        toAccountId = cashFlowItem.accountId;
      }

      if (String(cashFlowItem.categoryId) === transferFeeCategoryId) {
        fee = cashFlowItem.amount;
        feeMoneyId = cashFlowItem.moneyId;
        feeAccountId = cashFlowItem.accountId;
      }
    }

    if (!amount || !moneyId || !fromAccountId || !toAccountId || !transferDate || !reportPeriod) {
      throw new InternalError('Transfer record is corrupted');
    }

    return {
      userId,
      id,
      amount,
      moneyId,
      fromAccountId,
      toAccountId,
      fee,
      feeMoneyId,
      feeAccountId,
      transferDate,
      reportPeriod,
      note,
      tags,
      updatedAt,
    };
  }

  toDTO({
    userId,
    id,
    amount,
    moneyId,
    fromAccountId,
    toAccountId,
    transferDate,
    reportPeriod,
    fee,
    feeMoneyId,
    feeAccountId,
    note,
    tags,
    updatedAt,
  }: ITransfer): ITransferDTO {
    return {
      id,
      amount,
      moneyId,
      fromAccountId,
      toAccountId,
      transferDate,
      reportPeriod,
      fee,
      feeMoneyId,
      feeAccountId,
      note,
      tags,
      updatedAt,
      userId,
    };
  }

  toDomain(transferDAO: ITransferDAO): ITransfer {
    const {
      userId,
      id,
      amount,
      moneyId,
      fromAccountId,
      toAccountId,
      fee,
      feeMoneyId,
      feeAccountId,
      transferDate,
      reportPeriod,
      note,
      tags,
      updatedAt,
    } = transferDAO;

    return new Transfer({
      userId: String(userId),
      id: String(id),
      amount,
      moneyId: String(moneyId),
      fromAccountId: String(fromAccountId),
      toAccountId: String(toAccountId),
      fee,
      feeMoneyId: feeMoneyId ? String(feeMoneyId) : null,
      feeAccountId: feeAccountId ? String(feeAccountId) : null,
      transferDate,
      reportPeriod,
      note: note || '',
      tags: tags ? tags.map(String) : [],
      updatedAt,
    });
  }
}

export const transferMapper = new TransferMapperImpl();
