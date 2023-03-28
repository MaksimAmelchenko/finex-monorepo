import { Account } from '../stores/models/account';
import { Category } from '../stores/models/category';
import { Contractor } from '../stores/models/contractor';
import { DebtItem } from '../stores/models/debt-item';
import { Metadata, Permit, Sign, TDate, TDateTime } from './index';
import { Money } from '../stores/models/money';
import { Tag } from '../stores/models/tag';
import { User } from '../stores/models/user';

export interface IDebtDTO {
  userId: string;
  id: string;
  contractorId: string;
  note: string;
  tags: string[];
  items: IDebtItemDTO[];
  updatedAt: TDateTime;
}

export interface IDebt {
  user: User;
  id: string;
  contractor: Contractor;
  note: string;
  tags: Tag[];
  items: DebtItem[];
  updatedAt: TDateTime;
}

export interface GetDebtsQuery {
  limit: number;
  offset: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  sign?: Sign;
  contractors?: string;
  tags?: string;
}

export interface GetDebtsResponse {
  debts: IDebtDTO[];
  metadata: Metadata;
}

export interface CreateDebtData {
  contractorId: string;
  note?: string;
  tags?: string[];
  items?: CreateDebtItemData[];
}

export interface CreateDebtResponse {
  debt: IDebtDTO;
}

export type UpdateDebtChanges = Partial<{
  contractorId: string;
  note: string;
  tags: string[];
  items: CreateDebtItemData[];
}>;

export interface UpdateDebtResponse {
  debt: IDebtDTO;
}

export interface IDebtItemDTO {
  userId: string;
  debtId: string;
  id: string;
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
  permit: Permit;
}

export interface IDebtItem {
  user: User;
  debtId: string;
  id: string;
  sign: Sign;
  amount: number;
  money: Money;
  account: Account;
  category: Category;
  contractor: Contractor;
  debtItemDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: Tag[];
  permit: Permit;
}

export interface CreateDebtItemData {
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string;
  accountId: string;
  debtItemDate: TDate;
  reportPeriod: TDate;
  note?: string;
  tags?: string[];
}

export interface CreateDebtItemResponse {
  debtItem: IDebtItemDTO;
}

export type UpdateDebtItemChanges = Partial<{
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string;
  accountId: string;
  debtItemDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
}>;

export interface UpdateDebtItemResponse {
  debtItem: IDebtItemDTO;
}
