import { JSONSchema, Model, Validator } from 'objection';

import { IRequisitionDAO, IRequisitionNordigen } from '../types';
import { TDateTime } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';

import { requisitionDAOSchema } from './requisition-dao.schema';

export class RequisitionDAO extends Model implements IRequisitionDAO {
  static tableName = 'cf$_nordigen.requisition';
  static jsonSchema = requisitionDAOSchema as JSONSchema;
  static jsonAttributes = [];
  static idColumn = ['projectId', 'id'];

  projectId: number;
  userId: number;
  id: string;
  institutionId: string;
  requisitionId: string;
  connectionId: string | null;
  status: string;
  responses: IRequisitionNordigen[];
  createdAt: TDateTime;
  updatedAt: TDateTime;

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date().toISOString();
  }

  static createValidator(): Validator {
    return ajvValidator;
  }
}
