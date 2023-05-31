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

const TRANSFORMATION_NAME = 'defaultTransformation';
export const defaultTransformation: TransformationFunction = (
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
  log.trace(TRANSFORMATION_NAME, { account, cashAccountId: options.cashAccountId });
  // consider only booked transactions since pending transactions are not yet confirmed and can be changed
  return transactions.booked.map(transaction => {
    const {
      internalTransactionId,
      creditorName,
      debtorName,
      ultimateCreditor,
      bookingDate,
      valueDate,
      remittanceInformationUnstructured,
      remittanceInformationUnstructuredArray = [],
      remittanceInformationStructured,
      remittanceInformationStructuredArray = [],
      additionalInformation,
      transactionAmount,
      bankTransactionCode,
    } = transaction;
    // TODO use Zod to validate transaction
    const transactionId = internalTransactionId || transaction.transactionId!;
    const transactionDate = bookingDate || valueDate || format(new Date(), 'yyyy-MM-dd');
    const note = [
      remittanceInformationUnstructured,
      ...(!remittanceInformationUnstructured ? remittanceInformationUnstructuredArray : []),
      remittanceInformationStructured,
      ...(!remittanceInformationStructured ? remittanceInformationStructuredArray : []),
      additionalInformation,
    ]
      .filter(Boolean)
      .join(' | ');
    const contractorName = creditorName || debtorName || ultimateCreditor;
    const amount = Number(transactionAmount.amount);
    const currency = transactionAmount.currency;
    const accountId = account.accountId!;
    let cashFlow: INormalizedTransactionCashFlow | INormalizedTransactionTransfer | null = null;

    const isCashWithdrawal = additionalInformation === 'BARGELDAUSZAHLUNG' || bankTransactionCode === 'PMNT-CCRD-CWDL';

    if (isCashWithdrawal) {
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
    }

    const isCashDeposit = additionalInformation === 'BARGELDEINZAHLUNG SB' || bankTransactionCode === 'PMNT-CCRD-CDPT';
    if (isCashDeposit) {
      const { cashAccountId } = options;
      if (cashAccountId) {
        cashFlow = {
          cashFlowType: CashFlowType.Transfer,
          note,
          amount: Math.abs(amount),
          currency,
          fromAccountId: cashAccountId,
          toAccountId: accountId,
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
