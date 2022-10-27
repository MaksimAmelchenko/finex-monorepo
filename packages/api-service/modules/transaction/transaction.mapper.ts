import { Transaction } from './models/transaction';
import { ITransaction, ITransactionDAO, ITransactionDTO, TransactionMapper } from './types';

class TransactionMapperImpl implements TransactionMapper {
  toDTO({
    id,
    cashFlowId,
    sign,
    amount,
    moneyId,
    transactionDate,
    reportPeriod,
    accountId,
    contractorId,
    categoryId,
    quantity,
    unitId,
    isNotConfirmed,
    note,
    tags,
    permit,
    userId,
  }: ITransaction): ITransactionDTO {
    return {
      id,
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      contractorId,
      transactionDate,
      reportPeriod,
      quantity,
      unitId,
      isNotConfirmed,
      note,
      tags,
      permit,
      cashFlowId,
      userId,
    };
  }

  toDomain({
    id,
    cashflowId,
    sign,
    amount,
    moneyId,
    categoryId,
    contractorId,
    accountId,
    transactionDate,
    reportPeriod,
    quantity,
    unitId,
    isNotConfirmed,
    note,
    tags,
    userId,
    permit,
  }: ITransactionDAO): ITransaction {
    return new Transaction({
      id: String(id),
      cashFlowId: String(cashflowId),
      sign,
      amount,
      moneyId: String(moneyId),
      categoryId: String(categoryId),
      accountId: String(accountId),
      contractorId: contractorId ? String(contractorId) : null,
      transactionDate,
      reportPeriod,
      quantity,
      unitId: unitId ? String(unitId) : null,
      isNotConfirmed,
      note: note ?? '',
      tags: tags ? tags.map(String) : [],
      permit,
      userId: String(userId),
    });
  }
}

export const transactionMapper = new TransactionMapperImpl();
