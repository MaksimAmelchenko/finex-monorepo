import { format } from 'date-fns';

import { CashFlowType } from '../../cash-flow/types';
import {
  IAccount,
  INormalizedTransaction,
  INormalizedTransactionCashFlow,
  INormalizedTransactionTransfer,
} from '../../connection/types';
import { ILogger, Sign } from '../../../types/app';
import { INordigenTransactions, TransformationFunction } from '../types';

const TRANSFORMATION_NAME = 'N26Transformation';
export const N26Transformation: TransformationFunction = (
  log: ILogger,
  account: IAccount,
  transactions: INordigenTransactions,
  options: {
    cashAccountId?: string;
    accounts: Array<{
      providerAccountName: string;
      accountId: string;
    }>;
  }
): INormalizedTransaction[] => {
  log.trace(TRANSFORMATION_NAME, { account, options });

  // consider only booked transactions since pending transactions are not yet confirmed and can be changed
  return transactions.booked.map(transaction => {
    const {
      internalTransactionId,
      creditorName,
      debtorName,
      bookingDate,
      valueDate,
      remittanceInformationUnstructured,
      transactionAmount,
      bankTransactionCode,
    } = transaction;
    // TODO use Zod to validate transaction
    const transactionId = internalTransactionId || transaction.transactionId!;
    const transactionDate = bookingDate || valueDate || format(new Date(), 'yyyy-MM-dd');
    const note = remittanceInformationUnstructured !== '-' ? remittanceInformationUnstructured : undefined;
    const contractorName = creditorName || debtorName;
    const amount = Number(transactionAmount.amount);
    const currency = transactionAmount.currency;
    const accountId = account.accountId!;
    let cashFlow: INormalizedTransactionCashFlow | INormalizedTransactionTransfer | null = null;

    switch (bankTransactionCode) {
      case 'PMNT-CCRD-CWDL':
        // Cash Withdrawal
        const { cashAccountId } = options;
        if (cashAccountId) {
          cashFlow = {
            cashFlowType: CashFlowType.Transfer,
            note,
            amount: Math.abs(amount),
            currency,
            fromAccountId: accountId,
            toAccountId: cashAccountId,
            transferDate: transactionDate,
          };
        }
        break;
    }

    if (!cashFlow) {
      // N26 has transfers in the format "From <account> to <account>" between spaces
      const match = new RegExp(/^From (.+) to (.+)$/).exec(contractorName || '');
      const fromAccountName = match && match[1];
      const toAccountName = match && match[2];
      const { accounts } = options;
      const fromAccountId = accounts.find(
        ({ providerAccountName }) => providerAccountName === fromAccountName
      )?.accountId;
      const toAccountId = accounts.find(({ providerAccountName }) => providerAccountName === toAccountName)?.accountId;

      if (fromAccountId && toAccountId) {
        cashFlow = {
          cashFlowType: CashFlowType.Transfer,
          note,
          amount: Math.abs(amount),
          currency,
          fromAccountId,
          toAccountId,
          transferDate: transactionDate,
        };
      }
    }

    // default
    if (!cashFlow) {
      cashFlow = {
        cashFlowType: CashFlowType.IncomeExpense,
        contractorName,
        note,
        items: [
          {
            sign: Math.sign(amount) as Sign,
            accountId,
            cashFlowItemDate: transactionDate,
            amount: Math.abs(amount),
            currency,
            note,
          },
        ],
      };
    }

    return {
      transactionId,
      transactionDate,
      amount,
      currency,
      cashFlow,
      transformationName: TRANSFORMATION_NAME,
      source: transaction,
    };
  });
};
