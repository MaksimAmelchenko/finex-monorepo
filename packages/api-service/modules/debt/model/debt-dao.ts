import { JSONSchema, Model, Validator } from 'objection';

import { IDebtDAO } from '../types';
import { TDateTime } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';

import { debtDAOSchema } from './debt-dao.schema';

export class DebtDAO extends Model implements IDebtDAO {
  static tableName = 'cf$.v_cashflow_v2';
  static jsonSchema = debtDAOSchema as JSONSchema;
  static idColumn = ['projectId', 'id'];
  static jsonAttributes = [];

  readonly projectId: number;
  readonly id: number;
  readonly userId: number;
  contractorId: number;
  note: string | null;
  tags: number[] | null;
  updatedAt: TDateTime;
  cashflowTypeId: number;

  $beforeInsert() {
    // this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static createValidator(): Validator {
    return ajvValidator;
  }
}
