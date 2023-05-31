import { Account } from '../stores/models/account';
import { Category } from '../stores/models/category';
import { Contractor } from '../stores/models/contractor';
import { Metadata, Permit, Sign, TDate } from './index';
import { Money } from '../stores/models/money';
import { Tag } from '../stores/models/tag';
import { Unit } from '../stores/models/unit';
import { User } from '../stores/models/user';

export interface ITransactionDTO {
  id: string;
  cashFlowId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string | null;
  contractorId: string | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string | null;
  tags: string[];
  permit: Permit;
  userId: string;
}

export interface ITransaction {
  id: string;
  cashFlowId: string;
  sign: Sign;
  amount: number;
  money: Money;
  category: Category | null;
  account: Account;
  contractor: Contractor | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unit: Unit | null;
  isNotConfirmed: boolean;
  note: string;
  tags: Tag[];
  permit: Permit;
  user: User;
}

export interface IPlannedTransactionDTO extends Omit<ITransactionDTO, 'id' | 'cashFlowId' | 'isNotConfirmed'> {
  planId: string;
  markerColor: string;
  repetitionNumber: number;
}

export interface IPlannedTransaction extends Omit<ITransaction, 'id' | 'cashFlowId' | 'isNotConfirmed' | 'category'> {
  category: Category;
  planId: string;
  markerColor: string;
  repetitionNumber: number;
}

export interface GetTransactionsQuery {
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

export interface GetTransactionsResponse {
  transactions: (ITransactionDTO | IPlannedTransactionDTO)[];
  metadata: Metadata;
}

export interface CreateTransactionData {
  cashFlowId?: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string | null;
  accountId: string;
  contractorId: string | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];

  planId: string | null;
}

export interface CreateTransactionResponse {
  transaction: ITransactionDTO;
}

export type UpdateTransactionChanges = Partial<{
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string | null;
  accountId: string;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
}>;

export interface UpdateTransactionResponse {
  transaction: ITransactionDTO;
}

export interface ITransactionsApi {
  get: (query: GetTransactionsQuery) => Promise<GetTransactionsResponse>;
  create: (data: CreateTransactionData) => Promise<CreateTransactionResponse>;
  update: (transactionId: string, changes: UpdateTransactionChanges) => Promise<UpdateTransactionResponse>;
  remove: (transactionId: string) => Promise<void>;
}

export function isPlannedTransactionDTO(
  transaction: IPlannedTransactionDTO | ITransactionDTO
): transaction is IPlannedTransactionDTO {
  return (transaction as IPlannedTransactionDTO).planId !== undefined;
}

export function isPlannedTransaction(
  transaction: IPlannedTransaction | ITransaction | any
): transaction is IPlannedTransaction {
  return (transaction as IPlannedTransaction).planId !== undefined;
}
