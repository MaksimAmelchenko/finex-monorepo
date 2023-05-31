import { IRequestContext, Permit, Sign, TDate } from '../../types/app';

export interface IOperationTransactionDAO {
  operationType: 'transaction';
  id: number;
  cashflowId: number;
  sign: Sign;
  amount: number;
  moneyId: number;
  accountId: number;
  categoryId: number | null;
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
  categoryId: string | null;
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
  fromAccountId: number;
  toAccountId: number;
  operationDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  feeMoneyId: number | null;
  feeAccountId: number | null;
  note: string | null;
  tags: number[] | null;
  userId: number;
}

export interface IOperationTransferDTO {
  operationType: 'transfer';
  id: string;
  amount: number;
  moneyId: string;
  fromAccountId: string;
  toAccountId: string;
  transferDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  feeMoneyId: string | null;
  feeAccountId: string | null;
  note: string;
  tags: string[];
  userId: string;
}

export interface IOperationExchangeDAO {
  operationType: 'exchange';
  id: number;
  sellAmount: number;
  sellMoneyId: number;
  sellAccountId: number;

  buyAmount: number;
  buyMoneyId: number;
  buyAccountId: number;

  operationDate: TDate;
  reportPeriod: TDate;

  fee: number | null;
  feeMoneyId: number | null;
  feeAccountId: number | null;

  note: string | null;
  tags: number[] | null;
  userId: number;
}

export interface IOperationExchangeDTO {
  operationType: 'exchange';
  id: string;
  sellAmount: number;
  sellMoneyId: string;
  sellAccountId: string;

  buyAmount: number;
  buyMoneyId: string;
  buyAccountId: string;

  exchangeDate: TDate;
  reportPeriod: TDate;

  fee: number | null;
  feeMoneyId: string | null;
  feeAccountId: string | null;

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
