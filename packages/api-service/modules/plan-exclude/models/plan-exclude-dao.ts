import { JSONSchema, Model, Validator } from 'objection';

import { IPlanExcludeDAO } from '../types';
import { TDate } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';
import { planExcludeDAOSchema } from './plan-exclude-dao.schema';

export class PlanExcludeDAO extends Model implements IPlanExcludeDAO {
  static tableName = 'cf$.plan_exclude';
  static jsonSchema = planExcludeDAOSchema as JSONSchema;
  static idColumn = ['idProject', 'idPlan', 'idUser', 'dexclude', 'actionType'];
  static jsonAttributes = [];

  readonly idProject: number;
  readonly idPlan: number;
  readonly idUser: number;
  readonly dexclude: TDate;
  readonly actionType: number;

  static createValidator(): Validator {
    return ajvValidator;
  }
}
