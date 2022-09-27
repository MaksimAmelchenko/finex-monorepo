import { IPlanTransaction, IPlanTransactionEntity } from '../types';
import { Permit, Sign, TDate } from '../../../types/app';

export class PlanTransaction implements IPlanTransaction {
  readonly projectId: string;
  readonly planId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string;
  accountId: string;
  contractorId: string | null;
  quantity: number | null;
  unitId: string | null;
  //
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

  constructor({
    projectId,
    planId,
    sign,
    amount,
    moneyId,
    categoryId,
    accountId,
    contractorId,
    quantity,
    unitId,

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
    userId,
    permit,
  }: IPlanTransactionEntity) {
    this.projectId = projectId;
    this.planId = planId;
    this.sign = sign;
    this.amount = amount;
    this.moneyId = moneyId;
    this.categoryId = categoryId;
    this.accountId = accountId;
    this.contractorId = contractorId;
    this.quantity = quantity;
    this.unitId = unitId;

    this.startDate = startDate;
    this.reportPeriod = reportPeriod;
    this.repetitionType = repetitionType;
    this.repetitionDays = repetitionDays;
    this.terminationType = terminationType;
    this.repetitionCount = repetitionCount;
    this.endDate = endDate;
    this.note = note;
    this.operationNote = operationNote;
    this.operationTags = operationTags;
    this.markerColor = markerColor;
    this.userId = userId;
    this.permit = permit;
  }
}
