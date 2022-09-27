import { Account } from '../stores/models/account';
import { Category } from '../stores/models/category';
import { Contractor } from '../stores/models/contractor';
import { Money } from '../stores/models/money';
import { Permit, Sign, TDate } from './index';
import { Unit } from '../stores/models/unit';
import { User } from '../stores/models/user';
import { Tag } from '../stores/models/tag';
import { Plan } from '../stores/models/plan';

export interface IPlanTransactionDTO {
  planId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string;
  accountId: string;
  contractorId: string | null;
  quantity: number | null;
  unitId: string | null;

  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;
  repetitionDays: number[] | null;
  terminationType: number | null;
  repetitionCount: number | null;
  endDate: TDate | null;
  note: string;
  operationNote: string;
  operationTags: string[];
  markerColor: string | null;
  userId: string;
  permit: Permit;
}

export interface IPlanTransactionEntity {
  planId: string;
  sign: Sign;
  amount: number;
  money: Money;
  category: Category;
  account: Account;
  contractor: Contractor | null;
  quantity: number | null;
  unit: Unit | null;

  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;
  repetitionDays: number[] | null;
  terminationType: number | null;
  repetitionCount: number | null;
  endDate: TDate | null;
  note: string;
  operationNote: string;
  operationTags: Tag[];
  markerColor: string | null;
  user: User;
  permit: Permit;
}

export interface IPlanTransaction {
  planId: string;
  sign: Sign;
  amount: number;
  money: Money;
  category: Category;
  account: Account;
  contractor: Contractor | null;
  quantity: number | null;
  unit: Unit | null;
  plan: Plan;
  permit: Permit;
}

export interface CreatePlanTransactionData {
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string;
  accountId: string;
  contractorId: string | null;
  quantity: number | null;
  unitId: string | null;

  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;
  repetitionDays?: number[] | null;
  terminationType?: number | null;
  repetitionCount?: number | null;
  endDate?: TDate | null;
  note?: string;
  operationNote?: string;
  operationTags?: string[];
  markerColor?: string | null;
}

export interface CreatePlanTransactionResponse {
  planTransaction: IPlanTransactionDTO;
}

export interface GetPlanTransactionsResponse {
  planTransactions: IPlanTransactionDTO[];
}

export type UpdatePlanTransactionChanges = Partial<{
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string;
  accountId: string;
  contractorId: string | null;
  quantity: number | null;
  unitId: string | null;
  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;
  repetitionDays: number[] | null;
  terminationType: number | null;
  repetitionCount: number | null;
  endDate: TDate | null;
  note: string;
  operationNote: string;
  operationTags: string[];
  markerColor: string | null;
}>;

export interface UpdatePlanTransactionResponse {
  planTransaction: IPlanTransactionDTO;
}

export interface IPlanTransactionsApi {
  get: () => Promise<GetPlanTransactionsResponse>;
  create: (data: CreatePlanTransactionData) => Promise<CreatePlanTransactionResponse>;
  update: (planId: string, changes: UpdatePlanTransactionChanges) => Promise<UpdatePlanTransactionResponse>;
  remove: (planId: string) => Promise<void>;
}
