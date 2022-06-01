import { Account } from '../stores/models/account';
import { Category } from '../stores/models/category';
import { Contractor } from '../stores/models/contractor';
import { Money } from '../stores/models/money';
import { Permit, Sign, TDate } from './index';
import { Tag } from '../stores/models/tag';
import { Unit } from '../stores/models/unit';
import { User } from '../stores/models/user';

export interface ITransaction {
  id: string;
  cashFlowId: string;
  sign: Sign;
  amount: number;
  money: Money;
  category: Category;
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
