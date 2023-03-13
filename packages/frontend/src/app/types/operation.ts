import { Account } from '../stores/models/account';
import { Category } from '../stores/models/category';
import { Contractor } from '../stores/models/contractor';
import {
  CreateExchangeData,
  CreateExchangeResponse,
  IExchange,
  IExchangeDTO,
  UpdateExchangeChanges,
  UpdateExchangeResponse,
} from './exchange';
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
import { IDebtItem, IDebtItemDTO, UpdateDebtItemChanges, UpdateDebtItemResponse } from './debt';

export interface IOperationTransactionDTO extends ITransactionDTO {
  operationType: 'transaction';
}

export interface IOperationTransaction extends ITransaction {
  operationDate: TDate;
}

export interface IOperationDebtItemDTO extends IDebtItemDTO {
  operationType: 'debtItem';
}

export interface IOperationDebtItem extends IDebtItem {
  operationDate: TDate;
}

export interface IOperationTransferDTO extends ITransferDTO {
  operationType: 'transfer';
}

export interface IOperationTransfer extends ITransfer {
  operationDate: TDate;
}

export interface IOperationExchangeDTO extends IExchangeDTO {
  operationType: 'exchange';
}

export interface IOperationExchange extends IExchange {
  operationDate: TDate;
}

export type IOperationDTO =
  | IOperationTransactionDTO
  | IOperationDebtItemDTO
  | IOperationTransferDTO
  | IOperationExchangeDTO;

export type IOperation = (IOperationTransaction | IOperationDebtItem | IOperationTransfer | IOperationExchange) &
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

  updateDebtItem(debtId: string, debtItemId: string, changes: UpdateDebtItemChanges): Promise<UpdateDebtItemResponse>;
  deleteDebtItem(debtId: string, debtItemId: string): Promise<void>;

  createTransfer: (data: CreateTransferData) => Promise<CreateTransferResponse>;
  updateTransfer: (transferId: string, changes: UpdateTransferChanges) => Promise<UpdateTransferResponse>;
  deleteTransfer: (transferId: string) => Promise<void>;

  createExchange: (data: CreateExchangeData) => Promise<CreateExchangeResponse>;
  updateExchange: (exchangeId: string, changes: UpdateExchangeChanges) => Promise<UpdateExchangeResponse>;
  deleteExchange: (exchangeId: string) => Promise<void>;
}
