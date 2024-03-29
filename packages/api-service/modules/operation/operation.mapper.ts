import {
  IOperationDAO,
  IOperationDTO,
  IOperationDebtItemDAO,
  IOperationTransactionDAO,
  IOperationTransferDAO,
  OperationMapper,
} from './types';

function isOperationTransaction(operation: IOperationDAO): operation is IOperationTransactionDAO {
  return operation.operationType === 'transaction';
}

function isOperationDebtItem(operation: IOperationDAO): operation is IOperationDebtItemDAO {
  return operation.operationType === 'debtItem';
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
        categoryId: categoryId ? String(categoryId) : null,
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

    if (isOperationDebtItem(operation)) {
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
        debtId: String(cashflowId),
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
        fromAccountId,
        toAccountId,
        operationDate,
        reportPeriod,
        fee,
        feeMoneyId,
        feeAccountId,
        note,
        tags,
        userId,
      } = operation;

      return {
        operationType,
        id: String(id),
        amount,
        moneyId: String(moneyId),
        fromAccountId: String(fromAccountId),
        toAccountId: String(toAccountId),
        transferDate: operationDate,
        reportPeriod,
        fee,
        feeMoneyId: feeMoneyId ? String(feeMoneyId) : null,
        feeAccountId: feeAccountId ? String(feeAccountId) : null,
        note: note ?? '',
        tags: tags ? tags.map(String) : [],
        userId: String(userId),
      };
    }

    const {
      operationType,
      id,
      buyAmount,
      buyMoneyId,
      sellAmount,
      sellMoneyId,
      buyAccountId,
      sellAccountId,
      operationDate,
      reportPeriod,
      fee,
      feeMoneyId,
      feeAccountId,
      note,
      tags,
      userId,
    } = operation;

    return {
      operationType,
      id: String(id),
      sellAmount,
      sellMoneyId: String(sellMoneyId),
      sellAccountId: String(sellAccountId),
      buyAmount,
      buyMoneyId: String(buyMoneyId),
      buyAccountId: String(buyAccountId),
      exchangeDate: operationDate,
      reportPeriod,
      fee,
      feeMoneyId: feeMoneyId ? String(feeMoneyId) : null,
      feeAccountId: feeAccountId ? String(feeAccountId) : null,
      note: note ?? '',
      tags: tags ? tags.map(String) : [],
      userId: String(userId),
    };
  }
}

export const operationMapper = new OperationMapperImpl();
