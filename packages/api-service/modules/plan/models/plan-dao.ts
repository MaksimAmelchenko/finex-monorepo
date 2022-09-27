import { JSONSchema, Model, Validator } from 'objection';
import { format } from 'date-fns';

import { IPlanDAO } from '../types';
import { TDate } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';
import { planDaoSchema } from './plan-dao.schema';

export class PlanDAO extends Model implements IPlanDAO {
  static tableName = 'cf$.v_plan_v2';
  static jsonSchema = planDaoSchema as JSONSchema;
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

  $parseDatabaseJson(json) {
    const plan = super.$formatJson(json);
    plan.startDate = plan.startDate ? format(plan.startDate, 'yyyy-MM-dd') : null;
    plan.reportPeriod = plan.reportPeriod ? format(plan.reportPeriod, 'yyyy-MM-dd') : null;
    plan.endDate = plan.endDate === null ? null : plan.endDate ? format(plan.endDate, 'yyyy-MM-dd') : null;
    return plan;
  }
}
