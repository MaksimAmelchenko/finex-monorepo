import { IPlannedTransaction, IPlannedTransactionDAO, IPlannedTransactionDTO, PlannedTransactionMapper } from './types';
import { Permissions } from '../../types/app';
import { PlannedTransaction } from './models/planned-transaction';

class PlannedTransactionMapperImpl implements PlannedTransactionMapper {
  toDTO({
    planId,
    contractorId,
    markerColor,
    repetitionNumber,
    sign,
    amount,
    moneyId,
    transactionDate,
    reportPeriod,
    accountId,
    categoryId,
    quantity,
    unitId,
    note,
    tags,
    permit,
    userId,
  }: IPlannedTransaction): IPlannedTransactionDTO {
    return {
      planId,
      contractorId,
      markerColor,
      repetitionNumber,
      sign,
      amount,
      moneyId,
      transactionDate,
      reportPeriod,
      accountId,
      categoryId,
      quantity,
      unitId,
      note,
      tags,
      permit,
      userId,
    };
  }

  toDomain({
    planId,
    contractorId,
    markerColor,
    repetitionNumber,
    sign,
    amount,
    moneyId,
    categoryId,
    accountId,
    transactionDate,
    reportPeriod,
    quantity,
    unitId,
    note,
    tags,
    permit,
    userId,
  }: IPlannedTransactionDAO): IPlannedTransaction {
    return new PlannedTransaction({
      planId,
      contractorId,
      markerColor,
      repetitionNumber,
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      transactionDate,
      reportPeriod,
      quantity,
      unitId,
      note: note ?? '',
      tags: tags ?? [],
      userId,
      permit,
    });
  }
}

export const plannedTransactionMapper = new PlannedTransactionMapperImpl();
