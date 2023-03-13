import { IRequestContext, Permit, Sign, TDate } from '../../types/app';

export interface IOperationTransactionDAO {
  operationType: 'transaction';
  id: number;
  cashflowId: number;
  sign: Sign;
  amount: number;
  moneyId: number;
  accountId: number;
  categoryId: number;
  operationDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: number | null;
  isNotConfirmed: boolean;
  note: string | null;
  tags: number[] | null;
  contractorId: number | null;
  userId: number;
  permit: Permit;
}

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

export interface IOperationDebtItemDAO {
  operationType: 'debtItem';
  id: number;
  cashflowId: number;
  sign: Sign;
  amount: number;
  moneyId: number;
  accountId: number;
  categoryId: number;
  operationDate: TDate;
  reportPeriod: TDate;
  note: string | null;
  tags: number[] | null;
  contractorId: number;
  userId: number;
  permit: Permit;
}

export interface IOperationDebtItemDTO {
  operationType: 'debtItem';
  id: string;
  debtId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  contractorId: string;
  debtItemDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
  userId: string;
  permit: Permit;
}

export interface IOperationTransferDAO {
  operationType: 'transfer';
  id: number;
  amount: number;
  moneyId: number;
  accountFromId: number;
  accountToId: number;
  operationDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  moneyFeeId: number | null;
  accountFeeId: number | null;
  note: string | null;
  tags: number[] | null;
  userId: number;
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

export interface IOperationExchangeDAO {
  operationType: 'exchange';
  id: number;
  amountSell: number;
  moneySellId: number;
  accountSellId: number;

  amountBuy: number;
  moneyBuyId: number;
  accountBuyId: number;

  operationDate: TDate;
  reportPeriod: TDate;

  fee: number | null;
  moneyFeeId: number | null;
  accountFeeId: number | null;

  note: string | null;
  tags: number[] | null;
  userId: number;
}

export interface IOperationExchangeDTO {
  operationType: 'exchange';
  id: string;
  amountSell: number;
  moneySellId: string;
  accountSellId: string;

  amountBuy: number;
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

export type IOperationDAO =
  | IOperationTransactionDAO
  | IOperationDebtItemDAO
  | IOperationTransferDAO
  | IOperationExchangeDAO;

export type IOperationDTO =
  | IOperationTransactionDTO
  | IOperationDebtItemDTO
  | IOperationTransferDTO
  | IOperationExchangeDTO;

export interface FindOperationsRepositoryQuery {
  limit: number;
  offset: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  sign?: Sign;
  contractors?: string[];
  accounts?: string[];
  categories?: string[];
  tags?: string[];
}

export type FindOperationsServiceQuery = FindOperationsRepositoryQuery;

export interface FindOperationsRepositoryResponse {
  operations: IOperationDAO[];
  metadata: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface FindOperationsServiceResponse {
  operations: IOperationDTO[];
  metadata: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface OperationRepository {
  findOperations(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindOperationsRepositoryQuery
  ): Promise<FindOperationsRepositoryResponse>;
}

export interface OperationService {
  findOperations(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindOperationsServiceQuery
  ): Promise<FindOperationsServiceResponse>;
}

export interface OperationMapper {
  toDTO(transaction: IOperationDAO): IOperationDTO;
}
