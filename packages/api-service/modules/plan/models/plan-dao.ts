import { JSONSchema, Model, Validator } from 'objection';

import { IPlanDAO } from '../types';
import { TDate } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';
import { planDAOSchema } from './plan-dao.schema';

export class PlanDAO extends Model implements IPlanDAO {
  static tableName = 'cf$.v_plan_v2';
  static jsonSchema = planDAOSchema as JSONSchema;
  static idColumn = ['projectId', 'id'];
  static jsonAttributes = [];

  readonly projectId: number;
  readonly id: number;
  contractorId: number | null;
  readonly userId: number;
  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;

  repetitionDays: number[] | null;
  terminationType: number | null;
  repetitionCount: number | null;
  endDate: TDate | null;

  note: string | null;

  operationNote: string | null;
  operationTags: number[] | null;
  markerColor: string | null;

  static createValidator(): Validator {
    return ajvValidator;
  }
}
