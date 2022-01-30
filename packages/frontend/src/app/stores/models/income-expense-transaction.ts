import { IUser } from '../../types/user';
import { Permit, Sign, TDate } from '../../types';
import { IIncomeExpenseTransaction } from '../../types/income-expense-transaction';
import { IAccount } from '../../types/account';
import { ICategory } from '../../types/category';
import { IContractor } from '../../types/contractor';
import { IMoney } from '../../types/money';
import { IUnit } from '../../types/unit';

export class IncomeExpenseTransaction implements IIncomeExpenseTransaction {
  readonly id: string;
  cashFlowId: string;
  account: IAccount;
  category: ICategory;
  contractor: IContractor | undefined;
  dTransaction: TDate;
  money: IMoney;
  quantity: number;
  reportPeriod: TDate;
  sign: Sign;
  sum: number;
  note: string;
  tags: string[];
  permit: Permit;
  unit: IUnit | undefined;
  user: IUser;
  colorMark: string;
  isNotConfirmed: boolean;
  nRepeat: number | null;

  constructor({
    id,
    cashFlowId,
    user,
    contractor,
    category,
    account,
    money,
    unit,
    dTransaction,
    reportPeriod,
    sign,
    sum,
    quantity,
    note,
    tags,
    permit,
    colorMark,
    isNotConfirmed,
    nRepeat,
  }: IIncomeExpenseTransaction) {
    this.id = id;
    this.cashFlowId = cashFlowId;
    this.user = user;
    this.contractor = contractor;
    this.category = category;
    this.account = account;
    this.money = money;
    this.unit = unit;
    this.dTransaction = dTransaction;
    this.reportPeriod = reportPeriod;
    this.sign = sign;
    this.sum = sum;
    this.quantity = quantity;
    this.note = note;
    this.tags = tags;
    this.permit = permit;
    this.colorMark = colorMark;
    this.isNotConfirmed = isNotConfirmed;
    this.nRepeat = nRepeat;
  }
}
