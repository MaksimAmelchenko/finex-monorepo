import { JSONSchema, Model, RelationMappings, Validator } from 'objection';

import { IPlanDAO } from '../../plan/types';
import { IPlanTransactionDAO } from '../types';
import { PlanDAO } from '../../plan/models/plan-dao';
import { Sign } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';
import { planTransactionDAOSchema } from './plan-transaction-dao.schema';

export class PlanTransactionDAO extends Model implements IPlanTransactionDAO {
  static tableName = 'cf$.v_plan_transaction';
  static jsonSchema = planTransactionDAOSchema as JSONSchema;
  static idColumn = ['projectId', 'planId'];
  static jsonAttributes = [];

  readonly projectId: number;
  readonly planId: number;
  sign: Sign;
  amount: number;
  moneyId: number;
  categoryId: number;
  accountId: number;
  contractorId: number | null;
  quantity: number | null;
  unitId: number | null;
  plan: IPlanDAO;

  static createValidator(): Validator {
    return ajvValidator;
  }

  static get relationMappings(): RelationMappings {
    return {
      plan: {
        relation: Model.HasOneRelation,
        modelClass: PlanDAO,
        join: {
          from: ['cf$.v_plan_transaction.projectId', 'cf$.v_plan_transaction.planId'],
          to: ['cf$.v_plan_v2.projectId', 'cf$.v_plan_v2.id'],
        },
      },
    };
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    // this.createdAt = new Date().toISOString();
    // this.updatedAt = new Date().toISOString();
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    // this.updatedAt = new Date().toISOString();
  }
}
