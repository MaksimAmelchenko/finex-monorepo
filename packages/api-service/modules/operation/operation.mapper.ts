import {
  IOperationDAO,
  IOperationDebtDAO,
  IOperationDTO,
  IOperationTransactionDAO,
  IOperationTransferDAO,
  OperationMapper,
} from './types';

function isOperationTransaction(operation: IOperationDAO): operation is IOperationTransactionDAO {
  return operation.operationType === 'transaction';
}

function isOperationDebt(operation: IOperationDAO): operation is IOperationDebtDAO {
  return operation.operationType === 'debt';
}

function isOperationTransfer(operation: IOperationDAO): operation is IOperationTransferDAO {
  return operation.operationType === 'transfer';
}

class OperationMapperImpl implements OperationMapper {
  toDTO(operation: IOperationDAO): IOperationDTO {
    if (isOperationTransaction(operation)) {
      const {
        operationType,
        id,
        cashflowId,
        sign,
        amount,
        moneyId,
        accountId,
        categoryId,
        operationDate,
        reportPeriod,
        quantity,
        unitId,
        isNotConfirmed,
        note,
        tags,
        contractorId,
        userId,
        permit,
      } = operation;

      return {
        operationType,
        id: String(id),
        cashFlowId: String(cashflowId),
        sign,
        amount,
        moneyId: String(moneyId),
        categoryId: String(categoryId),
        accountId: String(accountId),
        transactionDate: operationDate,
        reportPeriod,
        contractorId: contractorId ? String(contractorId) : null,
        quantity,
        unitId: unitId ? String(unitId) : null,
        isNotConfirmed,
        note: note ?? '',
        tags: tags ? tags.map(String) : [],
        userId: String(userId),
        permit,
      };
    }

    if (isOperationDebt(operation)) {
      const {
        operationType,
        id,
        cashflowId,
        sign,
        amount,
        moneyId,
        accountId,
        categoryId,
        operationDate,
        reportPeriod,
        contractorId,
        note,
        tags,
        userId,
        permit,
      } = operation;

      return {
        operationType,
        id: String(id),
        cashFlowId: String(cashflowId),
        sign,
        amount,
        moneyId: String(moneyId),
        categoryId: String(categoryId),
        accountId: String(accountId),
        debtItemDate: operationDate,
        reportPeriod,
        contractorId: String(contractorId),
        note: note ?? '',
        tags: tags ? tags.map(String) : [],
        userId: String(userId),
        permit,
      };
    }

    if (isOperationTransfer(operation)) {
      const {
        operationType,
        id,
        amount,
        moneyId,
        accountFromId,
        accountToId,
        operationDate,
        reportPeriod,
        fee,
        moneyFeeId,
        accountFeeId,
        note,
        tags,
        userId,
      } = operation;

      return {
        operationType,
        id: String(id),
        amount,
        moneyId: String(moneyId),
        accountFromId: String(accountFromId),
        accountToId: String(accountToId),
        transferDate: operationDate,
        reportPeriod,
        fee,
        moneyFeeId: moneyFeeId ? String(moneyFeeId) : null,
        accountFeeId: accountFeeId ? String(accountFeeId) : null,
        note: note ?? '',
        tags: tags ? tags.map(String) : [],
        userId: String(userId),
      };
    }

    const {
      operationType,
      id,
      buyAmount,
      moneyBuyId,
      sellAmount,
      moneySellId,
      accountBuyId,
      accountSellId,
      operationDate,
      reportPeriod,
      fee,
      moneyFeeId,
      accountFeeId,
      note,
      tags,
      userId,
    } = operation;

    return {
      operationType,
      id: String(id),
      sellAmount,
      moneySellId: String(moneySellId),
      accountSellId: String(accountSellId),
      buyAmount,
      moneyBuyId: String(moneyBuyId),
      accountBuyId: String(accountBuyId),
      exchangeDate: operationDate,
      reportPeriod,
      fee,
      moneyFeeId: moneyFeeId ? String(moneyFeeId) : null,
      accountFeeId: accountFeeId ? String(accountFeeId) : null,
      note: note ?? '',
      tags: tags ? tags.map(String) : [],
      userId: String(userId),
    };
  }
}

export const operationMapper = new OperationMapperImpl();
