import { Account } from '../stores/models/account';
import { Category } from '../stores/models/category';
import { Contractor } from '../stores/models/contractor';
import { IDeletable, ISelectable, Metadata, Permit, Sign, TDate } from './index';
import { Money } from '../stores/models/money';
import { Unit } from '../stores/models/unit';
import { User } from '../stores/models/user';
import { Tag } from '../stores/models/tag';

export interface IOperationTransactionDTO {
  operationType: 'transaction';
  id: string;
  cashFlowId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
  contractorId: string | null;
  userId: string;
  permit: Permit;
}

export interface IOperationTransaction {
  id: string;
  cashFlowId: string;
  operationDate: TDate;
  sign: Sign;
  amount: number;
  money: Money;
  account: Account;
  category: Category;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unit: Unit | null;
  isNotConfirmed: boolean;
  note: string;
  tags: Tag[];
  contractor: Contractor | null;
  user: User;
  permit: Permit;
}

export interface IOperationDebtDTO {
  operationType: 'debt';
  id: string;
  cashFlowId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  debtItemDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
  contractorId: string;
  userId: string;
  permit: Permit;
}

export interface IOperationDebt {
  id: string;
  operationDate: TDate;
  cashFlowId: string;
  sign: Sign;
  amount: number;
  money: Money;
  account: Account;
  category: Category;
  debtItemDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: Tag[];
  contractor: Contractor;
  user: User;
  permit: Permit;
}

export interface IOperationTransferDTO {
  operationType: 'transfer';
  id: string;
  amount: number;
  moneyId: string;
  accountFromId: string;
  accountToId: string;
  transferDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  moneyFeeId: string | null;
  accountFeeId: string | null;
  note: string;
  tags: string[];
  userId: string;
}

export interface IOperationTransfer {
  id: string;
  operationDate: TDate;
  amount: number;
  money: Money;
  accountFrom: Account;
  accountTo: Account;
  transferDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  moneyFee: Money | null;
  accountFee: Account | null;
  note: string;
  tags: Tag[];
  user: User;
}

export interface IOperationExchangeDTO {
  operationType: 'exchange';
  id: string;
  sellAmount: number;
  moneySellId: string;
  accountSellId: string;

  buyAmount: number;
  moneyBuyId: string;
  accountBuyId: string;

  exchangeDate: TDate;
  reportPeriod: TDate;

  fee: number | null;
  moneyFeeId: string | null;
  accountFeeId: string | null;

  note: string;
  tags: string[];
  userId: string;
}

export interface IOperationExchange {
  id: string;
  operationDate: TDate;
  sellAmount: number;
  moneySell: Money;
  accountSell: Account;

  buyAmount: number;
  moneyBuy: Money;
  accountBuy: Account;

  exchangeDate: TDate;
  reportPeriod: TDate;

  fee: number | null;
  moneyFee: Money | null;
  accountFee: Account | null;

  note: string;
  tags: Tag[];
  user: User;
}

export type IOperationDTO =
  | IOperationTransactionDTO
  | IOperationDebtDTO
  | IOperationTransferDTO
  | IOperationExchangeDTO;

export type IOperation = (IOperationTransaction | IOperationDebt | IOperationTransfer | IOperationExchange) & ISelectable & IDeletable;

export interface FindOperationsAPIQuery {
  limit: number;
  offset: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  sign?: Sign;
  contractors?: string;
  accounts?: string;
  categories?: string;
  tags?: string;
}

export interface GetOperationsQuery {
  limit: number;
  offset: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  sign?: Sign;
  contractors?: string;
  accounts?: string;
  categories?: string;
  tags?: string;
}

export interface GetOperationsResponse {
  operations: IOperationDTO[];
  metadata: Metadata;
}

export interface IOperationsApi {
  get: (query: GetOperationsQuery) => Promise<GetOperationsResponse>;
}
