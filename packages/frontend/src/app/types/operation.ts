import { Account } from '../stores/models/account';
import { Category } from '../stores/models/category';
import { Contractor } from '../stores/models/contractor';
import {
  CreateTransactionData,
  CreateTransactionResponse,
  ITransaction,
  ITransactionDTO,
  UpdateTransactionChanges,
  UpdateTransactionResponse,
} from './transaction';
import {
  CreateTransferData,
  CreateTransferResponse,
  ITransfer,
  ITransferDTO,
  UpdateTransferChanges,
  UpdateTransferResponse,
} from './transfer';
import { IDeletable, ISelectable, Metadata, Permit, Sign, TDate } from './index';
import { Money } from '../stores/models/money';
import { Tag } from '../stores/models/tag';
import { User } from '../stores/models/user';

export interface IOperationTransactionDTO extends ITransactionDTO {
  operationType: 'transaction';
}

export interface IOperationTransaction extends ITransaction {
  operationDate: TDate;
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

export interface IOperationTransferDTO extends ITransferDTO {
  operationType: 'transfer';
}

export interface IOperationTransfer extends ITransfer {
  operationDate: TDate;
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

export type IOperation = (IOperationTransaction | IOperationDebt | IOperationTransfer | IOperationExchange) &
  ISelectable &
  IDeletable;

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
  createTransaction: (data: CreateTransactionData) => Promise<CreateTransactionResponse>;
  updateTransaction: (transactionId: string, changes: UpdateTransactionChanges) => Promise<UpdateTransactionResponse>;
  deleteTransaction: (transactionId: string) => Promise<void>;

  createTransfer: (data: CreateTransferData) => Promise<CreateTransferResponse>;
  updateTransfer: (transferId: string, changes: UpdateTransferChanges) => Promise<UpdateTransferResponse>;
  deleteTransfer: (transferId: string) => Promise<void>;
}
