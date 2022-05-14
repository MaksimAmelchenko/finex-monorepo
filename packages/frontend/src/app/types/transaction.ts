import { IAccount } from './account';
import { ICategory } from './category';
import { IContractor } from './contractor';
import { IMoney } from './money';
import { IUnit } from './unit';
import { IUser } from './user';
import { Permit, Sign, TDate } from './index';

export interface ITransaction {
  id: string;
  cashFlowId: string;
  sign: Sign;
  amount: number;
  money: IMoney;
  category: ICategory;
  account: IAccount;
  contractor: IContractor | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unit: IUnit | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
  permit: Permit;
  user: IUser;
}
