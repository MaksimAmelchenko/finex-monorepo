import { action, makeObservable, observable } from 'mobx';

import { Category } from './category';
import { IAccount } from '../../types/account';
import { IContractor } from '../../types/contractor';
import { IIncomeExpenseTransaction } from '../../types/income-expense-transaction';
import { IMoney } from '../../types/money';
import { IUnit } from '../../types/unit';
import { IUser } from '../../types/user';
import { Permit, Sign, TDate } from '../../types';

export class IncomeExpenseTransaction implements IIncomeExpenseTransaction {
  readonly id: string | null;
  cashFlowId: string | null;
  planId: string | null;
  account: IAccount;
  category: Category;
  contractor: IContractor | null;
  transactionDate: TDate;
  money: IMoney;
  quantity: number | null;
  reportPeriod: TDate;
  sign: Sign;
  amount: number;
  note: string;
  tags: string[];
  permit: Permit;
  unit: IUnit | null;
  user: IUser;
  colorMark: string;
  isNotConfirmed: boolean;
  nRepeat: number | null;

  isSelected: boolean;

  constructor({
    id,
    cashFlowId,
    planId,
    user,
    contractor,
    category,
    account,
    money,
    unit,
    transactionDate,
    reportPeriod,
    sign,
    amount,
    quantity,
    note,
    tags,
    permit,
    colorMark,
    isNotConfirmed,
    nRepeat,
    isSelected,
  }: IIncomeExpenseTransaction) {
    this.id = id;
    this.cashFlowId = cashFlowId;
    this.planId = planId;
    this.user = user;
    this.contractor = contractor;
    this.category = category;
    this.account = account;
    this.money = money;
    this.unit = unit;
    this.transactionDate = transactionDate;
    this.reportPeriod = reportPeriod;
    this.sign = sign;
    this.amount = amount;
    this.quantity = quantity;
    this.note = note;
    this.tags = tags;
    this.permit = permit;
    this.colorMark = colorMark;
    this.isNotConfirmed = isNotConfirmed;
    this.nRepeat = nRepeat;
    this.isSelected = isSelected;

    makeObservable(this, {
      isSelected: observable,
      toggleSelection: action,
    });
  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }
}
