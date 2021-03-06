import dbRequest from '../../../../libs/db-request';
import { IRequestContext } from '../../../../types/app';
import { UpdateTransactionGatewayChanges, UpdateTransactionGatewayResponse } from '../../types';
import { decodeTransaction } from './decode-transaction';
import { skipUndefined } from '../../../../libs/skip-undefined';

export async function updateTransaction(
  ctx: IRequestContext,
  transactionId: string,
  changes: UpdateTransactionGatewayChanges
): Promise<UpdateTransactionGatewayResponse> {
  ctx.log.trace({ changes }, 'try to update transaction');

  const {
    sign,
    amount,
    moneyId,
    accountId,
    categoryId,
    transactionDate,
    reportPeriod,
    quantity,
    unitId,
    note,
    tags,
    isNotConfirmed,
  } = changes;

  const params: any = {
    idIEDetail: Number(transactionId),
    sign,
    sum: amount,
    dIEDetail: transactionDate,
    reportPeriod,
    quantity,
    isNotConfirmed,
    note,
    tags,
  };

  if (moneyId !== undefined) {
    params.idMoney = Number(moneyId);
  }

  if (categoryId !== undefined) {
    params.idCategory = Number(categoryId);
  }

  if (accountId !== undefined) {
    params.idAccount = Number(accountId);
  }

  if (unitId !== undefined) {
    params.idUnit = unitId ? Number(unitId) : null;
  }

  const { ieDetail } = await dbRequest(ctx, 'cf.ieDetail.update', skipUndefined(params));

  const transaction = decodeTransaction(ieDetail);

  ctx.log.info({ transactionId: transaction.id }, 'updated transaction');

  return transaction;
}
