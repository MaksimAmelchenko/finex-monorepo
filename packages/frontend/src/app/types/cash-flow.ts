import { Account } from '../stores/models/account';
import { Category } from '../stores/models/category';
import { Contractor } from '../stores/models/contractor';
import { CashFlowItem } from '../stores/models/cash-flow-item';
import { Metadata, Permit, Sign, TDate, TDateTime } from './index';
import { Money } from '../stores/models/money';
import { Tag } from '../stores/models/tag';
import { User } from '../stores/models/user';
import { Unit } from '../stores/models/unit';

export interface ICashFlowDTO {
  userId: string;
  id: string;
  contractorId: string | null;
  note: string;
  tags: string[];
  items: ICashFlowItemDTO[];
  updatedAt: TDateTime;
}

export interface ICashFlow {
  user: User;
  id: string;
  contractor: Contractor | null;
  note: string;
  tags: Tag[];
  items: CashFlowItem[];
  updatedAt: TDateTime;
}

export interface GetCashFlowsQuery {
  limit: number;
  offset: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  accounts?: string;
  contractors?: string;
  tags?: string;
}

export interface GetCashFlowsResponse {
  cashFlows: ICashFlowDTO[];
  metadata: Metadata;
}

export interface CreateCashFlowData {
  contractorId?: string | null;
  note?: string;
  tags?: string[];
  items?: CreateCashFlowItemData[];
}

export interface CreateCashFlowResponse {
  cashFlow: ICashFlowDTO;
}

export type UpdateCashFlowChanges = Partial<{
  contractorId: string | null;
  note: string;
  tags: string[];
  items: UpdateCashFlowItemChanges[];
}>;

export interface UpdateCashFlowResponse {
  cashFlow: ICashFlowDTO;
}

export interface ICashFlowItemDTO {
  userId: string;
  cashFlowId: string;
  id: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  cashFlowItemDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
  permit: Permit;
}

export interface ICashFlowItem {
  user: User;
  cashFlowId: string;
  id: string;
  sign: Sign;
  amount: number;
  money: Money;
  account: Account;
  category: Category | null;
  cashFlowItemDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unit: Unit | null;
  isNotConfirmed: boolean;
  note: string;
  tags: Tag[];
  permit: Permit;
}

export interface CreateCashFlowItemData {
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string | null;
  accountId: string;
  cashFlowItemDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note?: string;
  tags?: string[];
}

export interface CreateCashFlowItemResponse {
  cashFlowItem: ICashFlowItemDTO;
}

export type UpdateCashFlowItemChanges = Partial<{
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string | null;
  accountId: string;
  cashFlowItemDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
}>;

export interface UpdateCashFlowItemResponse {
  cashFlowItem: ICashFlowItemDTO;
}

export interface ICashFlowsApi {
  getCashFlows: (query: GetCashFlowsQuery) => Promise<GetCashFlowsResponse>;
  createCashFlow: (data: CreateCashFlowData) => Promise<CreateCashFlowResponse>;
  createCashFlowItem: (cashFlowId: string, data: CreateCashFlowItemData) => Promise<CreateCashFlowItemResponse>;
  updateCashFlow: (cashFlowId: string, changes: UpdateCashFlowChanges) => Promise<UpdateCashFlowResponse>;
  updateCashFlowItem: (
    cashFlowId: string,
    cashFlowItemId: string,
    changes: UpdateCashFlowItemChanges
  ) => Promise<UpdateCashFlowItemResponse>;
  deleteCashFlow: (cashFlowId: string) => Promise<void>;
  deleteCashFlowItem: (cashFlowId: string, cashFlowItemId: string) => Promise<void>;
}
