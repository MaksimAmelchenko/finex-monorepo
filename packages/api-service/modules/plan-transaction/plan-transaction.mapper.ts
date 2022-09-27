import { IPlanTransaction, IPlanTransactionDAO, IPlanTransactionDTO, PlanTransactionMapper } from './types';
import { PlanTransaction } from './models/plan-transaction';
import { IPlanDAO } from '../plan/types';
import { Permissions } from '../../types/app';

class PlanTransactionMapperImpl implements PlanTransactionMapper {
  toDomain(
    {
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      contractorId,
      quantity,
      unitId,

      plan: {
        projectId,
        id,
        startDate,
        reportPeriod,
        repetitionType,
        repetitionDays,
        terminationType,
        repetitionCount,
        endDate,
        note,
        operationNote,
        operationTags,
        markerColor,
        userId,
      },
    }: IPlanTransactionDAO,
    { accounts }: Permissions
  ): IPlanTransaction {
    return new PlanTransaction({
      projectId: String(projectId),
      planId: String(id),
      sign,
      amount,
      moneyId: String(moneyId),
      categoryId: String(categoryId),
      accountId: String(accountId),
      contractorId: contractorId ? String(contractorId) : null,
      quantity,
      unitId: unitId ? String(unitId) : null,
      permit: accounts[String(accountId)] ?? 0,

      startDate,
      reportPeriod,
      repetitionType,
      repetitionDays,
      terminationType,
      repetitionCount,
      endDate,
      note: note ?? '',
      operationNote: operationNote ?? '',
      operationTags: operationTags ? operationTags.map(String) : [],
      markerColor,
      userId: String(userId),
    });
  }

  toDTO({
    projectId,
    planId,
    sign,
    amount,
    moneyId,
    categoryId,
    accountId,
    contractorId,
    quantity,
    unitId,
    permit,
    startDate,
    reportPeriod,
    repetitionType,
    repetitionDays,
    terminationType,
    repetitionCount,
    endDate,
    note,
    operationNote,
    operationTags,
    markerColor,
    userId,
  }: IPlanTransaction): IPlanTransactionDTO {
    return {
      planId,
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      contractorId,
      quantity,
      unitId,
      startDate,
      reportPeriod,
      repetitionType,
      repetitionDays,
      terminationType,
      repetitionCount,
      endDate,
      note,
      operationNote,
      operationTags,
      markerColor,
      userId,
      permit,
    };
  }
}

export const planTransactionMapper = new PlanTransactionMapperImpl();
