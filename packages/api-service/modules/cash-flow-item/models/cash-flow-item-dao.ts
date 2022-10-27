import { JSONSchema, Model, Validator } from 'objection';

import { ICashFlowItemDAO } from '../types';
import { Sign, TDate } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';

import { cashFlowItemDAOSchema } from './cash-flow-item-dao.schema';

export class CashFlowItemDAO extends Model implements ICashFlowItemDAO {
  static tableName = 'cf$.v_cashflow_item';
  static jsonSchema = cashFlowItemDAOSchema as JSONSchema;
  static idColumn = ['projectId', 'id'];
  static jsonAttributes = [];

  readonly projectId: number;
  readonly id: number;
  readonly cashflowId: number;
  readonly userId: number;
  sign: Sign;
  amount: number;
  moneyId: number;
  cashflowItemDate: TDate;
  reportPeriod: TDate;
  accountId: number;
  categoryId: number;
  quantity: number | null;
  unitId: number | null;
  isNotConfirmed: boolean;
  note: string | null;
  tags: number[] | null;

  static createValidator(): Validator {
    return ajvValidator;
  }
}
