import { JSONSchema, Model, Validator } from 'objection';

import { IDebtItemDAO } from '../types';
import { Sign, TDate } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';

import { debtItemDAOSchema } from './debt-item-dao.schema';

export class DebtItemDAO extends Model implements IDebtItemDAO {
  static tableName = 'cf$.v_cashflow_item';
  static jsonSchema = debtItemDAOSchema as JSONSchema;
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
  note: string | null;
  tags: number[];

  static createValidator(): Validator {
    return ajvValidator;
  }
}
