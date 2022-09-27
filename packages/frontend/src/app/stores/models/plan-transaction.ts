import { action, makeObservable, observable } from 'mobx';

import { Account } from './account';
import { Category } from './category';
import { Contractor } from './contractor';
import { IDeletable, ISelectable, Permit, Sign } from '../../types';
import { IPlanTransaction, IPlanTransactionEntity } from '../../types/plan-transaction';
import { Money } from './money';
import { Unit } from './unit';
import { Plan } from './plan';

export class PlanTransaction implements IPlanTransaction, ISelectable, IDeletable {
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

  isDeleting: boolean;
  isSelected: boolean;

  constructor({
    planId,
    sign,
    amount,
    money,
    category,
    account,
    contractor,
    quantity,
    unit,
    startDate,
    reportPeriod,
    repetitionType,
    repetitionDays,
    terminationType,
    repetitionCount,
    endDate,
    note,
    operationNote,
    operationTags,
    markerColor,
    user,
    permit,
  }: IPlanTransactionEntity) {
    this.planId = planId;
    this.sign = sign;
    this.amount = amount;
    this.money = money;
    this.category = category;
    this.account = account;
    this.contractor = contractor;
    this.quantity = quantity;
    this.unit = unit;
    this.plan = new Plan({
      id: planId,
      startDate,
      reportPeriod,
      repetitionType,
      repetitionDays,
      terminationType,
      repetitionCount,
      endDate,
      note,
      operationNote,
      operationTags,
      markerColor,
      user,
    });
    this.permit = permit;

    this.isDeleting = false;
    this.isSelected = false;

    makeObservable(this, {
      isDeleting: observable,
      isSelected: observable,
      toggleSelection: action,
    });
  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }
}
