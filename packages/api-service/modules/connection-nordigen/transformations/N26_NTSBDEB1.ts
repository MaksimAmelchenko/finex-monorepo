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

  // take first cash account
  const { accounts, connectionAccounts } = options;
  const cashAccount = accounts.filter(account => account.accountType === 1)[0];

  const result: INormalizedTransaction[] = [];
  // consider only booked transactions since pending transactions are not yet confirmed and can be changed
  for (const transaction of transactions.booked) {
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
    const iban = transaction.creditorAccount?.iban || transaction.debtorAccount?.iban;
    const amount = Number(transactionAmount.amount);
    const currency = transactionAmount.currency;
    const accountId = connectionAccount.accountId!;

    let cashFlow: INormalizedTransactionCashFlow | INormalizedTransactionTransfer | null = null;

    switch (bankTransactionCode) {
      case 'PMNT-CCRD-CWDL':
        // Cash Withdrawal
        if (cashAccount?.id) {
          cashFlow = {
            cashFlowType: CashFlowType.Transfer,
            note,
            amount: Math.abs(amount),
            currency,
            fromAccountId: accountId,
            toAccountId: cashAccount.id,
            transferDate: transactionDate,
          };
        }
        break;
    }

    // check income/expense with another space
    // in this case need to skip and this transaction will be added during Main Account sync as transfer
    // Condition:
    // - contractorName is account name
    // - "note": "From Main Account" or "note": "To Main Account"
    if (!cashFlow && contractorName && note) {
      if (
        connectionAccounts.find(
          ({ providerAccountName, accountId }) => providerAccountName === contractorName && accountId
        ) &&
        (note.includes(`From ${contractorName}`) || note.includes(`To ${contractorName}`))
      ) {
        // skip this transaction
        continue;
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

    if (!cashFlow) {
      // N26 has transfers in the format "From <account> to <account>" between spaces
      const match = new RegExp(/^From (.+) to (.+)$/).exec(contractorName || '');
      const fromAccountName = match && match[1];
      const toAccountName = match && match[2];
      const fromAccountId = connectionAccounts.find(
        ({ providerAccountName }) => providerAccountName === fromAccountName
      )?.accountId;
      const toAccountId = connectionAccounts.find(
        ({ providerAccountName }) => providerAccountName === toAccountName
      )?.accountId;

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

    result.push({
      transactionId,
      transactionDate,
      amount,
      currency,
      cashFlow,
      transformationName: TRANSFORMATION_NAME,
      source: transaction,
    });
  }

  return result;
};
