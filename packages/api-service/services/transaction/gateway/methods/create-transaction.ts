import dbRequest from '../../../../libs/db-request';
import { CreateTransactionGatewayData, CreateTransactionGatewayResponse } from '../../types';
import { IRequestContext } from '../../../../types/app';
import { decodeTransaction } from './decode-transaction';

export async function createTransactions(
  ctx: IRequestContext,
  data: CreateTransactionGatewayData
): Promise<CreateTransactionGatewayResponse> {
  ctx.log.trace({ data }, 'try to create transaction');

  const {
    sign,
    amount,
    moneyId,
    accountId,
    categoryId,
    contractorId,
    transactionDate,
    reportPeriod,
    quantity,
    unitId,
    note,
    tags,
    isNotConfirmed,
    planId,
  } = data;

  const { ieDetail } = await dbRequest(ctx, 'cf.ieDetail.create', {
    idContractor: contractorId ? Number(contractorId) : null,
    idPlan: planId ? Number(planId) : null,
    idAccount: Number(accountId),
    idMoney: Number(moneyId),
    idCategory: Number(categoryId),
    idUnit: unitId ? Number(unitId) : null,
    sign,
    dIEDetail: transactionDate,
    reportPeriod,
    quantity,
    sum: amount,
    isNotConfirmed,
    note,
    tags,
  });

  const transaction = decodeTransaction(ieDetail);

  ctx.log.info({ transactionId: transaction.id }, 'created transaction');

  return transaction;
}
