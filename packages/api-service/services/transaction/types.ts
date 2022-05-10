import { Permit, Sign, TDate } from '../../types/app';

export interface ITransaction {
  userId: string;
  id: string | null;
  cashFlowId: string | null;
  sign: Sign;
  amount: number;
  moneyId: string;
  transactionDate: TDate;
  reportPeriod: TDate;
  accountId: string;
  categoryId: string;
  contractorId: string | null;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string | null;
  tags: string[];
  permit: Permit;
  nRepeat: number | null;
  colorMark: string | null;
  planId: string | null;
}

export type IPublicTransaction = ITransaction;

export interface GetTransactionsGatewayQuery {
  limit?: number;
  offset?: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  sign?: Sign;
  contractors?: string;
  accounts?: string;
  categories?: string;
  tags?: string;
}

export type GetTransactionsServiceQuery = GetTransactionsGatewayQuery;

export interface GetTransactionsGatewayResponse {
  transactions: IPublicTransaction[];
  metadata: { total: number; totalPlanned: number; limit: number; offset: number };
}

export type GetTransactionsServiceResponse = GetTransactionsGatewayResponse;

export interface CreateTransactionGatewayData {
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  contractorId?: string | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity?: number | null;
  unitId?: string | null;
  note?: string;
  tags?: string[];
  isNotConfirmed: boolean;
  planId?: string | null;
}

export type CreateTransactionServiceData = CreateTransactionGatewayData;

export type CreateTransactionGatewayResponse = ITransaction;
export type CreateTransactionServiceResponse = CreateTransactionGatewayResponse;
