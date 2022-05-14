import { ITransaction } from '../../types';

export function decodeTransaction(transaction: any): ITransaction {
  return {
    id: transaction.idIEDetail ? String(transaction.idIEDetail) : null,
    cashFlowId: transaction.idIE ? String(transaction.idIE) : null,
    sign: transaction.sign,
    amount: transaction.sum,
    moneyId: String(transaction.idMoney),
    categoryId: String(transaction.idCategory),
    accountId: String(transaction.idAccount),
    contractorId: transaction.idContractor ? String(transaction.idContractor) : null,
    transactionDate: transaction.dIEDetail,
    reportPeriod: transaction.reportPeriod,
    quantity: transaction.quantity,
    unitId: transaction.idUnit ? String(transaction.idUnit) : null,
    isNotConfirmed: transaction.isNotConfirmed,
    note: transaction.note,
    tags: transaction.tags,
    permit: transaction.permit,
    userId: String(transaction.idUser),
    nRepeat: transaction.nRepeat,
    colorMark: transaction.colorMark || null,
    planId: transaction.idPlan ? String(transaction.idPlan) : null,
  };
}
