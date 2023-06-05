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
  connectionAccount: IAccount,
  transactions: INordigenTransactions,
  options: {
    accounts: Array<{
      id: string;
      name: string;
      accountType: number;
      iban: string;
    }>;
    connectionAccounts: Array<{
      providerAccountName: string;
      accountId: string;
    }>;
  }
): INormalizedTransaction[] => {
  log.trace(TRANSFORMATION_NAME, { connectionAccount });
  // consider only booked transactions since pending transactions are not yet confirmed and can be changed
  // take first cash account
  const { accounts, connectionAccounts } = options;
  const cashAccount = accounts.filter(account => account.accountType === 1)[0];

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
    const iban = transaction.creditorAccount?.iban || transaction.debtorAccount?.iban;
    const amount = Number(transactionAmount.amount);
    const currency = transactionAmount.currency;
    const accountId = connectionAccount.accountId!;
    let cashFlow: INormalizedTransactionCashFlow | INormalizedTransactionTransfer | null = null;

    const isCashWithdrawal = additionalInformation === 'BARGELDAUSZAHLUNG' || bankTransactionCode === 'PMNT-CCRD-CWDL';

    if (isCashWithdrawal) {
      if (cashAccount?.id) {
        cashFlow = {
          cashFlowType: CashFlowType.Transfer,
          note,
          amount: Math.abs(amount),
          currency,
          fromAccountId: accountId,
          toAccountId: cashAccount?.id,
          transferDate: transactionDate,
        };
      }
    }

    const isCashDeposit = additionalInformation === 'BARGELDEINZAHLUNG SB' || bankTransactionCode === 'PMNT-CCRD-CDPT';
    if (isCashDeposit) {
      if (cashAccount?.id) {
        cashFlow = {
          cashFlowType: CashFlowType.Transfer,
          note,
          amount: Math.abs(amount),
          currency,
          fromAccountId: cashAccount?.id,
          toAccountId: accountId,
          transferDate: transactionDate,
        };
      }
    }

    if (!cashFlow) {
      // is it transfer from my another account?
      const account = accounts.find(account => account.iban === iban);
      if (account) {
        let fromAccountId = account.id;
        let toAccountId = accountId;
        if (Math.sign(amount) === -1) {
          [fromAccountId, toAccountId] = [toAccountId, fromAccountId];
        }
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
