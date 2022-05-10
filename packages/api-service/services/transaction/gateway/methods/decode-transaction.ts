import { ITransaction } from '../../types';

export function decodeTransaction(transaction: any): ITransaction {
  return {
    userId: String(transaction.idUser),
    id: transaction.idIEDetail ? String(transaction.idIEDetail) : null,
    cashFlowId: transaction.idIE ? String(transaction.idIE) : null,
    accountId: String(transaction.idAccount),
    categoryId: String(transaction.idCategory),
    sign: transaction.sign,
    transactionDate: transaction.dIEDetail,
    reportPeriod: transaction.reportPeriod,
    amount: transaction.sum,
    moneyId: String(transaction.idMoney),
    contractorId: transaction.idContractor ? String(transaction.idContractor) : null,
    quantity: transaction.quantity,
    unitId: transaction.idUnit ? String(transaction.idUnit) : null,
    isNotConfirmed: transaction.isNotConfirmed,
    note: transaction.note,
    tags: transaction.tags,
    permit: transaction.permit,
    nRepeat: transaction.nRepeat,
    colorMark: transaction.colorMark || null,
    planId: transaction.planId ? String(transaction.planId) : null,
  };
}
